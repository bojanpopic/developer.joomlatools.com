---
layout: default
title: Icon Sizes
---

* Table of Content
{:toc}

## Introduction

DOCman comes with a couple of different icon sizes used on the frontend. When you want a size other than the default you can use a little CSS to make the change. 

We expect you to have a good understanding of the following for this article:

* CSS knowledge
* Browser / web inspector knowledge

## Change all icons at once

The easiest way to change the sizes for all the "joomlatools icons" on the whole site at once is by using a CSS override. The most proper way of changing the icon sizes is by adding the following snippet of CSS to [your custom CSS file](/framework/custom-css.html).

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

This will change all the icon sizes on the whole website for both the DOCman components and modules and the FILEman components from whatever size they are to 32x32 pixels.

## On a component / module Level

You might not want to change all the icons though. To exercise a bit more control you could change the above CSS in something like the following:

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

This code will only change all the icons within the DOCman component. The DOCman module will still have the smaller icons. If you want to have slightly larger icons in the module you could add the following snippet below the last one:

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

That style rule will make all the icons in all DOCman modules 24x24 pixels.

## Drilling down

For the sake of illustration lets say you wanted to "drill down" to change only the size within the DOCman filtered table view. You could do that like this: 

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

So how can you find out what CSS class you need? In the above examples you can see we only changed the middle part. Respectively, we added `".com_docman"`, `".mod_docman"` and finally `".docman_table_layout--filtered_table"`. You can find these class names by using a browser inspector.

By inspecting the page elements you can see that we are adding a `<div class="koowa">` with either an extra `"com_docman"` or `"mod_docman"` class around all our views. The child of this container will contain the name of the view. For example, on the default hierarchical view the class name of that inner `<div>` would be: `"docman_list_layout--default"`. And would would look like this:

{% highlight html %}
<div class="koowa com_docman">
  <div class="docman_list_layout docman_list_layout--default">
    …
  </div>
</div>
{% endhighlight %}

As you can see; you can target exactly what you want. A few useful examples would be:


+ The whole extension: `.com_docman`

+ All table layouts: `.docman_table_layout`

+ Filtered table view: `.docman_table_layout--filtered_table`

+ Only headers in Lists: `.docman_list_layout--default .koowa_header`

The rest of the CSS will always be the same. Only the new rules you make will affect any change.

{% highlight css %}
body .koowa.koowa [your class(es)] .koowa_header__image,
body .koowa.koowa [your class(es)] [class^="koowa_icon--"],
body .koowa.koowa [your class(es)] [class*=" koowa_icon--"],
body .koowa.koowa [your class(es)] [class^="koowa_icon--"]:before,
body .koowa.koowa [your class(es)] [class*=" koowa_icon--"]:before { }
{% endhighlight %}

### A little explanation on this:

- `body .koowa.koowa` targets all elements with the `koowa` class within the `body` element. This will make sure only icons in our views get targeted. The reason we added `body` and added `koowa` twice is to make sure we get a higher specification without the need to use "!important" even if the custom CSS file gets loaded first. 
- `[your class(es)]` is the one you need. Leaving this out will change all icons for all our extensions on all views.
- `.koowa_header__image` looks for elements that have the `koowa_header__image` class making sure that custom images get scaled as well.
- `[class^="koowa_icon--"]` looks for elements that start with the `koowa_icon--` class.
- `[class*=" koowa_icon--"]` looks for elements that contains the ` koowa_icon--` class starting with a space.
- Both classes with `:before` are needed because the actual icon is placed in this pseudo selector.

### Why so much code?

The reason the code is so explicit is because we need to make sure things look as good as possible on all the different templates out there. To support that, we are using a "better safe then sorry" approach and that means you also need to override all classes.