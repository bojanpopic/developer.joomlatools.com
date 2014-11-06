## Update/rebuild custom theme

The only thing we're adding right now is the menu bar, nothing else. This small tutorial shows how to quickly rebuild a theme.

1. Rename current 'theme' folder to 'theme_backup'
2. Copy/paste latest theme from [Gitbook repo](https://github.com/GitbookIO/gitbook/tree/master/theme)
3. Copy the `theme.css`, `theme.js` and images from 'theme_backup' to 'theme'
4. Add `theme.css` AFTER `style.css` to the proper page to load it (search for `style.css` in 'theme' folder)
5. Add `theme.js` BEFORE `app.js` to the proper page to load it (search for `app.js` in 'theme' folder)
6. Add markup to the right file (currently `page.html`). Add it just before `<div class="book"></div>`
7. Add `class="no-js"` to `<body>`
8. Add following right below `<body class="no-js">`:
```<script data-inline type="text/javascript">function hasClass(e,t){return e.className.match(new RegExp("(\\s|^)"+t+"(\\s|$)"))}var el=document.body;var cl="no-js";if(hasClass(el,cl)){var reg=new RegExp("(\\s|^)"+cl+"(\\s|$)");el.className=el.className.replace(reg," js-enabled")}</script>```
9. Run `gitbook serve` and test if menu is working (mobile first)
10. On success remove theme_backup