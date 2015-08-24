---
layout: default
title: Dispatcher Events
---

## Introduction

Until now the focus was on the MVC layer of a component using `com_acme` as an example. For each MVC triad there are twenty-two plugin events that get broadcast via the Event API.

However, there are another twenty-two plugin events that a plugin can tap into. Each component has a dispatcher. The dispatcher acts as a [component front controller](https://en.wikipedia.org/wiki/Front_Controller_pattern). It routes the request to the correct controller, which then handles it form there.
			
The abstract dispatcher [`KDispatcherAbstract`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php#L16) has four action methods:		
		
|method|description|
|:---------|:---------------|
|[`_actionDispatch`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php)| Loads the controller and executing the right action on the controller. |
|[`_actionForward`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php)| Handles the redrection of a request after the `dispatch` method has done its work |
|[`_actionFail`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php)| Prepares an `Exception` response for the client |
|[`_actionSend`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/abstract.php)| Used to send the response to the client |


<!--`_actionDispatch, _actionForward, _actionFail,` and `_actionSend`		-->
		
The HTTP dispatcher [`KDispatcherHttp`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php) adds seven more actions which correspond to the HTTP methods:

|method|description|
|:---------|:---------------|
|[`_actionHead`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php#L204)|Respond to request with headers only|
|[`_actionOptions`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php#L341)|Respond with HTTP verbs allowed by controller for the authenticated user|	
|[`_actionGet`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php#L171)|Execute the GET request against the right controller|
|[`_actionPost`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php#L225P)|Interpret the POST request to determine the right non-safe action to take, i.e. `add`, `edit`, `delete` |
|[`_actionPut`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php#L275)|Results in an `add` or `edit` action being called on the controller.|	
|[`_actionDelete`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php#L321)|Handles the request made with DELETE HTTP method. Will execute `delete` on the controller.|
|[`_actionRedirect`](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php#L152)|Handles redirection after dispatching is complete, of if called from another dispatcher method|
		
  
## `PlgAcmeExample` with a Dispatcher Event Handler

Your plugin can control how any Joomlatools component handles the actions described above. A few example uses: 

+ component wide access control
+ HTTP method restriction
+ request logging
+ override all controller redirects

You should use the dispatcher event handlers only when you want to effect a component when it's being dispatched. If you wish to intercept an event for a specific entity, use one of the MVC event handlers.       

Here is the `PlgAcmeExample` with a new event handler. It checks that any POST request coming into `com_acme` has a `foo` variable before allowing the dispatcher to continue. 

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

Note: The naming convention is close to the MVC listeners, but there is no entity: 

on + [Before] + [Acme] + [Dispatcher] + [Post] 

