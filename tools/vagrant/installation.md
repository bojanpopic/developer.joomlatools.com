---
layout: default
title: Installation
---

1. Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
1. Install [Vagrant](https://www.vagrantup.com/downloads.html)
1. Run the following commands in a directory of your choice to download and start the Vagrant box:

    `$ vagrant init joomlatools/box`<br />
    `$ vagrant up`

1. Add the following line into your ***hosts file*** (`/etc/hosts` on Linux and Mac OS X, for other operating systems see [here][1]):

    `33.33.33.58 joomla.box webgrind.joomla.box phpmyadmin.joomla.box`

1. The dashboard is now available at [joomla.box](http://joomla.box)

There will be two new directories created called `www` and `Projects`. These directories act as shared directories between your host computer and the box.

If everything is setup, we will show you how to install your first Joomla site on the [getting started page](2-getting-started.html).

   [1]: http://en.wikipedia.org/wiki/Hosts_(file)#Location_in_the_file_system
