---
layout: default
title: Parameterizable
---

* Table of Content
{:toc}

Parameterizable is a database behavior, it allows you to define custom attributes for an entity. The behavior provides an API to get and set the attributes. Ultimately, the attributes get serialised into a single database field.

This approach follows the [Entity Attribute Value (EAV)](https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model) data model. The EAV pattern allows for the storing of a  flexible set of attributes about an entity. Traditionally, EAV does this by using an extra table with three columns: entity, attribute, and value. Each attribute gets its own line in that table. This approach be bulky and makes retrieving data more complicated. Parameterizable follows the EAV model, but stores the attributes along with the entity itself.

## Using parameters

The Parameterizable API provides both `getParameters` and `setPropertyParameters` methods to interact with the data in the database column.

### getParameters()

The data from the column gets unserialized and cached in the `$_parameters` property of the behavior object. That object gets returned as a `KObjectConfig` instance in the defined format.

Here is an example usage that gets the parameters:

{% highlight php %}
<?
if($bar->isParameterizable()) {
    $parameters = $bar->getParameters();
}
{% endhighlight %}

### setPropertyParameters($values)

The `setPropertyParameters` merges the incoming values. Merging preserves attributes that exists already in the `$_parameters` object. Only attributes that are set in the `$values` input will be overwritten.

{% highlight php %}
<?
$bar->setPropertyParameters(array(‘more’ => ‘This param gets merged’, ‘foo’ => ‘This is my overridden Foo Param’));`
{% endhighlight %}

### Remove or set a specific attribute

To unset a specific value, use the `KObjectConfig::remove($name)`, or `KObjectConfig::offsetUnset($name)` methods, e.g. :

{% highlight php %}
<?
$bar->getParameters()->remove(‘foo’) ;
{% endhighlight %}

There are a few ways to add or set an attribute in the `$_parameters` property. Each of these produces the exact same effect:

{% highlight php %}
<?
$bar->getParameters()->offsetSet($offset, $value);
$bar->getParameters()->set($name, $value)
$bar->getParameters()->name = $value;
{% endhighlight %}

### The `save` entity method

The example `$bar` variable is an entity row object. `$bar->save()`  triggers either an `insert` or `update` on the `bars` table object.  Parameterizable both `_beforeInsert` and `_beforeInsert`. These handle the conversion of the `$_parameters` object to a formatted string .  That string is then stored in the `parameters` field of the database.

### What does isParameterizable() do?

{% highlight php %}
<?
if($bar->isParameterizable()) {
   $params =   $bar->getParameters();
}
{% endhighlight %}

The `isParameterizable()` method is a virtual method. The inclusion of a row object's database behaviors are all testable with this pattern:

`is[Behaviorname]`

These virtual methods all function as a result of the [`KDatabaseRowAbstract` magic `__call` method](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/database/row/abstract.php#L649). When invoked it :

+ checks whether the table object has the particular behavior.
+ if so, it loads the behavior object at runtime
+ adds the behavior's mixable methods to the row objects interface, e.g. `getParameters()`

If a behavior object has not been loaded and mixed in, its methods are not available. Calling `$bar->getParameters()` would result in a thrown `BadMethodCallException`.

## Using a Custom Column

{% highlight php %}
<?
class ComAcmeDatabaseBehaviorParameterizable extends KDatabaseParameterizable
{
    function _initialize(KObjectConfig $config)
    {
        $config->append(array(
            'column' => 'settings' // or whatever column name you want
        ));

        parent::_initialize($config);
    }
}
{% endhighlight %}

The table column used to store the parameters gets specified in the object configuration. In the `_initialize` method, the default is 'parameters'. You are free to use any column name. In the example above the `settings` column will be used.

A custom column name will add a new virtual `get` method to the row object's interface. This method has the same function as `getParameters`.  With the column name defined as 'settings'  you can call `getSettings`:

{% highlight php %}
$bar->getSettings(); // passes through to $bar->getParameters();
{% endhighlight %}

<span class="note">
Technical Tip : Use `blob` as your column type if you are storing a large amount of data. It has a much higher compression ratio than `text`.
</span>

You can also the framework bootstrapper to configure the example object. In that case no specialised class for your component. Do this by creating a `resources/config/bootstrapper.php` file in your component and adding the following:

{% highlight php %}
<?
return array(
    'identifiers' => array(
        'com://site/acme.database.behavior.parameterizable => array('column' => 'settings')
    )
);
{% endhighlight %}

## Available Formats

There are many formats available for storing data in your column. The following are currently supported:

+ [php](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/object/config/php.php#L16) (will store the data as PHP arrays)
+ [yaml](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/object/config/yaml.php#L16)
+ [xml](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/object/config/xml.php#L16)
+ [ini](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/object/config/ini.php#L16)
+ [json](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/object/config/json.php#L16)

## Format

The `getParameters` call returns an  [KObjectConfigFormat](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/object/config/format.php#L19) object, an extension of KObjectConfig.

The format class used depends on what filter the table object has specified for that column. If no filter exists for that column then the `type` attribute of the table object’s schema.

### Define the Column Format

{% highlight php %}
<?
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

Column filter formats gets defined in the table object. The `filters` setting in the `$config` variable takes an array of column names. Each of these can have an array of filter formats. Those filters process data before it gets written to the table column.

Your column format gets defined by the presence of a filter assigned to that column.  If a column has no filter, the parameterizable behavior will use JSON.

## Summary

+ Make sure that  Parameterizable gets included and mixed in with `isParameterizable`
+ Using a custom column results in a new virtual `get` method.
+ Parameterizable asks the table object for the filter which gets applied to that column. The filter or the type property of the column schema defines the format.
+ To define format other than JSON, set the table object filters.
+ The format lets `getParameters()` know how  to serialise and unserialise your data.
