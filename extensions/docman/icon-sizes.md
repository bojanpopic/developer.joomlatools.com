---
layout: default
title: Icon Sizes
---

* Table of Content
{:toc}

DOCman comes with a couple of different icon sizes used on the frontend. When you want a size other than the default you can use CSS to make the change.

We expect you to have a good understanding of CSS for this article.

## Change all icons at once

Add the following snippet to [your custom CSS file](/framework/views/html/stylesheets.html) to change the icons to 32x32 pixels for both the DOCman component and modules and the FILEman component:

{% highlight css %}
body .koowa.koowa .koowa_header__image,
body .koowa.koowa [class^="koowa_icon--"],
body .koowa.koowa [class*=" koowa_icon--"],
body .koowa.koowa [class^="koowa_icon--"]:before,
body .koowa.koowa [class*=" koowa_icon--"]:before {
    width: 32px;
    height: 32px;
    font-size: 32px;
    line-height: 32px;
    max-width: 32px;
    max-height: 32px;
}
{% endhighlight %}

## Specific component

The following snippet will only change the icons within the DOCman component:

{% highlight css %}
body .koowa.koowa .com_docman .koowa_header__image,
body .koowa.koowa .com_docman [class^="koowa_icon--"],
body .koowa.koowa .com_docman [class*=" koowa_icon--"],
body .koowa.koowa .com_docman [class^="koowa_icon--"]:before,
body .koowa.koowa .com_docman [class*=" koowa_icon--"]:before {
    width: 32px;
    height: 32px;
    font-size: 32px;
    line-height: 32px;
    max-width: 32px;
    max-height: 32px;
}
{% endhighlight %}

## Specific module

The following snippet will only change the icons within the DOCman module:

{% highlight css %}
body .koowa.koowa .mod_docman .koowa_header__image,
body .koowa.koowa .mod_docman [class^="koowa_icon--"],
body .koowa.koowa .mod_docman [class*=" koowa_icon--"],
body .koowa.koowa .mod_docman [class^="koowa_icon--"]:before,
body .koowa.koowa .mod_docman [class*=" koowa_icon--"]:before {
    width: 24px;
    height: 24px;
    font-size: 24px;
    line-height: 24px;
    max-width: 24px;
    max-height: 24px;
}
{% endhighlight %}

## Specific view

The following snippet will only change all the icons within the DOCman filtered table view:

{% highlight css %}
body .koowa.koowa .docman_table_layout--filtered_table .koowa_header__image,
body .koowa.koowa .docman_table_layout--filtered_table [class^="koowa_icon--"],
body .koowa.koowa .docman_table_layout--filtered_table [class*=" koowa_icon--"],
body .koowa.koowa .docman_table_layout--filtered_table [class^="koowa_icon--"]:before,
body .koowa.koowa .docman_table_layout--filtered_table [class*=" koowa_icon--"]:before {
    width: 32px;
    height: 32px;
    font-size: 32px;
    line-height: 32px;
    max-width: 32px;
    max-height: 32px;
}
{% endhighlight %}

## Find your class name

So how can you find out what CSS class you need? In the above examples you can see we only changed the middle part. Respectively, we added:

* `.com_docman`
* `.mod_docman`
* `.docman_table_layout--filtered_table`

You can find these class names by using the web inspector for your browser.

By inspecting the page elements you can see that we are adding a `<div class="koowa">` with either an extra `com_docman` or `mod_docman` class. The child of this container will contain the name of the view.

For example, on the default hierarchical view the class name of that inner `<div>` would be: `docman_list_layout--default`. And would would look like this:

{% highlight html %}
<div class="koowa com_docman">
  <div class="docman_list_layout docman_list_layout--default">
    …
  </div>
</div>
{% endhighlight %}

Some examples:

* The whole extension: `.com_docman`
* All table layouts: `.docman_table_layout`
* Filtered table view: `.docman_table_layout--filtered_table`
* Only headers in Lists: `.docman_list_layout--default .koowa_header`

The rest of the CSS will always be the same. Only the new rules you make will affect any change.

{% highlight css %}
body .koowa.koowa [specific classes] .koowa_header__image,
body .koowa.koowa [specific classes] [class^="koowa_icon--"],
body .koowa.koowa [specific classes] [class*=" koowa_icon--"],
body .koowa.koowa [specific classes] [class^="koowa_icon--"]:before,
body .koowa.koowa [specific classes] [class*=" koowa_icon--"]:before { }
{% endhighlight %}

### Naming convention

- `body .koowa.koowa` targets all elements with the `koowa` class within the `body` element. This will make sure only icons in our views get targeted. The reason we added `body` and added `koowa` twice is to make sure we get a higher specification without the need to use `!important` even if the custom CSS file gets loaded first.
- `[specific classes]` is the one you need. Leaving this out will change all icons for all our extensions on all views.
- `.koowa_header__image` looks for elements that have the `koowa_header__image` class making sure that custom images get scaled as well.
- `[class^="koowa_icon--"]` looks for elements that start with the `koowa_icon--` class.
- `[class*=" koowa_icon--"]` looks for elements that contains the `koowa_icon--` class starting with a space.
- Both classes with `:before` are needed because the actual icon is placed in this pseudo selector.

## Why so much code?

The code is so explicit to make sure our extensions look great in any Joomla template. Using a "better safe then sorry" approach means you need to override all classes.