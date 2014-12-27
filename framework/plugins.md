# Plugins

The Framework provides a nice Event API to Joomla! extensions that use it. All of the main actions that take place in the Nooku MVC layer are exposed via before and after command chains that broadcast events; we can subscribe a Joomla plugin methods to those events with `PlgKoowaSubscriber`. This gives a huge advantage to component extensions that use the Framework in terms of granularity of the functionality they can expose to their user base for customization, therefore nearly complete control of the component, i.e. 

**_they can customize the behavior exactly as needed_**

Here we provide an overview of the concepts, classes and objects involved in the make up and use of such a plugin. 

<!-- toc -->

## Easy Example

To get us started, here is a very simple example of a plugin that has three event handlers: one for each of the model, view and controller of a component extension called `Acme` focusing on an entity named `Bar`.

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
		 if($event->parameters->layout == 'special') {
		       $event->parameters->layout = 'newspecial';
		}      
	}
}
```

It shows off some important concepts that we'll refer to throughout. 

>For a really good specific  example of building a working plugin checkout the [DOCman Plugin Tutorial](extensions/docman/plugins.md).


## The MVC Layer

We're focusing on the Model View Controller layer and the events that it broadcasts through the Event API. In each part of this triad,  there are a number of major actions that take place, and it would be nice to be able to effect either their input or output. Maybe for a specific view we would like to affect the data that it holds or force a layout change (as above) **before** it gets rendered. For a model, we may wish to add more details about the contents of the entities  **after** we fetch them. In a controller, maybe we want to send an email to someone **after**  we add an entity to the database. All of these examples are possible because the MVC layer publishes **before** and **after** events through the API for each of its major actions. 

#### What actions can be affected?

As we've discuss, a given entity type, e.g. `Bar` will have its own Model, View and Controller triad. For the Model, there are four actions that we can tie into, **Fetch, Create, Count**, and **Reset**. The View exposes only the **Render** action. And lastly, the Controller exposes a total of six actions. They are the five BREAD paradigm actions: **Browse, Read, Edit, Add** and **Delete**; and then a **Render** action.  

## Plugin classes

There are two plugin classes that are important for you to know about to start building your own plugins. The first is `PlgKoowaAbstract` and the second is `PlgKoowaSubscriber`. They reside in the [library's plugin folder](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/plugins/koowa) but we describe them a little here.

### PlgKoowaSubscriber: The Actual Subscriber 

Nooku provides the Event API, but for a Joomla plugin to make use of it needs to become a 'subscriber'.  To make that happen these extensions simply need to extend from [`PlgKoowaSubscriber`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/plugins/koowa/subscriber.php). 

 As soon as they are instantiated a `PlgKoowaSubscriber` loads up the instance of the `KEventPublisher` and adds itself and its callable methods that begin with the letters **'on'** as event listeners for each of the similarly named events. In other words, it `subscribes` those `on` methods to specific `on` events. For example, the listener registered for the event named **"onBeforeAcmeBarControllerBrowse"** is in this case our `PlgKoowaAcme::onBeforeAcmeBarControllerBrowse()` method.
 
>**Technical Tip:** `PlgKoowaSubscriber` plugins will not fire for native Joomla! plugin events because they aren't connected to `JEventDispatcher`. 
 
### PlgKoowaAbstract

If you want your plugin to simply take advantage of the native Joomla! (and other extension plugin)  events, it need only extend `PlgKoowaAbstract`. It won't pick up the MVC events that we are focused on here. We highlight it because `PlgKoowaSubscriber` is a child class and is an important part of its functionality. 

This class extends directly from `JPlugin` and will work like any other plugin; but, you have the added bonus of direct access to the Frameworks object manager, not to mention allowing the plugin to have its own [object identifier](http://guides.nooku.org/essentials/object-management.html). 

Another benefit to using `PlgKoowaAbstract` over `JPlugin` is the ability to tell the plugin not to connect or subscribe to any events at all. We use this ability in [LOGman](http://developer.joomlatools.com/extensions/logman.html) for example to make sure that all the appropriate files are loaded for all the other LOGman plugin integrations. It helps to keep from cluttering up the dispatcher. 

## Plugin groups

Our _Easy example_ relies on the fact that when the Framework gets loaded in Joomla it tells the system to import the **koowa** group of plugins. That means any plugins placed in the /plugins/koowa/ directory (and enabled through the admin) will get loaded right away.

This inclusion in the **koowa** group is not a requirement though. We are free to break plugins up into groups based on the component package that they subscribe too. This means that we can specialize those plugins even further, keeping them well organized and separate. The Framework will load them when it publishes the event if they haven't been already.

For example we could reorganize our `Acme` plugin into two separate plugins of the **acme** group: one to focus on the presentation side of things and one to focus on the data. 

If we created a **/plugins/acme/views/views.php** file we would create a class named `PlgAcmeViews` in which we could place our `onBeforeAcmeBarViewRender()` method. In **/plugins/acme/bars/bars.php** we would put `PlgAcmeBars` and be free to add our `onAfterAcmeBarModelCount()`  and `onBeforeAcmeBarControllerBrowse` methods here. 

Development teams can come up with the plugin structure that is right for their project. 

## Event Handlers 

### Naming

An event handler can technically be any callable structure, but it our case it will simply be a method of a plugin. They must follow a specific naming pattern to be notified that an event is taking place. Its a fairly simple pattern:  

`on` + [**When**] + [**Package**] + [**Subject**] + [**Type**] + [**Action**]


* **When** - "Before" or "After" - All actions have a before/after event and unsurprisingly are run before/after the action
* **Package**  - The name of the component the event belongs to, in this case **Acme**
* **Subject** - The name of the "entity" that the event belongs to, e.g. the **Bar**
* **Type** - The type of the object using the entity, e.g. **Controller, View or Model**
* **Action** - The name of the action being run ([any one of these](what-actions-can-be-affected)). 

Our example `onBeforeAcmeBarControllerBrowse` method shows this pattern clearly. Its like saying 
<blockquote>	 "**Before** the **Acme** package **Bar** entity **Controller** performs a **Browse** action, do this". </blockqoute>

 ### The Event Variable

When subscribers to the Event API, are notified of a given event they get a nicely packaged `KEventInterface` object with all the information they need for a given situation. 

For example, our Acme plugin's controller focused event handler (`onBeforeAcmeBarControllerBrowse`) will get an event variable with these properties 

```php
    $event->subject;
    $event->action;
    $event->data;
    $event->result;
```

In addition, the variable object exposes methods to control the event like, `stopPropagation`,  `canPropogate` , and attribute getters and setters. We could assess and alter the `$context->data` property before it makes it to the subject class's execute method or alter the `$context->result` before it returns to the original calling scope.  

It is important to emphasize that event variables get different properties based on which action in the MVC layer they are focused on. Lets summarize them here

#### Properties Available to all event handlers 

* subject - All event variables are populated with a subject. This is the object that triggered the event, in our case above it would be the **bar** controller.

#### The Model `$event` variable

* Action: `Fetch`
	* entity - This property is similar to the controller focused event variable's result property and is meant for **After** events. 
* Action: `Count`
	* count - the count result as determined by the query. Meant for an **After** event handler. 
* Action: `Reset`
	*  modified - Is an array of the modified properties of an entity. This is available as both a **Before** and **After** event property. 
* Action: `Create`
	* properties - An array of the properties that a new entity is about to get. Meant to be used in a **Before** event handler. 

#### The View `$event` variable

* Action: `Render`
	* action - The original action that triggered the event, in this case **render**.
	* parameters - These are normally tied to the state of model entity(ies), layout and view variables that characterize the request and are available to **After** events. 

#### The Controller `$event` variable

* Action: `Browse, Read, Edit, Add, Delete` and `Render`
	* action - The original action that triggered the event.
	* data - Any data that is passed to the controller action. Typically this is used in the **Before** tense for any action that takes in data, such as **Add**, **Edit**, **Post** and **Put**. You could modify that data here if you wished.
	* result - This is populated with the result of the action, only applicable to **After** events.
	  
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

We have focused entirely on the MVC layer of a component. Each component however has a component dispatcher that asks as a bridge between the MVC and the Joomla dispatching process. `KDispatcherAbstract` descends from `KControllerAbstract` so it too gets exposed through the Events API. In this instance there is no specific entity, i.e. no `Bar`, but there is a specific protocol based strategy, in many cases `Http`.

As of the 2.0 Release the abstract dispatcher has four action methods:

`_actionDispatch, _actionForward, _actionFail,` and `_actionSend`

The Http dispatcher (`KDispatcherHttp`), which extends from that abstract, adds seven more actions, the majority of which correspond to HTTP methods:

`_actionHead, _actionOptions, _actionGet, _actionPost, _actionPut, _actionDelete` and `_actionRedirect`

That means our `Acme` component dispatcher, i.e. `com://site/acme.dispatcher.http` would be have  2 * (4 + 7) = 22 events published and thus give our `Acme` plugin 22 more opportunities to handle events.


## In closing

Developing components with the Nooku Framework exposes all its MVC actions to the Event API, both before and after they fire. This gives automatic and granular opportunities for sites that use the component to alter its functionality at run time with normal Joomla plugins. We've taken a look at the major areas to help you understand what is available in Joomlatools component extensions, and what you could have in your own Nooku Framework powered components. 