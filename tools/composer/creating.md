## Distributing packages

The previous example is a very basic way to use our [Composer plugin](https://github.com/joomlatools/joomla-composer). To make use of all Composer's features, for example automatically upgrading to the latest version, you are better off creating a package using your extension's source code. 

Create a `composer.json` file in the root of your project. This file defines your package. The package definition should contain the following basic information to make it installable into Joomla: 

```json
{
    	"name": "vendor/my-extension",
    	"require": {
        	"joomlatools/installer": "*"
    	}
}
```

If you want to make your extension available directly from Github or any other VCS, you want to make sure that the file layout in your repo resembles your install package. 

You can now publish your extension on [Packagist](https://packagist.org/) or serve it yourself using your own [Satis repository](http://getcomposer.org/doc/articles/handling-private-packages-with-satis.md). 

Once published, you can easily install your extension/template/.. using the method we described on the previous page.

For more information on rolling your own package, please refer to the [Composer documentation](http://getcomposer.org/doc/02-libraries.md).
