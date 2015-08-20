---
layout: default
title: Document Structure
---

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

We include 5 properties in this level and in accordance with the specification:

* [Entities](document-structure/entities.html)
* [Linked](document-structure/linked.html)
* [Links](document-structure/links.html)
* [Version](document-structure/version.html)