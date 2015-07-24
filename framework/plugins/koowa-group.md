# Plugin groups        
        
## Component Plugin Groups

The Event API will use the component name to attempt to load the plugin group that matches. Consider the `com_acme` example from the [Plugins topical guide](/framework/plugins.html). The `acme` plugin group loads the first time the component  `_action` method executes. The [_Easy example_](/framework/plugins.html#easy-example) is part of that group and loads as a result. 

You can create similar plugins for any Joomlatools component and group them together. 

## Koowa Plugin Group

Grouping your plugins on the name of the component is not required. You are free to place all plugins into the `koowa` group. Like the `system` group plugins, `koowa` plugins load for each page request. Be careful though, this the increases overhead of your application. 


To create a `koowa` plugin replace the `PlgAcme` prefix with `PlgKoowa`. After that, place the plugin in the **/plugins/koowa/** folder.  When component events are broadcast, the plugin event handlers get notified the same way.

