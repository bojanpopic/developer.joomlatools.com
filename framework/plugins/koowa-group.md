# Plugin groups		
		
## Component Plugin Groups

When a component action results in the broadcast of an event, the Event API will use the component name and attempt to load the plugin group that matches. Consider the `com_acme` example from the [Plugins topical guide](/framework/plugins.html). The `acme` plugin group is loaded the first time an `_action` method is executed in that component. The [_Easy example_](/framework/plugins.html#easy-example) is part of the **acme** plugin group (because it has the `PlgAcme` class prefix) and would be loaded. You can create plugins for any Joomlatools component and group them together. 

## Koowa Plugin Group

Grouping your plugins on the name of the component is not a requirement. You are free to place all plugins into the `koowa` group. Like the `system` group plugins, `koowa` plugins are loaded for each page request. Be careful though, this the increases overhead of your application.      
		
To create such a plugin simply replace the `PlgAcme` prefix with `PlgKoowa` and move it to the **/plugins/koowa/** folder. Now when the `onAfterAcmeBarControllerBrowse` event is broadcast, the Event API will notify that method in exactly the same way. 

