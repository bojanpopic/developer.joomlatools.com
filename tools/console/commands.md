---
layout: default
title: Commands
---

<ul>
{% for namespace in site.data.joomla-console.namespaces %}
{% if namespace.id != '_global' %}
<li><a href="/tools/console/commands/{{ namespace.id }}.html">{{ namespace.id | capitalize }}</a></li>
{% endif %}
{% endfor %}
</ul>