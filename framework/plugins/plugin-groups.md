---
layout: default
title: Plugin Groups
---        
        
## Component Plugin Groups

The Event API will attempt to load the plugin group based on the component name. Consider the `com_acme` example. Plugins in the `acme` plugin group are loaded when an event is broadcast by the Acme component. For more details check the [_Easy example_](/framework/plugins.html#easy-example).

## Koowa Plugin Group

Grouping plugins based on the name of the component is not required. You can also place your plugin into the `koowa` group. Like the Joomla `system` group, `koowa` plugins load for each page request if the Joomlatools Framework is active. If not, the plugins will not be loaded. Be careful though, loading too many plugins can decrease performance.

To create a `koowa` plugin replace the `PlgAcme` prefix with `PlgKoowa`. After that, place the plugin in the **/plugins/koowa/** directory.  When component events are broadcast, the plugin event handlers get triggered in the same way.

