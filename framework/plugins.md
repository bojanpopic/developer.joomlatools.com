# Plugins

The Framework provides a nice Event API to Joomla! extensions that use it. It is the principle mechanism by which we can subscribe a Joomla plugin to events in other parts of the Framework. All of the main actions that take place in the MVC layer expose both before and after command chains that broadcast events to the Joomla! Plugin layer for plugin's that extend `PlgKoowaSubscriber`. This gives huge advantages to component extensions that use the Framework in terms of granularity of the events they can expose to their user base and therefore nearly complete control of the component, i.e. _they can customize the behavior exactly as needed_

Here we provide a high level overview of the concepts, classes and objects involved in the make up of such a plugin. 

> **Specific Plugin Example:** Build a working plugin with the [DOCman Plugin Tutorial](extensions/docman/plugins.md).

<!-- toc -->


## Plugin Classes

Here is a very simple example of a Nooku plugin that has three event handlers: one for each of the model, view and controller of a component extension called `Acme` focusing on an entity named `Bar`.

```php
class PlgKoowaAcme extends PlgKoowaSubscriber
{
    function onBeforeAcmeBarControllerBrowse(KEventInterface $event)
    {
	    if(!$event->data->foo) {
		    JFactory::getApplication()->redirect('/', 'You have no Foo!');  
		}      
	}
	function onAfterAcmeBarModelCount(KEventInterface $event)
    {
	    if($event->count === 0) {
		    $event->stopPropagation();
		}      
	}
	function onBeforeAcmeBarViewRender(KEventInterface $event)
	{
		 if($event->paramters->layout == 'special') {
		       $event->paramters->layout = 'newspecial';
		}      
	}
}
```

### PlgKoowaAbstract

If you want your plugin to simply take advantage of the native Joomla! (and other extension plugin events), it need only extend `PlgKoowaAbstract`. This class extends directly from `JPlugin` and will work like any other plugin; but, you have the added bonus of direct access to the Frameworks object manager, not to mention allowing the plugin to have its own [object identifier](http://guides.nooku.org/essentials/object-management.html). 

Another benefit to using `PlgKoowaAbstract` over `JPlugin` is the ability to tell the plugin not to connect or subscribe to any events at all. We use this ability in [LOGman](http://developer.joomlatools.com/extensions/logman.html) for example to make sure that all the appropriate files are loaded for all the other LOGman plugin integrations. It helps to keep from cluttering up the dispatcher. 

### PlgKoowaSubscriber: The Actual Subscriber 

Nooku provides the Event API, but for a Joomla plugin to make use of it needs to become a 'subscriber'.  To make that happen these extensions simply need to extend from [`PlgKoowaSubscriber`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/plugins/koowa/subscriber.php). 

> **Technical Tip**: As soon as they are instantiated a `PlgKoowaSubscriber` loads up the instance of the `KEventPublisher` and adds itself and its callable methods that begin with the letters **'on'** as event listeners for each of the similarly named events. In other words, it `subscribes` those `on` methods to specific `on` events. For example, the listeners registered for event named **"onBeforeAcmeBarControllerBrowse"** are in this case plugin's  `onBeforeAcmeBarControllerBrowse` method.
 
>**Another Tip:** `PlgKoowaSubscriber` plugins will not fire for native Joomla! plugin events because they aren't connected to `JEventDispatcher`. 

## Plugin Methods 

The event handlers are the methods of the plugin and must follow a specific naming pattern to be notified that an event is taking place. 

### Naming

Above we saw the event handler method `onBeforeAcmeBarControllerBrowse` . Its parts can be broken down as follows

`on` + [**When**] + [**Package**] + [**Subject**] + [**Type**] + [**Action**]


* **When** - "Before" or "After" - All actions have a before/after event and unsurprisingly are run before/after the action
* **Package**  - The name of the component the event belongs to, in this case **Acme**
* **Subject** - The name of the "entity" that the event belongs to, e.g. the **Bar**
* **Type** - The type of the object using the entity, e.g. **Controller, View or Model**
* **Action** - The name of the action being run. Controller BREAD actions, Render for a view and Fetch for a model.

> Technical Tip: The [KCommandHandlerEvent::execute()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/command/handler/event.php#L12) method shows the building of the event handler name clearly
`$event_specific = on'.ucfirst($when).ucfirst($package).ucfirst($subject).ucfirst($type).$name;`

### The Event Variable

When subscribers to the Event API (our plugin methods in this case) are notified of a given event they get a nice `KEventInterface` object with all the information they need for a given situation. 

For example, our Acme plugin's controller focused event (`onBeforeAcmeBarControllerBrowse`) will get an event variable with these properties 

```php
    $event->subject;
    $event->action;
    $event->data;
    $event->result;
```

In addition, the variable exposes methods to control the event like, `stopPropagation`,  `canPropogate` , and attribute getters and setters. We could assess and alter the `$context->data` property before it makes it to the subject class's execute method or alter the `$context->result` before it returns to the original calling scope.  

It is important to emphasize that event variables get different properties based on which action in the MVC layer they are focused on. Lets summarize them here

#### Properties Available to all event handlers 

* subject - All event variables are populated with a subject. This is the object that triggered the event, in our case above it would be the **bar** controller.

#### The Model event variable

* Action: `Fetch`
	* entity - This property is similar to the controller focused event variable's result property and is meant for **After** events. 
* Action: `Count`
	* count - the count result as determined by the query. Meant for an **After** event handler. 
* Action: `Reset`
	*  modified - Is an array of the modified properties of an entity. This is available as both a **Before** and **After** event property. 
* Action: `Create`
	* properties - An array of the properties that a new entity is about to get. Meant to be used in a **Before** event handler. 

#### The View event variable

* Action: `Render`
	* action - The original action that triggered the event, in this case **render**.
	* parameters - These are normally tied to the state of model entity(ies), layout and view variables that characterize the request and are available to **After** events. 

#### The Controller event variable

* Action: `Browse, Read, Edit, Add, Delete`
	* action - The original action that triggered the event.
	* data - Any data that is passed to the controller action is stored in a KObjectConfig object. Typically this is used for any action that takes in data, such as **Add**, **Edit**, **Post** and **Put**. You could modify the data here if you wished.
	* result - This is populated with the result of the action, only applicable to **After** events.
	  
#### Before/After - When to use

It can sometimes be confusing to know when to use before or after events. However, following these simple rules should help:

* **BEFORE** - If you wish to modify the incoming data, such as in add/edit actions. Use the `$event->data` variable. 
* **AFTER** - If you need to be sure the action was successful or need to manipulate the response before it is displayed, for example removing certain values from a document for unregistered users. You use the `$event->result` variable is this case. 

## What is possible?

A better question would be **"What's not possible?"**. To get a feel for the potential, lets extend our example signature of our `PlgKoowaAcme` plugin so that it that takes advantage of all the opportunities exposed in just the MVC layer, again only for an entity `Bar`.

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
and thus 8 more opportunities for each entity. 

> **Next Tip:** There are even more exposed for the component's [Dispatcher](#dispatcher)


## Advanced Topic: Dispatcher

A component dispatcher descends from `KControllerAbstract` so it too gets exposed through the Events API. In this instance there is no specific entity, i.e. no `Bar`, but there is a specific protocol based strategy, in many cases `Http`.

As of the 2.0 Release the abstract dispatcher has 4 action methods:

`_actionDispatch, _actionForward, _actionFail,` and `_actionSend`

The Http dispatcher, which extends from that abstract, adds 7 more actions, the majority of which correspond to HTTP methods:

`_actionHead, _actionOptions, _actionGet, _actionPost, _actionPut, _actionDelete` and `_actionRedirect`

That means our `Acme` component dispatcher, i.e. `com://site/acme.dispatcher.http` would be have  2 * (4 + 7) = 22 events published and thus give our `Acme` plugin 22 more opportunities to handle events.


