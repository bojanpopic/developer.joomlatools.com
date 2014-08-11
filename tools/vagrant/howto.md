# How To Use

* Install [VirtualBox](http://www.virtualbox.org/)
* Install [Vagrant](http://downloads.vagrantup.com/)
* Run the following commands in a folder of your choice:

```bash
    $ vagrant init joomlatools/box
    $ vagrant up
```
    
* This will download the Vagrant box and get it running. 

Note that this requires a 700 MB download for the first run and Vagrant version 1.5 or later. If you want to perform an offline installation or on an older Vagrant version, [download the box here](https://vagrantcloud.com/joomlatools/box/version/1/provider/virtualbox.box) and run the following commands instead:

```bash
    $ vagrant init joomlatools/box /path/to/download/joomlatools-box-1.2.box
    $ vagrant up
```

* Add the following line into your **hosts file** (/etc/hosts on Linux and MacOS, for other operating systems see [here](http://en.wikipedia.org/wiki/Hosts_%28file%29#Location_in_the_file_system)): `33.33.33.58 joomla.dev webgrind.joomla.dev phpmyadmin.joomla.dev`

And you are done. There will be two new folders created called www and Projects.