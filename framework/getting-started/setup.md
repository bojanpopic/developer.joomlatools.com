---
layout: default
title: Setup
---

* Table of Content
{:toc}

To help you get moving we suggest that you have our [Vagrant box](/tools/vagrant.html) installed.

1. Open the web terminal:

    [http://joomla.box:3000](http://joomla.box:3000){:target="_blank"}

2. Create a new Joomla site

    `$ joomla site:create todo`

3. Install the Joomlatools Framework:

    `$ composer require --working-dir=/var/www/todo nooku/nooku-framework:2.*`

That's it! Your Joomla site is now available at [http://joomla.box/todo/](http://joomla.box/todo/){:target="_blank"}.
