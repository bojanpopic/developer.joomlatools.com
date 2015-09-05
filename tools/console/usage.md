---
layout: default
title: Usage
---

* Table of Content
{:toc}

## Managing sites

### Create a new Joomla site

To create a site with the latest Joomla version, run:

    joomla site:create testsite

The newly installed site will be available at _/var/www/testsite_ and _testsite.dev_ after that. You can login into your fresh Joomla installation using these credentials: `admin` / `admin`.

By default, the web server root is set to _/var/www_. You can pass _--www=/my/server/path_ to commands for custom values.

You can choose the Joomla version or the sample data to be installed:

    joomla site:create testsite --joomla=2.5 --sample-data=blog

You can pick any branch from the Git repository (e.g. master, staging) or any version from 2.5.0 and up using this command.

For more information and available options, try running:

    joomla site:create --help

## Components and extensions

### Symlink your code into a Joomla installation

Let's say you are working on your own Joomla component called _Awesome_ and want to develop it with the latest Joomla version.

By default your code is assumed to be in _~/Projects_. You can pass _--projects-dir=/my/code/is/here_ to commands for custom values.

Please note that your source code should resemble the Joomla directory structure for symlinking to work well. For example your administrator section should reside in ~/Projects/awesome/administrator/components/com_awesome.

Now to create a new site, execute the site:create command and add a symlink option:

      joomla site:create testsite --symlink=awesome

Or to symlink your code into an existing site:

    joomla extension:symlink testsite awesome

This will symlink all the directories from the _awesome_ directory into _testsite.dev_.

Run discover install to make your component available to Joomla and you are good to go!

For more information on the symlinker, run:

      joomla extension:symlink  --help

### Install Joomla extensions

You can use discover install on command line to install extensions.

    joomla extension:install testsite com_awesome

You need to use the _element_ name in your extension manifest.

For more information, run:

     joomla extension:install --help

Alternatively, you can install extensions using their installation packages using the `extension:installfile` command. Example:

    joomla extension:installfile testsite /home/vagrant/com_component.v1.x.zip /home/vagrant/plg_plugin.v2.x.tar.gz

This will install both the com_component.v1.x.zip and plg_plugin.v2.x.tar.gz packages.

