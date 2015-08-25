---
layout: default
title: Backend
---

* Table of Content
{:toc}

Now we're going to create the back-end for our component, com_todo.
In other words we will create the environment for an administrator to manage all the Todo Items in the system: create/modify/delete Items.

Here are some of the things you'll learn:

* Change the Default View or Your Component
* Create a Backend List View
* Create a Form to Edit Your Todos
* Add an Actionbar to Your Views
* Add a Menubar to Your List View

## Entry Point

The entry-point contains the very first code that gets executed when you visit

http://joomla.dev/todo/administrator/index.php?option=com_todo

To get going just like the Front End component create the following file

    /administrator/components/com_todo/todo.php

Then place the following code in that file:

{% highlight php %}
<?php echo KObjectManager::getInstance()
          ->getObject('com://admin/todo.dispatcher.http')
          ->dispatch();
{% endhighlight %}

**Tip:** This file is the exact same as in the Front End version of the com_todo entry point except that the dispatcher
identifier is for `admin` instead of `site`.

This line simply loads the dispatcher and calls the `dispatch` action.

Now, try pointing your browser to

http://joomla.dev/todo/administrator/index.php?option=com_todo.

*You will get an error, something like*
![No Todos Todos Table.](/resources/images/todotutorial/backend-todos-error.png)

When there is no `view` parameter in the request, Joomlatools Framework tries to load the pluralized name of the component as its `view`, in our case **'todos'**.
But this won't work because we haven't defined the view by that name, nor have we defined a table to match.

As you can see the `view` is very important. It tells the component dispatcher which `Controller` to load, which loads the `Model`
 and the actual `View` object. The `view` in a Joomlatools Framework component is fundamental. This is why that at the very least the directory
 structure and the template of the view needs to be defined.

The Framework needs to know how you want that information rendered.

## Create a View

Let's recreate (or _not create_ as the case may be) the Items View as we did in the Front End version, but this time use a table to display the data. Just create the file

    /administrator/components/com_todo/view/items/tmpl/default.html.php

And add the following did before

{% highlight php %}
<table>
    <thead>
        <th><?=translate('ID') ?></th>
        <th><?=translate('Title') ?></th>
        <th><?=translate('Description') ?></th>
    </thead>
  <? foreach($items as $item) : ?>
        <tr>
            <td>
                <?= $item->id?>
            </td>
            <td>
                <a href="<?= route('view=item&id='. $item->id ) ?>">
                            <?= $item->title ?>
                   </a>
            </td>
             <td>
                <?= $item->description?>
            </td>
         </tr>
    <? endforeach; ?>
</table>
{% endhighlight %}

With the this template file in place and point the browser to

http://joomla.dev/todo/administrator/index.php?option=com_todo

_we still get an error "View: todos not found"_

### Don't get discouraged! All of this has a point!

The Framework is still trying to load the same "todos" view, because we haven't told it to do any different.

## Dispatcher

In our case we don't want to have a view named "todos", but would like our default view to be a list of the Todo "items" in the system.
To get this done we have to create a specialized dispatcher that will override the Framework's default.

First, create the file

`/administrator/components/com_todo/dispatcher/http.php`

and insert the following code

{% highlight php %}
    <?php
    class ComTodoDispatcherHttp extends ComKoowaDispatcherHttp
    {
        protected function _initialize(KObjectConfig $config)
        {
            $config->append(array(
                    'controller'	=> 'item'
            ));
            parent::_initialize($config);
        }
    }
{% endhighlight %}

Looking at the first line; notice that we're extending the [`ComKoowaDispatcherHttp`](http://api.nooku.org/class-ComKoowaDispatcherHttp.html). This is the class which gets loaded
in response to an HTTP request if we don't make our own dispatcher class.

>For reference, its located at `/libraries/koowa/components/com_koowa/dispatcher/http.php`.

In our class, we're telling our component to load the "item" controller as the default. Which is the same as saying:

>When there is no view param in the request, we want to see items

Now if we refresh our page

http://joomla.dev/todo/administrator/index.php?option=com_todo

The Framework will redirect the request to

http://joomla.dev/todo/administrator/index.php?option=com_todo&view=items

_which is great!_

We already defined our default layout for a list of our items, so we get something like
![Success, our first Todos Table.](/resources/images/todotutorial/backend-todos-first-list.png)

#### Optional Exercise: Create a Dashboard

The above is the simplest way to get your backend going. However, there is often a desire to create some kind of Dashboard
in the administrator application side of a component. Maybe you want some statistics related to your Todos, maybe some instructions
for other admins using your component, or even data from another part of the system that you think is relevant.

Note: If you haven't read about the MVC architecture you are strongly advised to do so. Being familiar with MVC is required
to understand the Framework.

In this case a Dashboard
A) is singular
B) won't have a single table or model associated with it

To implement this view and have it be our default screen we'll need to do a few things.

1) We need a controller that doesn't expect a model. The fallback [`ComKoowaControllerDefault`](http://api.nooku.org/class-ComKoowaControllerDefault.html)
descends from [`KControllerModel`](http://api.nooku.org/class-KControllerModel.html), which expects an associated database tabl
e.
We need to our dashboard controller to extend [`ComKoowaControllerView`](http://api.nooku.org/class-ComKoowaControllerView.html) instead.

We create the file

`/administrator/components/com_todo/controller/dashboard.php`

And add the following code

{% highlight php %}
<?php  class ComTodoControllerDashboard extends ComKoowaControllerView{}
{% endhighlight %}

2) Then create a template layout

`/administrator/components/com_todo/view/dashboard/tmpl/default.html.php`

And add the following code

{% highlight php %}
<h1>Todo Dashboard</h1>
{% endhighlight %}

3) Update the `ComTodoDispatcherHttp` and make `dashboard` the default controller instead

{% highlight php %}
    <?php
    class ComTodoDispatcherHttp extends ComKoowaDispatcherHttp
    {
        protected function _initialize(KObjectConfig $config)
        {
            $config->append(array(
                    'controller'	=> 'dashboard'
            ));
            parent::_initialize($config);
        }
    }
{% endhighlight %}

That's it. Pointing your browser to http://joomla.dev/todo/administrator/index.php?option=com_todo will now redirect and load your new Dashboard.

![Todos Default Dashboard.](/resources/images/todotutorial/backend-todos-dashboard.png)

## Controller Package

Lastly, a little bit about the Controller package. Aside from the example for a Dashboard above there is no need for us to create
a Controller for the Todo Items. The behavior provided by the [`ComKoowaControllerModel`](http://api.nooku.org/class-ComKoowaControllerModel.html) is robust and fulfills all of our needs,
and this is the class that the Framework falls back to.

**Because we have defined a database table that conforms to the naming conventions that the Framework expects, we don't need to define a class.**

### Controller Toolbars

One of the more important pieces in the backend is the Toolbar. The administrator toolbar is the series of command buttons at the
top of the screen that you are all familiar with. For our component to work properly and be user friendly, we need to
be able to create, edit and delete Todo items. And guess what, if you don't need anything special, you don't have to create these either as Joomlatools Framework
give you a nice implementation out of the box.

We touch on the Toolbars a little more in the next section.

## Form

What good is a management level component if you can't edit the data. Let get into the steps you need to follow to
get that working.

When you click the "Todo item one" link in the items view , a <span style="color: red;">500 error</span> should be generated.

    The template "com://admin/todo.item.default.html" cannot be located.

>Note: If you put debugging on in Configuration a lot more info is available.

This error should be _Expected_. Remember, the layout file is the only thing we absolutely need to explicitly write for a given html `view`.

We can go ahead and create a new template file

`/administrator/components/com_todo/view/item/tmpl/default.html.php`

And enter the following code

{% highlight html %}
<?= helper('behavior.koowa'); ?>

<form action="<?= route('id='.$item->id) ?>" method="post" class="-koowa-form">
    <div>
    	<div>
		<input  type="text" name="title" id="title" size="40" maxlength="255"
		        value="<?= $item->title; ?>"
		        placeholder="<?= translate( 'Title' ); ?>" />
	</div>
	<?= helper('editor.display', array(
	                    'name' => 'description',
                        'id' => 'description',
                        'width' => '100%',
                        'height' => '300',
                        'cols' => '60',
                        'rows' => '20',
                        'value' => $item->description
			    ))
	?>
    </div>
</form>
{% endhighlight %}

We should end up with something which is similar to this

![Todos List With Toolbar](/resources/images/todotutorial/todo-form-no-toolbar.png)

Awesome! We have a form, but no buttons to tell our application to save our Todos. Lets take care of that
in the next section.

## Toolbar

### Toolbar for Item View

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


#### Adding the Menu Bar: Optional Exercise

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


### Toolbar for List View

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

##### WHOA! What is all That?

Those are special `ktml` namespace tags. The `ktml` part helps to avoid name collisions with any other tags. More importantly,
the Joomlatools Framework template engine finds all of these tags when it compiles a given template and performs special processing for us.

In this example, the `<ktml:toolbar>` tag gets filtered and replaced with a real controller toolbar. The `<ktml:module>` tag gets filtered and
anything inside it gets *injected* into the template position as defined in the tag's `position` attribute, which in this case is fittingly `toolbar`.

If you were wondering about the `<ktml:style src="[url]" />` tag, that's a special way of saying

>"I want the stylesheet in the `src` attribute pushed into the `<head />` tag of this page".

And if you happened to noticed `media://` in that url, well that also gets filtered to the URL of your `/media`
directory, which in our case is `http://joomla.dev/todo/media/` ... _**That is handy**_

You may have also noticed the `<?= helper('behavior.koowa'); ?>` line. It loads the Javascript required for the toolbar
to work.

If you refresh your page you should see something similar to

![Todos Item With Toolbar](/resources/images/todotutorial/todo-form-with-toolbar.png)

#### Saving HTML in the 'description'

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
