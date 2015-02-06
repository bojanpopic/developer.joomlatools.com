# Parameterizable

There is sometimes a need to store more than one value in a table column as a serialized string of some kind. Maybe each record in the table has different configuration settings, or maybe you simply require flexibility in data storage without the need, and in many cases, the ability to add columns to your table to hold individual pieces of data. 
 
The Framework provides for storing of item level configuration or customized inputs (custom fields) in a component's tables with a database behavior called **Parameterizable**
<!-- The Framework solves the problem of allowing custom fields in its components by providing a database behavior called Parameterizable: -->

```KDatabaseBehaviorParameterizable``` 

In combination with the [`KFilter`](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/libraries/filter) classes and `KConfigFormat` this behavior handles the saving and retrieving of non-normalized data in a given format. 

We take a walk through some of the related objects and classes to give you some insight on how this behavior works.

## Formats

Data stored in this way needs a Format. There are a number of formats available for storing information in a column, and anywhere else for that matter, e.g a file, or a session. Currently the following formats are supported: 

+ php  (parameters are stored as php arrays) 
+ yaml - 
+ xml
+ ini
+ json

These are 'Configuration' formats and as such, they are all available for inspection at [libraries/koowa/libraries/object/config/](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/libraries/object/config). They provide handy encoding for configuration objects as strings.  

## KConfigObject

When we ask a row object for its `parameters` the behavior returns an object that extends from [KConfigObject](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/object/config/config.php#L19). 
Doing so provides a nice uniform interface for working with the data contained in the object no matter what format its in, with some very useful methods for doing so. 

> **Technical Tip:** Each `KObjectConfig[Format]` implements the `serialziable` interface and extends `KObjectFormat`, and so provides the option of storing and retrieving parameters to a file. 


## Using a Custom Column

The column that gets used to store this data is specified in the objects configuration, and the default is 'parameters'. 
```php
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
```

Parameters can actually be stored in any column of appropriate type (i.e. not int or date, but can be text and blob, etc). The class takes a `column` configuration option so we can assign this behavior for any column we like. 

For example, a column name like `config` or `settings` will be dealt with in the same way as `parameters`. Simply specify the column in the `_initialize` config object of a new class that extends this `KDatabaseBehaviorParameterizable` as we have done above.


> **Did you know? ** 
> You can also the Nooku Framework bootstrapper to configure this object and not even have to create the class. By creating a resources/config/bootstrapper.php file in your component and adding the following: 
 
```php 
 return array(
		 'identifiers' => array(
			'com://site/acme.database.behavior.parameterizable =>
				array('column' => 'settings')
		)
);
``` 
 
### Assign a Format: Table column filters

A column format is defined either by the presence of a filter assigned to that column; or, if none is assigned by the `type` actually defined in the physical database column itself. 

```php
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
```

For the Parameterizable behavior to do its work, the column to be used in  **must** have a valid format from above associated with it. The filter gets used by the behavior to make sure that the information gets written to the column in the right format. 

In the Acme extension Bar table we defined above, the `parameter` column has `KFilterJson` filter attached to it.  Hence if we set the `parameter` column of a row object to an array, that filter will take care of turning the array into a json string for database storage. 

Parameterizable asks the table object for the filter which is applied to that column, because the filter defines the format.  

Therefore to assign a desired format, we just need to tell the table object which one we want for that column. 

The format specified in the column's filter lets `getParameters()` know what strategy to use to pack and unpack your data.

## isParameterizable?

When looking to interact with a row object's parameters we want to make sure that the "parameterizable" database behavior is present in that row's table. So we ask first:

```php
if($bar->isParameterizable()) {
     $params =   $bar->getParameters();
}
```
This is good practice. If the behavior exists its `mixable` methods get added to the $bar row object's interface, which is why we can call `getParamerters` . There is a risk of getting a fatal error if the behavior is not present in some context. 

In some of the examples above we have alluded to using a custom column name in the behavior, like `settings` or `config`, instead of the default `parameters`. If you do use a custom column, a method which is similar to `getParameters` be exposed for that column as well. The column name `settings` yields `getSettings` in the row object, and if `config` were used, `getConfig` would be callable too. 

```php
$params = $bar->getSettings();
```