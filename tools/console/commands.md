---
layout: default
title: Commands
---

{% assign ignored = "no-interaction,ansi,help,no-ansi,quiet,verbose,version" | split:"," %}

* Table of Content
{:toc}

{% for namespace in site.data.joomla-console.namespaces %}

  	{% if namespace.id != '_global' %}
  	
## {{ namespace.id | capitalize }}

	{% for command in namespace.commands %}
		
### {{ command }}
		
		{% for info in site.data.joomla-console.commands %}
	
			{% if info.name == command %}
{{ info.description }}

> Syntax: `{{ info.usage }}`

{{ info.help | process_help }}

<table>
  {% if info.definition.arguments.size > 0 %}
  <thead>
    <tr>
      <th>Arguments</th>
      <th colspan="2">&nbsp;</th>
    </tr>
  </thead>
  <tbody>
	{% for hash in info.definition.arguments %}
		<tr>
		    <td>{{ hash[0] }}</td>
			<td colspan="2">{{ hash[1].description | escape }}</td>
		</tr>
	{% endfor %}
  </tbody>
  {% endif %}
  {% if info.definition.options.size > ignored.size %}
  <thead>
    <tr>
      <th>Options</th>
      <th>&nbsp;</th>
      <th>Default</th>
    </tr>
  </thead>
  <tbody>
	{% for hash in info.definition.options %}
		{% unless ignored contains hash[0] %}
			<tr>
			    <td>{{ hash[1] | option_to_html }}</td>
				<td>{{ hash[1].description | escape }}</td>
				<td>
					{% if hash[1].default != blank %}
						{{ hash[1].default | escape }}
					{% endif %}
				</td>
			</tr>
		{% endunless %}
	{% endfor %}
  </tbody>
  {% endif %}
</table>
			
				{% break %}	
			{% endif %} 
			
		{% endfor %}		

[Back to top](#markdown-toc)

		{% endfor %}
	{% endif %}
{% endfor %}