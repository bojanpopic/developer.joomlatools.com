---
layout: default
title: Joomlatools Framework
---

All of Joomlatools extensions are powered by the Joomlatools Framework. A solid, modern framework and lean architecture for building Joomla extensions.

Joomlatools Framework is a modern PHP framework for Joomla, which provides a number of amazing features to extensions that use it. It provides an unparalleled combination of **flexibility, re-usability** and **extensibility**. 

Our goal is to make it easier for developers to create more powerful custom extensions.

## Features

<div class="container features">
    {% for feature in site.data.features.items %}
    <div class="features__feature">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
    </div>
    {% endfor %}
</div>
