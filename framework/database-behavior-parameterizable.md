# Parameterizable

Nooku Framework solves the problem of allowing custom fields in its components by providing a database behavior called Parameterizable. 

The class handles the saving and retrieving of non-normalized data (more than one piece of information in a field) for a given format. 

We take a walk through some of the related objects and classes to give you some insight on how this behavior works.

## Formats

There are a number of formats available for storing information in a column. Nooku framework goes well beyond INI and JSON by giving you all of the following:

+ php  (parameters are stored as php arrays) 
+ yaml - 
+ xml
+ ini
+ json

They are all available for inspection at [libraries/koowa/libraries/object/config/](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/libraries/object/config). 

## KConfigObject

Each parameter set that the behavior returns is an object that extends from [KConfigObject](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/object/config/config.php#L19). 
Doing so provides a nice uniform interface for interacting with the data no matter what format its in, with some very useful methods for doing so. 

> **Technical Tip:** Each KObjectConfig[Format] implements the serialziable interface and extends KObjectFormat, and so provides the option of storing and retrieving parameters to a file. 


## Using a Custom Column

Parameters can actually be stored in any column of appropriate type (i.e. not int or date, etc). The class takes a `column` configuration option so we can use it for any column we like. For example, a column name like `config` or `settings` will be dealt with in the same way. Simply specify the column in the `_initialize` config object of a new class that extends this behavior:

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
 
### Assign a Formats: Table column filters

A columns format is defined either by the presence of a filter assigned to that column; or, if non is assigned by the `type` actually defined in the physical database column itself. 

For a column to be used in this way it needs to have a valid format from above associated with it and we do this via the column's filter. The filter makes sure that the information gets written to the column in the right format. In the DOCman documents table for example, the `parameter` column has KFilterJson filter attached to it.  Hence if we set the `parameter` column of a row object to an array, that filter will take care of turning the array into a json string for database storage. 
Parameterizable asks the table object for the filter which is applied to that column, because the filter defines the format.  

Therefore to assign a desired format, we just need to tell the table object which one we want for that column. 

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

The format specified in the column's filter lets `getParameters()` know what strategy to use to pack and unpack your data.

## isParameterizable?

When looking to interact with a row object's parameters we want to make sure that the "parameterizable" table behavior is present in that row's table. So we ask first:

```php
if($bar->isParameterizable()) {
     $params =   $bar->getParameters();
}
```
This is good practice. We are checking if the `getParameters` method is available in the `$bar` object's interface. There is a greater risk of getting a fatal error otherwise. 

