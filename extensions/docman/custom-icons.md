---
layout: default
title: Custom Icons
---

When we released the stable 2.0 releases of our extensions we introduced an icon font to display all our icons. If you need to change the icons that we chose it’s possible to override them. To follow this tutorial you need a good understanding of CSS and templating/overriding in Joomla.

The first part of this tutorial shows you how to change your frontend icons. The last part shows you how to change the administrator icons as well.

![Select icon](https://farm6.staticflickr.com/5593/15135621962_f947e74be7_o.png)

## 1. Changing DOCman Document Icons in the Front End

There are three ways to get your own custom icons in DOCman:

1. [by uploading a custom icon per document](#1-upload-custom-icons) as described on our blog
2. [by using background images ](#2-using-background-images)
3. [by using a custom icon font](#3-using-a-custom-icon-font)

### 1. Upload custom icons

This technique is described in detail [on our blog](http://blog.joomlatools.com/2014/10/how-to-get-your-own-custom-icons-to-docman.html).

### 2. Using background images

In this second technique we are going to override the default icons. This will change all icons on your website at once. It’s no longer possible to use the icons we picked since we’re using / overriding the existing markup.

If you’re feeling old school or if you need to use icons with multiple colors you should use this second technique. We are basically going to use existing class names and change the output of these classes so they’re showing background images instead of an icon font.

Currently we are using the following classes for our 9 base icons:

{% highlight css %}
.koowa_icon--archive
.koowa_icon--audio
.koowa_icon--default
.koowa_icon--document
.koowa_icon--folder
.koowa_icon--image
.koowa_icon--pdf
.koowa_icon--spreadsheet
.koowa_icon--video
{% endhighlight %}

These are the 9 icons you can find in the image below from left to right. We are using the :before [pseudo](http://coding.smashingmagazine.com/2011/07/13/learning-to-use-the-before-and-after-pseudo-elements-in-css/) element to display the icons:

![Available icons](https://farm6.staticflickr.com/5562/14949316139_13d71bb027_o.png)

To start with clean classes you need to add some CSS to your website. If you’re using a free or commercial template and want to be able to update your template in the future we strongly recommend you to create a separate icons.css file instead of adding this CSS to the template main stylesheet. So how do you do that?

1. Create an empty file with a text editor and save it as icons.css in your template root folder.
2. Open your template’s index.php file
3. Add the stylesheet to the code. Here’s a small tutorial on adding custom stylesheets: [http://docs.joomla.org/JDocument/addStyleSheet](http://docs.joomla.org/JDocument/addStyleSheet)
4. Upload the files to your server

We recommend creating a new icons.css stylesheet because every time you update your template there’s a chance you will remove your style declarations contained within the master template css file. This way all you will need to do is repeat steps 3 & 4 to bring back your new icons.

**Protostar Template Example**

If you use Protostar you could search for the following line in the index.php file

{% highlight php %}
<?php
$doc->addStyleSheet('templates/'.$this->template.'/css/template.css');
{% endhighlight %}

And right below add this line:

{% highlight php %}
<?php
$doc->addStyleSheet( 'templates/' . $this->template . '/icons.css' );
{% endhighlight %}

That will load your icons.css file into the template. Now add the following lines of code to your icons.css file:

{% highlight css %}
.koowa [class^="koowa_icon--"]:before,
.koowa [class*=" koowa_icon--"]:before {
  content: " ";
}
{% endhighlight %}

By adding these lines we are telling the template to clear the content property by only showing a space instead. We do this because the icon font uses this content property to define which icon has to be showed. We added the body element before our class name so our new styles will always be more important than the original ones. This makes sure we won’t get any conflicts. **This is how the default DOCman icon styling is overridden.**

Now you need to tell the template which images to load. First make sure that the images you want to use are located in the template folders. For example if you’re using the "Protostar" template then you could place the images in:

[joomla] > templates > protostar > images > custom_docman_icons

Now the only way to use images as icons is by using an image background.

There’s actually only one property you have to add per class in order for this to work. Just add the correct image file path to each separate class using the background-image property like so:

{% highlight css %}
.koowa .koowa_icon--archive:before {
  background-image: url("images/custom_docman_icons/my_archive_icon.png");
}

.koowa .koowa_icon--audio:before {
  background-image: url("images/custom_docman_icons/my_audio_icon.png");
}
{% endhighlight %}

**Guidance on choosing your icon image**

1. You preferably want to work with transparent PNG files since they can be used on any background color.
2. The icon area is either 16x16 pixels, 24x24 pixels or 48x48 pixels so make sure your image is at least 48x48 pixels.
3. It’s also required to make your icons square shaped.
4. And if you want beautiful icons on high-resolution screens be sure to use images that are at least 96x96 pixels.

Note: You can also use larger images like 600x600 pixels but this will drastically slow down your website. We recommend using a maximum width and height of 96 pixels.

**An example of a finished icon overwrite using images**

{% highlight css %}
.koowa [class^="koowa_icon--"]:before,
.koowa [class*=" koowa_icon--"]:before {
  content: " ";
}

.koowa .koowa_icon--archive:before {
  background-image: url("images/custom_docman_icons/my_archive_icon.png");
}

.koowa .koowa_icon--audio:before {
  background-image: url("images/custom_docman_icons/my_audio_icon.png");
}

.koowa .koowa_icon--default:before {
  background-image: url("images/custom_docman_icons/my_default_icon.png");
}

.koowa .koowa_icon--document:before {
  background-image: url("images/custom_docman_icons/my_document_icon.png");
}

.koowa .koowa_icon--folder:before {
  background-image: url("images/custom_docman_icons/my_folder_icon.png");
}

.koowa .koowa_icon--image:before {
  background-image: url("images/custom_docman_icons/my_image_icon.png");
}

.koowa .koowa_icon--pdf:before {
  background-image: url("images/custom_docman_icons/my_pdf_icon.png");
}

.koowa .koowa_icon--spreadsheet:before {
  background-image: url("images/custom_docman_icons/my_spreadsheet_icon.png");
}

.koowa .koowa_icon--video:before {
  background-image: url("images/custom_docman_icons/my_video_icon.png");
}
{% endhighlight %}

### 3. Using a Custom Icon Font

A better solution might be to use your own custom icon font. This technique works almost the same as the one with images but we’ve got a few extra steps to do.

First create your own custom icon font consisting of the 9 icon types that are available:

![Available icons](https://farm6.staticflickr.com/5562/14949316139_13d71bb027_o.png)

1. archive
2. audio
3. default
4. document
5. folder
6. image
7. pdf
8. spreadsheet
9. video

You can easily create your own custom icon fonts with one of the following tools:

* [http://icomoon.io/](http://icomoon.io/)
* [http://fontello.com/](http://fontello.com/)
* [http://fontastic.me/](http://fontastic.me/)

For this tutorial I’m going to use the code that is generated by [icomoon.io](http://icomoon.io/) since we use this app ourselves.

Just like in the image technique we are going to use the existing class names and just assign different icons to them. But before we can do that we have to make sure that our CSS file can locate the proper font files.

Download the font that you created and unzip the file. Within this file you will find a couple of files and folders. Be sure to copy all the fonts from the "fonts" folder and add these files to your template. If you are using the “Protostar” template you could (for example) add the font files to:

{% highlight vim %}
templates > protostar > fonts
{% endhighlight %}

To start with clean classes you need to add some CSS to your website. If you’re using a free or commercial template and want to be able to update your template in the future we strongly recommend you to create a separate icons.css file instead of adding this css to the template main stylesheet. So how do you do that?

1. Create an empty file with a text editor and save it as icons.css in your template root folder.
2. Open your template’s index.php file
3. Add the stylesheet to the code. Here’s a small tutorial on adding custom stylesheets: [http://docs.joomla.org/JDocument/addStyleSheet](http://docs.joomla.org/JDocument/addStyleSheet)
4. Upload the files to your server

We recommend creating a new icons.css stylesheet because every time you update your template there’s a chance you will remove your style declarations contained within the master template css file. This way all you will need to do is repeat steps 3 & 4 to re-instate your new icons.

**Protostar Template Example**

If you use Protostar you could search for the following line in the index.php file

{% highlight php %}
$doc->addStyleSheet('templates/'.$this->template.'/css/template.css');
{% endhighlight %}

And right below add this line:

{% highlight php %}
$doc->addStyleSheet( 'templates/' . $this->template . '/icons.css' );
{% endhighlight %}

That will load your icons.css file into the template.

Next open the style.css file (contained within the root of the icon font zip you downloaded) and copy the contents and paste them in your icons.css file:

```[joomla] > templates > protostar > icons.css```

Now we’ve got to update the CSS style declarations to match those used by DOCman. Look for the area that starts with "[class^=".

{% highlight css %}
[class^="icon-"], [class*=" icon-"] {
{% endhighlight %}

This line has to be changed to the following:

{% highlight css %}
body .koowa .koowa_icon--default:before,
body .koowa .koowa_icon--image:before,
body .koowa .koowa_icon--video:before,
body .koowa .koowa_icon--archive:before,
body .koowa .koowa_icon--folder:before,
body .koowa .koowa_icon--pdf:before,
body .koowa .koowa_icon--audio:before,
body .koowa .koowa_icon--document:before,
body .koowa .koowa_icon--spreadsheet:before {
{% endhighlight %}

So the revised style declaration should now look something like this:

{% highlight css %}
body .koowa .koowa_icon--default:before,
body .koowa .koowa_icon--image:before,
body .koowa .koowa_icon--video:before,
body .koowa .koowa_icon--archive:before,
body .koowa .koowa_icon--folder:before,
body .koowa .koowa_icon--pdf:before,
body .koowa .koowa_icon--audio:before,
body .koowa .koowa_icon--document:before,
body .koowa .koowa_icon--spreadsheet:before {
    font-family: 'icomoon';
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
{% endhighlight %}

Next we have to manually link the codes in the "content" property to the class names we are using. The codes in the “content:” property are characters from the “Private Use Area of Unicode”. Using these characters make sure that screen readers won’t read single Latin characters but just ignore the characters instead. These codes are usually generated by the tool you used to create the icon font. More information about this can be found on the [icomoon.io docs page](http://icomoon.io/#docs).

We want to use the existing class names. But we need to add the new characters to them. So let’s say you’ve got the following class in your css file (that comes with the font) to represent the "image" icon:

{% highlight css %}
.icon-camera:before {
    content: "\e601";
}
{% endhighlight %}

To actually make this work you should change it to:

{% highlight css %}
.koowa .koowa_icon--image:before {
    content: "\e601";
}
{% endhighlight %}

The important part here is that the "content" property doesn’t get changed. You have to do this manually for all 9 icons.

**An example of a finished icon overwrite (icons.css) using a font**

{% highlight css %}
@font-face {
  font-family: 'icomoon';
  src:url('fonts/icomoon.eot');
  src:url('fonts/icomoon.eot?#iefix') format('embedded-opentype'),
  url('fonts/icomoon.ttf') format('truetype'),
  url('fonts/icomoon.woff') format('woff'),
  url('fonts/icomoon.svg#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
}

body .koowa .koowa_icon--default:before,
body .koowa .koowa_icon--image:before,
body .koowa .koowa_icon--video:before,
body .koowa .koowa_icon--archive:before,
body .koowa .koowa_icon--folder:before,
body .koowa .koowa_icon--pdf:before,
body .koowa .koowa_icon--audio:before,
body .koowa .koowa_icon--document:before,
body .koowa .koowa_icon--spreadsheet:before {
  font-family: 'icomoon';
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.koowa .koowa_icon--default:before {
  content: "\e600";
}

.koowa .koowa_icon--image:before {
  content: "\e601";
}

.koowa .koowa_icon--video:before {
  content: "\e602";
}

.koowa .koowa_icon--archive:before {
  content: "\e603";
}

.koowa .koowa_icon--folder:before {
  content: "\e604";
}

.koowa .koowa_icon--pdf:before {
  content: "\e605";
}

.koowa .koowa_icon--audio:before {
  content: "\e606";
}

.koowa .koowa_icon--document:before {
  content: "\e607";
}

.koowa .koowa_icon--spreadsheet:before {
  content: "\e608";
}
{% endhighlight %}

## 2. Adding Custom Icons to the Administrator

Right now we’ve only covered how to add the images to the frontend, but wouldn’t it be useful to have the same icons display on the administrator side?

This is basically the same as adding the new icons to the frontend template. First locate the administrator template you are using. We are using the "Isis" template in the following example which can be found here:

[joomla] > administrator > templates > isis

To make things a little bit easier we’re just going to use the same file we already created. So Basically the only thing you have to do is this:

1. Download the administrator template index.php file
2. locate the line that starts with a piece of code that looks like this:
{% highlight php %}
$doc->addStyleSheet('templates/' . $this->template ….
{% endhighlight %}
3. Add the following line right below (replacing [your template] with protostar for example):
{% highlight php %}
$doc->addStyleSheet(JURI::root().'templates/[your template]/icons.css');
{% endhighlight %}
4. Upload the index.php file and you should be good to go.