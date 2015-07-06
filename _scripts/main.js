// Variables
var togglebutton = document.getElementById('sidebar-toggle'),
    sidebar = document.getElementsByClassName('sidebar')[0];

// Functions
function sidebarHide() {
    apollo.addClass(togglebutton, 'toggled');
    apollo.addClass(sidebar, 'toggled');
}

function sidebarShow() {
    apollo.removeClass(togglebutton, 'toggled');
    apollo.removeClass(sidebar, 'toggled');
}

function sideBarStatus() {
    // Check viewport width
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    // Set classes
    if ( width >= 768 ) {
        sidebarShow();
    } else {
        sidebarHide();
    }
}

// Toggle
togglebutton.onclick = function() {
    var display = window.getComputedStyle(sidebar, null).getPropertyValue("display");
    if ( display == 'block' ) {
        sidebarHide();
    } else {
        sidebarShow();
    }
};

domready(function () {
    sideBarStatus();
});

window.onresize = function() {
    sideBarStatus();
};
