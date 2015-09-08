---
layout: default
title: Getting Started
---

* Table of Content
{:toc}

## Installation

1. Install using [Composer](https://getcomposer.org/):

    `composer global require joomlatools/joomla-console`

1. Tell your system where to find the executable by adding the composer directory to your `PATH`. Add the following line to your shell configuration file called either .profile, .bash_profile, .bash_aliases, or .bashrc. This file is located in your home directory.

    `export PATH="$PATH:~/.composer/vendor/bin"`

1. Verify the installation

    `joomla --version`

Congratulations, you are now ready to use our `joomla` console tool.

## Managing sites

### Create a new Joomla site

To create a site with the latest Joomla version, run:

    joomla site:create testsite

The newly installed site will be available at `/var/www/testsite` and `testsite.dev` after that. You can login into your fresh Joomla installation using these credentials: `admin` / `admin`.

You can choose the Joomla version or the sample data to be installed:

    joomla site:create testsite --joomla=2.5 --sample-data=blog

You can pick any branch from the Git repository (e.g. master, staging) or any version from 2.5.0 and up using this command.

For more information and available options, try running:

    joomla site:create --help
    
### Web server root
    
The web server root is set to `/var/www`. You can pass `--www=/my/server/path` to change the default path.

## Components and extensions

### Symlink your code into a Joomla installation

<span class="note">
**Note**: Your code is assumed to be in `~/Projects` directory. You can pass `--projects-dir=/my/code/is/here` to change the default path.
</span>

Your source code should match the Joomla directory structure for symlinking to work well. For example your administrator section should reside in `~/Projects/foobar/administrator/components/com_foobar`.

Now to create a new site, execute the site:create command and add a symlink option:

    joomla site:create testsite --symlink=foobar

Or to symlink your code into an existing site:

    joomla extension:symlink testsite foobar

This will symlink all the directories from the `foobar` directory into `testsite.dev`.

Run discover install to make your component available to Joomla and you are good to go!

For more information on the symlinker, run:

    joomla extension:symlink  --help

### Install Joomla extensions

You can use discover install on command line to install extensions.

    joomla extension:install testsite com_foobar

You need to use the `element` name in your extension manifest.

For more information, run:

     joomla extension:install --help

Alternatively, you can install extensions using their installation package. Example:

    joomla extension:installfile testsite /home/vagrant/com_foobar.v1.x.zip

This will install both the **com_component.v1.x.zip** packages.

