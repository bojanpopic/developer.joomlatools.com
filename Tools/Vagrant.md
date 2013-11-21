# Vagrant

## The Problem

You are a Joomla web agency and you have a team of 10 developers and designers working on various projects. Some of your staff is using Ubuntu, most are on Mac OS and a few are still on Windows.

Imagine your team is working on two projects with completely different stacks: Joomla, PHP, server setup, tools, … are all different. How can you develop both projects at the same time and keep everything in sync?

Setup different local servers, one for each project? That’s a lot of overhead. Work remotely all the time, slow and time consuming. Use a tool like WAMP or MAMP or a set of command line scripts for Bash, … All great options, yet none of them are ideal.

What about when a new developer joins your team? He will need to spend half a day setting up his machine. And another half for that new project coming up. Time lost from actual coding work.

What about fixing that nasty bug your co-worker reported but you still cannot replicate? It works on your machine, right?

There should be a better way to do this!

## Meet Vagrant

Vagrant is a tool for managing virtual machines from providers such as VMWare and Virtualbox.

It lets you create, setup and destroy virtual machines with a single command. It comes with base operating system builds called boxes and server provisioning software to make it easy to install and configure the virtual machine to your needs.

```
vagrant
```

Using Vagrant with Virtualbox, you can set up a Joomla development environment from scratch in minutes.

## Joomla in a box

At Joomlatools we have been using our own Joomla box for a while now in favor of MAMP. Vagrant has helped us a lot to streamline our teams workflow and be more productive.

Setting up a new Joomla development environment takes minutes. We don’t have to install 20 different tools one by one and then configure them to your needs. Just bootup Vagrant and we are set.
Each of our team members always has the exact same configuration running which makes “works on my machine” an old excuse.

Testing new releases of our extensions with different configurations becomes very easy. We can simply instantiate another box, upgrade to another PHP version do testing and destroy the box afterwords.
If you are not happy with the default setup provided, just fork the repo and change the provisioning scripts to suit your exact needs.

## Try it yourself

Go to [Joomla Vagrant](https://github.com/joomlatools/joomla-vagrant) repository on Github and follow the instructions to setup your own Joomla in a box.

Happy coding !