---
layout: default
title: Frontend
---

* Table of Content
{:toc}

Most components built for Joomla have both a Frontend application, the site and a Backend application, the administrator.
In this section of the tutorial we'll focus on getting off the ground by showing you
how to:

* Create a Component Entry Point
* Register your Component with Joomla
* Get your first views to work with almost NO CODE
* Build a database table for your Todos, which in turn, builds your model automatically, with NO CODE

## Register

The first thing we need to do is make sure our component is registered in the database. This is normaly done automatically when installing a new component with the normal Joomla installer. In our case we need to do it manually.

We know that our component is going to be called `com_todo` so we can perform an insert with the following code in the database.

> For those of you are using the Joomlatools vagrant box, you can use http://phpmyadmin.joomla.dev

*Replace '#__' with your database prefix:*

For Joomla 2.5.x and 3.x
{% highlight mysql %}
    INSERT INTO `sites_todo`.`#__extensions`
        (`extension_id`, `name`, `type`, `element`, `folder`, `client_id`,
         `enabled`, `access`, `protected`, `manifest_cache`, `params`,
         `custom_data`, `system_data`, `checked_out`, `checked_out_time`,
         `ordering`, `state`
         )
    VALUES
        (NULL, 'com_todo', 'component', 'com_todo', '', '0', '1', '1',
        '1', '', '', '', '', '0', '0000-00-00 00:00:00', '0', '0');
{% endhighlight %}

With that done, we are free to dive into our component development.

## Entry Point

If you have ever developed a Joomla component before you know about the _component entry point_, sometimes referred to as the _component loader_.
The file in most cases in Joomla loads a controller and fires the execute method on that controller. We're doing something
different; loading and firing our own dispatcher to take care of all that.

So, just create this file:

    /components/com_todo/todo.php

And then add the following line of code to the file:

{% highlight php %}
<?php echo KObjectManager::getInstance()                     // load the Object Manager
            ->getObject('com://site/todo.dispatcher.http')  // Get an HTTP Dispatcher
            ->dispatch();                                   // call the dispatch action
{% endhighlight %}

## Hello World

If you have read the [HMVC](/essentials/hmvc.html) article, you will know that it's the view's responsibility to render things to the screen.
So that's what we'll do next:  _Create a View_.

The first view we will add, is the view that renders our list of todo items. For this, create the following file and directory structure:

    /components/com_todo/view/items/tmpl/default.html.php

> Notice that the directory name "items" is plural, and not "item", which is singular.
> This is part of the framework's [Naming Conventions](/essentials/naming-conventions.html): Since we're creating a view that's
going to display multiple todo items, we use the plural form "items". Later on we will set up the view that displays a single blog
post, which will have a singular name, "post".

We don't have a list of items to display just yet, so inside the newly created default.html.php just add the following line for now:

{% highlight php %}
    Hello World, and welcome to my Todo Items!
{% endhighlight %}

### Add a Model...For now

Also in the [HMVC](/essentials/hmvc.html) article you learned that a controller loads a model. The default controller that Joomlatools Framework
would create for you expects a model, which in turn expects a database table by default. As we don't have a database yet, we will
bypass this behavior by extending our items model from [`KModelAbstract`](http://api.nooku.org/class-KModelAbstract.html) instead. Please create the the following file and directory structure:

     /components/com_todo/model/items.php

And then add the following line of code to the file:

{% highlight php %}
    <?php class ComTodoModelItems extends KModelAbstract {}
{% endhighlight %}

**We're going to get rid of this later when we set up our database.**

Now, try opening [http://joomla.dev/todo/index.php?option=com_todo&view=items](http://joomla.dev/todo/index.php?option=com_todo&view=items)
 in your browser. If you set everything up correctly you should see something like

![Hello World, and welcome to my Todo Items](/resources/images/todotutorial/hello-world.png)

### What just happened?

As you may have noticed, we didn't create a view class at all. Nor did we create a controller. The model we created was simply to bypass
the framework default. In the cases where the Framework can't find a class that you need represented in the Component's MVC Context, i.e. item controller, a item model
or a items view, it will iteratively [Fallback](/essentials/object-management.html) to classes through a hierarchy of classes provided by the
framework and use them instead.

_This is part of what we call Joomlatools Framework **Magic**:_

**If you're not trying to accomplish anything out of the ordinary, Joomlatools Framework will often do the job for you.**

In other words: Don't add code until you're sure you really need it. More on this in the following parts of this tutorial.

## Database Table

Let's define the basic database schema for our component. Execute the following SQL statement in your MySQL client,
such as [PHPMyAdmin](http://www.phpmyadmin.net/home_page/index.php).

Before doing so, replace the prefix '#__' with the prefix you chose during Joomla installation.

    CREATE TABLE IF NOT EXISTS `#__todo_items` (
      `todo_item_id` SERIAL,
      `title` varchar(255) NOT NULL,
      `description` longtext NOT NULL
    );

### Naming Conventions Explained

Have a good look at the [Essentials > Naming Conventions](/essentials/naming-conventions.html) page. There is an easy for follow section for the database side of things.

The name of the table is `#__todo_items`. 'todo' is the name of our component, followed by the name of the entity we want
to store in this table which in this case is simply 'items'. This name should always be plural; a table is always a collection of items.
So the database table naming convention is:

`dbprefix` + `component name` + `_`  +`entities`

Next we have the primary key. Every table should have one. We define it as SERIAL.

> SERIAL is an alias for BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE.

The name of the primary key is `todo_item_id` . Again we use the component's name 'todo', followed by the name of the entity,
in singular this time, since it describes one item. In other words the primary key name format is:

 `component name` + `_` + `entity_id`

### Insert the Data Please!

Now we insert some sample data into the blog table. Again, replace #__ with your database prefix:

    INSERT INTO `#__todo_items` (`title`, `description`) VALUES
        ('todo item one', 'This is the first Todo'),
        ('todo item two', 'This is the second Todo'),
        ('todo item three', 'This is the third Todo');


Now we have a database defined let's get rid of the `ComTodoModelItems` class we created in the previous part. For this
delete the `/components/com_todo/model/` directory, or at least the enclosed file in

    DELETE     /components/com_todo/model/items.php

If you go back to http://joomla.dev/todo/index.php?option=com_todo&view=items, you will see that even though you
have deleted your model, the page still renders as it did before.

**Remember, we only needed to create that file because we didn't have an associated table yet. Now we do!**

## List View

Your component Views are how you present your data to the world.

We got you started off in the [Frontend](front-end.html) part of the tutorial by creating a file called

    /components/com_todo/view/items/tmpl/default.html.php

Open it up and lets get to work showing our todo items!

> Remember, we're using http://joomla.dev/todo/index.php?option=com_todo&view=items

### Display Data in the Template

Writing templates in Joomlatools Framework is like writing regular HTML and PHP, but simpler. Add the following code to your open template
file:

{% highlight php %}
    <ul>
    <? foreach($items as $item) : ?>
        <li>
            <?=$item->id?>.
            <?=$item->title?>
            <?=$item->text?>
        </li>
    <? endforeach; ?>
    </ul>
{% endhighlight %}

This code will render an unordered list and for each entity in `$items` object it will render a `<li>` element with the
Todo Item's id, title, and its description.

![My Joomlatools Framework Powered Todo List](/resources/images/todotutorial/front-end-view.png)

Some important notes about our code:

1. We are using PHP short tags:

    * <? instead of <?php
    * <?= instead of <?php echo

    If short tags are disabled in your php.ini file, Joomlatools Framework will automatically rewrite them as normal tags. So you don't
    have to worry about compatibility issues with some server setups. Again, you can use normal tags as well, but this is more compact.

2. We are using the [PHP alternative syntax](http://php.net/manual/en/control-structures.alternative-syntax.php) for control
structures such as the foreach statement, once again for readability.

3. We can simply use `$items` in the above example instead of `$this->items`. Joomlatools Framework will by default assign items data to the
`items view` if you don't tell it otherwise..._More Magic_

4. Note that we have only added a template here; no `View` class. This is because Joomlatools Framework will fallback on default classes
whenever your component does not contain a specific class that it's looking for, in this case the `items` HTML view. So
when `ComTodoViewItemsHtml` is not found, it will simply fall back on [`ComKoowaViewHtml`](http://api.nooku.org/class-ComKoowaViewHtml.html), and assume that since you're requesting
the `items view`, that you want to view a list of Todo items.

<b>Tip:</b> You can also add a 'default' view class for your component, `ComTodoViewHtml`, if you want to use that as a fallback
instead of [`ComKoowaViewHtml`](http://api.nooku.org/class-ComKoowaViewHtml.html). For HTML format requests your new class
still needs to descend from `KViewHtml`.

Again, take note of the following: "item**s**" implies multiple items, while "item" implies a single post. Everywhere in Joomlatools Framework, it's very
important to use singular and plural forms correctly. Thanks to [`KStringInflector`](http://api.nooku.org/class-KStringInflector.html),
Joomlatools Framework translates back and forth between most English words.

_It even knows words like "person" is singular, where "people" is its plural form. Similarly, "index" is the singular form of the plural "indices"._

### Using Template Shortcuts

The Framework provides some handy shortcuts and syntactical sugar for use in our view templates. They
help keep templates clean and function names a little more relevant to the designer. Here are some of them:

* `object()` => [`KObject::getObject()`](http://api.nooku.org/source-class-KObject.html#_getObject)
* `translate()` => [`KObject::getObject('translator')->translate()'`](http://api.nooku.org/source-class-KTranslatorAbstract.html#_translate)
* `route()` => [`KViewTemplate::getRoute()`](http://api.nooku.org/source-class-KViewTemplate.html#_getRoute)
* `json()` => `json_encode()`
* `format()` => `sprintf()`
* `replace()` => `strtr()`
* `escape()` => [`KTemplate::escape()`](http://api.nooku.org/source-class-KTemplate.html#_escape)
* `helper()` => [`KTemplate::invoke()`](http://api.nooku.org/source-class-KTemplate.html#_invoke)
* `import()` => [`KTemplateEngineKoowa::_import()`](http://api.nooku.org/source-class-KTemplateEngineKoowa.html#__import)
* `parameters()` => [`KTemplate::getParameters()`](http://api.nooku.org/source-class-KTemplate.html#_getParameters)

Let try some in our example. Change the `ul` list in above example to:

{% highlight php %}
    <ul>
    <? foreach($items as $item) : ?>
        <li>
            <?=translate('ID'). ': ' . $item->id?>.
            <?=translate('Title'). ': ' . $item->title?>
            <?=translate('Text'). ': ' . $item->text?>
        </li>
    <? endforeach; ?>
    </ul>
{% endhighlight %}
If we had some date information defined in our database for each item, i.e. $item->created_on we could use the `helper` shortcut to load
the date helper and make that information easier to read for us humans.

{% highlight php %}
<?= helper('date.humanize', array('date' => $activity->created_on )); ?>
{% endhighlight %}

Also, when we have a singular Item view ready we could use the `route` shortcut to help us build our urls.
{% highlight php %}
  <a href="<?= route('view=item&id='. $item->id ) ?>">
            <?= $item->title ?>
   </a>
{% endhighlight %}

All of the shortcuts are there
 to help you **"Write Less Code"**. Mastering them will help you produce templates faster that
are ultimately easier to read.