# Vagrant

## The Problem

You are a Joomla web agency and you have a team of 10 developers and designers working on projects. Some of your staff is using Ubuntu, most are on Mac OS, a few are still on Windows. Further your team is working on various projects with completely different stacks: Joomla, PHP, server setup, tools… all are different.

You could set up different local servers, one for each project? That’s a lot of overhead. Work remotely all the time, slow and time consuming. Use a tool like WAMP or MAMP or a set of command line scripts for Bash… All great options, yet none of them are ideal.

What about when a new developer joins your team? He will need to spend half a day setting up his machine. And another half for that new project coming up. Time lost from actual coding work. Or how about fixing that nasty bug your co-worker reported but you still cannot replicate? It works on your machine, right?

There should be a better way to do this!

## How Can Vagrant Help You?

[Vagrant](http://vagrantup.com) is a tool for managing virtual machines from providers such as VMWare and Virtualbox.

It lets you create, setup and destroy virtual machines with a single command. It comes with a base operating system and builds called boxes and server provisioning software to make it easy to install and configure the virtual machine to your needs.

Using Vagrant with Virtualbox, you can set up a Joomla development environment from scratch in minutes.

## How To Use

Install [VirtualBox](http://www.virtualbox.org/)

Install [Vagrant](http://downloads.vagrantup.com/)

Run the following commands in a folder of your choice:

    $ vagrant init joomlatools/box
    $ vagrant up
    
This will download the Vagrant box and get it running. 


Note that this requires a 700 MB download for the first run and Vagrant version 1.5 or later. If you want to perform an offline installation or on an older Vagrant version, [download the box here](https://vagrantcloud.com/joomlatools/box/version/1/provider/virtualbox.box) and run the following commands instead:

    $ vagrant init joomlatools/box /path/to/download/joomlatools-box-1.2.box
    $ vagrant up

Add the following line into your **hosts file** (/etc/hosts on Linux and MacOS, for other operating systems see [here](http://en.wikipedia.org/wiki/Hosts_%28file%29#Location_in_the_file_system))

    33.33.33.58 joomla.dev webgrind.joomla.dev phpmyadmin.joomla.dev

And you are done. There will be two new folders created called www and Projects.

## FAQs
### What does the box contain?

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

### How do I access my site?

Apache serves files from the `www` folder using the IP:

    http://33.33.33.58/
    
If you have setup your hosts file correctly as shown above, you can now also access the default www/ folder at:

	http://joomla.dev

It is advised to use virtual hosts for development. See below for our virtual host manager.

### Can I SSH into my box?

You can reach the box by using the command:

	$ vagrant ssh
	
### Can I create a new site from the command line?

The Vagrant box has our [Joomla Console](https://github.com/joomlatools/joomla-console) script pre-installed.
To create a site with the latest Joomla version, run:

    joomla site:create testsite

The newly installed site will be available in the /testsite subfolder at http://joomla.dev/testsite after that. The files are located at /var/www/testsite.
You can login into your fresh Joomla installation using these credentials: `admin` / `admin`.

For more information, please refer to the [Joomla Console](http://www.joomlatools.com/developer/tools/console) repository.

*Note*: The script also creates a new virtual host when creating a new site. If you add the following line into your /etc/hosts file on your host machine:

    33.33.33.58 testsite.dev

you can access it directly at http://testsite.dev.

### How should I test my component's code on the Vagrant box?
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

For more information on the symlinker, refer to the [Joomla Console](http://www.joomlatools.com/developer/tools/console) documentation or run:

      joomla extension:symlink  --help    
    
### Where can I find phpmyadmin?

After you modify /etc/hosts as shown above you can use phpMyAdmin at

    http://phpmyadmin.joomla.dev
    
### Can I use webgrind? 

After you modify /etc/hosts as shown above go to

    http://webgrind.joomla.dev
    
### Can I sftp into my box?

Use following details to connect:

    Host: 127.0.0.1
    Port: 2222
    User: vagrant
    Password: vagrant
    
### How do I stop the box?

Simply type

```
vagrant halt
```

### How do I destroy a box? 
	
To completely destroy the virtual image, run 

```
vagrant destroy 
```
To create the image again run: 

```
vagrant up
```

## Changelog

The [CHANGELOG](https://github.com/joomlatools/joomla-vagrant/blob/master/CHANGELOG.md) has all the details about the changes done in all releases.

## Contributing

[Fork the project, create a feature branch, and send us a pull request.](../preface/contributing.md)

## Authors

See the list of [contributors](https://github.com/joomlatools/joomla-vagrant/contributors).

## License

This project is licensed under the Mozilla Public License, version 2.0 - see the [LICENSE](https://github.com/joomlatools/joomla-vagrant/blob/master/LICENSE) file for details.


## Further Resources

* [Joomla Vagrant](https://github.com/joomlatools/joomla-vagrant)
* [Vagrant](http://www.vagrantup.com/)
* [VirtualBox](http://www.virtualbox.org/)

Happy coding!
