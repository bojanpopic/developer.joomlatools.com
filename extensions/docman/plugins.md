# Plugins

There are times when you may want to alter or augment the functionality of DOCman to suit a specific need in a given situation.
Perhaps you want to send an email when a document is uploaded. Maybe you want add some data to the list of documents before
it gets rendered to the screen. Whatever you would like to do is possible with Plugins and our Event driven architecture.

<!-- toc -->

## Introduction

DOCman is a Nooku Framework powered extension and as such, has access to a powerful, yet simple event architecture.
Almost ANY action in DOCman can have an event listener registered against it. Not only that, but multiple listeners can be
registered for a single event.

In the majority of cases, you will want to register an event listener against a controller action. A controller action is
a method within DOCman that is run when a particular user request happens. There are five (5) standard actions that are available in
the controller which are characterized with the BREAD acronym:

* **B**rowse - Viewing a list of documents
* **R**ead - Viewing a single document
* **E**dit - Editing/updating a single existing document on save
* **A**dd - Adding a new document on save
* **D**elete - Deleting a document

Each of these actions can have an event listener registered to be run **before** or **after** the action itself is executed.

There are a number controllers for whose actions you may wish to register an event handler against:

**Admin Controllers**

* Document
* Category
* File

**Site Controllers**

* Document
* Download
* List

##Setup

Your first step is to create a plugin and register/install it within Joomla. If you have ever created a Joomla plugin, the
process is exactly the same. A plugin consists of at least 2 files, a PHP class and an XML descriptor. Let's quickly cover how to
set these up:

###XML Descriptor

The XML file contains a description of the plugin so that Joomla knows what it is installing.

```xml
<?xml version="1.0" encoding="utf-8"?>
<extension version="2.5" type="plugin" group="koowa">
    <name>DOCman Plugin</name>
    <author>YOUR NAME</author>
    <creationDate>June 2013</creationDate>
    <version>1.0.0</version>
    <description>PLUGIN DESCRIPTION</description>
    <files>
        <filename plugin="docman">docman.php</filename>
    </files>
</extension>
```

This is the minimum required contents of the descriptor. Adjust the values accordingly. There are plenty more options you
can configure for the XML file, but you need to specify at least these. For more information consult the Joomla 2.5+ documentation.

The XML file should have the same name as your plugin (see the `<filename plugin="docman">` line). Your XML file would in this example
be named `docman.xml`.

##PHP Class

The PHP class contains the code you want to execute before/after certain events. The class name must conform to a specific
format in order for your plugin to work. The format is as follows:

`PlgKoowaName` where the **Name** part is the name (first letter capitalized) of your plugin as defined in the `<filename plugin="docman">` section
of the XML descriptor above. In our case, the name would be:

`PlgKoowaDocman`

Also, the plugin **must** also extend [`PlgKoowaAbstract`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/plugins/koowa/abstract.php#L10)

So our PHP file should look something like this:

```php
<?php
class PlgKoowaDocman extends PlgKoowaAbstract{}
```

## Installing the plugin

Joomla provides 2 main methods for installing plugins

1. Install via a ZIP file
2. Place the files in the correct location and "discover" them

<!-- CB: Should we add a third option for development via the console? -->

Method 1 is generally used when packaging plugins and distributing them, while Method 2 is useful when you have full control
over the source code and can just write the files in place, then tell Joomla to discover them so they are installed.

1) For this example, let's put the files in place so that you know where they are when we come to editing them. The files
should be located in the `/plugins/koowa/name` directory where name is the name of your plugin, in our case `/plugins/koowa/docman`

2) Once the files are in place, in the Joomla backend, go to **Menu > Extensions > Extension Manager**, then select **Discover**
from the sub-menu.

3) On the Discover screen, hit the **Discover** button, the plugin should then show up in the list. Now click the
checkbox to the left of the plugin, and hit **Install**. The plugin should now be installed.

4) Once the plugin is installed, you also need to enable it. Go to: **Menu > Extensions > Plug-in Manager** and search by
name or filter by type and set to **koowa**. When you the newly created plugin, you should see a red cross in the status
column to indicate the plugin is disabled; click that red cross to enable the plugin.

## Event handlers

### Naming

Congratulations on getting this far! Let's go ahead and create some actual event handlers to our class.

An event handler is simply a method of our new plugin, the naming of which conforms to a standard convention as follows:

on[**Before/After**][**Component**][**Name**][**Type**][**Action**]

> Note: Each part in brackets must always start with an uppercase letter.

This might look confusing, but it's actually quite simple. Each of the parts in brackets is a variable placeholder and
can be substituted with different values:

* Before/After - All actions have a before/after event and unsurprisingly are run before/after the action
* Component - The name of the component the event belongs to, in this case **Docman**
* Name - The name of the "entity" that the event belongs to, e.g. the **Document**
* Type - The type of the object using the entity, e.g. **Controller** (*)
* Action - The name of the action being run. In the case of controllers, this would be one of the BREAD actions as explained above.

If we wanted to run some code after the user adds a new document, the event name would look like this:

`onAfterDocmanDocumentControllerAdd()`

Using this syntax, you can register events for any combination of controllers and actions.

> In this tutorial we are only covering controller events. The event system is also capable of subscribing to
database table, database adapter, model and view events! Consider for example **onBeforeDocmanDocumentViewRender** or
**onAfterDocmanDocumentModelFetch**. <br><br>Maybe you can think of a few more?


### Method

The event handler takes a single argument which is an instance of [`KEventInterface`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/event/interface.php#L10)
and holds all of the information about the event that was dispatched. This is very similar to how events work in Javascript; the event object
that is passed to the method contains everything you need to know about who/what generated the event.

```php
public function onAfterDocmanDocumentControllerAdd(KEventInterface $event)
{
    //The event object contains several useful properties
    $caller		= $event->caller;
    $action 	= $event->action;
    $data 		= $event->data;
    $result 	= $event->result;
}
```

* Caller - This is the object that triggered the event, in the case above it would be the **document** controller.
* Action - The original action that triggered the event, in this case **add**.
* Data - Any data that is passed to the controller action is stored in a KConfig object. Typically this is used for
any action that takes in data, such as **Add**, **Edit**, **Post** and **Put**. You could modify the data here if you wished.
* Result - This is populated with the result of the action, only applicable to **After** events.

### Stopping Events

Just as in Javascript, it is possible to stop any further events from being run. You can do this by calling

```php
$event->stopPropagation();
```

This will stop any other event handlers registered for the given action from being run.

### Before/After - When to use

It can sometimes be confusing to know when to use before or after events. However, following these simple rules should help:

* **BEFORE** - If you wish to modify the incoming data, such as in add/edit actions.
* **AFTER** - If you need to be sure the action was successful or need to manipulate the response before it is displayed,
for example removing certain values from a document for unregistered users.

## Put it all together

```php
<?php
class PlgKoowaDocman extends PlgKoowaAbstract
{
    public function onBeforeDocumentControllerAdd(KEventInterface $event)
    {
        //Do something like sending an email to an administrator and disabling the document
        $event->data->enabled = 0;
        mail('admin@yoursite.com',
            'New document added',
            'A new document has been added with title:'.$event->data->title
        );
    }
}
```

The above is an example of how you might send an email when an event happens and modify the incoming data according to
your business rules.

## Example Plugin

Let's work through a real world example that was requested in the Joomlatools forum:

> "We want to use DOCman for special document processing. The document description will contain keywords for special tagging
 (year of publishing, author etc).
> If the document is saved, modified or deleted we would listen to these events and store this information in a
custom database table so that we can do special search operations."

So let's go ahead and work out what events we need to respond to:

* When: **after** - we do this after the action has run so that if the action were to fail, our event listener won't run.
* Component: **docman** - This is to only affect the DOCman extension.
* Name: **document** - We're only interested in documents
* Action: **add**,**edit**,**delete** - Save/modify/delete events

Therefore the event method names we need are:

```php
class PlgKoowaDocman extends PlgKoowaAbstract
{
        onAfterDocmanDocumentControllerAdd(KEventInterface $event){}
        onAfterDocmanDocumentControllerEdit(KEventInterface $event){}
        onAfterDocmanDocumentControllerDelete(KEventInterface $event){}
}
```

Pretty simple so far right?

Now consider save events, these cover both add and edit (create and update), so the simplest way to have both of these
methods run the same code is have one call the other.

```php
class PlgKoowaDocman extends PlgKoowaAbstract
{
        onAfterDocmanDocumentControllerAdd(KEventInterface $event)
        {
            return $this->onAfterDocmanDocumentControllerEdit($event);
        }
        onAfterDocmanDocumentControllerEdit(KEventInterface $event){}
        onAfterDocmanDocumentControllerDelete(KEventInterface $event){}
}
```

Now, let's flesh out the edit event.

In the brief the customer gave, they want to react to certain keywords for special tagging. As we don't know the format
for this, let's just say they'll be in the format `{year:X}` and `{author:Y}`  where **X** is the year number and **Y** is the author name.

First things first; we need to get the document that was added/edited. This is contained within the "result" property
 of the event object as it's the "result" of the action that's being performed.

Secondly we need to get the description field of the document that we're going to check for the keywords.

```php
public function onAfterDocmanDocumentControllerEdit(KEventInterface $event)
{
    //The result of the controller action is stored in the "result" property
    $row = $event->result;
    //The row contains properties that map to the database table columns
    $description = $row->description;
}
```

If you were to `var_dump($description)` or use your favorite debugger you should find that it contains the value of the description field.

> Note: you'll need to add an `exit()` or `die()` method after the var_dump otherwise the page will redirect and you won't see anything).

Once we have the description, we can do some simple regular expression matches on it to extract the year and the author:

```php
public function onAfterDocmanDocumentControllerEdit(KEventInterface $event)
{
    //The result of the controller action is stored in the "result" property
    $row = $event->result;
    //The row contains properties that map to the database table columns
    $description = $row->description;
    //You can now do anything you want with the data, for example look for certain keywords
    $year = $author = null;
    if(preg_match('#{year:([\s0-9]*)}#', $description, $match)){
        $year = trim($match[1]);
    }
    //Or get the author?
    if(preg_match('#{author:([\s\w]*)}#', $description, $match)){
        $author = trim($match[1]);
    }
    //Now do some custom query to store these values, perhaps store in a table using $row->id as an index?
    if($year){
        //Do something
    }
    if($author){
        //Do something
    }
}
```

Simple as that :)

To get the sample plugin, visit here: [Example Plugin](https://github.com/joomlatools/docman-example/). You can download it
or even install it with Composer.

## In Closing

We have shown you how to create event handlers for any DOCman controller action.

You can affect both the input and output of any one of those actions by simply building and placing a plugin properly and following the method
naming convention that we have outlined above.

Though we did not cover all the possibilities extensively here, you have this same ability for DOCman models, tables and views as well.

Remember also, the handler method gets passed an [`KEventInterface $event`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/event/interface.php#L10) object with most of the information you will need.