---
layout: default
title: Plugins
---

Read the [Framework Plugins](/framework/plugins.html) guide to get the absolute most out of this tutorial. We build on concepts that are covered in that guide.

* Table of Content
{:toc}

## Introduction

There are times when you may want to alter or augment the functionality of DOCman to suit a specific need in a given situation:

* send an email when a document is uploaded
* add some data to the list of documents before it gets rendered to the screen

Whatever you would like to do is possible with Plugins and our Event driven architecture. Almost any action in DOCman can have an event listener registered against it. Multiple listeners can be registered for a single event.

In the majority of cases, you will want to register an event listener against a controller action. However, you can also register listeners against all model, view and controller actions.

There are a number of entities in DOCman for whose MVC actions you may wish to register an event handler against:

|Site component|Administrator component|
|-----------------|------------|
|Document| Document|
|Download|Category|
|List|File|

To get a sense of the granularity of the events that a plugin can subscribe to have a look at ["What is Possible?"](/framework/plugins.html#what-is-possible) in the Framework Plugins guide. 

## Setup

A plugin consists of at least 2 files, a PHP class and an XML descriptor. 

<span class="note">
Note: See [Plugins Creation and Installation](/framework/plugins.html#creation-and-installation) section in the Framework guide for more information.
</span>

### XML Descriptor

In the following snippet we have named our plugin `document`. However, you are free to name your plugin anything you like.

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

The `group` attribute specifies `docman`. The system will make sure that this group of plugins is loaded whenever a DOCman event is broadcast.

### PHP Class

The example below might help moderate document submissions:

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

Two things are being done:

1. make sure that the document is not published right away
2. notification of the submission

The `onBeforeDocumentControllerAdd` method follows a [specific naming convention](/framework/plugins.html#naming).

For controller focused events the `$event` variable gets the `data` property. This is made up of the input data of the request coming into the action. We intercept it with a **Before** event handler because we want to disable the document before we add it to the database.

Refer to [MVC Actions and Events](/framework/plugins.html#mvc-actions-and-events) for detailed information about specific `$event` variable properties and the actions they are geared towards. 
 
## Example

The document description will contain keywords for special tagging (year of publishing, author, etc).
When the document is saved or modified the keywords are extracted from the description and stored in a custom database table.

Events to respond to:

* When: **After** - we do this after the action has run so that if the action were to fail, our event listener won't run.
* Component: **Docman** - This is to only affect the DOCman extension.
* Name: **Document** - We're only interested in documents
* Action: **Add** & **Edit** - Save/modify events

Therefore the event method names we need are:

{% highlight php %}
<?php
class PlgDocmanDocument extends PlgKoowaSubscriber
{
    onAfterDocmanDocumentControllerAdd(KEventInterface $event){}
    onAfterDocmanDocumentControllerEdit(KEventInterface $event){}
}
{% endhighlight %}

### Save event

Save events cover both `Add` and `Edit`. The simplest way to have both of these methods run the same code is have one call the other.

{% highlight php %}
<?php
class PlgKoowaDocman extends PlgKoowaSubscriber
{
    onAfterDocmanDocumentControllerAdd(KEventInterface $event)
    {
        return $this->onAfterDocmanDocumentControllerEdit($event);
    }
    onAfterDocmanDocumentControllerEdit(KEventInterface $event){}
}
{% endhighlight %}

### Edit event

We want to react to certain keywords in the description for special tagging, like:

* `{year:2015}`
* `{author:Stephen Hawking}`

The description field of the document that was added or edited is contained within the `result` property of the `$event` object. It's the result of the action performed.

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

### Extract tags

Some simple regular expression matches will extract the year and the author:

{% highlight php %}
<?php
public function onAfterDocmanDocumentControllerEdit(KEventInterface $event)
{
    //The result of the controller action is stored in the "result" property
    $row = $event->result;
    
    //The row contains properties that map to the database table columns
    $description = $row->description;
    
    //Get the year
    $year = $author = null;
    if(preg_match('#{year:([\s0-9]*)}#', $description, $match)){
        $year = trim($match[1]);
    }
    
    //Get the author
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

This example plugin can be found on [GitHub](https://github.com/joomlatools/docman-example/). You can even install it with Composer.
