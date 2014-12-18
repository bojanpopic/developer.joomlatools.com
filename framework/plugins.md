# Plugins

The Framework provides a nice Plugin API to Joomla! extensions that use it. Here we provide a high level overview of the
 classes and objects involved, and dive into some specific examples.

<!-- toc -->

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

A better question would be "What's not possible?".
<!--There are many opportunities in the handling of a request through the Framework for the
supplementing of an extension's functionality.-->
To get a feel for the potential, here is an example signature of a plugin
that takes advantage of all the opportunities exposed in just the MVC layer in an extension called `Acme` for one entity called `Bar`.
```php
<?php
class PlgKoowaAcme extends PlgKoowaAbstract
{
    // 12 controller event handlers
    function onBeforeAcmeBarControllerRender(KEventInterface $event);
    function onBeforeAcmeBarControllerRender(KEventInterface $event);
    function onBeforeAcmeBarControllerBrowse(KEventInterface $event);
    function onAfterAcmeBarControllerBrowse(KEventInterface $event);
    function onBeforeAcmeBarControllerRead(KEventInterface $event);
    function onAfterAcmeBarControllerRead(KEventInterface $event);
    function onBeforeAcmeBarControllerEdit(KEventInterface $event);
    function onAfterAcmeBarControllerEdit(KEventInterface $event);
    function onBeforeAcmeBarControllerAdd(KEventInterface $event);
    function onAfterAcmeBarControllerAdd(KEventInterface $event);
    function onBeforeAcmeBarControllerDelete(KEventInterface $event);
    function onAfterAcmeBarControllerDelete(KEventInterface $event);

    // 8 model event handlers
    function onBeforeAcmeBarModelFetch(KEventInterface $event);
    function onAfterAcmeBarModelFetch(KEventInterface $event);
    function onBeforeAcmeBarModelCreate(KEventInterface $event);
    function onAfterAcmeBarModelCreate(KEventInterface $event);
    function onBeforeAcmeBarModelCount(KEventInterface $event);
    function onAfterAcmeBarModelCount(KEventInterface $event);
    function onBeforeAcmeBarModelReset(KEventInterface $event);
    function onAfterAcmeBarModelReset(KEventInterface $event);

    // 2 view event handlers
    function onBeforeAcmeBarViewRender(KEventInterface $event);
    function onAfterAcmeBarViewRender(KEventInterface $event);
}
```

That's 22 distinct opportunities for a developer to augment the extension treatment of the `Bar` entity in exactly the way they choose; **and that's for just one entity type**.
If the extension were to have another entity called `Foo`, then there are 22 more.

> **Tip:** There are four more actions mixed into a controller's interface by default via the [Editable behavior](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/components/com_koowa/controller/behavior/editable.php#L16),
and thus 8 more opportunities.

> **Next Tip:** There are even more exposed for the component's [Dispatcher](#dispatcher)

## How does it work?

All objects in the Framework that provide this access through the Events API have the same architectural characteristic. Their main
action methods get funnelled through a singular 'executing' method and thus centralizes the execution strategy of their respective class.

That method is rarely used directly from outside of an object, but is exposed via the magic `__call()` method. It also
always exhibits the same general logic

1. a `context` variable of some kind gets set up
2. a `before` command chain is fired
3. the actual `_action[Action]` method is called, the `result` of which is added to the `context`
4. a `after` command chain is invoked.

By inspecting a stripped down example of the [`KViewAbstract::render()`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/view/abstract.php#L113) method we
can clear see each step.
```php
public function render()
{
    $context = $this->getContext();
    $context->action  = 'render';
     if ($this->invokeCommand('before.render', $context) !== false)
     {
        $context->result = $this->_actionRender($context);
        $this->invokeCommand('after.render', $context);
     }
     return $context->result;
}
```
The `invokeCommand` method is part of the `KCommandMixin` interface, and each object that uses the described behavior needs to
have it mixed in at its creation.

Have a look at the others

* [`KControllerAbstract::execute()`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/abstract.php#L125)
* [`KModelAbstract::fetch()`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/model/abstract.php#L125)

### Where does the Plugin part come in?

It is those `before` and `after` steps that are the starting points for the Event API. They tell the object to run a series of commands, or a command chain.

To expose this 'heart' of changeability as a _core Joomla 'like' plugin_ the object in question must have the a `KCommandHandlerEvent` class based object
in its command chain.

>Most objects in the Framework have an `_initialize` method where a number of defaults and base configuration variables
are set. Each class that we expose as Plugin API will have a `command_handlers` array with `'lib:command.handler.event'`.

When this handler gets is turn in the chain, its own `execute` method

1. builds the **event** name
2. tells the event publisher to publish the event
3. which loads the plugin(s), _with `JPluginHelper::importPlugin`_
4. When the plugin(s) load (and they extend from `PlgKoowaSubscriber`) the methods that start with 'on' are `subscribed` to the
event publisher, and the ones that match the event name are fired at that point.

<!-- DIAGRAM HERE -->


### The Event Mixin

At the core of the Framework is the ability to `mixin` functionality. When we have an object that we want to expose through the Event API
we make sure to mixin the `KEventMixin` interface. This provides that object, and those that use it, with access to the objects that make up the API.
Namely the event publisher, subscribers, listeners and access to a `publishEvent` method.

This is important architecturally. It means that if you are writing an with extension Nooku Framework you can add your own custom events, with any
naming convention you like from any class with the `KEventMixin` interface.

>Tip: The Event Mixin is not directly used by the event command handler `KCommandHandlerEvent` but is very relevant to the overall Event API

### The Event Variable

When the
That **event** part is important. Its provides a nice interface for you to work with in your plugin. Attached to it are
some of the same objects our context variable from above gets.

```php
    $caller		= $event->caller;
    $action 	= $event->action;
    $data 		= $event->data;
    $result 	= $event->result;
```

### Naming

From our ["What is possible? example"](#what-is-possible) above, the pattern that a plugin method takes can start to be seen.

`on` + [**When**] + [**Package**] + [**Subject**] + [**Type**] + [**Action**]

Each of the parts in brackets holds a piece of information that helps the command handler build a method name and see if any
event handlers are defined for this event.

* **When** - "Before" or "After" - All actions have a before/after event and unsurprisingly are run before/after the action
* **Package**  - The name of the component the event belongs to, in this case **Acme**
* **Subject** - The name of the "entity" that the event belongs to, e.g. the **Bar**
* **Type** - The type of the object using the entity, e.g. **Controller, View or Model**
* **Action** - The name of the action being run. Controller BREAD actions, Render for a view and Fetch for a model.

The [KCommandHandlerEvent::execute()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/command/handler/event.php#L12) method
shows the building of the event handler name clearly

```php
$event_specific = 'on'.ucfirst($when).ucfirst($package).ucfirst($subject).ucfirst($type).$name;
```

<!-- ### Modules

A module's `html.php` file is the rendering strategy for that module, and will it extend `ModKoowaHtml`
which descends from the above mentioned `KViewAbstract` and so, has the Plugin API automatically.

However, the **Subject** gets removed from the event handler naming. There is no specific entity that the module html identifier specifies.

Take a module with this identifier `mod://acme_banner.html`

`class ModAcme_bar_bannerHtml extends ModKoowaHtml`
If we wanted to alter the output of this module after it renders the plugin method would look like

```php
class PlgKoowaAcme extends PlgKoowaAbstract
{
    function  onBeforeAcme_bar_bannerHtmlRender(KEventInterface $event){}  // no Subject
    function  onAfterAcme_bar_bannerHtmlRender(KEventInterface $event){}  // no Subject
 }
```
-->

### Dispatcher

A component dispatcher descends from `KControllerAbstract` so it too gets exposed through the Events API. In this
 instance there is no specific entity, i.e. no `Bar`, but there is a specific protocol based strategy, in many cases `Http`.

As of the 2.0 Release the abstract dispatcher has 4 action methods:

`_actionDispatch, _actionForward, _actionFail,` and `_actionSend`

Normally, we use the http dispatcher which adds more action methods, the majority of which correspond to HTTP methods:

`_actionHead, _actionOptions, _actionGet, _actionPost, _actionPut, _actionDelete` and `_actionRedirect`

That means our `Acme` component dispatcher, i.e. `com://site/acme.dispatcher.http` would be exposed to
our `Acme` plugin with another 2 * (4 + 7) = 22 opportunities to handle events


