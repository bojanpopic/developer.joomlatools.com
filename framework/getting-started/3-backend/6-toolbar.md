---
layout: default
title: Toolbar
---

* Table of Content
{:toc}

## Toolbar for Item View

Now that we know how use some of these tags, we should add something similar to our list view to get an appropriate `toolbar` there as well.
Open up

`/administrator/components/com_todo/view/items/tmpl/default.html.php`

And add the following code

{% highlight html %}
<?= helper('behavior.koowa'); ?>
 <ktml:style src="media://koowa/com_koowa/css/koowa.css" />
 <ktml:module position="submenu">
     <ktml:toolbar type="menubar">
 </ktml:module>
 <ktml:module position="toolbar">
     <ktml:toolbar type="actionbar" title="ITEMS" icon="item icon-stack">
 </ktml:module>
{% endhighlight %}

![Todos List With Toolbar](/resources/images/todotutorial/todo-list-with-toolbar.png)


### Adding the Menu Bar: Optional Exercise

If you were really paying attention you may have noticed we added a little extra module injection in that last example.

{% highlight html %}
 <ktml:module position="submenu">
     <ktml:toolbar type="menubar">
 </ktml:module>
{% endhighlight %}

We didn't see it do anything special happen because of this code. That's because we have not defined a controller menu bar.

>Unlike our actionbar, the menubar has no default commands in it. That means it won't render automatically.

Let's use the Dashboard view from our last Optional Exercise to illustrate. Again, predictable naming conventions tell us where to put our
`menubar` class.

Let's create a file at

`/administrator/components/com_todo/controller/toolbar/menubar.php`

And in that file place the following class definition

{% highlight php %}
<?php
class ComTodoControllerToolbarMenubar extends ComKoowaControllerToolbarMenubar
{
    function getCommands()
    {
        $view = KStringInflector::singularize($this->getController()->getView()->getName());
        // add the dashboard view to the menu
        $this->addCommand('Dashboard', array(
            'href' => 'index.php?option=com_todo&view=dashboard',
            'active' => ($view == 'dashboard')
        ));
        // add the items view to the menu
        $this->addCommand('Items', array(
            'href' => 'index.php?option=com_todo&view=items',
            'active' => ($view == 'item')
        ));
        return parent::getCommands();
    }
}
{% endhighlight %}

_Let's explore what's happening here._

When any toolbar is about to be rendered, the [`getCommands`](http://api.nooku.org/source-class-ComKoowaControllerToolbarMenubar.html#_getCommands) method is called. There are no commands registered in the `menubar`
by default and so it is empty until we add them. If the `view` we are looking at matches a command we are adding, it gets
an `'active' => true` and is highlighted as active on the page.

Go ahead and refresh your browser at http://joomla.dev/todo/administrator/index.php?option=com_todo&view=items

![Todos List With Menubar](/resources/images/todotutorial/todo-list-with-menubar.png)


## Toolbar for List View

You may notice that something seems to be missing. There are none of the important toolbars we discussed in the last section.

Toolbars are **quite easy** to add to any Joomlatools Framework powered component. We can get them to render simply by adding the following
code anywhere in the template we just created

{% highlight html %}
<?= helper('behavior.koowa'); ?>
<ktml:style src="media://koowa/com_koowa/css/koowa.css" />
<ktml:module position="toolbar">
    <ktml:toolbar type="actionbar" icon="item-add icon-pencil-2">
</ktml:module>
{% endhighlight %}

#### WHOA! What is all That?

Those are special `ktml` namespace tags. The `ktml` part helps to avoid name collisions with any other tags. More importantly,
the Joomlatools Framework template engine finds all of these tags when it compiles a given template and performs special processing for us.

In this example, the `<ktml:toolbar>` tag gets filtered and replaced with a real controller toolbar. The `<ktml:module>` tag gets filtered and
anything inside it gets *injected* into the template position as defined in the tag's `position` attribute, which in this case is fittingly `toolbar`.

If you were wondering about the `<ktml:style src="[url]" />` tag, that's a special way of saying

>"I want the stylesheet in the `src` attribute pushed into the `<head />` tag of this page".

And if you happened to noticed `media://` in that url, well that also gets filtered to the URL of your `/media`
folder, which in our case is `http://joomla.dev/todo/media/` ... _**That is handy**_

You may have also noticed the `<?= helper('behavior.koowa'); ?>` line. It loads the Javascript required for the toolbar
to work.

If you refresh your page you should see something similar to

![Todos Item With Toolbar](/resources/images/todotutorial/todo-form-with-toolbar.png)

### Saving HTML in the 'description'

By illustration, we showed you how to use the `editor` helper. If you try to save HTML in your description though, you will
 find that your Todo's description gets stripped of that HTML.

Joomlatools Framework loads predefined column filters when dealing with your data, depending initially on the `type` we set for that column.
For `description` we set the type to `longtext` (back in [Creating the Database](creating-the-database.html) ) and that column
type gets filtered as a `string` (see [KFilterString](http://api.nooku.org/class-KFilterString.html)).

Since we want to allow HTML in our descriptions we'll need to let the Joomlatools Framework know that its OK to let HTML through.

**We do that through a Table object**

Just create the following file

    /administrator/components/com_todo/database/table/items.php

And add the following code

{% highlight php %}
<?php
class ComTodoDatabaseTableItems extends KDatabaseTableAbstract
{
    protected function _initialize(KObjectConfig $config)
    {
        $config->append(array(
                'filters' => array(
                    'description'  => array('html')
            )
        ));
        parent::_initialize($config);
    }
}
{% endhighlight %}

With that in place, Joomlatools Framework knows to let HTML through the filter for the `description` column.

### Try it out!