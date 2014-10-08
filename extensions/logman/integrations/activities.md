# Activities

In LOGman, activity objects fully adhere to the [Activity Streams specification](http://activitystrea.ms/) by implementing the **ComActivitiesActivityInterface**. Through this interface, activities effectively expose data to the outer world.

In the previous sections, we have explained that components can be integrated with LOGman by using plugins. These plugins take care of the activity logging process and make them available to LOGman.

Additionally, these plugins can also provide activity overrides that will get used by LOGman, and this for each resource type and for each component being integrated with LOGman, e.g. we may define and activity for users, groups, user notes and user categories resources while integrating the com_users Joomla! core component with LOGman.

By providing activity overrides, the developer automatically gains control on how the activity exposes its data, and thus, how this data gets rendered.

Activity overrides can be provided by simply including activity classes in an `activity` folder located in your LOGman plugin root directory. The override filename must match the resource type as stored in the activities datababase, i.e. for a overriding a `user` activity, the override filename would be `user.php`.

For convenience, an activity override per component can also be defined, i.e. if the resource override `activity/user.php` is not found, LOGman will look for a component wide activity override inside the `activity/users.php` file (users being the package/component holding the resource referenced by the activity). If none is found, then the default activity object will get used. The only important thing to notice is that the `users.php` override will get used for each of the component's resources that doesn't provide an activity override.

Let us create our first activity override class. If we would like to create an activity override for a `bar` resource of our `foo` component we would add the following contents inside the `plugins/logman/foo/activity/bar.php` file:

```
<?php
	class PlgLogmanFooActivityBar extends ComLogmanModelEntityActivity
	{
	}
?>
```

We have successfully told LOGman to use our own activity object instead of the default **ComLogmanModelEntityActivity** class. Each time an activity from a `bar` resource of the `foo` component gets loaded by LOGman, this is the class activity class that will get used.

## Format

The activity format defines the text layout that is used for rendering activity messages.

These layouts can be defined during instantiation:

```
    protected function _initialize(KObjectConfig $config)
    {
        $config->append(
        	array('format' => '{actor} {action} {object.type} title {object}'
        );
        
        parent::_initialize($config);
	}    
```

The `{actor} {action} {object.type} title {object}` string is what we call a short format. Short formats contain tokens (with {} placeholders) and constants (like the word title in our previous example).

Tokens are variables referencing [activity objects](http://activitystrea.ms/specs/json/1.0/#object). These objects represent the different components of an activity.

These activity objects can be accessed from an activity by using getters which follow the `getActivity{ObjectName}` naming convention, e.g. we may use a call like `$activity->getActivityActor()` for getting the activity **actor** object.

By issuing a call to the activity **getActivityFormat** method, we are given with a translated version of the short format string presented above. In English this call may return something like:

	{actor} {action} the {object.type} with the title {object}
	
The short format `{actor} {action} {object.type} title {object}` string gets translated by going through a key search process to find a suitable translation string in the translation files. The base key for the previous short format is:

	KLS_ACTIVITY_ACTOR_ACTION_OBJECTTYPE_TITLE_OBJECT
	
which translates itself to:

		{actor} {action} the {object.type} with the title {object}

in the en-GB.com_activities.ini translations file.

When translating a short format string, tokens are first replaced with their corresponding activity object `objectName` property. As an example the `{actor}`, `{action}` and `{object}` tokens are replaced with `$activity->getActivityActor()->objectName`, `$activity->getActivityAction()->objectName` and `$activity->getActivityObject()->objectName` values respectively. `{object.type}` is a particular case. Its token replacement value is accessed with the `$activity->getActivityObject()->objectType` call. Activity objects with referenced dot properties in format must always provide an `object{Property}` property. 
 
Let us assume that, after replacement, the short format string looks as follows:

	John deleted article title Tasks
	
This string gets used for constructing the translation key:

	KLS_ACTIVITY_JOHN_DELETED_ARTICLE_TITLE_TASKS
	
If the key is found in the translations file, then it gets used. The activity translator will always look for the most specific key first. Then it will relax the search by ignoring some replacements until it finds a suitable key. For example, the next key to look for might be:

	KLS_ACTIVITY_ACTOR_DELETED_ARTICLE_TITLE_TASKS
	
where the `{actor}` token value has been excluded while generating key. This how the translator manages to allow translation overrides. Eventually, if a specialized key isn't found, the most generic version of the key (with no token replacements at all) gets used:

	KLS_ACTIVITY_ACTOR_ACTION_OBJECTTYPE_TITLE_OBJECT
	
Translated formats provided by the **getActivityFormat** method still have their tokens un-replaced:

	{actor} {action} the {object.type} with the title {object}

This is intentional, as it allows consumers to do the replacement themselves using (if any) a markup language of their choice.

Contrarily to key generation (as explained above), tokens from the translated formats are to be replaced by the `displayName` property of the corresponding activity object. This property contains the displayable and potentially translated string of the activity object.

For the translated format string:

	{actor} {action} the {object.type} with the title {object}
	
`{actor}`, `{action}` and `{object}` are replaced with `$activity->getActivityActor()->displayName`, `$activity->getActivityAction()->displayName` and `$activity->getActivityObject()->displayName` respectively. Again, `{object.type}` is a special case. Its replacement value is accessed by making the `$activity->getActivityObject()->displayType` call.

## Activity objects

Activity objects are the backbone of an activity record. They represent the different parts of an activity and can be accessed with getters following the `getActivity{ObjectName}` naming convention. The returned object must implement **ComActivitiesActivityObjectInterface**.

The **ComLogmanModelEntityActivity** base activity class already provide getters for the base activity objects referenced in the Activity Streams specification, i.e. actor, object, target, generator and provider.

The way on which any of the activity objects gets constructed can, and sometimes must, be modified. Let us see how.

### Configuration

The base activity object getters make calls to `_{object}Config` methods (where `{object}` is the object's name, e.g. actor, action, object, etc.). These are basically configuration getters for grabbing configurations objects, which get used for instantiating the activity objects. By overriding these methods you can change the way activity objects get instantiated.

Let's for example change the object activity object URL property. For this we would need to add the following code:

```
	protected function _objectConfig(KObjectConfig $config)
	{
		$config->append(array('url' => 'http://www.foo.com'));
		return parent::_objectConfig($config);
	}
```

That's it, just a couple of lines and we are all set.

### Instantiation

A call to `ComLogmanModelEntityActivity::_getObject` is always made when instantiating activity objects. This method takes care of a few things such as translating properties, routing URLs, finding objects, etc. It is always recommended to use this getter when creating activity objects.

The configuration object that gets passed to `ComLogmanModelEntityActivity::_getObject` may contain any of the properties that are settable in the **ComActivitiesActivityObject** class, i.e. objectName, displayName, attachments, author, content, downstreamDuplicates, etc. These will get set directly in the resulting activity object. Additionally the following, properties may be set in the configuration object:

* *find*: A string pointing to a related resource to look for. When this property is set, a call to a `_findObject{ObjectName}` finder method will get issued for determining if the resource exists. If it does not exists, the URL property of the object will be set to null, effectively making it non-linkable, and its deleted property will get set to true. As an example, if we set the configuration object as follows: `$config->find = 'object'`, the URL and delete properties of the resulting activity object will be set according to the result of the **_findObjectObject** finder method.
* *translate*: An array containing property names to translate. By default, and if translate is not defined or not equal to false, all of the `display{Property}` properties are set as translatable. If an array of properties is provided, only those properties will get translated. If false is provided, no property gets translated at all.

The **_getObject** method will automatically set a `display` prefixed  property for each `object` prefixed property if the first is not already set in the configuration object. The value that gets used to set the `display` prefixed property is the `object` prefixed property value. Remember that the `display` prefixed property is the displayable property (usually translated) of the corresponding `object` prefixed property. Think of the `object` prefixed property as the property that always get used internally or by consumers for conditionally acting upon its value. This is the property that gets used while coding around it since its value is always the same regardless of the language on which activity get translated. On the other hand, the `display` prefixed property that gets translated to other languages and it is always used for rendering purposes.

### Finding objects

As mentioned above, by passing a `find` property to the **_getObject** method configuration object, the object getter will attempt to find the referenced resource and act over the configuration properties accordingly.

If we take a closer look at the core **_findObjectActor** and **_findObjectObject** methods, we realize that all that they are doing is to search for activity objects and return the search result. The actor finder is unlikely to need changes. On the other hand the **_findObjectObject** method makes use of two instance properties that get set during the activity instantiation: 

* *_object_table*: A string containing the name of the database table holding the object resources, e.g. for a newsfeed activity object, the database table to look up for newsfeeds resources is `newsfeeds`. This is the database table name holding newsfeed resources.
* *_object_column*: A string containing the name of the identity column of the database table containing the object resources, e.g. for a newsfeed activity object, the identity column name of the newsfeeds database table is `id`.

By setting these properties at instantiation time (see **ComLogmanModelEntityActivity::_initialize**) the object finder will be able to determine if a given newsfeed resource referenced in an activity record still exists. For our previous example we set these properties as follows:

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

### Icons

Activity messages that get rendered in LOGman's UI, are always assigned an icon to easily differentiate one activity from another. This icon is simply a CSS class that gets assigned to a given activity and which is made available through the image property, e.g. `$activity->image`.

For overriding this property, all that is needed is to override the **getPropertyImage** method within the activity class:

```
	public function getPropertyImage()
    {
    	$images = array('walk' => 'icon-walk', 'run' => 'icon-run' , 'sit' => 'icon-sit');
    	
    	$image = 'icon-default';
    	
    	if (in_array($this->verb, array_keys($images))) {
    		$image = $images[$this->verb];    	
    	}
    	
    	return $image;
    }
```

Like shown in this example, an icon is often assigned to a given activity action, but you could perfectly assign one icon to all of the activities of a given resource and/or component. This is left to the implementer's discretion.

### URLs

Activity object URLs may be set in two different ways. By talking a closer look to **ComActivitiesActivityObject::getUrl** you may see that URL are KHttpUrl objects. As we previously mentioned, activity objects are created by using a **_getObject** factory method. This method accepts a configuration object which may contain a url property for setting the activity object URL. 

If the url property is a string, the **_getObject** method will assume that it contains a query string. This query string will get routed, and the creation of the KHttpUrl object is taken cared off.

If the url property already contains a KHttpUrl object, the **_getObject** method will just use it AS IS.

The method you will use will basically depend on whether routing is needed or not.


## Extending the specification

The activity API isn't static. While we already provide a very complete platform for logging and exposing activity streams, nothing prevent developers to bend activities to their needs and likings by extending the Activity Streams specification and/or its LOGman implementation. 

As an example, adding new activity objects is a breeze. Let's assume that we are working on a Banner activity. Banners are usually assigned a client, so let's take this into account for the activity.

We can extend the activity by just adding a client activity object to it. First we provide a getter for the object:

```
	public function getActivityClient()
	{
		$config = new KObjectConfig();
	
		// Set the client activity object configuration
		...
		
		return $this->_getObject($config);
	}
```

Easy right?. Setting the object's configuration is nothing more than setting the data of the activity object we are creating, just as we have previously done in the above examples. This data may be grabbed from the activity row itself (possibly stored in the metadata property) or it can be queried directly on the database. That's really up to the developer.

After providing a getter for the client activity object, we can now make use of it by referencing it in short formats:

	{actor} {action} {object.type} {client} title {object}

which may translate to:

	{actor} {action} the {object.type} from client {client} with title {object}
	
For the object to be renderable on JSON activity streams, we need the activity to be aware of this new object. We can easily do so by specifying this at instantiation time:

```
	protected function _initialize(KObjectConfig $config)
	{
		$config->append(array('objects' => array('client')));
		parent::_initialize($config);
	}
```

By appending client to the objects array, we are effectively telling the activity that we are adding a client object. The client activity object will now get displayed as a part of the activity on JSON activity streams, i.e. by appending *&format=json&layout=stream* to the URL query.

When working with activity overrides, we strongly encourage developers to review the entire activity package (classes under the `activity` folder of the base activity component located at `libraries/koowa/components/com_activities`) as well as the **ComActivitiesModelEntityActivity** and **ComLogmanModelEntityActivity** implementations. Knowing the inns and outs of activity entities will be of great help while developing activity overrides for your LOGman plugins.