# Plugins

The Framework provides a nice Event API to Joomla! extensions that use it. It is the principle mechanism by which we can subscribe a Joomla plugin to events in other parts of the Framework. Here we provide a high level overview of the classes and objects involved, and dive into some specific examples.

In the majority of cases, you will want to register an event listener against a controller action. A controller action is
a method within DOCman that is run when a particular user request happens. There are five (5) standard actions that are available in
the controller which are characterized with the BREAD acronym:

* **B**rowse - Viewing a list of documents
* **R**ead - Viewing a single document
* **E**dit - Editing/updating a single existing document on save
* **A**dd - Adding a new document on save
* **D**elete - Deleting a document

Each of these actions can have an event listener registered to be run **before** or **after** the action itself is executed.

<!-- toc -->

<!-- THIS SEEMS LIKE MORE OF A BLOG POST TO ME-->

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

The [KCommandHandlerEvent::execute()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/command/handler/event.php#L12) method shows the building of the event handler name clearly

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


