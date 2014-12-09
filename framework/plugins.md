# Plugins

## Introduction
<!-- THIS SEEMS LIKE MORE OF A BLOG POST TO ME-->
The need to alter or supplement the functionality of an extension goes hand in hand with using the Joomla CMS. The current standard
in dealing with this need is to try to use either existing Joomla! event triggers. These are good but not as granular as one would like.

Another option is to contact a respective extension's developer and ask them to add a new trigger so that you can get the functionality that you need, via a plugin. But this is
far from ideal. You end up with an extension that is peppered with hooks.

There are performance implications to using an event trigger that may run the whole component before its able to fire.

Therein lies much of the motivation and thought behind the design and implementation of Joomlatools extensions, and the underlying Nooku Framework.
How do you get to alter an extension's behavior at just the right spot? An architecture that allows for the 'Observing' of an object's
'action' methods, and providing means and opportunity to fire events both before and after those methods are fired.

That's what Joomlatools Extensions provide you, out of the box. This Event Publisher Subscriber modelled architecture is made available
through the Joomla Plugin API. It follows the same general structural conventions as a core plugin, but with a method naming convention
 that allows for a very fine grained targeting.

<!-- THIS SEEMS LIKE MORE OF A BLOG POST TO ME-->

## What is possible?

A better question would be "What's not possible?". There are many opportunities in the handling of a request through the Framework for the
supplementing of an extension's functionality.

## How does it work?

All objects in the Framework that provide this access to the Plugin API have some similar characteristics. For one, their main
action methods funnelled through a singular 'executing' method. Examples include `render`, `execute` and `fetch`.  These
centralizes the execution strategy of their respective class. That method is rarely used directly from outside of an object,
but is called from the magic \_\_call() method.

That executing method always exhibits the same general logic

1. a `context` variable of some kind gets set up
2. a `before` command chain is fired
3. the actual `_action[Action]` method is called, the `result` of which is added to the `context`
4. a `after` command chain is invoked.

By simple inspection we can see that there is opportunity to alter what information an object is provided and what information
that same object provides in return.

<!-- KControllerAbstract::execute() or KViewAbstract::render() -->

The `invokeCommand` method is part of the `KCommandMixin` interface, and each object that uses the described behavior needs to
have it mixed in at its creation.

## Where does the Plugin API part come in?

To expose this 'heart' of changeability to the you as a core Joomla 'like' plugin each object must have the `KCommandHandlerEvent` class
in its command chain. Most objects in the Framework have an `_initialize` method where a number of defaults and base configuration variables
are set. Each class that we expose as Plugin API will have a `command_handlers` array with `'lib:command.handler.event'` (or some Object Identifier whose hierarchy
leads there).

Its that 'handler' which

1. builds the **event**
2. notifies a publisher
3. loads the plugin, _with `JPluginHelper::importPlugin`_
4. and calls the actual individual `event handling` plugins.

<!-- DIAGRAM HERE -->

### Naming

A plugin's method naming allows for a recognizable pattern .

`on` + [**When**] + [**Package**] + [**Subject**] + [**Type**] + [**Action**]

Each of the parts in brackets holds a piece of information that helps the command handler build a method name and see if any
 event handlers are defined for this event.

* **When** - "Before" or "After" - All actions have a before/after event and unsurprisingly are run before/after the action
* **Package**  - The name of the component the event belongs to, in this case **Acme**
* **Subject** - The name of the "entity" that the event belongs to, e.g. the **Document**
* **Type** - The type of the object using the entity, e.g. **Controller, View or Model**
* **Action** - The name of the action being run. In the case of controllers, this would be one of the BREAD actions as explained above.

The [KCommandHandlerEvent::execute()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/command/handler/event.php#L12) method
shows the building of the event name clearly

```php
$event_specific = 'on'.ucfirst($when).ucfirst($package).ucfirst($subject).ucfirst($type).$name;
```

As an example, lets say we have a component called `com_acme`, and we would like to alter the input to the model `ComAcmeModelBars`
class when we fetch a list of entities from the database.

Following the above pattern, our method signature would look like

   `onBeforeAcmeBarModelFetch(KEventInterface $event)`

Maybe we'd like to alter the data that we add to the Bar view `ComAcmeViewBarHtml` view, but only for a specific layout in that view, we would fashion our plugin method like so

  `onBeforeAcmeBarViewRender(KEventInterface $event)`

## The Event Variable

That **event** part is important. Its provides a nice interface for you to work with in your plugin. Attached to it are
some of the same objects our context variable from above gets.

```php
    $caller		= $event->caller;
    $action 	= $event->action;
    $data 		= $event->data;
    $result 	= $event->result;
```

### Model, View, Controller...Module?...Yup!

There are three + one separate areas where the framework readily exposes its objects for use in the Plugin API.

* [KControllerAbstract](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/abstract.php#L125)
* [KModelAbstract](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/model/abstract.php#L125)
* [KViewAbstract](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/view/abstract.php#L125)

The 'plus one' are modules. A module's html.php file is the rendering strategy for that module, and will it extend `ModKoowaHtml`
which descends from the above mentioned `KViewAbstract` and so, has the Plugin API automatically.
However, the **Subject** get's removed from the event hanlder naming. There is no specific entity that the module html identifier specifies.


Take a module with this identifier `mod://acme_banner.html`

`class ModAcme_bannerHtml extends ModKoowaHtml`
If we wanted to alter the output of this module after it renders the plugin method would look like

`onAfterAcme_bannerHtmlRender` // no Subject

## Examples

* Practical example (link to docman/plugins.md)

