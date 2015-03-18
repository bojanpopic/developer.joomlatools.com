# Parameters

There are occasions when we would like to store and display additional information about the documents in DOCman.

We take a quick look at how you might add pricing information to a document using a custom field and the `parameters` column of the documents table.

<!-- toc -->

## Solution

To add information to a document record we use template overrides and the parameters property of the of the document entity.

>The [Framework Template System](../framework/template-system.md) topical guide is a nice primer on templates and template overrides in general.

> There is also deeper background about using custom columns in your own components available in the [Framework Parameterizable](../framework/database-behavior-parameterizable.md) guide.

### 1. Create the template overrides

Copy both the **com_docman/views/document/tmpl/document.html.php** and **com_docman/views/document/tmpl/form.html.php** to your template's html folder in a new directory called **/com_docman/document/**.

If you use the protostar template this will look like:
>/templates/protostar/html/com_docman/document/

### 2. Edit the document form

In your new `form.html.php` file simply place the following somewhere inside the `<form>` tag.
```html
<? // Price ?>
<? if ($document->isParameterizable()): ?>
<div class="docman_grid">
    <div class="control-group docman_grid__item one-whole">
        <label class="control-label">
                 <?= translate('Price'); ?>
         </label>
        <div class=""controls"">
            <input required name="parameters[price]" value="<?= $document->getParameters()->price ?>" type="text"/>
        </div>
    </div>
</div>
<? endif; ?>
```
**A note on validation**

Our form already gets the validation javascript behavior loaded with a call to `<?= helper('behavior.validation') ?>` in the `form_scripts.html.php` layout file.  This means you have enhanced validation for your form inputs. Note that in our example we've added the `required` attribute to the `parameters[price]` field.

### 3. Edit the document layout

In you new `document.html.php` file place this code where ever you would like to show the price.
```html
<? if ($document->isParameterizable()  && $price = $document->getParameters()->price): ?>
 <span class=""label""><?= translate('Price'); ?></span>
<span><?= $price ?></span>
<? endif; ?>
```

## Relevant Resources

### Background

[Parameterizable](framework/database-behavior-parameterizable.md)

Major concepts and classes in the functioning of the Parameterizable database behavior.

### Classes and Methods

+ [KDatabaseBehaviorParameterizable::getParameters()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/database/behavior/parameterizable.php#L68)
+ [KDatabaseRowAbstract::__call()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/database/row/abstract.php#L628)

### Files

+ components/com_docman/view/document/tmpl/document.html.php
+ components/com_docman/view/document/tmpl/form.html.php
+ administrator/components/com_docman/database/table/documents.php

### Reading

+ [Template System](../framework/template-system.md)
+ [Parameterizable Database Behavior](../framework/database-behavior-parameterizable.md)
+ <a href="http://jqueryvalidation.org/"  target="_blank">jquery.validator.js</a>
