---
layout: default
title: Custom Parameters
---

* Table of Content
{:toc}

## Goal

There are times when you need to be able to add custom parameters to your documents. This tutorial explains how you can do so.. You will learn how to :

+ add a ‘price’ field to a document form, in the site and administrator
+ display the price information on the frontend, in the document list and details view

![Custom Price Field in DOCman](/resources/images/custom-field-in-document-end-result.png)

## Solution

To add pricing information about documents and then display that information to users you need to create a series of template overrides, and use a special property of the of the document entity called `parameters`.

>The [Framework Template System](/framework/template-system.html) topical guide is a nice primer on templates and template overrides in general.

### 1. Create the template overrides

#### Front-end

You need to create three (3) template overrides for the frontend of your website. There are two files for displaying documents to your users and one file where editing takes place.  

Create a new directory in your template's `/html/` directory called `com_docman`. If you use the protostar template this will look like:

`/templates/protostar/html/com_docman/document/`

Into this new directory copy the **document** detail layouts:

`/components/com_docman/views/document/tmpl/document.html.php` **&#8594;** `/templates/protostar/html/com_docman/document/document.html.php` 

`/components/com_docman/views/document/tmpl/default.html.php` **&#8594;** `/templates/protostar/html/com_docman/document/default.html.php`

Then the **form** layout: 

`/components/com_docman/views/document/tmpl/form.html.php` **&#8594;** `/templates/protostar/html/com_docman/document/form.html.php` 

#### Back-end

You will want to be able to edit pricing information in the backend as well. The overrides work in exactly the same way, but the filenames are slightly different. Let’s assume that you are using the default administrator template, **Isis**. 

In a similar step you just did for the frontend, create a new directory:

`/administrator/templates/isis/html/com_docman/document`
 
Then, copy the **document** form:

`/administrator/components/com_docman/views/document/tmpl/default.html.php` **&#8594;** `/administrator/templates/isis/html/com_docman/document/default.html.php`  

Note: Because the backend of your website is used to edit and configure documents, the `default.html.php` layout contains the html form to edit your document.

### 2. Edit the document form templates

Open both of your new document editing layouts:

`/templates/protostar/html/com_docman/document/form.html.php`
`/administrator/templates/isis/html/com_docman/document/default.html.php`

Then place the following code somewhere inside the `<form>` tag in each file.

{% highlight php %}
<? // Price ?>
<? if ($document->isParameterizable()): ?>
<div class="docman_grid">
    <div class="control-group docman_grid__item one-whole">
        <label class="control-label">
                 <?= translate('Price'); ?>
         </label>
        <div class="controls">
            <input required name="parameters[price]" value="<?= $document->getParameters()->price ?>" type="text"/>
        </div>
    </div>
</div>
<? endif; ?>
{% endhighlight %}

**A note on validation**

Our forms get the validation javascript behavior [helper](/framework/template-system.html#helpers) loaded with a call to `<?= helper('behavior.validation') ?>`. Specifically, in the `form_scripts.html.php` (frontend) and `default.html.php` (backend) layout files.  This means you have enhanced validation for your form inputs. Note that in our example we've added the `required` attribute to the `parameters[price]` field.

Have a look through the [jQuery Validator plugin documentation](http://jqueryvalidation.org/documentation/) for more information. 

### 3. Show Price in your Frontend

Finally, open both your new frontend document display overrides 

`/templates/protostar/html/com_docman/document/document.html.php` 
`/templates/protostar/html/com_docman/document/default.html.php`

Place the following markup wherever you would like to show the price.

{% highlight php %}
<? if ($document->isParameterizable() && isset($document->getParameters()->price)): ?>
 <span class="label">
	<?= translate('Price'); ?>
</span>
<span>
	<?= $document->getParameters()->price ?>
</span>
<? endif; ?>
{% endhighlight %}

## In closing

In this tutorial you learned how you can add custom fields to your documents. You also learned about the `Parameterizable` table behavior and the `getParameters` and `isParameterizable` methods of the `$document` entity object.

### Files

+ components/com_docman/view/document/tmpl/document.html.php
+ components/com_docman/view/document/tmpl/form.html.php
+ administrator/components/com_docman/database/table/documents.php

### Reading

+ [Template System](/framework/template-system.html)
+ <a href="http://jqueryvalidation.org/">jquery.validator.js</a>
