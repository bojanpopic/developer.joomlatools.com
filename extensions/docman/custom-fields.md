---
layout: default
title: Custom Fields
---

* Table of Content
{:toc}

Want to add custom parameters to your documents? This tutorial explains how you can:

* Add a ‘price’ field to a document form (front-end and back-end)
* Display the price field on your website (document list and details view)

![Custom Price Field in DOCman](/resources/images/custom-field-in-document-end-result.png)

<span class="note">
**Note**: The [Framework Template System](/framework/templates.html) guide is a nice primer on templates and template overrides in general.
</span>

## Create template overrides

To add pricing information about documents you need to create a series of template overrides.

### Front-end

You need to create three template overrides for the frontend of your website:

* Two for displaying documents to your users
* One file where editing takes place

Create a new directory in your template's `/html/` directory called `com_docman`:

    /templates/[template]/html/com_docman/document/

Copy the following files into this new directory:

* `/components/com_docman/views/document/tmpl/document.html.php`
* `/components/com_docman/views/document/tmpl/default.html.php`
* `/components/com_docman/views/document/tmpl/form.html.php`

### Back-end

You will want to be able to edit pricing information in the back-end as well. Assuming that you are using the default administrator template, **Isis**.

Create a new directory in your template's `/html/` directory called `com_docman`:

    /administrator/templates/isis/html/com_docman/document
 
Copy the following file into this new directory:

    /administrator/components/com_docman/views/document/tmpl/default.html.php

<span class="note">
**Note**: Because the backend of your website is used to edit and configure documents, the `default.html.php` layout contains the HTML form to edit your document.
</span>

## Edit form layouts

By using the `parameters` property of the document entity we can store the price information.

Open both of your new document editing layouts:

* `/templates/protostar/html/com_docman/document/form.html.php
* `/administrator/templates/isis/html/com_docman/document/default.html.php`

Then place the following code somewhere inside the `<form>` tag in each file:

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

### Form validation

Our forms get the validation Javascript behavior helper loaded with a call to:

    <?= helper('behavior.validation') ?>

This means you have enhanced validation abilities for the input field. In our example the `required` attribute has been added to the `parameters[price]` field.

Have a look through the [jQuery Validator plugin documentation](http://jqueryvalidation.org/documentation/) for more information.

## Show price information

Open both your new front-end document display overrides:

* `/templates/[template]/html/com_docman/document/document.html.php`
* `/templates/[template]/html/com_docman/document/default.html.php`

Place the following markup wherever you would like to show the price:

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
