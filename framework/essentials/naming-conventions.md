---
layout: default
title: Naming Conventions
---

* Table of Content
{:toc}

The framework relies heavily on the placement of class files and naming of classes and tables. There are some specific naming conventions that the framework uses for its default "magic" implementation.

The Object Manager in combination with the Class Locator packages helps locate and load the appropriate files that
your application is trying to use.

### Library Classes

Classes in the framework (located in koowa/libraries/) follow a very simple naming convention. They are the camelcase of each part of their directory path with the file name appended to the end:

* `KControllerModel` : koowa/libraries/controller/model.php
* `KViewHtml` : koowa/libraries/view/html.php

There is one exception, a file can go into a subdirectory as long as it has the exact same name with the directory:

* `KCommandChain` : koowa/libraries/command/chain/chain.php

### Components

Components are currently located in three places:

* administrator/components
* site/components
* libraries/koowa/components

<span class="note">
**Note**: Components in libraries/koowa/components directory are non-dispatchable and serve as a building block for extensions.
</span>

Class names for Components are very similar to Library classes in how they relate to the above directories, but always take the `Com` prefix.
Depending on which domain or application you are working in the `Com` part will be interpreted as your components directory.

For example:

* `ComFooControllerBar` : site/components/com_foo/controller/bar.php
* `ComFooModelBars` : site/components/com_foo/model/bars.php

#### Controllers

Controllers are always singular, this is due in part to the fact that the [BREAD](/framework/digging-deeper.html#bread) actions (more on that later) refer to a
single resource type, eg, an article, or a post.

Your `controller` classes go in the `controller` directory of your component:

* `ComFooControllerBar` : site/components/com_foo/controller/bar.php

#### Models

For the magic to work `model` names are always plural.

Your `model` classes go in the `model` directory of your component:

* `ComFooModelBars` : com_foo/model/bars.php

#### Views

The View naming conventions are slightly different in how the Class names are constructed in relation and how the files are named and names
of the views themselves.

First though, let's summarize their major characteristics:

* Singular or plural depending upon the view being requested.
* Singular item views require the model state to be unique.
* Plural views refer to multiple items, and may be filtered by states defined in the model.
* Generally map to a database table
* Either return multiple rows or a single row (The "Browse" and the "Read" in [BREAD](/framework/digging-deeper.html#bread)).
* Have several possible format types: HTML, JSON, CSV, RSS.

Your component views go into their own directory in the `views` directory. The file names of the actual view classes correspond directly to the
format they are meant to represent. Also, singular and plural views (and their directories) are separated and named accordingly, so if we keep running with our current `com_foo` example:

* `com_foo/views/bars/html.php` : list view (plural)
* `com_foo/views/bar/html.php` : item view (singular)

If we wanted to specify our own `json` for `bars` we would do so as follows:

* `com_foo/views/bars/json.php`

In our other Component parts, the file name and object name match up. In the case of a view, the object name matches its directory.

This is what allows your component to have different format representations.

#### Underscores in File Names

You can use underscores in the file name as well. The framework treats them exactly the same as a lowercase letter:

* `ComFooModelBaz_bars` : site/components/com_foo/model/baz_bars.php

### Databases

The database table naming conventions are also a central piece. Using them properly frees you from the need
to write code related to models or tables if you are doing nothing out of the ordinary.

#### Table name

The table name convention is quite simple:

	#__component_view

Where `#__` is replaced with your already defined ```JConfig::$dbprefix```.

Following our com_foo example:

* \#__foo_bars
* \#__foo_documents
* \#__foo_cars
* \#__foo_baz_bars

#### Primary key

There is a related convention for the primary keys for your tables as well:

	component_view_id

Following our com_foo example:

* foo_bar_id
* foo_document_id
* foo_car_id
* foo_baz_bar_id

<span class="note">
**Note**: The framework will automatically translate the primary key into a property of the name `id`. You can just refer to it as `$object->id`.
When data is requested by the model from the database, data will be returned as an entity object.
</span>

#### KModelEntityRow

This is a single object that represents an instance of a row from the database. Entities can be saved or deleted and hold
the data from the database internally. Columns are accessible as if they were public variables. The name of the entity
within the view will be the name of the singular view by default.

#### KModelEntityRowset

This is a collection of entities from the database. You can iterate through the object for specific entities.

	$rowset->find($id);

The name of rowset within the view will be the name of the plural view.