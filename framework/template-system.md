#Template System

Joomlatools extension templates expose unparalleled flexibility and power. What follows is a high level overview of the structures
we use so that you can better understand what's happening in each template layout.

<!-- toc -->

##Template Overrides

Template overrides allow you to change how a component's output is rendered without having to modify the original
component layout files. The main benefit of this is that component upgrades won't overwrite your modified files.

If you're familiar with the Joomla! template override system. The template engine is similar to that of Joomla!, but turbo
charged! All Joomlatool templates can be overridden from within the active system template, and follow the same folder
structure as standard Joomla! template overrides.

In order to override a component view layout, you must create a few folders and a PHP file within the active system template.

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
the `documents` view, in the `com_docman` component for pages using the `Beez` template. That file's existence tells the
system that you want to use it, as opposed to the original file `components/com_docman/views/documents/tmpl/list.php`.
This allows you to modify the output of a Joomlatools component without changing the core files.


In some situations you may want to keep the current core layout available, but would like to render a very similar

##Partials

Partials are a great way of separating layouts into manageable chunks. They are just layout files, that can be loaded on
their own, or included within another layout. We do this with the `import` template function.

```php
<?= import('layout_name.html');
```

**Note:** `<?=` is short for `<?php echo`, which gets replaced when the template is compiled.

The `'layout_name.html'` in this case is the name of the layout file itself without the `php` file extension. The above
method will attempt include a file called "layout_name.html.php" from the same folder in which the parent files reside
(note: the same rules for template overrides apply to partials).

When using `import()`, a second argument can be supplied to pass additional variables to the included partial. For example:

```php
<?= import('partial', array('var_name' => 'var_value'));
```

This will create a variable in the partial called `$var_name` with a value of `var_value`. In addition, any variables that exist in the
parent layout will be automatically be passed through to the partial.

A partial can also be loaded on its own by placing `&layout=partial` in the query string of url of the page, again, where `partial` is the
name of the partial file.

>Those of you who are familiar with Koowa 1.0 will recognize that "import "has replaced the "@template" template function.

##Helpers

Template Helpers are an incredibly useful tool for creating reusable template code. Joomlatools extensions use them throughout
their respective presentation layers. These helpers can be used for all sorts of things, from rendering form controls, to pagination, to tabs.
The Framework comes packaged with several helpers, including but not limited to:

* Accordion: methods to create an accordion menu
* Behavior: a set of javascript behaviors including, tooltips, overlays, keep alive, validator, autocomplete, sortable and calendar.
* Date: date helper functions, including formatting and humanizing dates (e.g. 1 minute ago).
* Grid: grid table controls, including checkbox, search, enable/disable, order, and access.
* Image: provides a select list of images in a directory and preview functions.
* Listbox: allows you to create a select list or auto-complete from data returned from a model.
* Pagination: pagination and limit controls.
* Select: select list, radio list, checkbox list and boolean list controls.
* Tabs: html & javascript code for creating tab controls.

Helpers are invoked using the `helper` [template function](#template-functions). That function is first passed a string which at first glance looks
like a regular Object Identifier; and then secondly, it can get an optional array of options. That string is actually
the helper's Object Identifier with a method name concatenated to it with a period (.):

    `com://site/example.template.helper.myhelper` + `.` + `mymethod`

To rephrase, everything before the last period in the string is an Object Identifier and after, is a method that is in
that helper object's interface.

This line of code:
```php
<?=  helper('com://site/example.template.helper.myhelper.mymethod', array('of' => 'options'));
```

Looks for the following class, and invokes the `mymethod` method:
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

1. `com_example/template/helper`
2. `libraries/koowa/components/com_koowa/template/helper`
3. `libraries/koowa/library/template/helper`

## Template Functions

There are a number of 'core' template functions that our extensions make use of. We've already introduced `helper` and `import` above.
Template functions let us shorten what can be lengthy object method calls, alias more obscure function names and generally help
keep the layouts clean.

Here are some of the mappings:

`object()` => `$this->getObject()`
`translate()` => `$this->getObject('translator')->translate()'`
`json()` => `json_encode()`
`format()` => `sprintf()`
`replace()` => `strtr()`
`escape()` => `$this->escape()`
`helper()` => `$this->invoke()`
`import()` => `$this->_import()`
`parameters()` => `$this->getParameters()`

When a Joomlatools layout gets compiled the above mappings are applied and the corresponding calls evaluated. What that means
for example is that calling `object()` inside a template layout file is the same as calling `$this->getObject()`.

## Tags

Tags are one more important part of the template dialect that Joomlatools uses. The system finds the `style`, `script`,
`meta`, `links` and `title` tags in a template, filters them out, and adds them to the head document. The `style` and `script` tags
can optionally be given the `data-inline` attribute, which lets them stay exactly where there are in the layout.

Special `ktml` namespace tags (i.e.`<ktml:toolbar></ktml:toolbar>`) also get filtered and replaced with specialized dynamic
output in a similar way that a template helper might. We use the `ktml` namespace to avoid name collisions with other tags.

`<ktml:script src=[url]>` - Render a script tag with specified source url and place that tag in the head.
`<ktml:style src=[url]>`  - Render the appropriate `link` tag, with `href` from the `src`, and add it to the head.
`<ktml:module position=[position]>` - Take the content contained inside the tag, and 'inject' it into the specified module `position`.
`<ktml:toolbar>` - Find the controller toolbar which is currently active and render its output. Often used inside a `<ktml:module>` tag.
`<ktml:content>` - Gets the currently rendered content from the template object. Allows the current layout to `decorate`
that content, and replace it back into the template object.

You may also see special scheme information in the URLs that templates use to load resources. In the above tags that use
a `src` attribute Joomlatools uses another filter to keep them nice and short, but dynamically and accurately specify what
 path the actual file resource is in.

You may see, in DOCman for example, a tag in the form:
  ```javascript
  <ktml:script src="media://com_docman/js/document.js" />
  ```
That `media://` scheme specification, gets replaced with the current URL for the media folder, i.e. `http://joomla.dev/media/`. In
combination with the `ktml:script` tag, the final result gets added to the head in the form:

```javascript
<script type="text/javascript" src="http://joomla.dev/media/com_docman/js/document.js"></script>
```
There also `base://` and `root://` url schemes which load the base url and root url of your application, respectively.

## Summing Up

We've taken a high level look at the Joomlatools template system. With a solid understanding of these fundamental pieces you can
easily gain inside into what's happening in those templates.  You can also customize all of the Joomlatools extensions and
add information that you want to see.



