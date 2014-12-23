# Plugins

The Framework provides a nice Event API to Joomla! extensions that use it. It is the principle mechanism by which we can subscribe a Joomla plugin to events in other parts of the Framework. All of the main actions that take place in the MVC layer expose both before and after command chains that are exposed to the Joomla! Plugin layer for plugin's that extend `PlgKoowaSubscriber`. Here we provide a high level overview of the classes and objects involved, and dive into some specific examples.

<!-- toc -->

## Setup

Your first step is to create a plugin and register/install it within Joomla. If you have ever created a Joomla plugin, the process is exactly the same. A plugin consists of at least 2 files, a PHP class and an XML descriptor. Let's quickly cover how to set these up:

### XML Descriptor

The XML file contains a description of the plugin so that Joomla knows what it is installing.

```xml
<?xml version="1.0" encoding="utf-8"?>
<extension version="2.5" type="plugin" group="koowa">
    <name>Acme Plugin</name>
    <author>John Foobar</author>
    <creationDate>Dec 2014</creationDate>
    <version>1.0.0</version>
    <description>PLUGIN DESCRIPTION</description>
    <files>
        <filename plugin="acme">acme.php</filename>
    </files>
</extension>
```

This is the minimum required contents of the descriptor. Adjust the values accordingly. There are plenty more options you can configure for the XML file, but you need to specify at least these. For more information consult the Joomla 2.5+ documentation.

The XML file should have the same name as your plugin (see the `<filename plugin="acme">` line). Your XML file would in this example
be named `acme.xml`.

## PHP Class

The PHP class contains the code you want to execute before/after certain events. The class name must conform to a specific format in order for your plugin to work. The format is as follows:

`PlgKoowaName` where the **Name** part is the name (first letter capitalized) of your plugin as defined in the `<filename plugin="docman">` section
of the XML descriptor above. In our case, the name would be:

`PlgKoowaAcme`

Also, the plugin **must** also extend [`PlgKoowaSubscriber`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/plugins/koowa/subscriber.php#L10)

So our PHP file should start out looking something like this:

```php
<?php
class PlgKoowaAcme extends PlgKoowaSubscriber{}
```

## Installing the plugin

Joomla provides 2 main methods for installing plugins

1. Install via a ZIP file
2. Place the files in the correct location and "discover" them

<!-- CB: Should we add a third option for development via the console? -->

Method 1 is generally used when packaging plugins and distributing them, while Method 2 is useful when you have full control over the source code and can just write the files in place, then tell Joomla to discover them so they are installed.

1. For this example, let's put the files in place so that you know where they are when we come to editing them. The files should be located in the `/plugins/koowa/name` directory where name is the name of your plugin, in our case `/plugins/koowa/docman`.

2. Once the files are in place, in the Joomla backend, go to **Menu > Extensions > Extension Manager**, then select **Discover** from the sub-menu.

3. On the Discover screen, hit the **Discover** button, the plugin should then show up in the list. Now click the checkbox to the left of the plugin, and hit **Install**. The plugin should now be installed.

4. Once the plugin is installed, you also need to enable it. Go to: **Menu > Extensions > Plug-in Manager** and search by name or filter by type and set to **koowa**. When you the newly created plugin, you should see a red cross in the status column to indicate the plugin is disabled; click that red cross to enable the plugin.

## Event handlers

### Naming

Without preamble, the event naming pattern is as follows

`on` + [**When**] + [**Package**] + [**Subject**] + [**Type**] + [**Action**]

> In our ["What is possible? example"](#what-is-possible), the pattern that a plugin method takes can to be readily seen.

Each of the parts in brackets holds a piece of information that helps the event command handler build an event name, and broadcast or publish that event.

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

> **Technical Tip**: As soon as they are instantiated a PlgKoowaSubscriber loads up the instance of the `KEventPublisher` and adds itself and its callable methods that begin with the letters **'on'** as event listeners for each of the similarly named events. In other words, it `subscribes` those `on` methods to specific `on` events. For example, the listeners registered for event named **"onBeforeAcmeBarControllerBrowse"** are in this case plugin's  `onBeforeAcmeBarControllerBrowse` method.
 
>**Another Tip:** `PlgKoowaSubscriber` plugins will not fire for native Joomla! plugin events because they aren't connected to `JEventDispatcher`. 

### PlgKoowaAbstract

Plugins written to take advantage of the native Joomla! and other extension plugin events, need only extend `PlgKoowaAbstract`. This class extends from `JPlugin` and will work like any other plugin, but you have the added bonus of direct access to the Frameworks object manager, not to mention allowing the plugin to have its own object identifier. 

Another benefit to using `PlgKoowaAbstract` over JPlugin is the ability to tell the plugin not to connect or subscribe to any events at all. We use this ability in [LOGman](http://developer.joomlatools.com/extensions/logman.html) to make sure that all the appropriate files are loaded for all the other LOGman plugin integrations. It helps to keep from cluttering up the dispatcher. 

### Before/After - When to use

It can sometimes be confusing to know when to use before or after events. However, following these simple rules should help:

* **BEFORE** - If you wish to modify the incoming data, such as in add/edit actions.
* **AFTER** - If you need to be sure the action was successful or need to manipulate the response before it is displayed,
for example removing certain values from a document for unregistered users.

### The Event Variable

When subscribers to the Event API, our Plugins in this case are notified that a given event is taking place, they get a nice `KEventInterface` object with all the information they need: 

```php
    $caller		= $event->caller;
    $action 	= $event->action;
    $data 		= $event->data;
    $result 	= $event->result;
```
It provides access to some of the same objects that our `$context` variable from above gets, but also gives us methods to control the event like, `stopPropagation`,  `canPropogate` , and attribute getters and setters. We can assess and alter the `$context->data` property before it makes it to the subject class's execute method or alter the `$context->result` before it returns to the original calling scope.  

* Caller - This is the object that triggered the event, in the case above it would be the **document** controller.
* Action - The original action that triggered the event, in this case **add**.
* Data - Any data that is passed to the controller action is stored in a KConfig object. Typically this is used for
any action that takes in data, such as **Add**, **Edit**, **Post** and **Put**. You could modify the data here if you wished.
* Result - This is populated with the result of the action, only applicable to **After** events.



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


