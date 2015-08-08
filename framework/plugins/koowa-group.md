---
layout: default
title: Plugin Groups
---        
        
## Component Plugin Groups

The Event API will use the component name to attempt to load the plugin group that matches. Consider the `com_acme` example. The `acme` plugin group loads the first time the component  `_action` method executes. Check the [_Easy example_](/framework/plugins.html#easy-example); it's part of that group and loads as a result. 

You can create similar plugins for any Joomlatools component and group them together. 

## Koowa Plugin Group

Grouping your plugins on the name of the component is not required. You are free to place all plugins into the `koowa` group. Like the `system` group plugins, `koowa` plugins load for each page request if the Joomlatools Framework is active. If not, the plugins will not be loaded. Be careful though, loading too many plugins can decrease performance. 

To create a `koowa` plugin replace the `PlgAcme` prefix with `PlgKoowa`. After that, place the plugin in the **/plugins/koowa/** folder.  When component events are broadcast, the plugin event handlers get triggered in the same way.

