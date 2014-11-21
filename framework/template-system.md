# Template System

Joomlatools extension templates expose unparalleled flexibility and power. What follows is a high level overview of the structures
we use so that you can better understand what's happening in each layout.
<a name="example-template"></a>
To start lets consider the following example component view template, named `default.html.php`:

```html
<?= helper('behavior.koowa'); ?>
<div id="example-template">
<h1><?= translate('Example Title') ?></h1>
<div class="control">
    <?= helper('listbox.category_id', array(
        'identifier'=>'com://site/example.model.examples',
        'id' => 'category_select'
    )) ?>
</div>
    <?= import('default_list.html', array(
        'title' => translate('This is my list')
        )) ?>
</div>
<ktml:script src="media://com_example/js/example.js" />
<style>
 .control select option:selected { color: red }
</style>
```

>This file gets loaded following the same rules as regular Joomla layouts. Get some more details
 in [Layout Considerations](layout-considerations.md)

This is not a great deal of code, but there is a lot going on. In this template we are making use of [Functions](#functions),
[Helpers](#helpers), [Special Tags](#tags) and [Partials](#partials). Joomlatools components use all of
these to keep our templates compact, segmented and thus reusable.

## Partials

Partials are a great way of separating layouts into manageable chunks. They are just template files, that can be loaded on
their own, or included within another layout. We do this with the `import` template function. You saw an example of this above
with the line that looks like:

```php
<?= import('default_list.html'); ?>
```
**Note:** `<?=` is short for `<?php echo`, which gets replaced when the template is compiled.

The `default_list.html` in this case is the name of the template file itself without the `php` file extension. The above
method will attempt include a file called "default_name.html.php" from the same folder in which the parent files reside

> The template system also applies [Template Overrides](layout-considerations.md) apply to partials.

When using `import()`, a second argument can be supplied to pass additional variables to the included partial. For example:

```php
<?= import('default_list.html', array(
        'title' => translate('This is my list')
        )) ?>
```

This will create a variable in the partial called `$title` with a value of `This is my list`. In addition, any variables that exist in the
parent layout will be automatically be passed through to the partial.

A partial can also be loaded on its own by placing `&layout=default_list` in the query string of url of the page. The system
assumes loads the `default.html.php` file because the implied format is `html` when looking at the page.


## Helpers

Template Helpers are an incredibly useful tool for creating reusable template code. Joomlatools extensions use them throughout
their respective presentation layers. These helpers can be used for all sorts of things, loading a javascript library, rendering form controls,
rendering pagination or the needed structure for tabs.
The Framework comes packaged with several helpers, including but not limited to:

* **Accordion**:    methods to create an accordion menu
* **Behavior**:     a set of javascript behaviors including, tooltips, overlays, keep alive, validator, autocomplete, sortable and calendar.
* **Date**:         date helper functions, including formatting and humanizing dates (e.g. 1 minute ago).
* **Grid**:         grid table controls, including checkbox, search, enable/disable, order, and access.
* **Image**:        provides a select list of images in a directory and preview functions.
* **Listbox**:      allows you to create a select list or auto-complete from data returned from a model.
* **Pagination**:   pagination and limit controls.
* **Select**:       select list, radio list, checkbox list and boolean list controls.
* **Tabs**:         html & javascript code for creating tab controls.

Helpers are invoked using the `helper` [template function](#functions). That function is first passed a string
which at first glance looks like a regular Object Identifier; and then secondly, it can get an optional array of options. That
string is actually the helper's Object Identifier with a method name concatenated to it with a period (.):

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

In our [example template](#example-template) in the introduction you saw us use this line of code in our example:
```php
<?= helper('listbox.category_id', array(
        'identifier'=>'com://site/example.model.examples',
        'id' => 'category_select'
    )) ?>
```
That call looks for the `listbox` helper and tries to invoke the `category_id` method of its interface. If there is not
a `com_example/template/helper/listbox.php` the system will load `libraries/koowa/components/com_koowa/template/helper/listbox.php`
instead and then pass along the array of configuration options to the method.


## Functions

There are a number of 'core' template functions that our extensions make use of. We've already introduced `helper` and `import` above.
Template functions let us shorten what can be lengthy object method calls, alias more obscure function names and generally help
keep the layouts clean.

Here are some of the mappings:


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


When a Joomlatools layout gets compiled the above mappings are applied and the corresponding calls evaluated. What that means
for example is that calling `object()` inside a template layout file is the same as calling `KObject::getObject()`.

## Tags

Tags are one more important part of the template dialect that Joomlatools uses. The system finds the `style`, `script`,
`meta`, `links` and `title` tags in a template, filters them out, and adds them to the head document. The `style` and `script` tags
can optionally be given the `data-inline` attribute, which lets them stay exactly where there are in the layout.

Special `ktml` namespace tags (i.e.`<ktml:toolbar></ktml:toolbar>`) also get filtered and replaced with specialized dynamic
output in a similar way that a template helper might. We use the `ktml` namespace to avoid name collisions with other tags.

* `<ktml:script src=[url]>` - Render a script tag with specified source url and place that tag in the head.
* `<ktml:style src=[url]>`  - Render the appropriate `link` tag, with `href` from the `src`, and add it to the head.
* `<ktml:module position=[position]>` - Take the content contained inside the tag, and **inject** it into the specified module `position`.
* `<ktml:toolbar>` - Find the controller toolbar which is currently active and render its output. Often used inside a `<ktml:module>` tag.
* `<ktml:content>` - Gets the currently rendered content from the template object. Allows the current layout to `decorate` that content,
and replace it back into the template object.

You may also see special scheme information in the URLs that templates use to load resources. For URLs in a layout that follow this form,
Joomlatools has access to another filter that replaces them with the appropriate `http://` scheme and the relevant domain and path information
for that resource.

Above, we used the following to get a javascript file into the head of the page.
  ```javascript
  <ktml:script src="media://com_example/js/example.js" />
  ```

That `media://` scheme specification, gets replaced with the current URL for the media folder, i.e. `http://joomla.dev/media/`. In
combination with the `ktml:script` tag, the final result gets added to the head in the form:

```javascript
<script type="text/javascript" src="http://joomla.dev/media/com_example/js/example.js"></script>
```
There also `base://` and `root://` url schemes which load the base url and root url of your application, respectively.

## Summing Up

We've taken a high level look at the Joomlatools template system. With a solid understanding of these fundamental pieces you can
easily gain insight into what's happening in those templates.  You can also customize all of the Joomlatools extensions and
add information that you want to see.



