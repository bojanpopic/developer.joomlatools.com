# Composer

Are you a developer and tired of reinstalling the same extensions over and over again every time you start a new Joomla project? Wouldn’t it be great if you could install and update multiple Joomla extensions in one go, without lifting a finger?

If you create websites for clients on a regular basis you require tools that allow you to get things done quickly and automatically. That’s why we have created a Composer installer for Joomla extensions.

## What is Composer?

Composer is a dependency manager for PHP. You can instruct Composer to pull in all the required extensions you need in your site using a single JSON file. This will keep all your dependencies in one convenient location and Composer will take care of upgrading and managing them.

Composer has become the de-facto standard for managing dependencies in the PHP community today. Because of its ease of use and community-wide support, it’s simply the best tool to manage extensions for a Joomla setup.

## How does it work?

Out of the box Composer will just download a package and move it to its requested destination. To install Joomla extensions using Composer we created a Composer plugin to leverage Composer’s package management functionality. This plugin bootstraps the Joomla application after downloading a package and executes the installation code.

The result is identical to installing an extension through the administrator interface of Joomla; only you don’t have to lift a finger and you can install multiple extensions with one single command!

We’ve published the plugin on Packagist, the central Composer repository, so that everyone can make use of it. To use it, just tell Composer to find the plugin and let it do all the hard work for you.

## How to manage your own extensions?

The simplest way to get started is by defining your extension in your Composer manifest directly. Setup a fresh Joomla installation and create a composer.json file in its root directory.

Let’s say you want to install the extension com_xyz and you’ve downloaded the installation package to /Users/YourName/Downloads/com_xyz.tar.gz.

Your composer.json contents should then look as follows;

```json
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

Save this file and run composer install in your console from the Joomla root folder. You should get output similar to the following:

Congratulations, your Joomla setup has already been completed! Leaving you plenty of time to start cracking on your new templates and/or extensions!

## Discover new possibilities!

The above example is a very basic way to use our Composer plugin. For a more elaborate usage description, please refer to the description on our Github repository.

Using the installer you can now publish your extensions to Packagist so everyone can install them or host them on a private repository and use Satis to make them available inside your company. Doing so will reduce the amount of code you need to configure Composer to a single line!

The installer allows you to ensure your developers and designers all work with exactly the same versions of certain extensions and keep everyone’s development environment in sync. You can distribute your extensions faster than before and never have to deal with installer uploads which are too big for PHP to handle anymore.

Want to contribute to the plugin or fix a bug? Don’t hesitate to fork us on Github and send a pull request! Have any other ideas for this plugin? Be sure to let us know in the comments!