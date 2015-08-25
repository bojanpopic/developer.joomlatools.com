---
layout: default
title: Getting started
---

* Table of Content
{:toc}

## Creating new Joomla sites

1. Once you have installed the box, open up the web terminal by browsing to [joomla.box:3000](http://joomla.box:3000). _Alternatively, you can SSH into the box from the command line with the `vagrant ssh` command._

1. Create your first Joomla website with this command:

{% highlight bash %}
joomla site:create mysite
{% endhighlight %}

1. Your new site is available at [joomla.box/mysite](http://joomla.box/mysite). You can login using the credentials  `admin` / `admin`.

    _Note_: the box always creates a separate virtual host for every Joomla installation but you have to add the hostname to your `/etc/hosts` file yourself. After adding the `33.33.33.58 mysite.dev` line you can browse to the site via [mysite.dev](http://mysite.dev).

Now that the Joomla site is running, we can push our own work into it.

## Symlink your code into a Joomla site

Let's say you are working on your own Joomla component called _Awesome_ and want to continue working on it using the Vagrant box. We should start by making the source code available to the Vagrant box. You can move your existing code into the _Projects_ directory, which is automatically created for you in the directory where you executed `vagrant up`.

Or, even better, you can tell the box to include other directories. Let's assume the source code is located at `/Users/myname/Projects/awesome`:

Create a file called `config.custom.yaml` ([example](https://github.com/joomlatools/joomla-vagrant/blob/master/config.custom.yaml-dist)) in the directory that contains your Vagrantfile (_this is the location you started the box from on your host machine_) and make it look like this:

    synced_folders:
        /home/vagrant/Projects: /Users/myname/Projects

Save this file and restart the Vagrant box using the `vagrant reload` command.

The _"Projects"_ directory from your host machine will now be available inside the Vagrant box at _/home/vagrant/Projects_.

Next step is to create the new site you'll be working on. Execute the following command on the box (via the [web terminal](http://joomla.box:3000) or through `vagrant ssh`):

    joomla site:create testsite --joomla=3.2 --symlink=awesome

Or to symlink your code into an existing site:

    joomla extension:symlink mysite awesome

Run discover install in the Joomla Extensions manager to make your component available to Joomla and you are good to go!

For more information on the symlinker, refer to the [Joomla Console docs](../console/2-usage.html) or run:

      joomla extension:symlink  --help

## Next steps

The `joomla` command is the most important piece in our Vagrant box. It's the workhorse for everything related to Joomla on the box. This [Joomla Console](../console.html) package can do a whole lot more except installing sites. You can also automatically [install your custom extensions](../console/2-usage.html#install-joomla-extensions) and even create your own [plugins](../console/3-plugins.html).

To find out more about its options and usage, you can get an overview by running the `joomla list` command, or head over to the [documentation pages](../console/2-usage.html) for a full explanation.
