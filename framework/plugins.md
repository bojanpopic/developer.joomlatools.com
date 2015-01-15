# Plugins

In Nooku Framework any controller, view or model method that has an `_action` prefix can be intercepted via the Nooku Event API and thus also through the Joomla plugin system. In contrast to Joomla, events in Nooku are not hardcoded, but are generated on the fly in a consistent and standardized fashion. 

Each controller, view and model action is exposed through an **before** and **after** command which is translated by a special event command handler and broadcasted to any object that subscribes to it. 

This [inversion of control](http://en.wikipedia.org/wiki/Inversion_of_control) mechanism allows for the intercepting of actions both before and after they occur. Extensions that use the Nooku Framework can take advantage of this to improve the granularity of their functionality. A component inverts nearly complete control of its data flow out of the box.

Here we provide an overview of the concepts, classes and objects involved in creating a Joomla plugin that can intercept action events. 

<!-- toc -->

## Easy example

To get us started, here is a very simple example of a plugin that has three event handlers: one for each of the model, view and controller. Our plugin is called `Example`, in the `Acme` component plugin group, and we are focusing on a model entity named `Bar`.

```php
class PlgAcmeExample extends PlgKoowaSubscriber
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

The above code shows some important concepts that we'll refer to throughout in this guide, but it is non-exhaustive. We will show you how all the pieces fit together to build events dynamically in the sections to come. 

>For a really good specific  example of building a working plugin checkout the [DOCman Plugin Tutorial](extensions/docman/plugins.md).


## The MVC layer

We're focusing on the Model View Controller layer and the events that it broadcasts through the Event API. In each part of this triad,  there are a number of major actions that take place, and it would be nice to be able to effect either their input or output. 

+ Maybe for a specific view we would like to affect the data that it holds or force a layout change (as above) **before** it gets rendered. 
+ For a model, we may wish to add more details about the contents of the entities  **after** we fetch them. 
+ In a controller, maybe we want to send an email to someone **after**  we add an entity to the database. 

All of these examples are possible because the MVC layer publishes **before** and **after** events through the API for each of its major actions. 

#### What actions can be affected?

As we've discuss, a given resource, e.g. `Bar`, will have its own Model, View and Controller triad. 

- Controller : **Browse, Read, Edit, Add** and **Delete**; and **Render** 
- Model      : **Fetch, Create, Count**, and **Reset**
- View       : **Render** 

We discuss each in more detail below in [MVC Actions and Events](#mvc-actions-and-events). Lets first look into the classes that make up a Joomla Plugin.

## Plugin classes

There are two plugin classes that are important for you to know about to start building your own plugins. The first is `PlgKoowaAbstract` and the second is `PlgKoowaSubscriber`. They reside in the [library's plugin folder](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/plugins/koowa) but we describe them a little here.

### PlgKoowaSubscriber: The actual subscriber 

Nooku provides the Event API, but for a Joomla plugin to make use of it needs to become a 'subscriber'.  To make that happen the plugin simply need to extend from [`PlgKoowaSubscriber`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/plugins/koowa/subscriber.php). 

 As soon as they are instantiated a `PlgKoowaSubscriber` loads up the instance of the `KEventPublisher` and adds itself and its callable methods that begin with the letters **'on'** as event listeners for each of the similarly named events. In other words, it `subscribes` those `on` methods to specific `on` events. 

For example, the event handler that is registered for the event named **"onBeforeAcmeBarControllerBrowse"** is our `PlgAcmeExample::onBeforeAcmeBarControllerBrowse()` method.
 
>**Technical Tip:** `PlgKoowaSubscriber` plugins will not fire for native Joomla! plugin events because they aren't connected to `JEventDispatcher`. 
 
### PlgKoowaAbstract

If you want your plugin to simply take advantage of the native Joomla! (and other extension events), it need only extend `PlgKoowaAbstract`. It won't pick up the MVC events that we are focused on here. We highlight it because `PlgKoowaSubscriber` is a child class and is an important part of its functionality. 

This class extends directly from `JPlugin` and will work like any other plugin; but, you have the added bonus of direct access to the Framework object manager, not to mention allowing the plugin to have its own [object identifier](http://guides.nooku.org/essentials/object-management.html). 

Another benefit to using `PlgKoowaAbstract` over `JPlugin` is the ability to tell the plugin not to connect or subscribe to any events at all. We use this ability in [LOGman](http://developer.joomlatools.com/extensions/logman.html) for example to make sure that all the appropriate files are loaded for all the other LOGman plugin integrations. It helps to keep from cluttering up the dispatcher. 

## Event handlers 

### Naming

An event handler can technically be any [callable](http://php.net/manual/en/language.types.callable.php), but it our case it will simply be a method of a plugin. They must follow a specific naming pattern to be notified that an event is taking place. Its a fairly simple pattern:

`on` + [**When**] + [**Package**] + [**Subject**] + [**Type**] + [**Action**]


* **When** - "Before" or "After" - All actions get events before and after they are executed 
* **Package**  - The name of the component the event belongs to, in this case **Acme**
* **Subject** - The name of the "entity" that the event belongs to, e.g. the **Bar**. This is singular.
* **Type** - The type of the object using the entity, e.g. **Controller, View or Model**. Also singular.
* **Action** - The name of the action being run ([any one of these](what-actions-can-be-affected)). 

Our example `onBeforeAcmeBarControllerBrowse` method shows this pattern clearly. Its like saying 
>"**Before** the **Acme** package **Bar** entity **Controller** performs a **Browse** action, do this". 

### The `$event` variable

When subscribers to the Event API, are notified of a given event they get a nicely packaged [`KEvent`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/event/event.php) object with all the information they need for a given situation. 

For example, our `PlgAcmeExample` plugin `onBeforeAcmeBarControllerBrowse` event handler will get an event variable containing the following properties :

```php
    $event->subject;
    $event->action;
    $event->data;
    $event->result;
```

In addition, the `$event` object exposes methods to interrogate and control the event, like `stopPropagation`,  `canPropogate`, attribute getters and setters and the ever relevant, `getTarget` and `setTarget`. 

We could assess and alter the `$context->data` property before it makes it to the subject class's execute method or alter the `$context->result` before it returns to the original calling scope.  

It is important to emphasize that event variables get different properties based on which action in the MVC layer they are focused on. 




### MVC Actions and Events


Its time to focus on the specific actions that we can write our plugins against. The model, view and controller actions each have slightly different event variables because they do different things.

#### The Model

The model really is the workhorse of the triad. Not only does it create the model entities based on the data it retrieves from the datastore. It also indirectly interprets the request to decide whether or not you want to interact with a list or a unique item. 

It exposes four (4) actions before and after they are fired, each with different `$event` variable properties. We list them below and describe the relevant properties the `$event` variable has.

##### Fetch


|method|description|
|:---------|:---------------|
|`_actionFetch()`|Much like it sounds, `fetch`, gets the results from the database based on the model's state, and place's that result in the model's entity object. Controller actions use the model's fetch method often.|

| $event properties         | description |
|:-----------------|:--------------|
|entity|This property is similar (and may be exactly the same) to the controller's `$event->result` property and is meant for **After** events.|

##### Count

|method|description|
|:---------|:---------------|
|`_actionCount()`|The `count` action performs a query similar to fetch, based on the models state, but instead of retrieving the actual data it will return the number of entities. |

| $event properties         | description |
|:-----------------|:--------------|
| count |The count result as determined by the query. Meant for an **After** event handler. |

##### Reset

|method|description|
|:---------|:---------------|
|`_actionReset()`|Resetting a model empties both the entity and count cache properties of the model.|

| $event properties         | description |
|:-----------------|:--------------|
|modified |Is an array of the modified state properties. This is available as both a **Before** and **After** event property. |


##### Create

|method|description|
|:---------|:---------------|
|`_actionCreate()`|The `create` action takes an array and creates an model entity, which can be anyone of a number of [model entity types](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/libraries/model/entity).|

| $event properties         | description |
|:-----------------|:--------------|
|properties |An array of the properties that a new entity is about to get. Meant to be used in a **Before** event handler. |

#### The View 

As you might expect the View handles everything to do with rendering the output of your component extension. There is one action exposed. 

|method|description|
|:---------|:---------------|
|`_actionRender()`|The view takes the model's entity data and passes it to its template where its is formatted for display. That all happens as a result of the `render()` action.|


| $event properties         | description |
|:-----------------|:--------------|
|action|The original action that triggered the event, in this case **render**.|
|parameters |The parameters property is normally tied to the state of model entity, layout and view variables that characterize the request and is available to both the **Before** and **After** events.|


#### The Controller 

The Controller has six (6) actions in total, and all are responsible for handling a particular type of request. All of the controller actions get the same event properties in each case, though the values of those properties may be different. This is in part to do with the fact that each of these actions gets invoked via the [KControllerAbstract::execute](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/abstract.php) method. 

**The Controller `$event` Variable**

| $event properties         | description |
|:-----------------|:--------------|
|`action` |The original action that triggered the event. Can be render, browse, read, edit, add or delete.| 
|`data`|Any data that is passed to the controller action gets set as the $event->data. Typically this is used in the **Before** tense for any action that takes you would pass in data, such as **Add**, **Edit**, **Delete** or **Post**. You could modify that data here if you wished.|
|`result`|This is populated with the result of the action, only applicable to **After** events.|

**The Controller Actions**

|method|description|
|:---------|:---------------|
|_actionBrowse()|When you want a list of items the `browse` action will respond to the GET request where the view parameter is plural (e.g. `option=com_acme&view=bars`). The model is loaded and its `fetch` method called. 
|_actionRead()|A GET request for a single item is handled by the `read` action (e.g. `option=com_acme&view=bar&id=1`). It loads the model and either gets an existing entity or creates a new one if no `id` is set. 
|_actionEdit()|When you make a POST request where one or more existing entity `id`s with updated properties are passed in, the `edit` action handles loading the model entity, setting the new properties and saving those changes. 
|_actionAdd()|A POST request with no `id` property set will result in an `add` action. It will load the model, create an entity and then attempt to save the new entity.|
|_actionDelete()|A DELETE request will load all the results for a given model state and erase them from the database. **Be careful with this one**.|
|_actionRender()|For GET requests it actually serves as a pass-through for `_actionBrowse` and `_actionRead`. When it gets the result from either of these two, it will pass it to the view for actual rendering.|


### Properties available to all event handlers


| $event properties| description |
|:-----------------|:------------|
|`target`|All event variables are populated with a target. This is the object that triggered the event, in our case above it would be the **bar** controller.	 Use the provided KEvent::getTarget() method to interact with the object.|


## What is possible?

A better question would be **"What's not possible?"**. To get a feel for the potential, lets extend the signature of our example `PlgAcmeExample` plugin so that it that takes advantage of all the opportunities exposed in just the MVC layer, again only for one entity `Bar`.

<a name="first_acme"></a>
```php
<?php
class PlgAcmeExample extends PlgKoowaSubscriber
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

If you count them, that's twenty two (22) distinct opportunities for a developer to augment the `Acme` component's treatment of the `Bar` entity in exactly the way they choose; **and that's for just one entity type**.
If the extension were to have another entity called `Foo`, then there are twenty two more.

> **Tip:** There are four more actions mixed into a controller's interface by default via the [Editable behavior](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/components/com_koowa/controller/behavior/editable.php#L16), and thus eight more opportunities for each entity. 

<!--
> **Next Tip:** There are even more exposed for the component's [Dispatcher](#dispatcher)
-->


## In closing

Component extensions developed with the Nooku Framework exposes all of its MVC actions to the Event API, both before and after they fire. This gives automatic and granular opportunities for sites that use the component to alter its functionality at run time with normal Joomla plugins. 

We've taken a look at the major areas to help you understand what is available in Joomlatools component extensions, and what you could have in your own Nooku Framework powered components. 
