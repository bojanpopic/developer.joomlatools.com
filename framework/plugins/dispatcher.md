## Advanced: Dispatcher Plugin Events
		
In [Plugins](./plugins.md), we focused entirely on the MVC layer of a component, using `com_acme` as an example. Each component however has a component dispatcher that acts as a bridge between the MVC and the Joomla dispatching process. [`KDispatcherAbstract`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php#L16) descends from [`KControllerAbstract`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/abstract.php#L16) so it also gets exposed through the Events API. In this instance there is no specific entity, i.e. no `Bar`, but there is a specific protocol based strategy, in many cases `Http`.		
		
As of the 2.0 Release the abstract dispatcher has four action methods:		
		
`_actionDispatch, _actionForward, _actionFail,` and `_actionSend`		
		
The HTTP dispatcher ([`KDispatcherHttp`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php)), which extends from that abstract, adds seven more actions, the majority of which correspond to HTTP methods:		
		
`_actionHead, _actionOptions, _actionGet, _actionPost, _actionPut, _actionDelete` and `_actionRedirect`		
		
That means our `Acme` component dispatcher, i.e. `com://site/acme.dispatcher.http` would have **before** and **after** events published for each of these eleven actions. Therefore, our  `Acme` component automatically broadcasts another twenty-two events.