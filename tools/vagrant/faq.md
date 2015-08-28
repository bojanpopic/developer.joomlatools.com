---
layout: default
title: FAQs
---

* Table of Content
{:toc}

## I don't like the command line! Is there another way to manage the Vagrant box?

There's a great tool we use to start and manage our Vagrant boxes once you've installed them, called [Vagrant Manager](http://vagrantmanager.com/).  It is currently available on OS X only, though!

If the Vagrant box is running, you can execute commands on the box using just your browser. All you need is to browse to the [web terminal](http://joomla.box:3000/). No need to connect via the command line at all.

## How can I access the command line on the box?

You can always run commands via the web terminal, accessible at [joomla.box:3000](http://joomla.box:3000) as soon as the box is up.

Alternatively, you can SSH into the box by using the command:

	vagrant ssh

## How can I access the MySQL databases?

The MySQL server on the box runs with these default user credentials:

* User: root
* Password: root

So to connect via PHP you would pass in these details:

{% highlight php %}
$connection = mysqli_connect('localhost', 'root', 'root', 'mydatabase');
{% endhighlight %}

If you prefer to, you can use phpMyAdmin at [phpmyadmin.joomla.box](http://phpmyadmin.joomla.box) if you setup your hosts file correctly, as described in the installation steps.

We highly recommend the [Sequel Pro](http://www.sequelpro.com/) desktop client on Mac OS X over the use of phpMyAdmin however. You can connect to the database using a desktop client with the following details:

* Host: 33.33.33.58
* User: root
* Password: root

## Where are the error logs and access logs?

You can access Apache, MySQL and system logs via the browser at [joomla.box/pimpmylog](http://joomla.box/pimpmylog).

## How to test e-mails?

We have installed [MailCatcher](http://mailcatcher.me) on the box. You can access it via the [dashboard](http://joomla.box).

PHP is configured to automatically send any mail to MailCatcher. You can test this real quick by creating a new Joomla site, creating a contact form and submitting it. Your message will show up in [MailCatcher](http://joomla.box:1080/) immediately.

If your applications use SMTP, you can configure your SMTP server as follows to send everything to MailCatcher:

* IP: 127.0.0.1
* Port: 1025

## Where can I find phpMyAdmin?

After you modify /etc/hosts as shown above you can use phpMyAdmin at

    http://phpmyadmin.joomla.box

## How can I use PhpMetrics?

To gather various metrics about your PHP project, you can invoke [PhpMetrics](https://github.com/Halleck45/PhpMetrics) from the command line. Please note that PhpMetrics uses a lot of memory and so it is best to increase the allowed memory limit first.

Let's say you want to analyze the `mysite` site which you installed using `joomla site:create mysite`:

1. Open up the [web terminal](http://joomla.box:3000)
1. Increase the memory limit:

{% highlight bash %}
box php:ini memory_limit 1024M
{% endhighlight %}

1. Now run phpmetrics:

{% highlight bash %}
phpmetrics --report-html=/var/www/mysite/report.html /var/www/mysite
{% endhighlight %}

1. Revert the memory limit to its original value:

{% highlight bash %}
box php:ini memory_limit 256M
{% endhighlight %}

1. Read the generated report at [joomla.box/mysite/report.html](http://joomla.box/mysite/report.html).

## How to use Webgrind?

After you modify /etc/hosts as shown above go to

    http://webgrind.joomla.box

## Can I SFTP into my box?

Use following details to connect:

* Host: 127.0.0.1
* Port: 2222
* User: vagrant
* Password: vagrant

## How do I stop the box?

Run `vagrant halt` to stop the box.

## How can I update the box to the latest version?

If a new version of the box is released, Vagrant will let you know when you run `vagrant up`. It's important to note that Vagrant stores the original box separately. Your running Vagrant environment is actually a _copy_ of that box. From the [Vagrant docs](https://docs.vagrantup.com/v2/boxes/versioning.html):

> Finally, you can update boxes with vagrant box update. This will download and install the new box. This will not magically update running Vagrant environments. If a Vagrant environment is already running, you'll have to destroy and recreate it to acquire the new updates in the box. The update command just downloads these updates locally.

In short: if you have important data *on* the box, be sure to back it up first. You could use our [backup plugin](https://github.com/joomlatools/joomla-console-backup) to backup website files and databases.

In summary, you need to run these commands to update a box:

{% highlight bash %}
vagrant box update
vagrant destroy
vagrant up
{% endhighlight %}

## How do I destroy a box?

To completely destroy the virtual image, run `vagrant destroy`.

To create the image again run `vagrant up`.
