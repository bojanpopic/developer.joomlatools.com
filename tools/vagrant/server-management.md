# Server management

<!-- toc -->

The basic LAMP stack consists out of Apache 2.4, PHP 5.5 and MySQL 5.5. The most important tasks can be done easily using the `box` command via [the web terminal](http://joomla.box:3000), or by SSHing into the box with `vagrant ssh`.

To get an overview of available command options, type `box list` in the terminal.

## Stop and start

You can stop Apache and MySQL using `box server:stop`. To simply restart, add the `--restart` flag: `box server:stop --restart`.

To start everything up again, run `box server:start`.

## Edit php.ini settings

To retrieve a value from the currently installed PHP version, you can use the `box php:ini <directive>` command. For example, to get the current `mysql.default_socket` value:

    box php:ini mysql.default_socket

To change this value into something else, append the new value:

    box php:ini mysql.default_socket /path/to/new/socket

The script puts these directives into an additional config file that overrides the default values. To remove your new configuration again, pass in an empty value:

    box php:ini mysql.default_socket ""

You can verify if the changes succeeded by taking a look at [joomla.box/phpinfo](http://joomla.box/phpinfo).

## Switch PHP version

We have created a tool that can build and install any PHP version from 5.2.0 and up automatically. This is ideal to try out your code on new PHP releases or to fix bugs that have been reported on older PHP versions.

To get a list of the PHP versions you can install, run this command:

    box php:versions

To install one of the available versions, for example 5.3.18, execute:

    box php:use 5.3.18

The script will check if this version has been installed and if not, will attempt to build it. Please note that building PHP might take a while. Once done you can verify if the install succeeded by browsing to [joomla.box/phpinfo](http://joomla.box/phpinfo).

Get a list of PHP versions you built using the `box php:list` command.

To restore the default PHP installation again, run:

    box php:reset

For more options, run `box list`.

For the truly adventurous; you can build the current master branch with this command: `box php:use master`. Each time you build the master branch the script will pull in the latest changes from the PHP Git repository.

## Manage Xdebug

Xdebug is enabled by default. To disable, run `box xdebug:disable`. To enable it again, simply run `box xdebug:enable`.

## Manage APC

The box comes with APCu and Opcache preinstalled and enabled. You can access the APC dashboard at [joomla.box/apc](http://joomla.box/apc).

To disable APCu and Opcache, run `box apc:disable`. To start again, execute `box apc:enable`.

If you just want to clear the cache, run `box apc:clear`.
