---
layout: default
title: Internals
---

* Table of Content
{:toc}

## Component Architecture

Joomlatools Framework employs a component based architecture, where components are self contained libraries or applications, some of which
are dispatchable (you can execute them from an HTTP request for example). Think of components like the packages of an SDK and
you should get the picture. This ties in with the composition principle as mentioned above, but more on that later. A component
architecture allows for a greater amount of code re-use amongst and across projects. [Joomlatools Framework Platform](https://github.com/nooku/nooku-platform)
comes with 15+ ready to use components out of the box, from basic article and category management, to versioning, tagging, and activity logs.

At the very heart of Joomlatools Framework is the design principle: **Favor Composition over Inheritance**.

To summarize that principle:

> "you should aim to compose (or add up) the functionality of multiple objects to create some
> sort of composite object, rather than relying on subclassing."

This statement embodies Joomlatools Framework's Component Architecture and development philosophy. Components aren’t the most important concept in the framework,
but they are likely where you will spend most of your time developing. Understanding how they work, can help you leverage the work you do now against other projects.

Components currently fall into two categories:

* Dispatchable components (called extensions)
* Non-dispatchable components

### Dispatchable Components

Dispatchable components can be thought of as applications, that can be accessed through an HTTP request, and can take the form of a blog, shopping cart, user manager, or any other end user application you can dream up, etc.

### Non-Dispatchable Components

Non-dispatchable components are components that are used as building blocks while making other extensions. Examples of this might be a category manager, tagging system, version control, comments, etc.

### HMVC

Components are typically built in the MVC pattern of _Models, Views_ and _Controllers_ and of course, as we'll see later, can contain of other structures.
By using HMVC (more later on the **H**) in Joomlatools Framework, your components can easily be built up from other components.  This in turn,
allows you to maximize code reuse, and speed up your development lifecycle.

Joomlatools Framework's component architecture allows you to use other Components inside Components. Write once use everywhere!

The H of HMVC stands for hierarchical. The principle is that software applications can be built up hierarchically, through the use of composition of other self contained MVC triads. Each MVC triad is only aware of a single incoming request, to a controller, and the request is dispatched as appropriate. The following diagram should help solidify the concept:

![HMVC Triads](/resources/images/hmvc.png)

The power of this concept lies in the simplicity of its implementation, small reusable blocks that make up a larger more complex system. By developing stand alone, self contained MVC triads and components one can build up a system out of predefined parts, in much the same way as you build a house out of lego. It also makes testing a great deal easier, and components can be developed independently and concurrently, thus speeding up development again.

#### What's wrong with MVC?

The problem with MVC (in stateless applications) on its own is that it is often considered a very much one shot execution type deal. You make a request to the web server, some handler intercepts the request, works out what controller to load, executes some action on the controller that gets data from the model, sends model data object the view, renders the view and returns the response to the browser.

![MVC](/resources/images/mvc.jpg)

Though MVC comes in different flavours, control flow is generally as follows:

1. The user interacts with the user interface in some way (for example, presses a mouse button).
2. An HTTP request is sent from the browser to the server.
3. The controller handles the input event from the user interface, often via a registered handler or callback.
4. The controller notifies the model of the user action, possibly resulting in a change in the model's state. (for example, the controller updates the user's shopping cart)
5. A view uses the model indirectly to generate an appropriate user interface (for example, the view lists the shopping cart's contents). The view gets its own data from the model. The model and controller have no direct knowledge of the view.
6. The user interface waits for further user interactions, which restarts the cycle.

All fine and dandy. So what's wrong with the above model?

Well think about most web pages that you visit. Generally they're a collection of different modules or widgets on one page, a collection of different views all assembled in one. Sure, it is possible to achieve the same effect using just MVC, but you will most likely end up having to hack things around, write custom templates to load specific data into a specific view, or even worse get the data yourself and push it into another view, gross.

Take a product page for example. A product page may contain the following features:

* An image gallery
* A video
* Comments
* Related products
* Add to cart

Now in a typical MVC system, each of those parts is either custom coded into the product template, or dynamically included somehow. The problem is, in most cases, the dynamic includes are just including a template file, and that template file goes away and gets the data in order to render itself. This leads to very coupled interfaces that are hard to re-use and more importantly, hard to test. What happens when you want to use the same comments form, including all its styling and functionality, in the new blog section you've just made?

Imagine if each of those elements could be a self contained MVC triad, with its own control logic, data storage and presentation. They could then be shared amongst your application, and even between projects.

#### Why is HMVC better?

HMVC focuses on the idea of modularising your MVC triads such that they can be re-used within any other MVC triad in a **"hierarchical"** fashion, hence HMVC.

![HMVC Triads](/resources/images/hmvc.png)

The image on the left shows a single MVC triad, the image on the right shows a hierarchy of MVC triads, each dispatching a request to the controller of another triad.

This allows you to create complex systems out of pre-existing reusable, modular parts, or in Joomlatools Framework's case, **components**. Each component can be tested on its own, can be built independently and concurrently at the same time as other components, and be re-usable. All this speeds up development and makes your code more structured, and stable.

One of the other major concerns of HMVC is the control aspect. In most MVC implementations, the request for a sub view goes directly to the view, thus bypassing the controller, and any form of ACL that might be implemented. That is BAD! Requests for sub views should go through the controller, this way, all your control logic is loaded just as if the request had come in via HTTP, and everything is kept safe. Also, if your controller implements any form of command chain (as Joomlatools Framework does) then you want those commands to be executed before/after the request as they may perform crucial manipulations of the input/output.

#### How?

Hopefully now you can see the power of HMVC and want to start using it. Joomlatools Framework implements HMVC out fo the box. In fact, it was designed to implement HMVC from the beginning, and uses it extensively throughout the admin interface.

Making an HMVC request is straightforward:

	echo KObjectManager::getInstance()->getObject('com://admin/component.controller.name')->render();

And if you need to set specific state information:

	echo KObjectManager::getInstance()->getObject('com://admin/component.controller.name')->render(array('id' => 5));

The above is essentially the same request that would happen as if it came directly from the browser via HTTP, as such, the controller is unaware it was requested internally. Pretty cool eh?

### BREAD

BREAD is a controller action pattern used to map actions against operations that can be performed on a database record/record set. You've probably heard of CRUD, well BREAD is similar, however it breaks the read action out into two, a crucial difference.

BREAD is an acronym, just like CRUD:

* B - Browse
* R - Read
* E - Edit
* A - Add
* D - Delete

BREAD is implemented within the `KControllerModel` class. This is typically something that can be requested or modified in some way.

#### Actions

##### Browse

The browse action is executed whenever the plural of the view is requested (the controller loaded is always the singular of the view). For example, products, articles, posts. The browse action returns a `KModelEntityRowset` of records returned from the model.

Browse executed contextually based on the plurality of the view via an HTTP GET request and is dispatched via the RENDER action.

##### Read

The read action is executed whenever the singular of the view is requested. For example, product, article, post. The read action always returns a `KModelEntityRow` of the record returned from the model.

Read is executed contextually based on the singularity of the view via an HTTP GET request and is dispatched via the RENDER action.

##### Edit

The edit action modifies an existing record and returns either a 205 (Reset) HTTP status Content, if data was modified, or a 204 (No content) HTTP status if the data was not changed.

Edit is executed contextually based on the uniqueness of the model state. If the model state is unique, then when issuing an HTTP POST request, an edit action will be performed. Edit is dispatched via the POST action.

##### Add

The add action modifies an existing record and returns either a 201 (Created) HTTP status, if a new record is created, or an exception is thrown if the record could not be created.

Add is executed contextually based on the uniqueness of the model state. If the model state is unique, then when issuing an HTTP POST request, an add action will be performed. Add is dispached via the POST action.

##### Delete

The delete action deletes a record or a set of records. A 204 (No content) HTTP status is returned if the record is deleted, an exception is thrown if not. Delete is dispatched directly via the HTTP Delete method.

#### Why?

Separating browse and read allows for more flexibility, specifically with testing, behaviors, events, etc. Standardising on the above structure allows a base controller to handle the majority of requests to retrieve or modify a record.

Most actions that apply to a record fall into the 5 categories above. If you find yourself having to create additional custom actions, then chances are, they can be better represented by the above 5. You should not implement actions like actionPublish() or actionEnable(). Those should be achieved through an edit action and passing the data to change as context. Binding context into your action names decreases flexibility, forces you to write more duplicate code, and makes testing more laborious.

#### Notes

The default controller extends the model controller, so for most controllers that map to records (e.g. database tables), you do not need to create your controller file/class, Joomlatools Framework will handle finding the right controller for you.

Bearing that in mind, if you need to create a view that is not associated with a record, like a static text for example, then you must create a controller class that extends `KControllerView`
