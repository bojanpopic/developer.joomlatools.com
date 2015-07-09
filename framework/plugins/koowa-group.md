# Plugin groups		
		
Our [_Easy example_](/framework/plugins.html#easy-example) is part of the **acme** plugin group. This is consistent with the class prefix `PlgAcme`. The Event API will look for the component name and attempt to load a plugin group that matches.  
		
Putting plugins in a group named for your component is not a requirement though. You are free to place all plugins into the **koowa** group, though this approach increases overhead because all **koowa** plugins are loaded for each request.  
		
To create such a plugin simply replace the `PlgAcme` prefix with `PlgKoowa` and move it to the **/plugins/koowa** folder. When the same `onAfterAcmeBarControllerBrowse` event is broadcast, the Event API will notify that method in exactly the same way. 