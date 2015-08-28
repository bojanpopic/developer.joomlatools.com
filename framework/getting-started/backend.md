---
layout: default
title: Backend
---

* Table of Content
{:toc}

## Entry Point

The entry point contains the very first code that gets executed.

Create the following file:

    /administrator/components/com_todo/todo.php

Add the following snippet to the file to load the `dispatcher` and call the `dispatch` action:

{% highlight php %}
<?php echo KObjectManager::getInstance()
    ->getObject('com://admin/todo.dispatcher.http')
    ->dispatch();
{% endhighlight %}

## List View

Let's create the items view using an HTML table to display the sample data.

Create the following file:

    /administrator/components/com_todo/view/items/tmpl/default.html.php

Add the following snippet to the view:

{% highlight html %}
<?php
<?= helper('behavior.koowa'); ?>

<ktml:module position="toolbar">
    <ktml:toolbar type="actionbar" title="COM_TODO_SUBMENU_TASKS" icon="task icon-stack">
</ktml:module>

<table>
    <thead>
        <tr>
            <th><?= translate('ID') ?></th>
            <th><?= translate('Title') ?></th>
            <th><?= translate('Description') ?></th>
        </tr>
    </thead>
    <tbody>
        <? foreach($items as $item) : ?>
        <tr>
            <td>
                <?= $item->id?>
            </td>
            <td>
                <a href="<?= route('view=item&id='. $item->id) ?>">
                    <?= $item->title ?>
                </a>
            </td>
            <td>
                <?= $item->description?>
            </td>
         </tr>
        <? endforeach; ?>
    </tbody>
</table>
{% endhighlight %}

The result will be:

![Success, our first Todos Table.](/resources/images/todotutorial/backend-todos-first-list.png)

Test yourself: [http://joomla.box/todo/administrator/index.php?option=com_todo&view=items](http://joomla.box/todo/administrator/index.php?option=com_todo&view=items){:target="_blank"}

<span class="note">
**Tip**: [Tags](http://localhost:3383/framework/views/html/templates.html#tags), like `<ktml:module>` are an important part of the template layer.
</span>

## Form View

What good is a management level component if you can't edit the data? Let get into the steps you need to follow to
get that working.

Create a new template file:

    /administrator/components/com_todo/view/item/tmpl/default.html.php

Add the following snippet to the file:

{% highlight html %}
<?php
<?= helper('behavior.koowa'); ?>

<ktml:style src="media://koowa/com_koowa/css/koowa.css" />
<ktml:module position="toolbar">
    <ktml:toolbar type="actionbar" icon="task-add icon-pencil-2">
</ktml:module>

<form action="<?= route('id='.$item->id) ?>" method="post" class="-koowa-form">
    <div>
        <div>
            <input  type="text" name="title" id="title" size="40" maxlength="255" value="<?= $item->title; ?>" placeholder="<?= translate( 'Title' ); ?>" />
        </div>
        <?= helper('editor.display', array(
            'name' => 'description',
            'id' => 'description',
            'width' => '100%',
            'height' => '300',
            'cols' => '60',
            'rows' => '20',
            'value' => $item->description
        )) ?>
    </div>
</form>
{% endhighlight %}

Result:

![Todos List With Toolbar](/resources/images/todotutorial/todo-form-with-toolbar.png)

## Tips & Tricks

### Saving HTML

If you try to save HTML in the editor you will find that HTML gets stripped out. The framework loads predefined column filters when saving data, depending initially on the `type` of each table column.

For the `description` column we set the type to `longtext` in the database schema which gets filtered as a `string`. Using a `Table object` you can allow HTML in the description database column.

Create the following file:

    /administrator/components/com_todo/database/table/items.php

Add the following snippet:

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

### Dispatcher

When there is no `view` parameter in the request the framework tries to load a view that has the same name as the component, `todos` in our case.

Using a specialized dispatcher the framework's default can be overwritten and redirect the request to our items view.

Create the following file:

    /administrator/components/com_todo/dispatcher/http.php

Add the following snippet to the file, to load the "item" controller as the default:

{% highlight php %}
<?php
class ComTodoDispatcherHttp extends ComKoowaDispatcherHttp
{
    protected function _initialize(KObjectConfig $config)
    {
        $config->append(array(
            'controller' => 'item'
        ));
        parent::_initialize($config);
    }
}
{% endhighlight %}

`?option=com_todo` will now redirect to `?option=com_todo&view=items`.

Test yourself: [http://joomla.box/todo/administrator/index.php?option=com_todo](http://joomla.box/todo/administrator/index.php?option=com_todo){:target="_blank"}.