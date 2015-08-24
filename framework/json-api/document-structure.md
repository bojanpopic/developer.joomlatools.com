---
layout: default
title: Document Structure
---

* Table of Content
{:toc}

In accordance with the specification Joomlatools Framework defines a Top Level JSON object for each document. Have a look at an example of the default JSON:

{% highlight json %}
{
    "version": "1.0",
    "links": {
        "self": {
            "href": "http://api.awesomeapi.you/chairs/?id=50&var1=y",
            "type": "application/json; version=1.0"
        }
    },
    "meta": {},
    "entities" : [{
        "id": "50",
        "title": "Arm Chair",
        "description":"This was my grandmother’s armchair",
        "category_id":"5"
    }],
    "linked":{}
}
{% endhighlight %}

The top level properties of any given document give an idea of how to query resources.

## Entries

Joomlatools Framework gives you [BREAD](../../essentials/BREAD.html) out of the box. Since we’re talking about the structure of our JSON documents we are interested in the Browse and Read operations, which are both GET requests.

Internally, the result of these actions are built into either Rowset or a singular Row object, respectively. In terms of the API and the document, a Row can be thought of as a Resource and a Rowset as a Collection of Resources.

The default JSON document response returns an array of entities, even if there is only one as a result of a Read operation.

#### A Resource and Resource Collection

When a client issues a GET request that has some identifying part that limits the result to one record, its considered a Read request in our BREAD paradigm.

In the default document structure, we’ve chosen to use the word “entities” as our key to store a Resource representation in the document, i.e.
{% highlight json %}
"entities":
[{
    "id": "1",
    "uuid": "c87d5566-b29a-4358-b328-463ee036aa2f",
    "title": "Walk the dog",
    "slug": "walk-the-dog",
    "description": "The dog really needs to go for a walk. ",
    "enabled": "1",
    "params": null,
    "links":
    {
        "self":
        {
            "href": "http://joomla.dev/component/tada/todo?slug=walk-the-dog&format=json",
            "type": "application/json; version=1.0"
        }
    }
}]
{% endhighlight %}
Note the array in the "entities" property.

>Did you know that you can use a Table Behaviors to add the created_on and/or created_by to all of
your records?  You just need the created_on or created_by column in the table and the `array(‘behaviors’ => ‘createable’) in your
table class’ \_initialize method.

Similarly, we send a Collection of Resources as JSON array of resource objects on “entities” property of the response document:
{% highlight json %}
"entities":
[{
    "id": "1",
    "uuid": "c87d5566-b29a-4358-b328-463ee036aa2f",
    "title": "Walk the dog",
    "slug": "walk-the-dog",
    "description": "The dog really needs to go for a walk. ",
    "enabled": "1",
    "category_id": "9",
    "params": null,
    "links":
    {
        "self":
        {
            "href": "http://joomla.dev/component/tada/todo?slug=walk-the-dog&format=json",
            "type": "application/json; version=1.0"
        }
    }
},
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
            "href": "http://joomla.dev/component/tada/todo?slug=water-the-lawn&format=json",
            "type": "application/json; version=1.0"
        }
    }
}]
{% endhighlight %}

You may also notice that each entity also has its own "links" property, with the “self” relationship.

## Linked

* http://jsonapi.org/format/#document-structure-compound-documents
* http://jsonapi.org/format/#fetching-includes

In keeping with the specification a “linked” property is included in its default JSON response document. It is meant for you to be able to produce compound documents for your client applications.

If our Todo records were to include a category_id, we may wish to load a list of category resource objects into "linked" property of our response:
{% highlight json %}
"linked": {
    "categories": [{
      "id": "9",
      "name": "dog related"
    }, {
    "id": "15",
      "name": "yard work"

    }]
}
{% endhighlight %}

## Links

The links property in general is used to specify resource relationships for resource objects. In our default implementation we include the “self” relationship which shows the link that this document is in response to and the mime type of the request:

{% highlight json %}
"self": {
    href: "http://joomla.dev/component/tada?view=todos&format=json&limit=2",
    type: "application/json; version=1.0"
}
{% endhighlight %}

When appropriate, we also include “next” and “previous” pagination links in the section in the exact same form.

{% highlight json %}
"next":
{
    href: "http://joomla.dev/component/tada?view=todos&format=json&limit=2&offset=2",
    type: "application/json; version=1.0"
}
{% endhighlight %}

**Remember, this happens automatically! You do not have to do anything.**

You can define how your named entity will render with no problem at all. Just create a JSON view class and define a method with the form ‘_get’ + The name of your entity

States are directly related to request variables and those variables are used to limit results to a set or an individual record.

## Version

This lets you tell your users what version of your api you are serving up.

Its pretty straight forward to change it from our default of “1.0”. Just define a JSON class in your component and set the `version` in your $config variable.
