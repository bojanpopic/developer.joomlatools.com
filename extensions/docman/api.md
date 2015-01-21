FORMAT: 1A
HOST: http://demo.joomlatools.com/joomla3/

# DOCman API

The DOCman JSON API is built on top of the [Nooku Framework](http://nooku.org). The default JSON response documents in Nooku are inspired by the [JSON API specification](http://jsonapi.org).
For a deeper look at how the core JSON format actually gets built have a look our write up about JSON at http://guides.nooku.org/JSON.html .

The responses used below are taken directly from http://demo.joomlatools.com/joomla3/ and can be duplicated there.

**A Valid Item ID**

DOCman requests must be associated with a valid Joomla! menu item **(Itemid)**, and the following API documentation assumes you will add it with each request.**

**PHP Examples and Plugin Events**

Included in each request type is the PHP API analogue. It shows you how you would do the same operation from inside the code. Also, a list of
relevant plugin events that you can make use of to alter the input or output of a particular request.


# Group Documents

## Documents Collection [/?option=com_docman&{&view,slug,created_by,category,limit,offset,sort,direction}]

```php
    // Get a list of documents through the controller for a given set of parameters.
    $documents = KObjectManager::getInstance()
                        ->getObject('com://docman.controller.document')
                        ->category(24)
                        ->sort('title')
                        ->browse();
```

** Relevant Plugin Events **


|**Before** | **After**|
|-----------|----------|
|onBeforeDocmanControllerDocumentRender | onAfterDocmanControllerDocumentRender|
|onBeforeDocmanControllerDocumentBrowse | onAfterDocmanControllerDocumentBrowse|
|onBeforeDocmanModelDocumentFetch | onAfterDocmanModelDocumentFetch|
|onBeforeDocmanModelDocumentCount | onAfterDocmanModelDocumentCount|


See:
[KControllerModel::_actionBrowse(KControllerContextInterface $context)](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/model.php#L195)

### List a subset of Documents [GET]

+ Parameters
    + view (required, string, `documents`) ... The view choices are **filteredlist, userlist, list** or **documents**.
    + slug (optional, string, `baking`) ... The slug is used to specify the category that the documents should belongs to.
    + category (optional, int, `24`) ... Is used to specify the category that the list of documents should belong to.
    + sort (optional, string, `title`) ... Column used to sort the results in the response.
    + direction (optional, string, `asc`) ... The direction of the resulting sort. The default is 'asc'.
    + offset (optional, int, `6`) ... Defines the beginning of the subset of entities.
    + limit (optional, int, `2`) ... Defines the number entities that should be returned in the response.

+ Request /?option=com_docman&view=documents&limit=2&offset=6&Itemid=126 (application/json)

+ Response 200

      + Body
        {
         "version": "1.0",
          "links": {
            "self": {
              "href": "http://demo.joomlatools.com/joomla3/?option=com_docman&view=documents&limit=2&offset=6&Itemid=126&format=json",
              "type": "application/json; version=1.0"
            },
            "next": {
              "href": "http://demo.joomlatools.com/joomla3/?option=com_docman&view=documents&limit=2&offset=8&Itemid=126&format=json",
              "type": "application/json; version=1.0"
            },
            "previous": {
              "href": "http://demo.joomlatools.com/joomla3/?option=com_docman&view=documents&limit=2&offset=4&Itemid=126&format=json",
              "type": "application/json; version=1.0"
            }
          },
          "meta": {
            "offset": 6,
            "limit": 2,
            "total": 73
          },
          "entities": [
            {
              "id": "41",
              "uuid": "8b5aecd9-8db3-4fb5-805c-34f8f4f4d947",
              "title": "Car example",
              "slug": "car-example-3",
              "docman_category_id": "9",
              "description": "<p>Etiam porta sem malesuada magna mollis euismod. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec id elit non mi porta gravida at eget metus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum.</p>",
              "image": "cars/ford-64041_640.jpg",
              "storage_type": "file",
              "storage_path": "cars/cars.pdf",
              "created_by": "690",
              "alias": "41-car-example-3",
              "access_title": "Public",
              "publish_date": "2013-09-27 09:32:23",
              "created_by_name": "Demo User",
              "itemid": "126",
              "icon": "pdf",
              "links": {
                "file": {
                  "href": {
                    "scheme": "http",
                    "host": "demo.joomlatools.com",
                    "port": "",
                    "user": "",
                    "pass": "",
                    "format": "",
                    "fragment": ""
                  },
                  "type": "application/json; version=1.0"
                },
                "category": {
                  "href": "http://demo.joomlatools.com/joomla3/docman/default-hierarchical-list/cars?format=json",
                  "type": "application/json; version=1.0"
                },
                "image": {
                  "href": "http://demo.joomlatools.com/joomla3//joomlatools-files/docman-images/cars/ford-64041_640.jpg"
                },
                "self": {
                  "href": "http://demo.joomlatools.com/joomla3/docman/default-hierarchical-list/cars/41-car-example-3?format=json",
                  "type": "application/json; version=1.0"
                }
              },
              "category": {
                "id": "9",
                "title": "Cars",
                "slug": "cars"
              },
              "file": {
                "extension": "pdf",
                "size": 610128
              }
            },
            {
              "id": "42",
              "uuid": "469850c9-fdd0-48de-afe0-fd18c32b79c6",
              "title": "Car example",
              "slug": "car-example-4",
              "docman_category_id": "9",
              "description": "<p>Etiam porta sem malesuada magna mollis euismod. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec id elit non mi porta gravida at eget metus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum.</p>",
              "image": "cars/sports-76403_640.jpg",
              "storage_type": "file",
              "storage_path": "cars/cars.pdf",
              "created_by": "690",
              "alias": "42-car-example-4",
              "access_title": "Public",
              "publish_date": "2013-09-27 09:32:42",
              "created_by_name": "Demo User",
              "itemid": "126",
              "icon": "pdf",
              "links": {
                "file": {
                  "href": {
                    "scheme": "http",
                    "host": "demo.joomlatools.com",
                    "port": "",
                    "user": "",
                    "pass": "",
                    "format": "",
                    "fragment": ""
                  },
                  "type": "application/json; version=1.0"
                },
                "category": {
                  "href": "http://demo.joomlatools.com/joomla3/docman/default-hierarchical-list/cars?format=json",
                  "type": "application/json; version=1.0"
                },
                "image": {
                  "href": "http://demo.joomlatools.com/joomla3//joomlatools-files/docman-images/cars/sports-76403_640.jpg"
                },
                "self": {
                  "href": "http://demo.joomlatools.com/joomla3/docman/default-hierarchical-list/cars/42-car-example-4?format=json",
                  "type": "application/json; version=1.0"
                }
              },
              "category": {
                "id": "9",
                "title": "Cars",
                "slug": "cars"
              },
              "file": {
                "extension": "pdf",
                "size": 610128
              }
            }
          ],
          "linked": []
        }





## Document [/?option=com_docman&view=document{&id}]

+ Model (application/json)

    A single Document object with all its details.

    + Body
        {
            "version": "1.0",
            "links": {
                "self": {
                    "href": ""http"://demo.joomlatools.com/joomla3/index.php?option=com_docman&view=document&id=74&format=json&Itemid=126",
                    "type": "application/json; version=1.0"
                }
            },
            "meta": [ ],
            "entities": [
                    {
                        "id": "74",
                        "uuid": "fe67c09d-abb3-4e85-b66c-96f10f563582",
                        "title": "Cake",
                        "slug": "cake",
                        "docman_category_id": "24",
                        "description": "<p>Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum. Etiam porta sem malesuada magna mollis euismod.</p> <hr id="system-readmore" /><hr /> <h3>Dapibus Fringilla Tellus Risus</h3> <p>Maecenas sed diam eget risus varius blandit sit amet non magna. Donec sed odio dui. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> <ul> <li>Donec id elit non mi porta gravida at eget metus.</li> <li>Vestibulum id ligula porta felis euismod semper.</li> <li>Nullam quis risus eget urna mollis ornare vel eu leo.</li> <li>Curabitur blandit tempus porttitor.</li> </ul> <p>Donec id elit non mi porta gravida at eget metus. Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Curabitur blandit tempus porttitor.</p> <ol> <li>Cum sociis natoque penatibus</li> <li>Et magnis dis parturient montes</li> <li>Nascetur ridiculus mus.</li> <li>Nullam id dolor id nibh ultricies vehicula ut id elit.</li> <li>Morbi leo risus, porta ac consectetur.</li> <li>Vestibulum at eros.</li> <li>Sed posuere consectetur est at lobortis.</li> </ol>",
                        "image": "recipes/cake-110934_640.jpg",
                        "storage_type": "file",
                        "storage_path": "recipes/recipe.pdf",
                        "created_by": "690",
                        "alias": "74-cake",
                        "access_title": "Public",
                        "publish_date": "2013-09-30 08:01:04",
                        "created_by_name": "Demo User",
                        "itemid": "126",
                        "icon": "pdf",
                        "links": {
                            "file": {
                                "href": {
                                    "scheme": "http",
                                    "host": "demo.joomlatools.com",
                                    "port": "",
                                    "user": "",
                                    "pass": "",
                                    "format": "",
                                    "fragment": ""
                                },
                            "type": "application/json; version=1.0"
                            },
                            "category": {
                                "href": ""http"://demo.joomlatools.com/joomla3/docman/default-hierarchical-list/demo-category-1/dessert?format=json",
                                "type": "application/json; version=1.0"
                            },
                            "image": {
                                "href": ""http"://demo.joomlatools.com/joomla3//joomlatools-files/docman-images/recipes/cake-110934_640.jpg"
                            },
                            "self": {
                                "href": ""http"://demo.joomlatools.com/joomla3/docman/default-hierarchical-list/demo-category-1/dessert/74-cake?id=74&amp;format=json",
                                "type": "application/json; version=1.0"
                            }
                    },
                    "category": {
                        "id": "24",
                        "title": "Dessert",
                        "slug": "dessert"
                    },
                    "file": {
                        "extension": "pdf",
                        "size": 594736
                    }
                }
        ],
        "linked": [ ]
    }

+ Parameters
    + id (required, number, `74`) ... Numeric `id` of the Document to retrieve.


### Retrieve a Document [GET]

```php
    // Get a document with a given id
    $documents = KObjectManager::getInstance()
                        ->getObject('com://docman.controller.document')
                        ->id(74)
                        ->read();
```

** Relevant Plugin Events **

|**Before** | **After**|
|-----------|----------|
|onBeforeDocmanControllerDocumentRender|onAfterDocmanControllerDocumentRender|
|onBeforeDocmanControllerDocumentRead|onAfterDocmanControllerDocumentRead|
|onBeforeDocmanModelDocumentFetch|onAfterDocmanModelDocumentFetch|



See:
[KControllerModel::_actionRead](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/model.php#L208)

+ Request /?option=com_docman&view=document&id=74&Itemid=126 (application/json)

+ Response 200

    [Document][]

### Create or Edit a Document [POST]

```php
    // Create a new document
    $data = array("title" => "Cake",
            "docman_category_id" => 24,
            "image": "recipes/cake-110934_640.jpg"
            ); // and more
    $controller = KObjectManager::getInstance()
                            ->getObject('com://docman.controller.document');
    // add a document
    $newDocument = $controller->add($data);
    // edit an existing document
    $updatedDocument = $controller->id(74)->edit($data);
```
** Relevant Plugin Events **

|**Before** | **After**|
|-----------|----------|
|onBeforeDocmanControllerDocumentEdit|onAfterDocmanControllerDocumentEdit|
|onBeforeDocmanControllerDocumentAdd|onAfterDocmanControllerDocumentAdd|
|onBeforeDocmanModelDocumentCreate|onAfterDocmanModelDocumentCreate|

See:
[KDispatcherHttp::_actionPost](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/dispatcher/http.php#L225), [KControllerModel::_actionAdd](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/model.php#L267),
[KControllerModel::_actionEdit](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/model.php#L235)

+ Parameters
    + id (optional, number, `0`) ... Must be '0' or empty. Setting this to an existing document id will try edit the corresponding document.

+ Request

    + Body
        {
          "title": "Cake",
          "docman_category_id": "24",
          "description": "<p>Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum. Etiam porta sem malesuada magna mollis euismod.</p> <hr id=\"system-readmore\" /><hr /> <h3>Dapibus Fringilla Tellus Risus</h3> <p>Maecenas sed diam eget risus varius blandit sit amet non magna. Donec sed odio dui. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> <ul> <li>Donec id elit non mi porta gravida at eget metus.</li> <li>Vestibulum id ligula porta felis euismod semper.</li> <li>Nullam quis risus eget urna mollis ornare vel eu leo.</li> <li>Curabitur blandit tempus porttitor.</li> </ul> <p>Donec id elit non mi porta gravida at eget metus. Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Curabitur blandit tempus porttitor.</p> <ol> <li>Cum sociis natoque penatibus</li> <li>Et magnis dis parturient montes</li> <li>Nascetur ridiculus mus.</li> <li>Nullam id dolor id nibh ultricies vehicula ut id elit.</li> <li>Morbi leo risus, porta ac consectetur.</li> <li>Vestibulum at eros.</li> <li>Sed posuere consectetur est at lobortis.</li> </ol>",
          "image": "recipes/cake-110934_640.jpg",
          "storage_type": "file",
          "storage_path": "recipes/recipe.pdf",
          "created_by": "690",
          "access_title": "Public",
          "publish_date": "2013-09-30 08:01:04",
          "icon": "pdf"
        }

+ Response 201

    [Document][]


### Remove a Document [DELETE]

```php
    // Loads the document row and then deletes that row object.
    $documents = KObjectManager::getInstance()
                        ->getObject('com://docman.controller.document')
                        ->id(74)
                        ->delete();
```

** Relevant Plugin Events **

|**Before** | **After**|
|-----------|----------|
|onBeforeDocmanControllerDocumentDelete|onAfterDocmanControllerDocumentDelete|

See: [KControllerModel::_actionDelete](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/controller/model.php#L313), [KDatabaseRowAbstract::delete()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/database/row/abstract.php#L163)
[KDatabaseRowsetAbstract::delete()](https://github.com/nooku/nooku-framework/blob/master/code/libraries/koowa/libraries/database/rowset/abstract.php#L163)

+ Parameters
    + id (required, number, `74`) ... Numeric `id` of the Document to delete.

+ Response 204
