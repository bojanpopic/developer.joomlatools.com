# FAQs

<!-- toc -->

## What does the box contain?

* Ubuntu 12.10 (Precise) 64 bit
* Apache
* MySQL
* PHP 5.4
* Composer
* Phpmyadmin
* Xdebug
* Webgrind
* Mailcatcher
* Less compiler
* UglifyJS

## How do I access my site?

Apache serves files from the `www` folder using the IP:

    http://33.33.33.58/

If you have setup your hosts file correctly as shown above, you can now also access the default www/ folder at:

	http://joomla.dev

It is advised to use virtual hosts for development. See below for our virtual host manager.

## Can I SSH into my box?

You can reach the box by using the command:

	$ vagrant ssh

## Can I create a new site from the command line?

The Vagrant box has our [Joomla Console](http://developer.joomlatools.com/tools/console) script pre-installed.
To create a site with the latest Joomla version, run:

    joomla site:create testsite

The newly installed site will be available in the /testsite subfolder at http://joomla.dev/testsite after that. The files are located at /var/www/testsite.
You can login into your fresh Joomla installation using these credentials: `admin` / `admin`.

For more information, please refer to the [Joomla Console](http://www.joomlatools.com/developer/tools/console) repository.

*Note*: The script also creates a new virtual host when creating a new site. If you add the following line into your /etc/hosts file on your host machine:

    33.33.33.58 testsite.dev

you can access it directly at http://testsite.dev.

## How should I test my component's code on the Vagrant box?

Let's say you are working on your own Joomla component called _Awesome_ and want to continue working on it using the Vagrant box. You can use the _Projects_ folder in the repository root for your projects.

But if you would like to use a custom folder we should start by making the source code available to the Vagrant box. Let's assume the source code is located at _/Users/myname/Projects/awesome_ :

Copy the ```config.custom.yaml-dist``` file to ```config.custom.yaml``` and edit with your favorite text editor. Make it look like this:

    synced_folders:
      /home/vagrant/Projects: /Users/myname/Projects

Save this file and restart the Vagrant box. (```vagrant reload```)

The "Projects" folder from your host machine will now be available inside the Vagrant box through _/home/vagrant/Projects_.

Next step is to create the new site you'll be working on. SSH into the box (```vagrant ssh```) and execute the following command:

    joomla site:create testsite --joomla=3.2 --symlink=awesome

Or to symlink your code into an existing site:

    joomla extension:symlink testsite awesome

Run discover install to make your component available to Joomla and you are good to go!

For more information on the symlinker, refer to the [Joomla Console](http://developer.joomlatools.com/tools/console) documentation or run:

      joomla extension:symlink  --help

## Where can I find phpmyadmin?

After you modify /etc/hosts as shown above you can use phpMyAdmin at

    http://phpmyadmin.joomla.dev

## I don't like the command line! Is there another way to manage the Vagrant box?

There's a great tool we use to start and manage our Vagrant boxes, called [Vagrant Manager](http://vagrantmanager.com/).  It is currently available on OS X only, though!

To create a new Joomla site or symlink an extension, you will still need the command line however.

## Can I use webgrind?

After you modify /etc/hosts as shown above go to

    http://webgrind.joomla.dev

## Can I sftp into my box?

Use following details to connect:

    Host: 127.0.0.1
    Port: 2222
    User: vagrant
    Password: vagrant

## How do I stop the box?

Simply type

```
vagrant halt
```

## How do I destroy a box?

To completely destroy the virtual image, run

```
vagrant destroy
```

To create the image again run:

```
vagrant up
```
