---
layout: default
title: Bootstrap CSS
---

* Table of Content
{:toc}

Some Joomla 2.5 templates are shipped with [Bootstrap](http://getbootstrap.com/). There are also Joomla 3 templates that are designed to work without Bootstrap. For these templates we built a switch to either disable or enable the Bootstrap that is shipped with our extensions.

<span class="note">
**Note**: Only available for our 2.0 stable extensions.
</span>

## Do I need this?

You almost never do. We developed our extensions in a way that they look great within 99.9% of all templates.

This switch is built for the edge cases and can have an unexpected outcome. That’s also the reason why there is no user interface for this switch.

## How does it work?

Disabling or enabling the Bootstrap file can only be done on a template level since a website might be using several templates.

It is not possible to enable or disable the file only for DOCman but not for FILEman.

## Joomla 2.5

On Joomla 2.5 our extensions load a `bootstrap.css` file by default.

Disabling this file is as easy as adding an empty file `disable-koowa-bootstrap.txt` to the root of your template directory:

    /templates/[template]/disable-koowa-bootstrap.txt

## Joomla 3

On Joomla 3 our extensions don't load a `bootstrap.css` file by default.

Enabling this file is as easy as adding an empty file `enable-koowa-bootstrap.txt` to the root of your template directory:

    /templates/[template]/enable-koowa-bootstrap.txt

## Template update

Updating your template might remove the added file. Your template might also include or exclude Bootstrap classes that were/weren’t there before after upgrading.