// Variables
var togglebutton = document.getElementById('sidebar-toggle'),
    sidebar = document.getElementsByClassName('sidebar')[0];

// Toggle
togglebutton.onclick = function() {
    apollo.toggleClass(togglebutton, 'toggled');
    apollo.toggleClass(sidebar, 'toggled');
};