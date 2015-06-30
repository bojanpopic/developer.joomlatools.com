---
layout: default
title: Plugins
---

By integrating LOGman with another component, activities from the latest will get logged and made available in a variety of forms: HTML/JSON Activity Streams, CSV exports, etc.

Components can be integrated with LOGman by creating LOGman plugins.

These plugins deal with all the aspects of the logging process, and optionally, they may also define how these activities get rendered.

Sections [1.2.1.1](joomla.md) and [1.2.1.2](nooku.md) explain in detail how to build LOGman plugins for Joomla! and Nooku powered components respectively. The way they are written differs and depend on the Framework the components are built on.

The activity API is presented in section [1.2.1.3](activities.md). This API allows to define the inner behavior of an activity resource. By overriding activity objects, we may take control over the activity data and how this data gets exposed and/or consumed. This guide is particularly aimed for experienced developers looking forward to use the LOGman API to its full potential.