---
layout: default
title: Frontend
---

* Table of Content
{:toc}

## Register

The first thing you need to do is make sure our component is registered in the database.

Knowing that the component is going to be called `com_todo` you can execute the following snippet in the `sites_todo` database.

Replace `#__` with your database prefix:

{% highlight mysql %}
INSERT INTO `#__extensions`
    (`extension_id`, `name`, `type`, `element`, `folder`, `client_id`,
     `enabled`, `access`, `protected`, `manifest_cache`, `params`,
     `custom_data`, `system_data`, `checked_out`, `checked_out_time`,
     `ordering`, `state`
     )
VALUES
    (NULL, 'com_todo', 'component', 'com_todo', '', '0', '1', '1',
    '1', '', '', '', '', '0', '0000-00-00 00:00:00', '0', '0');
{% endhighlight %}

<span class="note">
**Tip**: When using our Vagrant box you can use [http://phpmyadmin.joomla.dev](http://phpmyadmin.joomla.dev).
</span>

## Entry Point

If you have ever developed a Joomla component before you know about the _component entry point_, sometimes referred to as the _component loader_.
The file in most cases in Joomla loads a controller and fires the execute method on that controller. We're doing something
different; loading and firing our own dispatcher to take care of all that.

Create the following file:

    /components/com_todo/todo.php

Add the following snippet to the file:

{% highlight php %}
<?php echo KObjectManager::getInstance()            // load the Object Manager
    ->getObject('com://site/todo.dispatcher.http')  // Get an HTTP Dispatcher
    ->dispatch();                                   // call the dispatch action
{% endhighlight %}

## Database Table

The following snippet defines the database schema of our component, execute it in the `sites_todo` database.

Replace `#__` with your database prefix:

{% highlight mysql %}
CREATE TABLE IF NOT EXISTS `#__todo_items` (
  `todo_item_id` SERIAL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL
);
{% endhighlight %}

<span class="note">
**More**: Read more on the [Naming Conventions](/framework/essentials/naming-conventions.html#databases) of database tables.
</span>

### Insert sample data

Insert some sample data into the database table.

Replace `#__` with your database prefix:

{% highlight mysql %}
INSERT INTO `#__todo_items` (`title`, `description`) VALUES
    ('todo item one', 'This is the first Todo'),
    ('todo item two', 'This is the second Todo'),
    ('todo item three', 'This is the third Todo');
{% endhighlight %}

## List View

If you are familiar with [HMVC](/framework/digging-deeper.html#hmvc) you know that it's the view's responsibility to render things to the screen.

### Create the view

First we will add the view that renders our list of todo items. For this, create the following file and directory structure:

    /components/com_todo/view/items/tmpl/default.html.php

<span class="note">
**More**: Read more on the [Naming Conventions](/framework/essentials/naming-conventions.html#views) of Views.
</span>

### Display data

Writing templates is like writing regular HTML and PHP, but simpler. Add the following snippet to the view:

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

This code will render an unordered list for each entity in `$items` object displaying the id, title and description.

See [http://joomla.dev/todo/index.php?option=com_todo&view=items](http://joomla.dev/todo/index.php?option=com_todo&view=items)

![My Joomlatools Framework Powered Todo List](/resources/images/todotutorial/front-end-view.png)

Note that we have only added a template here; no `View` class. This is because Joomlatools Framework will fallback on default classes
whenever your component does not contain a specific class that it's looking for, in this case the `items` HTML view. So
when `ComTodoViewItemsHtml` is not found, it will simply fall back on [`ComKoowaViewHtml`](http://api.nooku.org/class-ComKoowaViewHtml.html), and assume that since you're requesting
the `items view`, that you want to view a list of Todo items.

## Tips & Tricks

### PHP short tags

We prefer PHP short tags:

* `<?` instead of `<?php`
* `<?=` instead of `<?php echo`

Even if short tags are disabled in your `php.ini` file they will automatically be rewritten as normal tags.

### PHP alternative syntax

We are using the [PHP alternative syntax](http://php.net/manual/en/control-structures.alternative-syntax.php) for control
structures such as the foreach statement, once again for readability.

### Items object

We can simply use `$items` in the above example instead of `$this->items`. The framework will by default assign items data to the `items view`.

### Singular & Plural

**Items** implies multiple Todo items, while **item** implies a single Todo item. It's very important to use singular and plural correctly.

Thanks to [`KStringInflector`](http://api.nooku.org/class-KStringInflector.html), the framework translates back and forth between most English words. It even knows words like "person" is singular, where "people" is its plural form.

### Shortcuts

The framework provides some handy [shortcuts](/framework/views/html/templates.html#shortcuts) for use in our view templates.
