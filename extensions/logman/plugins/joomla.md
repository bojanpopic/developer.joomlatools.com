---
layout: default
title: Joomla components
---

By utilizing Joomla's event system, third party components built on top of Joomla! can be easily integrated with LOGman. 

*For information on integrating a component within the Joomla! event system, please refer to the [Plugin](http://docs.joomla.org/Plugin) and [Events](http://docs.joomla.org/Plugin/Events) Joomla! guides.*

Once an application makes use of Joomla's event system, you can go ahead and create a plugin that listens for events and then notifies LOGman of the event.

##LOGman plugins

###Events

The first step on integrating a component with LOGman is to create a LOGman plugin that listens to the events we would like to log.

The name of the plugin should match the name of the component. This is important so that LOGman may find overrides for activities of a given package/component.

There are two different types of events. Context events and Non-context events. LOGman plugins support all kind of events, but the way you write plugins differ depending on the type of events that it listens to.

####Context Events

Context events are generic events that get triggered with a context argument. A context argument is a string that looks something like this:

		com_newsfeeds.newsfeed

The first part (before the point) is the component triggering the event. The second part (after the point) is the event object, i.e. the resource over which the action or event takes place.

Context events are said to be generic since the same event may be triggered over more than one resource and/or by more than one component. As an example, the event that gets triggered after saving an article or a banner is `onContentAfterSave`. The same event gets fired after the save action for both resources. The context that get passed (`com_content.article` and `com_newsfeed.newsfeed` for articles and news feeds respectively) is what helps on making the difference between an article and a newsfeed save action.

####Non-context Events

Contrarily to context events, non-context events are specific. This means that the event itself already provides information about who triggered the event and in what context. An example would be the `onUserAfterSaveGroup` event. By just looking at the event name, we know that it is users related and that it got triggered after saving a group.

With this in mind, let us re-develop the Newsfeeds LOGman plugin for logging newsfeeds activities. The newsfeeds core component triggers **context** events for notifying plugins. So let us first build a plugin that listens to those events for logging activities.

###Plugins listening to Context Events

The first step is to create a `newsfeeds.php` file in the `plugins/logman/newsfeeds` directory. The file should contain the following content inside:

{% highlight php %}
<?php
class PlgLogmanNewsfeeds extends ComLogmanPluginJoomla
{
}
{% endhighlight %}

Congratulations! you have just created your first LOGman plugin!.

By default plugins extending the **ComLogmanPluginJoomla** class will listen to the following **context** events:

* onContentAfterSave
* onContentAfterDelete
* onExtensionAfterSave
* onExtensionAfterDelete
* onContentChangeState

Unfortunately, at this stage, the plugin will not be logging anything. We need to provide it with more information about the things we want to log. Let's do exactly that.

Add the following code inside the class:

{% highlight php %}
<?php
protected function _initialize(KObjectConfig $config)
{
    $config->append(array(
        'resources' => array('newsfeed')
    ));

    parent::_initialize($config);
}
{% endhighlight %}

We have just changed the way the plugin initializes itself. By specifying resources in the config object we are telling the plugin which resources we are interested on. We are basically specifying the context we are interested on.

When a newsfeed is saved or deleted, the `onContentAfterSave` or `onContentAfterDelete` events are triggered respectively. By specifying newsfeed as a plugin resource in the config object, the plugin will proceed to log save and delete activities when these events get triggered over newsfeed resources.

Easy right?. There is still one small catch. Let us talk about data. When an event is triggered, handlers are very often provided with a reference to the data on which the action or the event took place. In this case the handler is given a newsfeed object.

Out of the box, the plugin will guess two pieces of information that it needs to log activities: the resource `id` and its `name`. The plugin assumes that the resource `id` and `name` correspond to the `id` and `title` properties in the passed data object, i.e. `$newsfeed->id` and ``$newsfeed->title` respectively. If this is the case, then all will work out of the box. Otherwise a bit more work will be needed to tell the plugin how to get this information.

In the case of our example, the newsfeeds name can be grabbed using the `name` property. Because of this, we need to add the following piece of code in our plugin:

{% highlight php %}
<?php
protected function _getNewsfeedObjectData($data, $event)
{
    return array('id' => $data->id, 'name' => $data->name);
}
{% endhighlight %}

The `_getNewsfeedObjectData` method gets called for getting the newsfeed data that will be passed to LOGman for logging the activity. The `$data` argument is the data passed to the event handler, i.e. the newsfeed object. The `$event` argument is a string containing the name of the event. The method should return an array containing at the very least the `id` and the `name` of the resource. Additionally, a `metadata` field can be provided with additional data that may be used for rendering activities. This field must contain an associative array of metadata.

As you may have guessed, the naming convention being used is `_get{Resource}ObjectData` where `{Resource}` is the object we are listenning events for. If we would be listening events for articles, the method for providing the activity data would be `_getArticleObjectData`.

Right now we have a working plugin that is capable of logging the following newsfeeds actions:

* Add
* Edit
* Delete

Pretty awesome uh?. Let us improve the plugin by supporting state change events.

As mentioned above, the base **ComLogmanPluginJoomla** class also provides support for the `onContentChangeState` event. This event gets triggered when a resource state changes. The following core state changes are supported:

* Published
* Unpublished
* Archived
* Trashed

As with our previous example, under some circumstances all will work out of the box. However, sometimes the plugin needs a bit of help for figuring it out.

For logging state changes, the plugin needs to know the name of the Joomla! table class that defines the event object, a.k.a the resource. By default this is assumed to be `JTable{Resource}`. This is needed because unfortunately, the `onContentChangeState` event only provides the IDs of the resources which state is changing. Otherwise speaking, we need to load the resources ourselves in order to get the activity data to be logged.

In our example, the Table class being used for newsfeeds resources is **NewsfeedsTableNewsfeed**. For telling the plugin which table class to use we must override the **_getItems** method using the following code block:

{% highlight php %}
<?php
protected function _getItems($ids, $config)
{
    $config->append(array(
        'prefix' => 'NewsfeedsTable'
    ));

    return parent::_getItems($ids, $config);
}
{% endhighlight %}

The table class name is constructed with two variables that get passed to the **_getItems** method, `prefix` and `name`. In this case we are telling the getter method that `prefix` is `NewsfeedsTable`. By default, `name` corresponds to the resource name, i.e. **Newsfeed**, which is exactly what we need. Otherwise, `'name' => {name}` should be appended to the config object along with the prefix. By concatenating both (`prefix` + `name`), the getter is able to determine the class name, **NewsfeedsTableNewsfeed** for this example.

By simply adding the above piece of code, our plugin can now log state changes like a champ. Awesome!.

###Plugins listening to non-Context Events

The previous section walked you through the process of creating a basic LOGman plugin that listens to context events to log activities. While context events are nice and dandy, and can be used in the great majority of cases, many components out there also trigger non-context events. Do not panic, LOGman can handle those too!.

All we need to do for listening to any event is to add a handler for it, i.e. a plugin method, to our plugin:

{% highlight php %}
<?php
public function on{EventName}($arg1, $arg2, ...)
{
    $this->log(
        array(
            'object' => array(
                'package'  => {package},
                'type'     => {type},
                'id'       => {id},
                'name'     => {name},
                'metadata' => {metadata}
            ),
            'verb'   => {verb},
            'actor'  => {actor},
            'result' => {result}			
        )
    );
}
{% endhighlight %}

where `{EventName}` is the name of the event we want to listen to. As an example, if we would like to listen to the **onUserLogin** event, our event handler must look like:

{% highlight php %}
<?php
public function onUserLogin($user, $options = array())
{
    ...
}
{% endhighlight %}

For logging an activity the handler must issue a **log** call with some activity data. Part of this data is mandatory, the rest is of course optional. Let us start with the mandatory fields:

* `{id}`: The unique identifier of the resource.
* `{name}`: The name/title of the resource.
* `{type}`: The type of the resource, e.g. user, article, newsfeed, etc.
* `{verb}`: The event action, e.g. delete, add, etc.
* `{result}`: The result of the event action, e.g. deleted, added, etc. This field is optional when verb is set to add, edit or delete. In this case the result is assumed to be added, edited or created respectively.

Optional fields:

* `{package}`: The package/component name that handles the resource, e.g. users, content, newsfeed, etc. Make sure not to include the the **com_** prefix.
* `{metadata`}: An associative array containing metadata.
* `{actor}`: The ID of the user executing the activity. If none is provided the ID of the current logged user will used.