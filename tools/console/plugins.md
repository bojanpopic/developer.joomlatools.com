---
layout: default
title: Plugins
---

* Table of Content
{:toc}

## Introduction

You can easily add your own commands that are specific to your workflow. You can install plugins by a third party or make your own. In this document we'll explain you how.

## Installing plugins

We have created a separate [example plugin](https://github.com/joomlatools/joomla-console-backup) that adds a backup command to the console tool.

Plugins should be published on [Packagist](https://packagist.org/) because they will be installed using Composer in the background. You just need to pass their package name. In the case of our example, the package name is `joomlatools/joomla-console-backup`.

1.  Install with the following command

    `joomla plugin:install joomlatools/joomla-console-backup`

    You can specify a specific version or branch by appending the version number to the package name. For example: `joomlatools/joomla-console-backup:dev-master`. Version constraints follow [Composer's convention](https://getcomposer.org/doc/01-basic-usage.md#package-versions). 

1. Verify that the plugin is available:

    `joomla plugin:list`

1. You can now create a backup of a site by running the following command:

    `joomla site:backup sitename`

    The tarball and mysql dump will be stored in your home directory. You can change this location using the `--directory` flag.

1. For all available options, run

    `joomla help site:backup`

## Uninstalling

To remove a plugin, run the uninstall command:

`joomla plugin:uninstall joomlatools/joomla-console-backup`

## Creating custom plugins

### Implementing a new command

Commands should always go into the `Foo/Console/Command` directory, where `Foo` is your name or company name. This path must be the same as the namespace of the command class.

1. Create the directories `Foo/Console/Command`
1. Create a file Hello.php in that new directory.
1. Put in the following PHP code:

{% highlight php %}
<?php
namespace Foo\Console\Command; // Namespace should be the same as the directory the file is in!

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class Bar extends Command
{
  protected function configure()
  {
      $this->setName('bar')
           ->setDescription('foo bar command');
  }
  protected function execute(InputInterface $input, OutputInterface $output)
  {
      $output->writeln('foobar!');
  }
}
{% endhighlight %}

The entire tool is build using Symfony's Console package. Commands subclass their `Command` class. You can find complete instructions on how to build a symfony console command with extra arguments and options on [their documentation pages](http://symfony.com/doc/current/components/console/introduction.html).

Take a look at the source of our [backup plugin](https://github.com/joomlatools/joomla-console-backup) for a working example.

### Registering custom symlinkers

The [extension:symlink](/tools/console/commands/extension.html#extensionsymlink) symlinks projects into a site to make ease development. Sometimes you might need more steps before symlinking can work (for example, creating new directories) or you might need to pull in extra dependencies. That's why it is possible to register custom symlinkers and dependencies.

#### Dependencies

To define extra dependencies for a given symlink:

{% highlight php %}
<?php
$symlink      = 'com_foobar';
$dependencies = array('com_dependency', 'com_library', 'plg_framework');

Extension\Symlink::registerDependencies($symlink, $dependencies);
{% endhighlight %}

If you now symlink `com_foobar` with `joomla extension:symlink site com_foobar`, the defined dependencies will automatically be symlinked too.

#### Symlinker

You can pass a function to `Extension\Symlink::registerSymlinker` to add new behavior to the symlink command.

{% highlight php %}
<?php
Extension\Symlink::registerSymlinker(function($source, $destination, $project, $projects) {
  if ($project != 'com_foobar')) {
    return false;
  }

  mkdir($destination.'/new/path', 0755, true);
  symlink($source, $destination.'/new/path/symlink');
  
  return true;
});
{% endhighlight %}

If the function returns true, the symlinker _will not_ run the default symlinking logic afterwards.


## Publishing your plugin

To make your plugin installable, you need to add a Composer manifest. Create a file `composer.json` in the root directory of this plugin with the following information:

{% highlight js %}
{
  "name": "foo/bar",
  "description": "My awesome plugin for joomla-console"
  "type": "joomla-console-plugin"
  "autoload": {
    "psr-0": {"Foo\\": "/"}
      .. or ..
    "files": ["symlinker.php"]
  }
}
{% endhighlight %}

A quick explanation of these fields:

* Name is required and must adhere to the Composer convention, eg `vendor/package-name`.
* Description is required for publishing packages
* Type must be set `joomla-console-plugin`, otherwise it will not be installed
* You must tell Composer how to map the namespace to your classes. Otherwise joomla-console will fail to recognize it. If you are only including a symlinker file, autoloading the file will be sufficient.

To find out all available options and get more information on these fields, please refer to the [composer.json schema documentation](https://getcomposer.org/doc/04-schema.md).

Now push your files to a GitHub repository and publish it on [Packagist](https://packagist.org/)!

Once published on Packagist, you'll be able install it by running the install command: `joomla plugin:install foo/bar` where `foo/bar` is the name you defined in composer.json!

Happy coding!
