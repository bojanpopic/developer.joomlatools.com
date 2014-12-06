# Plugins

## Introduction
<!-- THIS SEEMS LIKE MORE OF A BLOG POST TO ME-->
The need to alter or supplement the functionality of an extension goes hand in hand with using the Joomla CMS. The current standard
in dealing with this need is to try to use either existing Joomla! event triggers. These are good but not as granular as one would like.

Another option is to contact a respective extension's developer and ask them to add a new trigger so that you can get the functionality that you need, via a plugin. But this is
far from ideal. You end up with an extension that is peppered with hooks.

There are performance implications to using an event trigger that may run the whole component before its able to fire.

Therein lies much of the motivation and thought behind the design and implementation of Joomlatools extensions, and the underlying Nooku Framework.
How do you get to alter an extension's behavior at just the right spot? An architecture that allow for the 'Observing' of an object's
'action' methods, and providing means and opportunity to fire events both before and after those methods are fired.

That's what Joomlatools Extensions provide you, out of the box. This Event Publisher Subscriber modelled architecture is made available
through the Joomla Plugin API. It follows the same general structural conventions as a core plugin, but with a method naming convention
 that allows for a very fine grained targeting.

<!-- THIS SEEMS LIKE MORE OF A BLOG POST TO ME-->

## What is possible?

A better question would be "What's not possible?". There are many opportunities in the handling of a request through the Framework for the
supplementing of an extension's functionality.



### Model, View, Table, Controller...Module...Yup?

## How does it work?

All objects in the Framework that provide this access to the Plugin API have some similar characteristics. For one, their main
action methods funnelled through a singular 'executing' method, that centralizes the execution strategy of the class. That method
is rarely used directly from outside of an object, but is called from the magic \_\_call() method.

That executing method always exhibits the same general logic

1. a context variable gets set up
2. a `before` command chain is fired
3. the actual `_action[Action]` method is called, the result of which is added to the context
4. a `after` command chain is invoked.

By simple inspection we can see that there is opportunity to alter what information an object is provided and what information
that same object provides in return.

<!-- KControllerAbstract::execute() or KViewAbstract::render() -->

The `invokeCommand` method is part of the `KCommandMixin` interface, and each object that uses the described behavior needs to
have it mixed in at its creation.

## Where does the Plugin API part come in?

To expose this 'heart' of changeability to the you as a core Joomla 'like' plugin each object must have the KCommandHandlerEvent class
in its command chain. Most objects in the Framework have an `_initialize` method where a number of defaults and base configuration variables
are set. Each class that we expose as Plugin API will have a `command_chain` array with `'lib:command.handler.event'` (or some Object Identifier whose hierarchy
leads there).

Its that 'handler' that,
1. builds the **event**
2. which notifies a publisher
3. which loads the plugin, _with `JPluginHelper::importPlugin`_
4. and calls the event handler.

<!-- DIAGRAM HERE -->

That **event** part is important. Its provides a nice interface for you to work with in your plugin. It passes through much
of the same information that our context variable from above gets. In fact it is the 'exact' same information, most important of which are

```php
    $caller		= $event->caller;
    $action 	= $event->action;
    $data 		= $event->data;
    $result 	= $event->result;
```

## Specific Naming Conventions


## Examples

* Practical example (link to docman/plugins.md)

