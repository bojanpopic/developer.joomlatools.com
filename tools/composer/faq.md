# FAQs

<!-- toc -->

## How does it work?

Out of the box Composer will just download a package and move it to its requested destination. To install Joomla extensions using Composer we created a Composer plugin to leverage Composer’s package management functionality. This plugin bootstraps the Joomla application after downloading a package and executes the installation code.

The result is identical to installing an extension through the administrator interface of Joomla; only you don’t have to lift a finger and you can install multiple extensions with one single command

We’ve published the plugin on Packagist, the central Composer repository, so that everyone can make use of it. To use it, just tell Composer to find the plugin and let it do all the hard work for you.

## How can I publish my own package? 

To make use of all Composer's features, eg. upgrading to a newer version, you are better off creating a proper package using your extension's source code, instead of simply linking to installation packages.

The package definition should contain the following basic information to make it installable into Joomla: 

```js
{
        "name": "vendor/my-extension",
        "require": {
            "joomlatools/installer": "*"
        }
}
```

If you want to make your extension available directly from Github or any other VCS, you want to make sure that the file layout in your repo resembles your install package. 

You can now publish your extension on [Packagist](https://packagist.org/) or serve it yourself using your own [Satis](https://github.com/composer/satis) repository. 

For more information on rolling your own package, please refer to the [Composer documentation](http://getcomposer.org/doc/02-libraries.md).


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