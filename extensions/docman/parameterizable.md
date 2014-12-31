# Parameters

There are occasions when we would like to store and display additional information about the documents in DOCman.
We take a quick look at how you might add pricing information to a document using a custom field and the `parameters` column of the documents table.

<!-- toc -->

## Solution 

To add information to a document record we use template overrides and the parameters property of the of the document entity. 

>[Template System](framework/template-system.md) has a nice primer on the templates and template overrides in general.

### 1. Create the template overrides

Copy both the **com_docman/views/document/tmpl/document.html.php** and **com_docman/views/document/tmpl/form.html.php** to your template's html folder in a new directory called **/com_docman/document/**.

If you use the protostar template this will look like:  
>templates/protostar/html/com_docman/document/

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
            <input name="parameters[price]" value="<?= $document->getParameters()->price ?>" type=""text""/>
        </div>
    </div>
</div>
<? endif; ?>
```
### 3. Edit the document layout

In you new `document.html.php` file place this code where ever you would like to show the price.
```html
<? if ($document->isParameterizable()  && $price = $document->getParameters()->price): ?>
 <span class=""label""><?= translate('Price'); ?></span>
<span><?= $price ?></span>
<? endif; ?>
```

## Background

The **Parameterizable** is a Nooku database behavior. The class handles the saving and retrieving of non-normalized data (more than one piece of information in a field) for a given format. Parameters can actually be stored in any column. The class takes a `column` configuration option so we can use it for any column we like. We could for example use another column name like `config` or `settings` and the behavior will deal with it the same way.

For a column to be used in this way it needs to have a valid format associated with it, via the column's filter. In the case of our example the parameter column is in JSON format.These formats are available in [/library/object/config/](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/libraries/object/config). 
> **Technical Tip:** Column formats are set in a table object's _initialize method as filters. DOCman's documents table class ( administrator/components/com\_docman/database/table/documents.php)  has the following setting:  
```'filters' => array('parameters'   => array('json'))``

The format specified in the column's filter lets `getParameters()` know what strategy to use to pack and unpack your data. 

When looking to interact with a document's parameters we want to make sure that the "parameterizable" table behavior is present. So we ask first: 

```php
if($document->isParameterizable()) {
     $params =   $document->getParameters();
}
```
This is good practice. It makes sure that the table behavior is present, and if so, makes sure that its ready for us to use with `getParameters();`


## Relevant Resources

### Classes and Methods

+ [KDatabaseBehaviorParameterizable::getParameters()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/database/behavior/parameterizable.php#L68)
+ [KDatabaseRowAbstract::__call()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/database/row/abstract.php#L628)

### Files

+ components/com_docman/view/document/tmpl/document.html.php
+ components/com_docman/view/document/tmpl/form.html.php
+ administrator/components/com_docman/database/table/documents.php

### Reading

[Template System](framework/template-system.md) 