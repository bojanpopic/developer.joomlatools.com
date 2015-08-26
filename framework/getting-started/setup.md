---
layout: default
title: Setup
---

* Table of Content
{:toc}

To help you get moving we suggest that you have our [Vagrant box](/tools/vagrant.html) installed.

After you get your vagrant box set up and running, `ssh` into it

    $ vagrant ssh

When inside the box, use the `joomla` command line tool to create a new Joomla site

    $ joomla site:create todo

After that, make sure Joomlatools Framework is installed with the following line

    $ composer require --working-dir=/var/www/todo nooku/nooku-framework:2.*

That's it! Your Joomla site is now available at [http://joomla.dev/todo/](http://joomla.dev/todo/).
