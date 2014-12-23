# The Event API

The Framework provides a nice Event API to Joomla! extensions that use it. It is the principle mechanism by which we can subscribe a Joomla plugin to events in other parts of the Framework. Here we provide a high level overview of the classes and objects involved, and dive into some specific examples.

<!-- toc -->

<!-- THIS SEEMS LIKE MORE OF A BLOG POST TO ME-->

## How does it work?

All objects in the Framework that provide this access through the Events API have the same architectural characteristic. Their main action methods get funneled through a singular 'executing' method and thus centralizes the execution strategy of their respective class.

That method is rarely used directly from outside of an object, but is exposed via the magic `__call()` method. It also always exhibits the same general logic 

1. a `context` variable of some kind gets set up
2. a `before` command chain is fired
3. the actual `_action[Action]` method is called, the `result` of which is added to the `context`
4. a `after` command chain is invoked.

By inspecting a stripped down version of the [`KViewAbstract::render()`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/view/abstract.php#L113) method we
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

It is those `before` and `after` steps that are the starting points for the Event API. They tell the object to run a series of commands, or a _command chain_.

To expose this 'heart' of changeability as a _core Joomla 'like' plugin_ we provide our starting object with a command chain that holds a specific object which is an instance of `KCommandHandlerEvent`.

>Most objects in the Framework have an `_initialize` method where a number of defaults and base configuration variables are set. Each class that we expose through the Event API will have a `command_handlers` array with `'lib:command.handler.event'` as one of the values.

When this handler gets is turn in the chain, its own `execute` method takes care of all of the following steps

1. builds the **event** name
2. tells the event publisher to publish the event
3. which loads the plugin(s), _with `JPluginHelper::importPlugin`_
4. When the plugin(s) load (and they extend from `PlgKoowaSubscriber`) the methods that start with '**on**' are `subscribed` to the event publisher, and the ones that match the event name are fired at that point.

<!-- DIAGRAM HERE -->
![Diagram](/resources/images/jt6-event-api-with-plugins.png "Diagram")

### The Event Mixin

At the core of the Framework is the ability to `mixin` functionality of one class into another. When we have an object that we want to expose through the Event API we make sure to mixin the `KEventMixin` interface. This provides that object, and those that use it, with access to the objects that support API. Namely, the event publisher, subscribers, listeners and access to a `publishEvent` method.

This is important architecturally. It means that if you are writing an extension with Nooku you can add your own custom events, with any naming convention you like from any class with the `KEventMixin` interface added to it. The only other requirement is that your event handlers need to subscribe to those events.  

>Tip: The Event Mixin is not directly used by the event command handler `KCommandHandlerEvent` but is very relevant to the overall Event API

### Naming

Without preamble, the event naming pattern is as follows

`on` + [**When**] + [**Package**] + [**Subject**] + [**Type**] + [**Action**]

> In our ["What is possible? example"](#what-is-possible), the pattern that a plugin method takes can to be readily seen.

Each of the parts in brackets holds a piece of information that helps the command handler build an event name, and then see if any event handlers are registered, or available for this event.

* **When** - "Before" or "After" - All actions have a before/after event and unsurprisingly are run before/after the action
* **Package**  - The name of the component the event belongs to, in this case **Acme**
* **Subject** - The name of the "entity" that the event belongs to, e.g. the **Bar**
* **Type** - The type of the object using the entity, e.g. **Controller, View or Model**
* **Action** - The name of the action being run. Controller BREAD actions, Render for a view and Fetch for a model.

The [KCommandHandlerEvent::execute()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/command/handler/event.php#L12) method we discussed above shows the building of the event handler name clearly

```php
$event_specific = 'on'.ucfirst($when).ucfirst($package).ucfirst($subject).ucfirst($type).$name;
```

### PlgKoowaSubscriber: The Actual Subscriber 

Nooku provides the Event API, but to make use of it in a Joomla plugin, that plugin needs to subscribe to it.  To make that happen these extensions simply need to extend from [`PlgKoowaSubscriber`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/plugins/koowa/subscriber.php). This is the one of last pieces in the puzzle, and a pretty important one at that.    

As soon as they are instantiated a PlgKoowaSubscriber loads up the instance of the `KEventPublisher` and adds itself and its callable methods that begin with the letters **'on'** as event listeners for each of the similarly named events. In other words, it `subscribes` those `on` methods to specific `on` events. For example, the listeners registered for event named **"onBeforeAcmeBarControllerBrowse"** are in this case plugin's  `onBeforeAcmeBarControllerBrowse` method.
 
>**Tip:** `PlgKoowaSubscriber` plugins will not fire for native Joomla! plugin events because they aren't connected to `JEventDispatcher`.

### PlgKoowaAbstract

Plugins written to take advantage of the native Joomla! and other extension plugin events, need only extend `PlgKoowaAbstract`. This class extends from `JPlugin` and will work like any other plugin, but you have the added bonus of direct access to the Frameworks object manager, not to mention allowing the plugin to have its own object identifier. 

Another benefit to using `PlgKoowaAbstract` over JPlugin is the ability to tell the plugin not to connect or subscribe to any events at all. We use this ability in [LOGman](http://developer.joomlatools.com/extensions/logman.html) to make sure that all the appropriate files are loaded for all the other LOGman plugin integrations. It helps to keep from cluttering up the dispatcher. 

### The Event Variable

When subscribers to the Event API are notified that a given event is taking place, they get a nice `KEventInterface` object with all the information they need: 

```php
    $caller		= $event->caller;
    $action 	= $event->action;
    $data 		= $event->data;
    $result 	= $event->result;
```
It provides access to some of the same objects that our `$context` variable from above gets, but also gives us methods to control the event like, `stopPropagation`,  `canPropogate` , and attribute getters and setters. We can assess and alter the `$context->data` property before it makes it to the subject class's execute method or alter the `$context->result` before it returns to the original calling scope.  

## What is possible?

A better question would be **"What's not possible?"**.<!--There are many opportunities in the handling of a request through the Framework for thesupplementing of an extension's functionality.--> To get a feel for the potential, here is an example signature of a PlgKoowaSubscriber plugin that takes advantage of all the opportunities exposed in just the MVC layer in an extension called `Acme` for one entity called `Bar`.
<a name="first_acme"></a>
```php
<?php
class PlgKoowaAcme extends PlgKoowaSubscriber
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

## Extra Topic

### Dispatcher

A component dispatcher descends from `KControllerAbstract` so it too gets exposed through the Events API. In this instance there is no specific entity, i.e. no `Bar`, but there is a specific protocol based strategy, in many cases `Http`.

As of the 2.0 Release the abstract dispatcher has 4 action methods:

`_actionDispatch, _actionForward, _actionFail,` and `_actionSend`

The Http dispatcher, which extends from that abstract, adds 7 more actions, the majority of which correspond to HTTP methods:

`_actionHead, _actionOptions, _actionGet, _actionPost, _actionPut, _actionDelete` and `_actionRedirect`

That means our `Acme` component dispatcher, i.e. `com://site/acme.dispatcher.http` would be have  2 * (4 + 7) = 22 events published and thus give our `Acme` plugin 22 opportunities to handle events.


