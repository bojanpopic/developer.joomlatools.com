# Activities

In LOGman, activity objects fully adhere to the [Activity Streams specification](http://activitystrea.ms/) by implementing the **ComActivitiesActivityInterface**. Through this interface, activities effectively expose data to the outer world.

In the previous sections, we have seen that components can be integrated with LOGman by using plugins. These plugins take care of the activity logging process and make them available to LOGman.

Additionally, these plugins can also provide activity overrides that will get used by LOGman, and this for each resource type and for each component being integrated with LOGman, e.g. we may define an activity override for users, groups, user notes and/or user categories resources while integrating com_users with LOGman.

By providing activity overrides, the developer automatically gains control on how the activity exposes its data, and thus, how this data gets rendered.

Activity overrides can be provided by simply including activity classes in an `activity` folder located in your LOGman plugin root directory. The override filename must match the resource type as stored in the activities datababase, i.e. for a overriding a `user` activity, the override filename would be `user.php`.

For convenience, an activity override per component can also be defined, i.e. if the resource override `activity/user.php` is not found, LOGman will look for a component wide activity override inside the `activity/users.php` file (users being the package/component holding the resource referenced by the activity). If none is found, then the default activity object will get used.

Let us create our first activity override class. If we would like to create an activity override for a `bar` resource of our `foo` component we would add the following contents inside the `plugins/logman/foo/activity/bar.php` file:

```
<?php
	class PlgLogmanFooActivityBar extends ComLogmanModelEntityActivity
	{
	}
?>
```

We have successfully told LOGman to use our own activity object instead of the default **ComLogmanModelEntityActivity** class. Each time an activity from a `bar` resource of the `foo` component gets loaded by LOGman, this is the activity class that will get used.

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

Tokens are variables referencing [activity objects](http://activitystrea.ms/specs/json/1.0/#object). These objects represent the different components of an activity. We will learn more about them in the next section.

These activity objects can be accessed from an activity by using getters following the `getActivity{ObjectName}` naming convention, i.e. making a call like `$activity->getActivityActor()` for getting the activity **actor** object.

By issuing a call to the activity **getActivityFormat** method, we are given with a translated version of the short format string presented above. In English this call may return something like:

	{actor} {action} the {object.type} with the title {object}
	
The short format `{actor} {action} {object.type} title {object}` string gets translated by going through a key search process to find a suitable translation string in the translation files. The base translation key for the previous short format is:

	KLS_ACTIVITY_ACTOR_ACTION_OBJECTTYPE_TITLE_OBJECT
	
which translates itself to:

		{actor} {action} the {object.type} with the title {object}

in the en-GB.com_activities.ini translations file.

When translating a short format string, tokens are first replaced with their corresponding activity object `objectName` property. As an example the `{actor}`, `{action}` and `{object}` tokens are replaced with `$activity->getActivityActor()->objectName`, `$activity->getActivityAction()->objectName` and `$activity->getActivityObject()->objectName` values respectively. `{object.type}` is a particular case. Its token replacement value is accessed with the `$activity->getActivityObject()->objectType` call. For others dot format tokens, take `{foo.bar}` as an example, its replacement text can be accessed with the `$activity->getActivityFoo()->objectBar` call.
 
Let us assume that, after this replacement, the short format string looks as follows:

	John deleted article title Tasks
	
This string gets used for constructing the following translation key:

	KLS_ACTIVITY_JOHN_DELETED_ARTICLE_TITLE_TASKS
	
If the key is found in the translations file, then it gets used. The activity translator will always look for the most specific key first, i.e. the one with all of its placeholders replaced. Then it will relax the search by ignoring some replacements until it finds a suitable key. For example, the next key to look for might well be:

	KLS_ACTIVITY_ACTOR_DELETED_ARTICLE_TITLE_TASKS
	
where the `{actor}` token value has been excluded ("relaxed") while generating the key. This how the translator manages to provide translation overrides. Eventually, if a specialized key is not found, the most generic version of the key (with no token replacements at all) gets used:

	KLS_ACTIVITY_ACTOR_ACTION_OBJECTTYPE_TITLE_OBJECT
	
Translated formats provided by the **getActivityFormat** method still have their tokens un-replaced:

	{actor} {action} the {object.type} with the title {object}

This is intentional, as it allows consumers to do the replacement themselves by using (if any) a markup language of their choice.

Contrarily to short formats, tokens from the translated formats are to be replaced by the `displayName` property of the corresponding activity object. This property contains the displayable and potentially translated string of the activity object.

For the translated format string:

	{actor} {action} the {object.type} with the title {object}
	
`{actor}`, `{action}` and `{object}` are replaced with `$activity->getActivityActor()->displayName`, `$activity->getActivityAction()->displayName` and `$activity->getActivityObject()->displayName` respectively. Again, `{object.type}` is a special case. Its replacement value is accessed by making the `$activity->getActivityObject()->displayType` call. For others dot format tokens, take `{foo.bar}` as an example, its replacement text can be accessed with the `$activity->getActivityFoo()->displayBar` call.

By replacing tokens on translated formats, we get ourselves a rendered activity message:

	John deleted the article with the title FAQs

## Activity objects

Activity objects are the backbone of an activity record. They represent the different parts of an activity and can be accessed with getters following the `getActivity{Object}` naming convention. The returned object must implement **ComActivitiesActivityObjectInterface**.

The base **ComActivitiesModelEntityActivity** activity class already provide getters for activity objects referenced in the Activity Streams specification, i.e. actor, object, target, generator and provider.

The way on which any of the activity objects gets constructed can, and sometimes must, be modified. Let us see how.

### Configuration

The base activity object getters make calls to `_{object}Config` methods (where `{object}` is the object's name, e.g. actor, action, object, etc.). These are basically configuration getters for grabbing configuration objects that get used for instantiating activity objects. By overriding these methods you can change the way activity objects get instantiated.

Let us assume that in our `bar` activity override the way on which the object activity object URL is being wrongly set. Not a problem, we just need to change/override the way the URL property gets set. For this we would need to add the following code in our activity override class:

```
	protected function _objectConfig(KObjectConfig $config)
	{
		$config->append(array('url' => 'option=com_foo&view=bar&id=' . $activity->row));
		return parent::_objectConfig($config);
	}
```

That's it, just a couple of lines and we are all set.

All of the activity objects currently implemented in the activity class are overridable this way.

### Instantiation

A call to `ComLogmanModelEntityActivity::_getObject` is always made when instantiating activity objects. This method takes care of a few things such as translating properties, routing URLs, finding objects, etc. It is always recommended to use this getter when creating activity objects. You will learn how to create your own objects latter on.

The configuration object that gets passed to `ComLogmanModelEntityActivity::_getObject` may contain any of the properties that are settable in the **ComActivitiesActivityObject** class, i.e. objectName, displayName, attachments, author, content, downstreamDuplicates, etc. Make sure to take a look at the class implementation to see all the available properties. By simply passing these properties within the configuration object, they will get set in the resulting activity object. Additionally the following properties may also be included:

* *find*: A string pointing to a related resource to look for. When this property is set, a call to a `_findObject{Object}` finder method will get issued for determining if an object's resource exists. If it does not exists, the URL property of the object will be set to null, effectively making it non-linkable. Additionally, its deleted property will get set to true as well. As an example, if we set the configuration object as follows: `$config->find = 'object'`, the URL and delete properties of the resulting activity object will be set accordingly, provided the result of the **_findObjectObject** finder method.
* *translate*: An array containing property names to translate. By default, and if translate is not defined or not equal to false, all of the `display{Property}` properties are set as translatable automatically. If an array of properties is provided, only those properties will get translated. If false is provided, no property gets translated at all.

The **_getObject** method will automatically set a `display` prefixed  property for each `object` prefixed property if this one is not already set in the configuration object. The value that gets used to set the `display` prefixed property is the `object` prefixed property value. Remember that the `display` prefixed property is the displayable property (usually translated) of the corresponding `object` prefixed property. Think of the `object` prefixed property as the property that always get used internally or by consumers for conditionally acting upon its value. This is the property that gets used while coding around it since its value is always the same regardless of the language on which activities get translated. On the other hand, the `display` prefixed property is the displayable, usually translated property, that gets used for rendering purposes, i.e. for generating activity messages.

Let us suppose that we would like to add an additional dot property to the object activity object of our `bar` activity override. We do this as follows:

```
	protected function _objectConfig(KObjectConfig $config)
	{
		$config->append(
			array(
				'objectBaz' => 'Howdy'
			)
		)
	}
```

By only providing the `objectBaz` property, the object getter will automatically set for us a `displayBaz` property with `'Howdy'` as value. If a translate property isn't set at all it will also translate `displayBaz`. This is the default behavior, but we can always make it behave as we please. Let us see how:

```
	protected function _objectConfig(KObjectConfig $config)
	{
		$config->append(
			array(
				'objectBaz'  => 'Howdy',
				'displayBaz' => 'Hello sir!',
				'translate'  => array('displayName'),
				'find'       => 'something'
			)
		)
	}
```

Here we have just forced our `displayBaz` value. Additionally we have specified which properties get translated. In this particular case only the `displayName` will get translated. We have also told the object getter to perform a search for `something`. This will internally trigger a call to `_findObjectSomething` (if such a method exists) and set the deleted and url properties accordingly depending on the result of this call, i.e. true if found, false otherwise.

### Finding objects

As mentioned above, by passing a `find` property to the **_getObject** method configuration object, the object getter will attempt to find the referenced resource and act over the configuration properties accordingly.

If we take a closer look at the  **ComActivitiesModelEntityActivity::_findObjectActor** and **ComActivitiesModelEntityActivity::_findObjectObject** methods, we realize that all that they are doing is to search for activity objects and return the search result. The actor finder is unlikely to need changes. On the other hand the **_findObjectObject** method makes use of two instance properties that get set during the activity instantiation: 

* *_object_table*: A string containing the name of the database table holding the object resources, i.e. the `bar` rows.
* *_object_column*: A string containing the name of the identity column of the database table containing the object resources.

Let us suppose that in our hypothetical `com_foo` component, our `bar` resources get stored in a database table called `bars`. The identity column of this table is `bar_id`. If this is the case, then we would setup the above finder properties as follows:

```
    protected function _initialize(KObjectConfig $config)
    {
        $config->append(
        	array(
            	'object_table'  => 'bars',
            	'object_column' => 'bar_id',
        	)
        );

        parent::_initialize($config);
    }
```

The object finder will now be able to determine if a given `bar` resource referenced in an activity record still exists.

### URLs

Activity object URLs may be set in two different ways. By talking a closer look to **ComActivitiesActivityObject::getUrl** you may see that URL are KHttpUrl objects. As we previously mentioned, activity objects are created by using a **_getObject** factory method. This method accepts a configuration object which may contain a url property for setting the activity object URL. 

If the url property is a string, the **_getObject** method will assume that it contains a query string. This query string will get routed, and the creation of the KHttpUrl object is taken cared off.

If the url property already contains a KHttpUrl object, the **_getObject** method will just use it AS IS.

The method you will use will basically depend on whether routing is needed or not.

## Icons

Activity messages that get rendered by LOGman, are usually assigned an icon to easily differentiate one activity from another. This icon is simply a CSS class that gets assigned to a given activity. The name of the CSS class is made available through the image property, e.g. `$activity->image`.

For changing the value of this property, we just need to override the **getPropertyImage** method inside the activity override class:

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

An icon is often assigned to a given activity action, but you could perfectly assign one icon to all of the activities of a given resource and/or component. This is left to the implementer's discretion.


## Extending the specification

The activity API is not static. While we already provide a very complete platform for logging and exposing activity streams, nothing prevents developers to bend activities to their needs and likings by extending the Activity Streams specification and/or our implementation. 

As an example, adding new activity objects is a breeze. Let's assume that our `bar` activity also has related `baz` resources. Let us take this into account in our activity override.

We can extend the activity by just adding a `baz` activity object to it. First we provide a getter for the object:

```
	public function getActivityBaz()
	{
		$config = new KObjectConfig();
	
		// Set the baz activity object configuration
		...
		
		return $this->_getObject($config);
	}
```

Easy right?. Setting the object's configuration is nothing more than setting the data of the activity object we are creating. In this case, we are setting data from a `baz` related resource. This data may be grabbed from the activity row itself (possibly stored in the metadata property) or it can be queried directly from the database table holding `baz` rows. Anything works, this all depends on the implementation of the component being integrated, and whether or not the information is made available in the activities table.

After providing a getter for the client activity object, we can now make use of it by referencing it in short formats:

	{actor} {action} {object.type} {baz} title {object}

which may translate to:

	{actor} {action} the {object.type} from {baz} with title {object}
	
For the object to be renderable on JSON activity streams, we need the activity to be aware of this new object. We can easily do so by specifying this at instantiation time:

```
	protected function _initialize(KObjectConfig $config)
	{
		$config->append(array('objects' => array('baz')));
		parent::_initialize($config);
	}
```

By appending `baz` to the objects array, we are effectively telling the activity that we are adding a `baz` object. The `baz` activity object will now get displayed as part of the activity on JSON activity streams. JSON activity streams can be accessed by appending *&format=json&layout=stream* to the URL query.

When working with activity overrides, we strongly encourage developers to review the entire activity package (classes under the `activity` folder of the base activity component located at `libraries/koowa/components/com_activities`) as well as the **ComActivitiesModelEntityActivity** and **ComLogmanModelEntityActivity** implementations. Knowing the ins and outs of activity entities will be of great help while developing activity overrides for your LOGman plugins.