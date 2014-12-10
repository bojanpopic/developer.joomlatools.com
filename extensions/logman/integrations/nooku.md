#Nooku components

Joomla! components built on top of the [Nooku Framework](http://www.nooku.org) can also be easily integrated with LOGman.

For logging activities of Nooku powered components, we just need to wire activity loggers to the controllers performing the actions that we want to log. This may be 
achieved by using LOGman plugins.

To better illustrate all this, let us work on a LOGman plugin for logging DOCman documents activities.

##Plugins

The name of the plugin should match the name of the component. This is important so that LOGman may find overrides for activities of a given package/component.

For this, we need to create a LOGman plugin in the `plugins/logman/docman` directory. The `docman.php` plugin file content should be as follows:

```php
<?php
	class PlgLogmanDocman extends ComLogmanPluginKoowa
	{
	}
``` 

Here we are extending **ComLogmanPluginKoowa**, which is the base plugin class for integrating Nooku components. This plugin makes sure that the component controllers become loggable, i.e. it attaches the loggable behavior to each controller that we would like to integrate. The loggable behavior is also preset with one or more loggers by the plugin.

Next step is to tell the plugin which DOCman controller we would like log actions from, and define the logger that will be responsible for logging activities for this controller. We can do this by adding the following code:

```php
 	$config->append(
 		array(
    		'controllers' => array(
        		'com://site/docman.controller.document' => 'plg:logman.docman.logger.document'
    	    )                              
    	)
	);
```

Here we define a controllers array which contains controller/logger pairs. Each listed controller will get a loggable behavior attached with its corresponding logger.

In this case the logger identifier `plg:logman.docman.logger.document` points to the **PlgLogmanDocmanLoggerDocument** class located in the `plugins/logman/docman/logger/document.php` file. For consistency, and when creating plugins, we recommend that loggers are placed in a logger folder, even though they could be loaded from anywhere within the plugin directory.

##Loggers

Loggers sit in the middle between LOGman and your component controller. They provide an interface for grabbing activity data and for logging activities while using this data.

LOGman's base logger class is `ComLogmanActivityLogger`. This logger may be used as is and it may work out of the box for you. The base logger is initialized as follows on **ComActivitiesActivityLogger::_initialize**:

```php
        $config->append(
        	array(
        		'actions' => array(
        			'after.edit', 'after.add', 'after.delete'
        		),
        		'title_column' => array('title', 'name')
        	)
        );          
```

The first `actions` parameter defines the events (we call these commands in Nooku) on which the logger will attempt to log activities. The second `title_column` parameter is a list of properties to test against the activity object for determining its title.

The base logger will basically log add, edit and delete actions from your controllers, assuming that the activity object title is stored on either a `title` or `name` property. If this is the case, the base logger will work for you as is. You may use the base logger along with your controller by initializing the plugin as follows:

```php
<?php
	class PlgLogman{Component} extends ComLogmanPluginKoowa
	{
	 	$config->append(
 			array(
 				'controllers' => array(
 					'{identifier}' => 'com://admin/logman.activity.logger'
 				)
 			)
		);
	}
```

where `{Component}` and `{identifier}` are the component name and the identifier of your controller issuing the actions to be logged respectively.

More often than not, we will like to modify the behavior of the logger, i.e. log other actions, avoid logging in some particular cases, store additional metadata, override the default activity object to activity data mapping, etc. With this in mind, let us get back to our DOCman plugin example.

We are going to override the base logger by creating a `plugins/logman/docman/logger/document.php` file with the following content inside:

```php
<?php
	class PlgLogmanDocmanLoggerDocument extends ComLogmanActivityLogger
	{
	}
```

Right now our custom logger is just extending the base logger. Remember that the the DOCman plugin was initialized so that the document controller is made loggable by using the **PlgLogmanDocmanLoggerDocument** logger.

If we would like to log an additional `download` action, we would add the following code:

```php
	$config->append(
		array('actions' => array('after.download')
	);
```

Our logger will now attempt to log activities after the download action is executed in the document controller.

When logging custom actions, the first thing to take into account is the result of the action being logged. By default, loggers attempt to get this information from the activity object status (see **ComActivitiesActivityLogger::getActivityStatus**). While this work just fine for the default actions (add, edit, delete), the **getActivityStatus** method may need to be overridden when dealing with custom actions. Let us do just that:

```php
	public function getActivityStatus(KModelEntityInterface $object, $action = null)
    {
    	if ($action == 'after.download') {
    		$status = 'downloaded';
    	} else {
    		$status = parent::getActivityStatus($object, $action);
    	}
    	
    	return $status;
    }
```

Easy right?. This effectively tells LOGman that the result of the `download` action is `downloaded`.

What if we would like to store some metadata along with the activity data?. Let's do exactly that:

```php
	public function getActivityData(KModelEntityInterface $object, KObjectIdentifierInterface $subject)
	{
		$data = parent::getActivityData($object, $subject);
		
		$data['metadata'] = array('ip' => $subject->getRequest()->getAddress());
		
		return $data
	}
```

Here we override the **getActivityData** method for pushing some extra metadata. **getActivityData** is where the activity object data is mapped to activity data that will get passed to LOGman for logging the activity record. The subject is in this case the controller executing the action. Having access to the controller is very useful as it exposes the request layer. Here we have used the request object for grabbing the IP address.

**getActivityData** can also be overridden to change mappings between the activity object and the activity data that will get passed to LOGman.
 
Loggers implement a very flexible interface. Each method may be easily overridden in order to better fit your requirements. Make sure to review their implementations when developing integrations for your components.




















