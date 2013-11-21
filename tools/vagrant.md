# Vagrant

## The Problem

You are a Joomla web agency and you have a team of 10 developers and designers working on projects. Some of your staff is using Ubuntu, most are on Mac OS, a few are still on Windows. Further your team is working on various projects with completely different stacks: Joomla, PHP, server setup, tools… all are different.

You could set up different local servers, one for each project? That’s a lot of overhead. Work remotely all the time, slow and time consuming. Use a tool like WAMP or MAMP or a set of command line scripts for Bash… All great options, yet none of them are ideal.

What about when a new developer joins your team? He will need to spend half a day setting up his machine. And another half for that new project coming up. Time lost from actual coding work. Or how about fixing that nasty bug your co-worker reported but you still cannot replicate? It works on your machine, right?

There should be a better way to do this!

## How Vagrant Can Help You?

[Vagrant](http://vagrantup.com) is a tool for managing virtual machines from providers such as VMWare and Virtualbox.

It lets you create, setup and destroy virtual machines with a single command. It comes with a base operating system and builds called boxes and server provisioning software to make it easy to install and configure the virtual machine to your needs.

```
vagrant
```

Using Vagrant with Virtualbox, you can set up a Joomla development environment from scratch in minutes.

## How To Use

* Install [VirtualBox](http://www.virtualbox.org/)

* Install [Vagrant](http://downloads.vagrantup.com/)

Clone this repository

```
$ git clone https://github.com/joomlatools/joomla-vagrant.git
```

Go to the repository folder and create the box

```
$ cd joomla-vagrant
$ vagrant up
```

There will be two folders created in that folder called `www` and `projects`.

Add the following line to your `/etc/hosts`

```
33.33.33.58 webgrind phpmyadmin
```

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

It is advised to use virtual hosts for development. See below for our virtual host manager.

### Can I SSH into my box?

You can reach the box by using the command:

	$ vagrant ssh
	
### Can I create a new site from the command line?

This is a script developed by Joomlatools to ease the management of Joomla sites from command line.

To create a site with it, SSH into the box and then run

    joomla create testsite

Add the following line into your /etc/hosts file

    33.33.33.58 testsite.dev

Now you can reach www/testsite folder from the domain testsite.dev

For more information try running:

    joomla --help
    
    
### Yo dude where is my phpmyadmin?

After you modify /etc/hosts as shown above you can use phpMyAdmin at

    http://phpmyadmin
    
### Can I use webgrind? 

After you modify /etc/hosts as shown above go to

    http://webgrind
    
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

## Further Resources

* [Joomla Vagrant](https://github.com/joomlatools/joomla-vagrant)
* [Vagrant](http://www.vagrantup.com/)
* [VirtualBox](http://www.virtualbox.org/)

Happy coding!