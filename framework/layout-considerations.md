#Layout Considerations

When you look at a Joomlatools component view your are seeing the output of a template. The template system follows the same rules
as the Joomla! CMS does, but does a good deal of extra work to give our templates extra flexibility and power. We discuss some of
the more Joomla!-centric implications here.

Its important that we make a distinction between a `layout` and a `template` with regard to component views. A `layout` in Joomla!
normally references a the entire component level view and will have an `xml` file of the same root file name (everything before the first period '.' in the file name)
associated with it.
This is what lets use choose a `layout` for a menu item. A `layout` is also a `template`, and can have contain other templates. You can
use the following to remember the distinction:

>All Layouts are Templates, but not all Templates are Layouts

It is because of this that you will often see the terms used interchangeably.

##Template Overrides

Template overrides allow you to change how a component's output is rendered without having to modify the original
component layout files. The main benefit of this is that component upgrades won't overwrite your modified files.

If you're familiar with the Joomla! template override system. The template engine is similar to that of Joomla!, but turbo
charged! All Joomlatools templates can be overridden from within the active application template, and follow the same folder
structure as standard Joomla! template overrides.

In order to override a component view layout, you must create a few folders and a PHP file within the active application template folder.

The folder structure is as follows:

	/templates
		-> template_name
			-> html
				-> com_component_name
					-> view_name
						-> layout_name.php

* **template_name** - this is the name of the active system template
* **html** - all template overrides go in an "html" folder
* **com_component_name** - this is the name of the component, e.g. com_docman, com_fileman, etc
* **view_name** - the name name of the view whose template is being overridden
* **layout_name** - the specific layout being overridden, e.g. default.php, form.php

An example override might be `/templates/beez/html/com_docman/documents/list.html.php`, which overrides the `list` layout, in
the `documents` view, in the `com_docman` component for pages using the `Beez` template. That file's existence tells the
system that you want to use it, as opposed to the original file `components/com_docman/views/documents/tmpl/list.html.php`.
This allows you to modify the output of a Joomlatools component without changing the core files.

## Additional Layouts and Alternative Menu Items

In some situations you may want to keep the current core layout available, but would like to render a very similar layout
for a special purpose. Maybe you want a differently formatted list of items, or maybe you want some other piece of information
 from your site that's related to the current item being shown. Whatever the reason, we need to take a slightly different approach
 to that of the Template Override. Don't worry its very similar and is straight forward with Joomla! 2.5+ .

Once you have identified the layout that you want to augment, copy it to the same folder that you would have for a template
override **BUT** under a different name, i.e. `customlist.html.php`. This will let you load your new layout for a given item, just by adding
`layout=custom` to the URL of the page.

If you would like to have your new layout available as a menu item, that is straight forward as well. In similar way, copy the original
layout xml  file from the component view's layout director to the same override directory, and rename it to match your new layout name, but with the `.xml` instead of `.php` and no `html` part, i.e. `customlist.xml`.

![Custom Alternative Layout in Joomla](/resources/images/alternative-menu-item-layout-xml.png "Alternative List Menu Item")

After that, just open that file and edit the `title` attribute in the `<layout>` tag and make sure its unique compared with all the other layouts for
that view, like perhaps:

 ```xml
 <layout title="Custom List">
 		<message>
 			<![CDATA[COM_DOCMAN_VIEW_LIST_DESCRIPTION]]>
 		</message>
 	</layout>
 ```

With that, you should see something similar to this when you're creating a new menu item:

![Custom Alternative Layout Select in Joomla](/resources/images/joomla-alternative-menu-item-layout-select.png "Alternative List Menu Item Select")