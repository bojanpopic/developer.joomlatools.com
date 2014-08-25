# Vagrant

## Introduction

You are a Joomla web agency and you have a team of 10 developers and designers working on projects. Some of your staff is using Ubuntu, most are on Mac OS, a few are still on Windows. Further your team is working on various projects with completely different stacks: Joomla, PHP, server setup, tools… all are different.

You could set up different local servers, one for each project? That’s a lot of overhead. Work remotely all the time, slow and time consuming. Use a tool like WAMP or MAMP or a set of command line scripts for Bash… All great options, yet none of them are ideal.

What about when a new developer joins your team? He will need to spend half a day setting up his machine. And another half for that new project coming up. Time lost from actual coding work. Or how about fixing that nasty bug your co-worker reported but you still cannot replicate? It works on your machine, right?

There should be a better way to do this!

## Vagrant to the rescue!

[Vagrant](http://vagrantup.com) is a tool for managing virtual machines from providers such as VMWare and Virtualbox.

It lets you create, setup and destroy virtual machines with a single command. It comes with a base operating system and builds called boxes and server provisioning software to make it easy to install and configure the virtual machine to your needs.

By downloading our pre-built [Vagrant box](https://github.com/joomlatools/joomla-vagrant), you can set up a Joomla development environment from scratch in minutes.
