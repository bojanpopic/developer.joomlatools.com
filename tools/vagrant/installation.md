---
layout: default
title: Installation
---

1. Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
1. Install [Vagrant](https://www.vagrantup.com/downloads.html)
1. Run the following command in a directory of your choice:

{% highlight bash %}
vagrant init joomlatools/box
{% endhighlight %}

    This will create a `Vagrantfile` in your current directory.

1. Now start the box by executing this command:

{% highlight bash %}
vagrant up
{% endhighlight %}

    This will download the complete [Vagrant box](https://atlas.hashicorp.com/joomlatools/boxes/box) and get it running.

1. Add the following line into your ***hosts file*** (`/etc/hosts` on Linux and Mac OS X, for other operating systems see [here][1]

{% highlight vim %}
33.33.33.58 joomla.box webgrind.joomla.box phpmyadmin.joomla.box
{% endhighlight %}

1. The dashboard is now available at [joomla.box](http://joomla.box)

There will be two new directories created called `www` and `Projects`. These directories act as shared directories between your host computer and the box.

If everything is setup, we will show you how to install your first Joomla site on the [getting started page](2-getting-started.html).

   [1]: http://en.wikipedia.org/wiki/Hosts_(file)#Location_in_the_file_system
