---
layout: default
title: Installing Packages
---

First make sure you have composer installed on your machine. On the Composer website you will find a [Getting Started](http://getcomposer.org/doc/00-intro.md) guide.

The simplest way to get started is by defining your extension in your Composer manifest directly. Setup a fresh Joomla installation and create a `composer.json` file in its root directory.

Let’s say you want to install the extension `com_xyz` and you’ve downloaded the installation package to `/Users/YourName/Downloads/com_xyz.tar.gz`.

Your `composer.json` contents should then look as follows:

{% highlight js %}
{
    "repositories": [
        {
            "type": "package",
            "package": {
                "name": "vendor/xyz",
                "type": "joomlatools-installer",
                "version": "1.0.0",
                "dist": {
                    "url": "file:////Users/YourName/Downloads/com_xyz.tar.gz",
                    "type": "tar"
                },
                "require": {
                    "joomlatools/installer": "*"
                }
            }
        }
    ],

    "require": {
        "vendor/xyz": "1.0.0"
    }
}
{% endhighlight %}

Using this JSON file, we have now defined our own custom package. Pay attention to the following settings:

* The `type` has to be set to `joomlatools-installer`
* Make sure the `url` directive points to the location of the install package.

Save this file and run from your console and within the joomla root folder: 

{% highlight bash %}
composer install
{% endhighlight %}

Executing `composer install` will now fetch the `joomlatools/installer` plugin and use it to install the package into your Joomla installation.

You should get output similar to the following:

![Console output](http://farm6.staticflickr.com/5475/10689162794_875325a8f0_o.png)

*Congratulations*, your Joomla setup has already been completed! Leaving you plenty of time to start cracking on your new templates and/or extensions!

