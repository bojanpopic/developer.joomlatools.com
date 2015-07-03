---
layout: default
title: Plugins
---

**Read the [Framework Plugins](/framework/plugins.html) guide to get the absolute most out of this tutorial**. We build on concepts that are covered in that guide.  

* Table of Content
{:toc}

## Introduction

There are times when you may want to alter or augment the functionality of DOCman to suit a specific need in a given situation.
Perhaps you want to send an email when a document is uploaded. Maybe you want add some data to the list of documents before
it gets rendered to the screen. Whatever you would like to do is possible with Plugins and our Event driven architecture.

DOCman is a Nooku Framework powered extension and as such, has access to a powerful, yet simple event architecture. Almost ANY action in DOCman can have an event listener registered against it. Not only that, but multiple listeners can be registered for a single event.

In the majority of cases, you will want to register an event listener against a controller action. This is not a requirement though, you can also register listeners against all model, view and controller actions. 

There are a number of entities in DOCman for whose MVC actions you may wish to register an event handler against:

|In the Site component|In the Administrator component|
|-----------------|------------|
|Document| Document		|
|Download|Category|
|List|File|

To get a sense of the granularity of the events that a plugin can subscribe to have a look at ["What is Possible?"](/framework/plugins.html#what-is-possible) in the Framework Plugins guide. 

## Setup

A plugin consists of at least 2 files, a PHP class and an XML descriptor. 

>We cover the major details of each in [Creation and Installation](/framework/plugins.html#creation-and-installation) section of the Framework Plugin guide.

### XML Descriptor

This is what our _bare bones_ plugin manifest file should look like. 

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<extension version="2.5" type="plugin" group="docman">
    <name>DOCman Document Plugin</name>
    <author>YOUR NAME</author>
    <creationDate>June 2013</creationDate>
    <version>1.0.0</version>
    <description>PLUGIN DESCRIPTION</description>
    <files>
        <filename plugin="document">document.php</filename>
    </files>
</extension>
{% endhighlight %}
We've made our `group` attribute "docman" because we are altering the data from DOCman. The system will make sure that this group of plugins is loaded whenever a DOCman event is broadcast. Also for the sake of illustration, we have named our plugin `document` in 

`<filename plugin="document">document.php</filename>` 

However, you are free to name your plugin anything you like.

## PHP Class

The class that matches our new manifest starts out looking something like
{% highlight php %}
<?php
class PlgDocmanDocument extends PlgKoowaSubscriber{}
{% endhighlight %}

### Basic Example Method

{% highlight php %}
<?php
class PlgDocmanDocument extends PlgKoowaSubscriber
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
{% endhighlight %}

Here is an event handler that we might use to help moderate document submissions. 
We are doing two things here: 
1. want to make sure that the document is not published right away 
2. and that we get notified of the submission. 

Our `onBeforeDocumentControllerAdd` method follows a [specific naming convention](/framework/plugins.html#naming).

>Event names are built by Nooku's Event command handler, [KCommandHandlerEvent](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/command/handler/event.php#L120). 

That method reads as follows

>**Before** a **Document**  entity **Controller** executes the **Add** method , do this

For controller focused events the `$event` variable gets the `data` property. This is made up of the input data of the request coming into the action. We intercept it with a **Before** event handler because we want to disable the document before we add it to the database.

Refer to [MVC Actions and Events](/framework/plugins.html#mvc-actions-and-events) for detailed information about specific `$event` variable properties and the actions they are geared towards. 
 
## Real Life Example Plugin

Let's work through a real world example that was actually requested in the Joomlatools forum. It will help solidify the concepts we have covered so far. 

> "We want to use DOCman for special document processing. The document description will contain keywords for special tagging (year of publishing, author etc).
> If the document is saved, modified or deleted we would listen to these events and store this information in a custom database table so that we can do special search operations."

So let's go ahead and work out what events we need to respond to:

* When: **after** - we do this after the action has run so that if the action were to fail, our event listener won't run.
* Component: **docman** - This is to only affect the DOCman extension.
* Name: **document** - We're only interested in documents
* Action: **add**,**edit**,**delete** - Save/modify/delete events

Therefore the event method names we need are:

{% highlight php %}
<?php
class PlgDocmanDocument extends PlgKoowaSubscriber
{
    onAfterDocmanDocumentControllerAdd(KEventInterface $event){}
    onAfterDocmanDocumentControllerEdit(KEventInterface $event){}
    onAfterDocmanDocumentControllerDelete(KEventInterface $event){}
}
{% endhighlight %}

Pretty simple so far right?

Now consider save events, these cover both add and edit (create and update), so the simplest way to have both of these methods run the same code is have one call the other.

{% highlight php %}
<?php
class PlgKoowaDocman extends PlgKoowaSubscriber
{
    onAfterDocmanDocumentControllerAdd(KEventInterface $event)
    {
        return $this->onAfterDocmanDocumentControllerEdit($event);
    }
    onAfterDocmanDocumentControllerEdit(KEventInterface $event){}
    onAfterDocmanDocumentControllerDelete(KEventInterface $event){}
}
{% endhighlight %}

Now, let's flesh out the edit event.

In the brief the customer gave, they want to react to certain keywords for special tagging. As we don't know the format for this, let's just say they'll be in the format `{year:X}` and `{author:Y}`  where **X** is the year number and **Y** is the author name.

First things first; we need to get the document that was added/edited. This is contained within the `result` property of the `$event` object as it's the "result" of the action that's being performed.

Secondly we need to get the `description` field of the document entity that we're going to check for the keywords.

{% highlight php %}
<?php
public function onAfterDocmanDocumentControllerEdit(KEventInterface $event)
{
    //The result of the controller action is stored in the "result" property
    $row = $event->result;
    //The row contains properties that map to the database table columns
    $description = $row->description;
}
{% endhighlight %}

If you were to `var_dump($description)` or use your favorite debugger you should find that it contains the value of the `description` field.

> Note: you'll need to add an `exit()` or `die()` method after the var_dump otherwise the page will redirect and you won't see anything).

Once we have the description, we can do some simple regular expression matches on it to extract the year and the author:

{% highlight php %}
<?php
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
{% endhighlight %}

Simple as that :)

To get the sample plugin, visit here: [Example Plugin](https://github.com/joomlatools/docman-example/). You can download it
or even install it with Composer.

## In closing

We have shown you how to create event handlers for any DOCman controller action.

You can affect both the input and output of any one of those, or model and view actions by simply building and placing a plugin properly and following the method naming convention that we have outlined above. 

Remember also, the handler method gets passed an [`KEventInterface $event`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/event/interface.php#L10) object with most of the information you will need.