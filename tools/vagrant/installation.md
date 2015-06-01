# Installation

1. Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
1. Install [Vagrant](https://www.vagrantup.com/downloads.html)
1. Run the following commands in a folder of your choice:

    ```bash
vagrant init joomlatools/box
vagrant up
    ```

1. This will download the complete [Vagrant box](https://atlas.hashicorp.com/joomlatools/boxes/box) and get it running.

1. Add the following line into your ***hosts file*** (`/etc/hosts` on Linux and Mac OS X, for other operating systems see [here](http://en.wikipedia.org/wiki/Hosts_(file)#Location_in_the_file_system))

    ```
33.33.33.58 joomla.box webgrind.joomla.box phpmyadmin.joomla.box
    ```

1. The dashboard is now available at [joomla.box](http://joomla.box)

There will be two new folders created called `www` and `Projects`. These folders act as shared folders between your host computer and the box.

If everything is setup, we will show you how to install your first Joomla site on the  [getting started page](getting-started.md).
