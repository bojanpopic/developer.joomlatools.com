---
layout: default
title: Getting Started
---

## Installation

Go to the root directory of your Joomla installation on the command line and execute this command:

    $ composer require nooku/nooku-framework:2.*
    
<span class="note">
**Note**: Assuming you have [Composer](https://getcomposer.org/) already installed.
</span>

## Showcase

The best way to showcase the core functionality of the Joomlatools Framework is to show you step by step how to build something real.

Building a Todo management extension will help get you acquainted with the fundamental concepts and some of the more advanced features that the framework provides.

### Setup

To help you get moving we suggest that you have our [Vagrant box](/tools/vagrant.html) installed.

1. Open the web terminal:

    [http://joomla.box:3000](http://joomla.box:3000){:target="_blank"}

2. Create a new Joomla site

    `$ joomla site:create todo`

3. Install the Joomlatools Framework:

    `$ composer require --working-dir=/var/www/todo nooku/nooku-framework:2.*`

That's it! Your Joomla site is now available at [http://joomla.box/todo/](http://joomla.box/todo/){:target="_blank"}.

### Example extension

Explore the [Frontend](getting-started/frontend.html) and [Backend](getting-started/backend.html) guides of our example extension.
