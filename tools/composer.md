# Composer

## The Problem

Are you a developer and tired of re-installing the same extensions over and over again or every time you start a new Joomla project? Wouldn’t it be great if you could install and update multiple Joomla extensions in one go, without lifting a finger?

What if you create websites for clients on a regular basis and you require tools that allow you to get things done quickly and automatically. That is why we have created a Composer installer for Joomla extensions. 

## Composer Can Help You

[Composer](http://getcomposer.org/) is a dependency manager for PHP. You can instruct Composer to pull in all the required extensions you need in your site using a single JSON file. This will keep all your dependencies in one convenient location and Composer will take care of upgrading and managing them.

Composer has become the de-facto standard for managing dependencies in the PHP community today. Because of its ease of use and community-wide support, it’s simply the best tool to manage extensions for a Joomla setup.

## How To Use Composer?

First make sure you have composer installed on your machine. On the Composer website you will find a [Getting Started](http://getcomposer.org/doc/00-intro.md) guide.

The simplest way to get started is by defining your extension in your Composer manifest directly. Setup a fresh Joomla installation and create a `composer.json` file in its root directory.

Let’s say you want to install the extension `com_xyz` and you’ve downloaded the installation package to `/Users/YourName/Downloads/com_xyz.tar.gz`.

Your `composer.json` contents should then look as follows:

```js
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
```
Save this file and run from your console and within the joomla root folder: 

```bash
composer install
``` 

You should get output similar to the following:

![Console output](http://farm6.staticflickr.com/5475/10689162794_875325a8f0_o.png)

Congratulations, your Joomla setup has already been completed! Leaving you plenty of time to start cracking on your new templates and/or extensions!

## General Use 

The above example is a very basic way to use our [Composer plugin](https://github.com/joomlatools/joomla-composer). For a more elaborate usage description, please refer to the description on our [Github repository](https://github.com/joomlatools/joomla-composer).

Using the installer you can now publish your extensions to [Packagist](https://packagist.org/) so everyone can install them or host them on a private repository and use [Satis](https://github.com/composer/satis) to make them available inside your company. Doing so will reduce the amount of code you need to configure Composer to a single line!

The installer allows you to ensure your developers and designers all work with exactly the same versions of certain extensions and keep everyone’s development environment in sync. You can distribute your extensions faster than before and never have to deal with installer uploads which are too big for PHP to handle.

To make your extension available to other users or to take advantage of all of Composer's features you should consider referring to the [Custom Package](#creating-a-custom-package) section.

## FAQs 

### How does it work?

Out of the box Composer will just download a package and move it to its requested destination. To install Joomla extensions using Composer we created a Composer plugin to leverage Composer’s package management functionality. This plugin bootstraps the Joomla application after downloading a package and executes the installation code.

The result is identical to installing an extension through the administrator interface of Joomla; only you don’t have to lift a finger and you can install multiple extensions with one single command

We’ve published the plugin on Packagist, the central Composer repository, so that everyone can make use of it. To use it, just tell Composer to find the plugin and let it do all the hard work for you.

### Creating a custom package 

To make use of all Composer's features, eg. upgrading to a newer version, you are better off creating a package using your extension's source code. 

The package definition should contain the following basic information to make it installable into Joomla: 

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

If you want to make your extension available directly from Github or any other VCS, you want to make sure that the file layout in your repo resembles your install package. 

You can now publish your extension on Packagist or serve it yourself using your own Satis repository. 

For more information on rolling your own package, please refer to the [Composer documentation](http://getcomposer.org/doc/02-libraries.md).


### Change the user

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

### Requirements

* Composer
* Joomla version 2.5 and up.

### Contributing

[Fork the project, create a feature branch, and send us a pull request.](../preface/contributing.md)

### Authors

See the list of [contributors](https://github.com/joomlatools/joomla-composer/contributors).

### License

The `joomlatools/installer` plugin is licensed under the GPL v3 license - see the [LICENSE](https://github.com/joomlatools/joomla-composer/blob/master/LICENSE) file for details.

## Further Resources
 
- [Packagist](https://packagist.org/)
- [Satis repository](http://getcomposer.org/doc/articles/handling-private-packages-with-satis.md)
- [Composer documentation](http://getcomposer.org/doc/02-libraries.md)

Happy coding!




