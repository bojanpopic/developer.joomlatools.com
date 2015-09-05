---
layout: default
title: Commands
---

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

* Syntax: `{{ info.usage }}`

{{ info.help }}
					
					{% break %}
				{% endif %} 
		
			{% endfor %}		
		
[Back to top](#markdown-toc)
		
		{% endfor %}
	{% endif %}
{% endfor %}