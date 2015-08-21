---
layout: default
title: Internals
---

## Composition Over Inheritance

Joomlatools Framework focuses on _favoring composition over inheritance_, a fairly new concept to PHP. This one point is more important than perhaps
any other concept in Joomlatools Framework. The reason for this is that most other frameworks out there are based on inheritance to extend
functionality, causing bloated classes that often end up containing way more inherited methods than they actually need,
and poor code reuse due to PHP’s lack of multiple inheritance (prior to 5.4) that leads to copy/paste programming. The end
result is code that is hard to manage, poor resource usage, higher memory footprint, little to no code reuse and general
'miserability' amongst developers.

[Read more](internals/composition.html)

## Component Architecture

Joomlatools Framework employs a component based architecture, where components are self contained libraries or applications, some of which
are dispatchable (you can execute them from an HTTP request for example). Think of components like the packages of an SDK and
you should get the picture. This ties in with the composition principle as mentioned above, but more on that later. A component
architecture allows for a greater amount of code re-use amongst and across projects. [Joomlatools Framework Platform](https://github.com/nooku/nooku-platform)
comes with 15+ ready to use components out of the box, from basic article and category management, to versioning, tagging, and activity logs.

[Read more](internals/component-architecture.html)
