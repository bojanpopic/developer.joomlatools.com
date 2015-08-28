---
layout: default
title: Behaviors
---

Utilizing database behaviors lets us create [Trigger](http://en.wikipedia.org/wiki/Database_trigger) like procedures in our applications, without having to store them with the database. They provide a means to contextually affect change both before and after `select`, `insert`, `update` and `delete` actions performed in the database layer.

By following the [Single Responsibility Principle (SRP)](https://en.wikipedia.org/wiki/Single_responsibility_principle) we can use them in other table objects. Because they are mixins they add methods and functionality to the row level objects.

Available database behaviors:

+ **Creatable** - Strategy for storing information about the creator of a record and the date.
+ **Hittable** - Provides the row object with the interface to increment the  hit count, usually for counting views. Requires column name `hits` and most appropriately of  **int** type.
+ **Identifiable** - Handle storing a [Universal Unique Identifier]() string along with the object when the object is first stored. Requires a **unique** column called `uuid`.
+ **Lockable** - Locking a row record precludes it from being edited by some other user while another user is editing it.  When a row is lockable, it gets all the methods it needs to control that lock. Applicable columns include `locked_by` and `locked_on`.
+ **Modifiable** - Handles the automatic recording of the last user to modifying a record.
+ **Orderable** - Provides all that's required to maintain a database table's  `ordering` column when a row is inserted or updated.
+ [**Parameterizable**](/framework/models/database/behavior/parameterizable.html) - Handles the storing and retrieval of serialized data from a specified column in a table. The default column is `parameters`, but others can be specified. The formats are PHP, INI, JSON, Yaml and XML.
+ **Sluggable** - Builds a unique token string based on column values specified in its configuration. The default column is `title` but others can be added. An example outcome: if a row object has a `title` property set to "Red Dog", the `slug` property will become "red-dog".
