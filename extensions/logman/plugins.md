---
layout: default
title: Plugins
---

Components can be integrated with LOGman by creating LOGman plugins.

These plugins deal with all the aspects of the logging process, and optionally, they may also define how these activities get rendered.

The way LOGman plugins are written differs and depend on the Framework the components are built on:

* [Joomla](plugins/joomla.html) 
* [Nooku](plugins/nooku.html)

The [activity API](plugins/activity-api.html) allows to define the inner behavior of an activity resource. By overriding activity objects, we may take control over the activity data and how this data gets exposed and/or consumed. This guide is particularly aimed for experienced developers looking forward to use the LOGman API to its full potential.