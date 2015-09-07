---
layout: default
title: Commands
---

All interactions are done through the command-line interface.

If you run `joomla` by itself, help will be displayed showing all available commands. In addition to this, you can run any `joomla` command with the `-h` flag to output help about that specific command.

For example, try running `joomla site:create -h`. The help will output a one sentence synopsis of what the command does as well as a list of all the options the command accepts.

In depth documentation and use cases of all Console commands:

<ul>
{% for namespace in site.data.joomla-console.namespaces %}
{% if namespace.id != '_global' %}
<li><a href="/tools/console/commands/{{ namespace.id }}.html">{{ namespace.id | capitalize }}</a></li>
{% endif %}
{% endfor %}
</ul>