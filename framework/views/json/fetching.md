---
layout: default
title: Fetching Resources
---

* Table of Content
{:toc}

This section provides a little guidance on how to query the JSON API.

## Filtering

We use the model’s state in building our queries. By default these states are directly connected to the request variables received by the application. As such, any state variables that you write into your Model and account for in your query strategy, will be reflected in your API.

If your database table has UNIQUE columns, they automatically get added to your model’s state!
Checkout KModelBehaviorIndexable. This behavior gets added to every class that is an instance of KModelDatabase.
This is why we can use id=1 without having to write a model at all.

To illustrate filtering, let’s assume that we’ve created ComTadaModelTodos and added category_id as a state in our class, and account for it in our query building strategy (_buildQueryWhere):

{% highlight php %}
<?php
class ComTadaModelTodos extends KModelDatabase
{
    public function __construct(KObjectConfig $config)
    {
        parent::__construct($config);
        $this->getState()->insert(‘category_id’, ‘init’);
    }
    protected function _buildQueryWhere(KDatabaseQueryInterface $query)
    {
        if($this->getState()->category_id){
            $query->where('tbl.category_id = ' . $this->getState()->category_id);
        }
        parent::_buildQueryWhere($query)
    }
}
{% endhighlight %}

Now, a request to the API that has a category_id set will yield only those results:

{% highlight json %}
{
    "id": "2",
    "uuid": "6631d2b4-8b78-4e70-ab0e-d1db2d1e4dd1",
    "title": "Water the Lawn",
    "slug": "water-the-lawn",
    "description": "My grass is so dry, we need more rain. ",
    "enabled": "1",
    "category_id": "15",
    "params": null,
    "links":
    {
        "self":
        {
            "href": "http://joomla.box/component/tada/todo?slug=water-the-lawn&format=json",
            "type": "application/json; version=1.0"
        }
    }
}
{% endhighlight %}

## Pagination

In keeping with good API design, additional pagination information is provided. The limit, offset, & total are sent along with the response document as part of the meta property in the top level object.

{% highlight json %}
"offset": 0,
"limit": 2,
"total": 7,
{% endhighlight %}

The **limit** variable is included as a state variable by default in the model objects. It tells the query building part of the model what the LIMIT on the query should be.
The **offset** is an integer multiple of the limit and represents the first record in that corresponding page. In our example, if the limit is 2 and we want to see the third page of results our offset would be **page - 1** multiplied by the **limit** which equals 4, then the offset should be 4.

The **total** is a count of all the records available in the data that fit the current request vars without the limit applied to them.

## Sorting

Sorting results is a snap. Like the “Indexable” behavior above, each model derived from KModelDatabase gets a sortable behavior added to it. That means with no effort, two state variables get added to your models:

The `sort` variable gives us the column by which to sort our results.
The `direction` is either the familiar `asc` for ascending (which is the default) and `desc` for descending. In combination, they get used in the Model to build the `order by` part of your query. A request in our example with `&sort=category_id&direction=desc` will produce a query against database that has the following:

{% highlight mysql %}
    ORDER BY tbl.category_id DESC
{% endhighlight %}

## Sparse Fieldset

### Limit the columns you want to return

You can ask for partial results with no extra work. Just add the fields request variable to your request with a comma separated list of fields that correspond to the columns you want to see in your entities.

A request to `http://joomla.box/component/tada?view=todo&format=json&id=1&fields=id,title,description` yields only the columns we ask for in the returned entity:

{% highlight json %}
{
    "id": "1",
    "title": "Walk the dog",
    "description: "The dog really needs to go for a walk.",
    "links":
    {
        "self":
        {
            "href": "http://joomla.box/component/tada/todo/1?slug=walk-the-dog&format=json",
            "type": "application/json; version=1.0"
        }
    }
}
{% endhighlight %}