#Template System

The Nooku Framework boasts a new [Template System](http://api.nooku.org/package-Koowa.Library.Template.html) that give
Joomlatools extensions unparalleled flexibility and power. What follows is a high level overview of the practical end-uses
of the technology with a few examples to help you get creating awesome views for your extensions.

A good understanding of the Framework's [Object Management](http://guides.nooku.org/essentials/object-management.html) and
[Naming Conventions](http://guides.nooku.org/essentials/naming-conventions.html) will really help you realize more of the potential
benefits of the Template system. This is especially true if you want to create your own template helpers and filters.

##Template Overrides

Template overrides allow you to change how a component's output is rendered without having to modify the original
component layout files. The main benefit of this is that component upgrades won't overwrite your modified files.

If you're familiar with the Joomla! template override system, you'll be right at home with the Nooku template overrides.

The template engine is similar to that of Joomla!, but turbo charged! All view templates can be overridden from within the
active system template, and follow the same folder structure as standard Joomla! template overrides.

In order to override a component view template, you must create a few folders and a PHP file within the system template.

The folder structure is as follows:

	/templates
		-> template_name
			-> html
				-> com_component_name
					-> view_name
						-> layout_name.php

* **template_name** - this is the name of the active system template
* **html** - all template overrides go in an "html" folder
* **com_component_name** - this is the name of the component, e.g. com_docman, com_fileman, etc
* **view_name** - the name name of the view whose template is being overridden
* **layout_name** - the specific layout being overridden, e.g. default.php, form.php

An example override might be `/templates/beez/html/com_docman/documents/list.php`, which overrides the `list` layout, in
the `documents` view, in the `com_docman` component for pages using the `Beez` template. This file's existence tells the
Nooku template system that you want to use it, as opposed to the original file `components/com_docman/views/documents/tmpl/list.php`.
This allows you to modify the output of a Joomlatools component (or any other Nooku powered component) without changing
the core files.

##Partials

Partials are a great way of separating layouts into manageable chunks.
They are just layout files, that can be loaded on their own, or included within another layout. We do this with the `import` template
function.

```php
<?= import('layout_name.html');
```

**Note:** `<?=` is short for `<?php echo` which can use with any Nooku powered template.

The `'layout_name.html'` in this case is the name of the layout file itself without the `php` file extension. The above
method will attempt include a file called "layout_name.html.php" from the same folder in which the parent files reside
(note: the same rules for template overrides apply to partials).

When using `import()`, a second argument can be supplied to pass additional variables to the included partial. For example:

```php
<?= import('partial', array('var_name' => 'var_value'));
```

This will create a variable in the partial called `$var_name` with a value of `var_value`. In addition, any variables that exist in the
parent layout will be automatically be passed through to the partial.

A partial can also be loaded on its own by placing `&layout=partial` in the query string of the page, again, where `partial` is the
name of the partial file.

>Those of you who are familiar with Nooku/Koowa 1.0 will recognize that "import "has replaced the "@template" template function.

##Helpers

Template Helpers are an incredibly useful tool for creating reusable template code. They can be used for all sorts of things,
from rendering form controls, to pagination, to tabs. The Framework comes packaged with several helpers, including but not limited to:

* Accordion: methods to create an accordion menu
* Behavior: a set of javascript behaviors including, tooltips, overlays, keep alive, validator, autocomplete, sortable and calendar.
* Date: date helper functions, including formatting and humanizing dates (e.g. 1 minute ago).
* Grid: grid table controls, including checkbox, search, enable/disable, order, and access.
* Image: provides a select list of images in a directory and preview functions.
* Listbox: allows you to create a select list or auto-complete from data returned from a model.
* Pagination: pagination and limit controls.
* Select: select list, radio list, checkbox list and boolean list controls.
* Tabs: html & javascript code for creating tab controls.

Helpers are invoked using the `helper` template function. That function is first passed a string which at first glance looks
like a regular Nooku object identifier; and then secondly, it can get an optional array of options. That string is actually
the helper's Object Identifier with a method name concatenated to it with a period (.). To rephrase, everything before the
last period in the string is an Object Identifier and after, is a method that is in that helper object's interface.

This line of code:
```php
<?=  helper('com://site/example.template.helper.myhelper.mymethod', array('of' => 'options'));
```
Looks for the following class, and invoke the `mymethod` method:
<a name="myhelper"></a>
```php
class ComExampleTemplateHelperMyhelper extends KTemplateHelperAbstract
{
    function mymethod($config = array()){
    {
          $config = new KObjectConfig($config);
          $config->append(array(
                   'of' => 'methods'
          ));
           return '<div>'. $config->of .'</div>';
    }
}
```
A helper identifier can take on the form of a fully qualified identifier as above, or a more convenient abbreviated form where just the file name
of the helper is used with the concatenated method. Hence, if we are working on a template in `com_example` the following command will
produce the same result as the previous example:

```php
<?=  helper('myhelper.mymethod', array('of' => 'options')); // Write Less Code
```

In this case the system assumes that your helper classes are located somewhere in the `template/helper` fallback
hierarchy:

1) `com_example/template/helper`
2) `libraries/koowa/components/com_koowa/template/helper`
3) `libraries/koowa/library/template/helper`

Helpers with abbreviated identifiers will have their classes located first within the component where they are called from; then com_koowa;
then the Koowa library.

The helper methods included with Nooku are designed to be pretty smart in that they have a default set of parameters. This means they
can work with a limited amount of input. However, that 'array of options' we mentioned above is a convenient vehicle to
override those defaults and get what you need from the helper. We did this in our [above class example](#myhelper) but another real example:

```php
<?= helper('date.humanize', array('date' => $date)); //where $date is a datetime formatted YYY-mm-dd H:m:s
```

The best way to get to know template helpers is to first look at some of them, and then start using them. For examples of the
helpers that come with the Framework, see the `libraries/koowa/library/template/helper` and the `libraries/koowa/components/com_koowa/template/helper`
directories contained within the package.

##Filters

Filters are a powerful feature of the Nooku template system. They are yet another tool to support you in **"Writing Less Code"**.
Each template object has a 'queue' of filters, and before a template is rendered, each of those filters is used against the content
of the template. As an illustration lets look at the current ComKoowaViewPageHtml::_initialize method:

```php
    protected function _initialize(KObjectConfig $config)
    {
        $config->append(array(
            'template_filters'	=> array('document', 'module', 'style', 'link', 'meta', 'script', 'title', 'message'),
        ));

        parent::_initialize($config);
    }
```

You will note the `template_filters` array in the `$config` object. Any class that extends `ComKoowaViewPageHtml` get all of these filter added
to the view template.

### So what?

We'll take the 'module' filter as an example as its responsible for 'Module Injection':

1) It looks in the view template for the `<ktml:module />` tag
2) removes it from the template
3) parse its attributes which correspond to attributes inherent to Joomla! modules (i.e. position, etc)
4) lastly, add that module to your page in the position that you specify.

**Powerful stuff**

As you can see, there are a number of template filters included in the Framework, and if you had not guessed, they follow a similar set of conventions
to that of the template helpers.

The fallback hierarchy is almost exactly the same:

1) `com_example/template/filter`
2) `libraries/koowa/components/com_koowa/template/filter`
3) `libraries/koowa/library/template/filter`

By inspection of these directories you can review what filters you have access to.

##Attaching filters

All of these filters won't be much good if we don't know how to attach them to our templates. Typically this is done via
the view object. As you saw above the `template_filters` array can simply be set in the view's `_initialize` method. There is
no need to specify filters that are already included in the parent `_initialize` method, they are essentially merged together.

However, you are not restricted to adding filters to your template at view creation. There is another way that lets you add a filter
to a template later in the process via the `addFilter` method:

```php
class ComCommentsViewCommentsHtml extends ComKoowaViewHtml
{
	public function display()
    {
        $some_condition_is_true = false;
        ...
        if($some_condition_is_true)
            $this->getTemplate()->addFilter('mention');

        return parent::display();
    }
}
```

Simple as that. The above will attach a filter called `ComCommentsTemplateFilterMention` to the comments template, which would be
located at `/components/com_comments/templates/filters/mention.php` (or `/administrator/components/...` for admin components).
As always, unqualified identifiers are loaded from the current component first, and down through the hierarchy. A fully
qualified identifier will also work.

## Summing Up

We've taken a high level look at the Nooku template system. With a solid understanding of these fundamental pieces you can
start to build extension views more quickly with powerful ready to use features at your finger tips. You can also customize
all of the Joomlatools extensions and add information that you want to see.
The best way to get to know the template system is to start using it, we think you'll be happy you did.
