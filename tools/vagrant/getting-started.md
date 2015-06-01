# Getting started

1. Once you have installed the box, open up the web terminal by browsing to [joomla.box:3000](http://joomla.box:3000). _Alternatively, you can SSH into the box from the command line with the `vagrant ssh` command._

1. Create your first Joomla website with this command:

    ```
joomla site:create mysite
    ```

1. Your new site is available at [joomla.box/mysite](http://joomla.box/mysite). You can login using the credentials  `admin` / `admin`.

    _Note_: the box always creates a separate virtual host for every Joomla installation but you have to add the hostname to your `/etc/hosts` file yourself. After adding the `33.33.33.58 mysite.dev` line you can browse to the site via [mysite.dev](http://mysite.dev).

Now that you have a fresh Joomla installation, you can now [symlink](../console/usage.md#symlink-your-code-into-a-joomla-installation) and [install your custom extensions](../console/usage.md#install-joomla-extensions) into this site.

This can all be done using the `joomla` command, which is the  [Joomla Console](../console/usage.md) package that is preinstalled on the box. It has everything you need to work with Joomla sites and is the most important piece of our Vagrant box.

To find out more about its options and usage, you can get an overview by running the `joomla list` command, or head over to the [documentation pages](../console/usage.md) for a full explanation.
