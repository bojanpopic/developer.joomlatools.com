---
layout: default
title: FAQs
---

<!-- toc -->

## How does it work?

Out of the box Composer will just download a package and move it to its requested destination. To install Joomla extensions using Composer we created a Composer plugin to leverage Composer’s package management functionality. This plugin bootstraps the Joomla application after downloading a package and executes the installation code.

The result is identical to installing an extension through the administrator interface of Joomla; only you don’t have to lift a finger and you can install multiple extensions with one single command

We’ve published the plugin on [Packagist](https://packagist.org/), the central Composer repository, so that everyone can make use of it. To use it, just tell Composer to find the plugin and let it do all the hard work for you.

## How can I change the user during installation?

The installer injects a user called `root` into the Joomla application at runtime to make sure that the installer scripts have the necessary permissions to execute.

If for some reason, you need to change the details of this mock user, you can override them by adding a `joomla` block into the `config` section of your `composer.json`. Example:  

```js
{
    "config": {
        "joomla": {
            "username": "johndoe",
            "name":		 "John Doe",
            "email": 	 "john@doe.com"
        }
    }
}
```

## How can I debug my own packages?

Having trouble? You can increase Composer's verbosity setting (`-v|vv|vvv`) to gather more information. Increasing Composer's verbosity will also enable Joomla's log messages.

## Where can I find an example component?

We have published a very basic example component on [GitHub](https://github.com/joomlatools/joomla-com_helloworld). Then we've published this component on [Packagist](https://packagist.org/packages/joomlatools/com_helloworld) to make it available through Composer.

The [composer.json](https://github.com/joomlatools/joomla-com_helloworld/blob/master/composer.json) is all you need to add to your own project.

You can install this component in every Joomla installation by putting `joomlatools/com_helloworld` in your composer.json file.
