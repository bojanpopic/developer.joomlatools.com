# Vagrant Box

## A Joomla LAMP stack that just works

Our [Joomlatools Vagrant box](https://github.com/joomlatools/joomla-vagrant) is a preconfigured Vagrant Box that comes with a working LAMP Stack to get you up and running building Joomla sites in no time.

This box is a self-contained Joomla developer environment and has everything you need right from the start. You don't have to worry about setting up Vagrant, provisioning the server or even configuring Joomla installations. Since everything is packaged into the box, you can simply focus on your code.

## Features

The box comes with the following technologies installed and configured by default:

* Ubuntu 14.04
* PHP 5.5 _but you can install any PHP version you want_
* Apache 2.4
* Ruby 2.2
* MySQL 5.5
* Node 0.10

PHP comes with these extensions out of the box:

* APCu and Opcache
* Xdebug
* GD and Imagick
* Mcrypt
* PDO, SQLite and MySQL(i)
* cURL

On top of that, you have these developer tools at your disposal right away:

* [Joomla Console](http://github.com/joomlatools/joomla-console)
* [Composer](https://getcomposer.org/)
* [PhpMetrics](https://github.com/Halleck45/PhpMetrics)
* [Git](https://git-scm.com/)
* [NPM](https://www.npmjs.com/)
* [RubyGems](https://rubygems.org/)

To help you manage the development server via your browser, we've included these projects:

* [Wetty](https://github.com/krishnasrinivas/wetty)
* [PimpMyLog](http://www.pimpmylog.com)
* [PhpMyAdmin](http://www.phpmyadmin.net/)

To get started, head over to the [installation page](installation.md).
