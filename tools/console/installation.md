---
layout: default
title: Installation
---

1. Install using Composer:

 `$ composer global install joomlatools/joomla-console`

1. Tell your system where to find the executable by adding the composer directory to your PATH. Add the following line to your shell configuration file called either .profile, .bash_profile, .bash_aliases, or .bashrc. This file is located in your home folder.

 `$ export PATH="$PATH:~/.composer/vendor/bin"`

1. Verify the installation

 `$ joomla --version`

Congratulations, you are now ready to use the `joomla` console tool.
