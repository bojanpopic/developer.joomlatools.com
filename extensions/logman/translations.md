---
layout: default
title: Translations
---

* Table of Content
{:toc}

## Introduction

LOGman provides a simple yet powerful system for translating activity messages, leveraged through our own translator which sits on top of Joomla's translation system.

The override system is designed so that the most specific keys are given higher privilege over the more generic ones.

Activity messages typically follow the form:

	John Doe deleted the article with the title Frequently Asked Questions

Each part of the above message contains variable parts and constant parts. Let us examine which parts are likely to change between each activity message and which parts remain constant:

**Variables**

* John Doe
* deleted
* article
* Frequently Asked Questions

**Constants**

* the
* with
* the
* title

LOGman's activity message translations are not that different from regular Joomla! translations. They also have a key and a value. For example, the translation for the above message is:

	KLS_ACTOR_ACTION_OBJECTTYPE_TITLE_OBJECT="{actor} {action} the {object.type} with the title {object}"

The above string is used to generate the text in the first example. The first part (before the equals sign) is the key, these are pre-defined keys that LOGman uses to lookup the value (the part after the equals sign). The value is used to construct the activity message, it contains placeholders that are replaced by variables when outputting the message.

Using the above example, the variables would be mapped accordingly:

* {actor} = John Doe
* {action} = deleted
* {object.type} = article
* {object} = Frequently Asked Questions

##How does it work?

LOGman has specially constructed translation strings that can be customized for different languages, actions and resources.

Not all languages construct sentences in the same way, such as putting verbs, subjects and objects in different orders. For example, english constructs sentences using subject verb object, e.g. `Steve sat on the sofa`, whereas turkish uses subject object verb, e.g. `Steve koltukta oturdu`.

All LOGman translations start with the `KLS_` prefix.

Sometimes it is necessary to customize specific sentences, so that they sound more grammatically accurate.

For example, whilst :

	John Doe created the article with the title Frequently Asked Questions

makes sense, a more accurate sentence would be:

	John Doe created a new article with the title Frequently Asked Question

The original key `KLS_ACTOR_ACTION_OBJECTTYPE_TITLE_OBJECT` can be overridden to provide a more specific version only for the `created` action:

	KLS_ACTOR_CREATED_OBJECTTYPE_TITLE_OBJECT=”{actor} {action} a new {object.type} with title {object}”

As you can see, the above key has been made specific for the `created` action (`ACTION` has been replaced with `CREATED`). This key will be used for activities where action is created in favor of the generic one.

LOGman will always try to use the most specific version of the translation that it can find.

If we would like to use the previous example for article resources only, then we would use the following translation:

	KLS_ACTOR_CREATED_ARTICLE_TITLE_OBJECT=”{actor} {action} a new {object.type} with title {object}”
	
By specifying the action and the object type in the key, the translation has been made more specific. This means that it will only get used for activities where articles get created.

##Other languages

The same technique may be employed while translating activity messages to other languages, as this allows for changing the static components (words) of the translation key values for a given translation. Let’s switch to Spanish:

	KLS_ACTOR_ACTION_OBJECTTYPE_TITLE_OBJECT=”{actor} {action} el {object.type} con el título {object}“

This key would work fine for resources such as article, since article is a masculine subject. But what about category, which is feminine. In that case we can do this:

	KLS_ACTOR_ACTION_CATEGORY_TITLE_OBJECT=”{actor} {action} la {object.type} conn el título {object}“

Using the above key, you can override the translation string used for specific resource types in order to create a grammatically correct sentence.

Some message parameters such as {action} can also be translated by adding translations with the `KLS_` prefix. For example, to translate the word CREATED, we could need to define its translation using the `KLS_CREATED` key.

	KLS_CREATED="creado"

Not all parameters on keys are translatable (providing a key for each article title wouldn’t make sense). This is internally defined by each activity object.

When translating each variable our translator will first look up for `KLS_` prefixed keys. If none is found, non-prefixed keys (without the `KLS_` prefix) will be used if defined. This is useful for re-using Joomla! core translations and overriding them if needed.

##Context translations

Sometimes the translation of a given word will depend upon the context of a message. Take the following translation as example:

	KLS_ACTOR_ACTION_USER_GROUP_TITLE_OBJECT=”{actor} {action} el {object.type} de {object.subtype} con el título {object}”

This translation will produce activity messages as follows:

	Carlos borró el grupo de usuario con el título Clientes

The problem with the phrase above is that it is slightly grammatically incorrect. The correct message should be:

	Carlos borró el grupo de usuarios con el título Clientes

The translation of the word `user` in Spanish is `usuario`. This value is provided by the `USER` translation key defined in Joomla! core translations. The `{object.subtype}` placeholder gets replaced with this value. However, instead of `usuario` (singular) we should have `usuarios` (plural).

This is where context translations become useful. They provide a way to force translations in a given context.

So how do they work?. Check the following translation:

	KLS_ACTOR_ACTION_USER_GROUP_TITLE_OBJECT=”{actor} {action} el {object.type} de {object.subtype:usuarios} con el título {object}”

Check out the `{object.subtype:usuarios}`. Easy right?. LOGman’s translator will automatically use `usuarios` instead of the default `usuario` translation for this specific context. It is a way of saying to the trasnlator to not translate the word and use the one you are providing.

We might have directly done:

    KLS_ACTOR_ACTION_USER_GROUP_TITLE_OBJECT=”{actor} {action} el {object.type} de usuarios con el título {object}”

In this last example, we have completely omitted the variable placeholder and forced the usuarios word in the translation value. That is all right and it will work.

However, if the `object.type` variable was linkable or contained special formatting of some kind, this information is completely lost, as we have effectively replaced a variable with a constant.

As a rule of thumb, always favor context translations over hardcoded variable translations in cases like this.

##How to translate?

Translating activity messages to another language is just a matter of providing a LOGman language file for the desired language, just as it is done with any regular Joomla! extension.

As always, a great starting point is to use the English language translations file that is provided with LOGman.
