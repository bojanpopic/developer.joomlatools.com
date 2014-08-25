# Installation

1. Download or clone the [console](https://github.com/joomlatools/joomla-console) repository.

1. Make the 'joomla' command executable:

    `$ chmod u+x /path/to/joomla-console/bin/joomla`

1. Configure your system to recognize where the executable resides. There are 3 options:
    1. Create a symbolic link in a directory that is already in your PATH, e.g.:

        `$ ln -s /path/to/joomla-console/bin/joomla /usr/bin/joomla`

    1. Explicitly add the executable to the PATH variable which is defined in the the shell configuration file called .profile, .bash_profile, .bash_aliases, or .bashrc that is located in your home folder, i.e.:

        `export PATH="$PATH:/path/to/joomla-console/bin:/usr/local/bin"`

    1. Add an alias for the executable by adding this to you shell configuration file (see list in previous option):

        `$ alias joomla=/path/to/joomla-console/bin/joomla`

    For options 2 and 3 above, you should log out and then back in to apply your changes to your current session.

1. Test that joomla executable is found by your system:

    `$ which joomla`

1. From joomla-console root (/path/to/joomla-console), run Composer to fetch dependencies.

    `$ composer install`

Congratulations, you can now use the console from anywhere on your system!