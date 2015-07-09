---
layout: default
title: Parameterizable
---

* Table of Content
{:toc}

## Introduction

There is sometimes a need to store more than one value in a table column as a serialized string of some kind. Maybe each record in the table has different configuration settings, or maybe you simply require flexibility in data storage without the need, or in many cases, the ability to add columns to your table to hold individual pieces of data. With storage, you also want retrieval; you'll need to decode that data to use it in your application.

The Framework provides for both storing and retrieval of item level configuration or customized inputs (custom fields) in a component's tables with a database behavior called **Parameterizable**, i.e. [`KDatabaseBehaviorParameterizable`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/database/behavior/parameterizable.php#L16)

<!-- The Framework solves the problem of allowing custom fields in its components by providing a database behavior called Parameterizable: -->

By making use of the [`KFilter`](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/libraries/filter) classes and `KConfigFormat` this behavior handles the saving and retrieving of non-normalized data in a given format.

We take a walk through some of the related objects and classes to give you some insight on how this behavior works.

## Formats

Data stored in this way needs a **format**. There are a number of formats available for storing information in a column, and anywhere else for that matter, e.g perhaps a file. Currently the following formats are supported by the Framework:

+ php  (parameters are stored as php arrays)
+ yaml
+ xml
+ ini
+ json

These formats are mostly used to store, retrieve and encapsulate **configuration** objects, and as such, they are all available for inspection at [libraries/koowa/libraries/object/config/](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/libraries/object/config).  All of these classes extend from KConfigObject.

## KConfigObject

When we ask a row object for its `parameters` the behavior returns an object that extends from [KConfigObject](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/object/config/config.php#L19).
>KObjectConfig class plays a key role in all the major objects in the Framework. Each of them uses this object to provide for its configuration.

In fact, we build this object based primarily on the format that the `parameters` table column is **filtered** with, and if no filter exists then the `type` attribute of the table schema. The data from that column is then injected into the object.

Extending KObjectConfig provides a nice uniform interface for working with the data contained in the object no matter what format its in, with some very useful methods for doing so.

> **Technical Tip:** Each `KObjectConfig[Format]` implements the `serialziable` interface and extends `KObjectConfigFormat`, and so provides the option of storing and retrieving parameters to a file.

## Using a Custom Column

The column that gets used to store this data is specified in the objects configuration, and the default is 'parameters'.

{% highlight php %}
<?php
class ComAcmeDatabaseBehaviorParameterizable extends KDatabaseParameterizable
{
	function _initialize(KObjectConfig $config)
	{
		$config->append(array(
			'column' => 'settings' // or whatever column you want!
		));
		parent::_initialize($config);
	}
}
{% endhighlight %}

Parameters can actually be stored in any column of appropriate type (i.e. not `int` or `date`, but can be `text`, `blob` or `varchar`, etc). The class takes a `column` configuration option so we can tie this behavior to a column other than `parameters`.

For example, a column name like `config` or `settings` will be dealt with in the same way as `parameters`. Simply specify the column in the `_initialize` config object of a new class that extends this `KDatabaseBehaviorParameterizable` as we have done above.


> **Did you know? **
> You can also the Nooku Framework bootstrapper to configure this object and not even have to create the class. By creating a resources/config/bootstrapper.php file in your component and adding the following:

{% highlight php %}
<?php
return array(
 'identifiers' => array(
    'com://site/acme.database.behavior.parameterizable =>
        array('column' => 'settings')
    )
);
{% endhighlight %}

### KFilter and Formats

A column format is defined either by the presence of a filter assigned to that column; or, if none is assigned, by the `type` actually defined in the  database schema for the column itself.

{% highlight php %}
<?php
class ComAcmeDatabaseTableBars extends KDatabaseTableAbstract
{
	function _initialize(KObjectConfig $config)
	{
		$config->append(array(
			'filters' => array('parameters'   => array('json')
		));

		parent::_initialize($config);
	}
}
{% endhighlight %}

For the Parameterizable behavior to do its work, the column to be used in  **must** have a valid format from above associated with it. The filter gets used by the behavior to make sure that the information gets written to the column in the right format. And since we filtered it using this format to store it, we must use the same format to unserialize the data and push it into the KObjectConfig object.

In the `Acme` extension `Bars` table we defined above, the `parameter` column has `KFilterJson` filter attached to it.  Hence if we set the `parameter` column of a row object to an array, that filter will take care of turning the array into a json string for database storage. When we try to retrieve the column with `getParameters()`, the method sees KFilterJson and builds and returns a KObjectConfigJson object with the data.

### Facts

+ Parameterizable asks the table object for the filter which is applied to that column, because the filter defines the format.

+ Therefore to assign a desired format, we just need to tell the table object which one we want for that column.

+ The format specified in the column's filter lets `getParameters()` know what strategy to use to pack and unpack your data.

## isParameterizable()?

When looking to interact with a row object's parameters we want to make sure that the "parameterizable" database behavior is present in that row's table. So we ask first:

{% highlight php %}
<?php
if($bar->isParameterizable()) {
     $params =   $bar->getParameters();
}
{% endhighlight %}

This is good practice. If the behavior exists its **mixable** methods get added to the `$bar` row object's interface, which is why we can call `getParameters` . There is a risk of getting a fatal error if the behavior is not present in some context.

In some of the examples above we have alluded to using a custom column name in the behavior, like `settings` or `config`, instead of the default `parameters`. If you do use a custom column, a method which is similar to `getParameters` be exposed for that column as well via PHP magic __call method. The column name `settings` yields callable `getSettings` in the row object's interface, and if `config` were used, `getConfig` would be callable too. 
