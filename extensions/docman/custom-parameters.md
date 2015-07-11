---
layout: default
title: Custom Parameters
---

* Table of Content
{:toc}

## Goal

There are times when you need to be able to store and display additional information about for your documents. This tutorial explains how you can custom fields to a document. You will:

+ add a ‘price’ field to a document form, in the site and administrator
+ display the price information on the frontend, in the document list and details view


<!-- toc -->

## Solution

To add pricing information about documents and then display that information to users you need to create a series of template overrides, and use a special property of the of the document entity called `parameters`.

>The [Framework Template System](../framework/template-system.md) topical guide is a nice primer on templates and template overrides in general.

> There is also deeper background about using custom columns in your own components available in the [Framework Parameterizable](../framework/database-behavior-parameterizable.md) guide.

### 1. Create the template overrides

#### **Front-end**

You need to create three (3) template overrides for the frontend of your website. There are two files for displaying documents to your users and one file where editing takes place.  

Create a new folder in your template's `/html/` folder called `com_docman`. If you use the protostar template this will look like:

>`/templates/protostar/html/com_docman/document/`

Into this new folder copy the **document** detail layouts:
>`/components/com_docman/views/document/tmpl/document.html.php` **&#8594;** `/templates/protostar/html/com_docman/document/document.html.php` 
>`/components/com_docman/views/document/tmpl/default.html.php` **&#8594;** `/templates/protostar/html/com_docman/document/default.html.php`

Then the **form** layout: 
>`/components/com_docman/views/document/tmpl/form.html.php` **&#8594;** `/templates/protostar/html/com_docman/document/form.html.php` 

####**Back-end**

You will want to be able to edit pricing information in the backend as well. The overrides work in exactly the same way, but the filenames are slightly different. Let’s assume that you are using the default administrator template, **Isis**. 

In a similar step you just did for the frontend, create a new folder:

>`/administrator/templates/isis/html/com_docman/document`
 
Then, copy the **document** form:

> `/administrator/components/com_docman/views/document/tmpl/default.html.php` **&#8594;** `/administrator/templates/isis/html/com_docman/document/default.html.php`  


Because the backend of your website is used to edit and configure documents, the `default.html.php` layout is a form.

### 2. Edit the document form templates

Open both of your new document editing layouts:

>`/templates/protostar/html/com_docman/document/form.html.php`
>`/administrator/templates/isis/html/com_docman/document/default.html.php`

Then place the following code somewhere inside the `<form>` tag in each file.

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

Our forms get the validation javascript behavior [helper](/framework./template-system.md#helpers) loaded with a call to `<?= helper('behavior.validation') ?>`. Specifically, in the `form_scripts.html.php` (frontend) and `default.html.php` (backend) layout files.  This means you have enhanced validation for your form inputs. Note that in our example we've added the `required` attribute to the `parameters[price]` field.

> Have a look through the [jQuery Validator plugin documentation](http://jqueryvalidation.org/documentation/) for more information. 

### 3. Show **Price** in your Frontend

Finally, open both your new frontend document display overrides 

>`/templates/protostar/html/com_docman/document/document.html.php` 
>`/templates/protostar/html/com_docman/document/default.html.php`

Place the following markup wherever you would like to show the price.

```html
<? if ($document->isParameterizable()  && $price = $document->getParameters()->price): ?>
 <span class="label">
	<?= translate('Price'); ?>
</span>
<span>
	<?= $price ?>
</span>
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
