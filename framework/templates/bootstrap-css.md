---
layout: default
title: Bootstrap CSS
---

* Table of Content
{:toc}

## Introduction

Some Joomla 2.5 templates are already shipped with a Bootstrap file. There are also Joomla 3 templates that are designed to work without Bootstrap. For these templates we built a switch to either disable or enable the bootstrap file that is shipped with our extensions.

Note: this switch is only available since our 2.0 stable versions.

## Do I need this?

No, you almost never do. We developed our extensions in a way that they always look as good as possible with any template. This switch is built for the edge cases. That’s also the reason why we didn’t build a user interface for this switch.

## How does it work?

Disabling or enabling the Bootstrap file can only be done by template. A website might be using several templates. And you probably want to disable or enable Bootstrap for only one of these templates. 

Doing this on a template level also means that the file is being disabled/enabled for all Joomlatools extensions. It is not possible to disable the file only for DOCman but not for FILEman for example. Also the file is only being disabled/enabled on the frontend and not the administrator since the admin uses a different template.

## Disabling bootstrap.css on Joomla 2.5

On Joomla 2.5 our bootstrap.css file is loaded by default. Therefore it’s only possible to disable the file here.

Disabling is as easy as adding a file to your template root folder which is called: disable-koowa-bootstrap.txt

Example:	

[yourwebsite]/templates/[yourtemplate]/disable-koowa-bootstrap.txt

Notes:

1. The [yourwebsite] and [yourtemplate] in the above example are there to help you understand the structure. For example this could be a real-life example: www.mywebsite.com/templates/protostar/disable-koowa-bootstrap.txt
2. This file should be empty

## Enabling bootstrap.css on Joomla 3

On Joomla 3 we never load any bootstrap.css file by default. Therefore it’s only possible to enable the file here and not possible to disable it.

Enabling is as easy as adding a file to your template root folder which is called: enable-koowa-bootstrap.txt

Example:

[yourwebsite]/templates/[yourtemplate]/enable-koowa-bootstrap.txt

Notes:

1. The [yourwebsite] and [yourtemplate] in the above example are there to help you understand the structure. For example this could be a real-life example: www.mywebsite.com/templates/protostar/enable-koowa-bootstrap.txt
2. This file should be empty.

## Disclaimer

Keep in mind that this switch is only built for the edge cases. Using this switch might have a really unexpected outcome. If this is the case please revert back to the original state by removing the file you just added.

Also keep in mind that updating your template might remove this file. Another thing to understand is that your template might include or exclude some bootstrap classes that were/weren’t there before after upgrading.