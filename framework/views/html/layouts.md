---
layout: default
title: Layouts
---

* Table of Content
{:toc}

In some situations you may want to keep the current core layout available, but would like to render a very similar layout
for a special purpose. Maybe you want a differently formatted list of items, or maybe you want some other piece of information
 from your site that's related to the current item being shown. Whatever the reason, we need to take a slightly different approach
 to that of the Template Override.

 **Don't worry;** Its very similar and is straight forward with Joomla 2.5+ .

Once you have identified the layout that you want to augment, copy it to the same directory that you would have for a template
override **BUT** under a different name, i.e. `customlist.html.php`. This will let you load your new layout for a given item, just by adding
`layout=custom` to the URL of the page.

## Alternative Menu Items

If you would like to have your new layout available as a menu item, that is straight forward as well. In similar way, copy the original
layout xml file from the component view's layout director to the same override directory, and rename it to match your new layout name,
but with the `.xml` instead of `.php` and no `html` part, i.e. `customlist.xml`.

![Custom Alternative Layout in Joomla](/resources/images/alternative-menu-item-layout-xml.png "Alternative List Menu Item")

After that, just open that file and edit the `title` attribute in the `<layout>` tag and make sure its unique compared with all the other layouts for
that view, like perhaps:

{% highlight xml %}
<layout title="Custom List">
	<message>
		<![CDATA[COM_DOCMAN_VIEW_LIST_DESCRIPTION]]>
	</message>
</layout>
{% endhighlight %}

With that, you should see something similar to this when you're creating a new menu item:

![Custom Alternative Layout Select in Joomla](/resources/images/joomla-alternative-menu-item-layout-select.png "Alternative List Menu Item Select")