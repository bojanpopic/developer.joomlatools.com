---
layout: default
title: Controller
---

The core Controller package does a great job with handling the standard Browse, Read, Edit, Add and Delete (BREAD) requests and the action of rendering of those requests. Each of those expose before and after command chains, and we use a number of behaviors out of the box to augment Controller functionality and interface.

+ **Findable** - Special Joomla-centric behavior that handles updating the search index in Joomla when an entity is updated itself
+ **Cacheable** - Another Joomla-centric behavior to handle the caching of requests based on state and the invalidation of that cache when an entity changes.
+ **Persistable** - Persist the state of a request to the session and load them back into a current state of a subsequent request where the view, model type, layout and action are the same. Helps with browsing.
+ **Editable** - Places three additional action methods in a controller's interface: `save`, `add` and `apply` and handles setting and retrieving the redirect URL based on the `referrer` cookie information. Used in heavy conjuction with the [Toolbar](https://github.com/nooku/nooku-framework/tree/master/code/libraries/koowa/libraries/controller/toolbar) package.
+ **Permissible** - Provides the interface for handling whether of not a specific BREAD or `render` action can be performed.