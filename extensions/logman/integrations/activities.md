# Activities

In LOGman, activity objects fully adhere to the [Activity Streams specification](http://activitystrea.ms/) by implementing the **ComActivitiesActivityInterface** interface. Through this interface, activities effectively expose data to the outer world.

On the previous sections, we have explained that components can be integrated with LOGman by using plugins. These plugins take care of the activity logging process and make them available to LOGman.

LOGman plugins can also provide activity object overrides that will get used by LOGman instead of the default activity object, and this for each resource type and for each component being integrated with LOGman.

By providing activity object overrides, the developer automatically gains control on how the activity exposes its data, and thus, how this data gets rendered.

Activity overrides can be provided by simply including activity classes in an `activity` folder inside your LOGman plugin root directory. The override filename must match the resource type as stored in the activities datababase, i.e. for a overriding a `user` activity, the override filename would be `user.php`.

For convenience, a global activity record fallback mechanism is also available. In the previous `user` case, if no override is found for this resource `activity/user.php`, LOGman will look for a component wide activity override inside the `activity/users.php` file (users being the package/component name of the activity record). If none is found, then the default activity object will get used. The only important thing to notice is that the `users.php` override will get used for each of the component's resources that doesn't provide an activity override.

Let us create our first activity override class. If we would like to create an activity override for a `bar` resource of our `foo` component we would add the following inside `plugins/logman/foo/activity/bar.php`:

```
<?php
	class PlgLogmanFooActivityBar extends ComLogmanModelEntityActivity
	{
	}
?>
```

We have successfully told LOGman to use our own activity object instead of the default **ComLogmanModelEntityActivity** class. Each time an activity from a `bar` resource of the `foo` component gets loaded by LOGman, this is the class that is going to be instantiated.

## Format

The activity format defines the text layout that is going to be used for rendering activity messages.

Layouts can be provided while the activity object gets initialized:

```
    protected function _initialize(KObjectConfig $config)
    {
        $config->append(
        	array('format' => '{actor} {action} {object.type} title {object}'
        );
        
        parent::_initialize($config);
	}    
```

A format contains tokens (with {} placeholders) and constants (like the word title in our previous example).

Tokens are variables referencing activity objects as defined by the [Activity Stream specification](http://activitystrea.ms/specs/json/1.0/#object). These objects represent the different components of an activity.

These activity objects can be accessed from an activity by using the `getActivity{ObjectName}` convention, e.g. for getting access to the actor object we would need to issue a `$activity->getActivityActor()` call.

Activity objects implement the `ComActivitiesActivityInterface` interface. This interface is also in full compliance with the Activity Streams specification.

The **getActivityFormat** method provides a translated version of the format provided at instantiation. In English this call may return something like:

	{actor} {action} the {object.type} with the title {object}
	
The short format `{actor} {action} {object.type} title {object}` string gets translated by going through a key search process to find a suitable translation string in the translation files. The base key for the previous short format is:

	KLS_ACTIVITY_ACTOR_ACTION_OBJECTTYPE_TITLE_OBJECT
	
which translates itself to:

		{actor} {action} the {object.type} with the title {object}

in the en-GB.com_activities.ini translations file.

When translating a format string, tokens are first replaced with their corresponding activity object `objectName` property. As an example the `{actor}`, `{action}` and `{object}` tokens are replaced with `$activity->getActivityActor()->objectName`, `$activity->getActivityAction()->objectName` and `$activity->getActivityObject()->objectName` values respectively. `{object.type}` is a particular case. Its token replacement value is accessed with the `$activity->getActivityObject()->objectType` call. Activity objects with referenced dot properties in format must always provide a `object{Property}` property. 
 
Let us assume that the short format string after replacement looks like:

	John deleted article title Tasks
	
This string gets used for constructing the translation key:

	KLS_ACTIVITY_JOHN_DELETED_ARTICLE_TITLE_TASKS
	
If the key is found in the translations file, then it gets used. The activity translator will always look for the most specific key first. Then it will relax the search by ignoring some replacements until it finds a suitable key. For example, the next key to look for might be:

	KLS_ACTIVITY_ACTOR_DELETED_ARTICLE_TITLE_TASKS
	
where the `{actor}` token value has been excluded from the generated key. This how the translator manages to allow translation overrides. Eventually, if a specialized key isn't found, the most generic version of the key (with no token replacements at all):

	KLS_ACTIVITY_ACTOR_ACTION_OBJECTTYPE_TITLE_OBJECT
	
is the one that gets used.

Translated formats provided by **getActivityFormat** still have their tokens un-replaced. This is intentional, as it allows consumers to do fancy stuff when rendering activity messages. Contrarily to key generation (as explained above), tokens from the translated formats are to be replaced by the `displayName` property of the corresponding object. This property contains the displayable and potentially translated string of the activity object.

For the translated format string:

	{actor} {action} the {object.type} with the title {object}
	
`{actor}`, `{action}` and `{object}` are replaced with `$activity->getActivityActor()->displayName`, `$activity->getActivityAction()->displayName` and `$activity->getActivityObject()->displayName` respectively. Again, `{object.type}` is a special case. Its replacement value is accessed by making the `$activity->getActivityObject()->displayType` call.

## Activity objects

Activity objects are the backbone of an activity record. They represent the different parts of an activity. These can be accessed by using the `getActivity{Name}` methods. The returned object must implement the **ComActivitiesActivityObjectInteface** interface.

The base activity class **ComLogmanModelEntityActivity** already provide getters for the base activity objects referenced in the Activity Streams specification, i.e. actor, object, target, generator and provider. These getters work under some assumptions which are considered as the default behavior.

The way on which any of the activity objects get constructed can, and sometimes must, be modified. Let us see how.

### Configuration

The base activity object getters make calls to `_{object}Config` methods (where `{object}` is the object's name, e.g. actor, action, object, etc.) which are basically configuration getters for grabbing the object's config before instantiation. By overriding these methods you can change their default configurations.

Let's for example change the object activity object URL property. For this we would need to add the following code:

```
	protected function _objectConfig(KObjectConfig $config)
	{
		$config->append(array('url' => 'http://www.foo.com'));
		return parent::_objectConfig($config);
	}
```

That's it, just a couple of lines and you are all set.

### Instantiation

A call to `ComLogmanModelEntityActivity::_getObject` is always made when instantiating base activity objects. This method takes care of a few things such as dealing with and translating dot properties, making objects non-linkable if they cannot be found, etc. It is always recommended to use this getter when creating new activity objects.

The configuration object that gets passed to `ComLogmanModelEntityActivity::_getObject` may contain any of the properties that are settable in the **ComActivitiesActivityObject** class, i.e. objectName, displayName, attachments, author, content, downstreamDuplicates, etc. These will get set directly in the resulting activity object. Additionally the following, properties can be set in the config object:

* *find*: A string pointing to a related resource to look for. When this property is set, a call to a `_findObject{Find}` method will get issued for determining if the resource exists. If it doesn't exists, the URL property of the object will be set to null, effectively making it non-linkable, and its deleted property is set to true. As an example, if the `'object'` string gets passed as the *find* value, a call to the **_findObjectObject** method will be made inside **_getObject**. URL and delete properties will be set accordingly depending on the result of this call.
* *translate*: An array containing property names to translate. By default, and if translate is not defined or not equal to false, all of the `display{Property}` properties are set as translatable. If an array of properties is provided, only those properties will get translated. If false is provided, no property gets translated at all.

The **_getObject** method will automatically set a `display{Property}` property for each `object{Property}` property if the `display{Property}` is not set in the configuration object. The value that gets used to set the `display{Property}` property is the `object{Property}` property value, e.g. `displayName = objectName`, `displayType = objectType`, `displaySubtype = objectSubtype`, etc. Remember that the property with the `display` prefix is the displayable property (usually translated) of the corresponding `object` prefixed property, and both must be always present in activity object. The `object` prefixed property is always used internally or by consumers if they would like to conditionally act upon this value, while the `display` property is always the one that gets displayed, e.g. replaced by a translated format token when rendering an activity message.

### Find

As mentioned above, by passing a `find` property to the configuration object that gets passed to the **_getObject** method, the object getter will attempt to find  the referenced resource and act over the config properties accordingly.

If we take a closer look at the core **_findObjectActor** and **_findObjectObject** methods, we realize that all that they are doing is to search for activity objects and return the search result. The actor finder is unlikely to need changes. On the other hand the **_findObjectObject** methods makes use of two properties that get set in the main activity object: 

* *_object_table*: A string containing the name of the database table holding the object activity objects, e.g. for a newsfeed activity object, the database table to look up for newsfeeds rows in Joomla's com_newsfeeds is `newsfeeds`.
* *_object_column*: A string containing the name of the identity column of the database table containing object activity objects, e.g. for a newsfeed activity object, the identity column name of the newsfeeds database table of Joomla's com_newsfeeds is `id`.

By setting this properties at instantiation time as follows (see PlgLogmanNewsfeedsActivityNewsfeed):

```
    protected function _initialize(KObjectConfig $config)
    {
        $config->append(
        	array(
            	'object_table'  => 'newsfeeds',
            	'object_column' => 'id',
        	)
        );

        parent::_initialize($config);
    }
```

the object finder will be able to determine if a given newsfeed that's being referenced in an activity record still exists.





 