# Dispatcher Plugin Events

In the [Plugins topical guide](/framework/plugins.md) the focus was on the MVC layer of a component using `com_acme` as an example. We established that for each entity type there are twenty two plugin events that get broadcast via the Event API. 
There are another twenty two plugin events that a Framework powered component can tap into. Each component has a dispatcher that acts as a bridge between the MVC and the Joomla dispatching process and gets used before the MVC layer is touched. [`KDispatcherAbstract`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php#L16) is a special instance of [`KControllerAbstract`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/abstract.php#L16). This means its `_action` methods also get exposed through the Events API. 		
		
`KDispatcherAbstract` has four action methods:		
		

|method|description|
|:---------|:---------------|
|[`_actionDispatch`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php)| Handles loading the controller and executing the right action on the controller. |
|[`_actionForward`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php)| Handles the redrection of a request after the `dispatch` method has done its work |
|[`_actionFail`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php)| Handles preparation of an `Exception` response for the client |
|[`_actionSend`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php)| Handles preparation of an `Exception` response for the client |


<!--`_actionDispatch, _actionForward, _actionFail,` and `_actionSend`		-->
		
The HTTP dispatcher ([`KDispatcherHttp`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php)), which extends from that abstract, adds seven more actions. The majority of these correspond to HTTP methods:		
		
`_actionHead, _actionOptions, _actionGet, _actionPost, _actionPut, _actionDelete` and `_actionRedirect`		
		
The end result is that the `Acme` component dispatcher, i.e. `com://site/acme.dispatcher.http` would have **before** and **after** events published for each of these eleven actions. That means that the `Acme` component automatically broadcasts another twenty-two events.
  
## `PlgAcmeExample` with a Dispatcher Event Handler

{% highlight php %} 
class PlgAcmeExample extends PlgKoowaSubscriber
{
...

    function onBeforeAcmeDispatcherPost(KEventInterface $event)
    {
	    if(!$event->getSubject()->getRequest()->foo) {
		    JFactory::getApplication()->redirect('/', 'You have no Foo!');  
		}      
	}
}
{% endhighlight %}

The example above shows the `PlgAcmeExample` with a new event handler to be fired **before** the dispatch action is executed, and so effects every POST that comes to the component, no matter what entity the input is meant for.  
