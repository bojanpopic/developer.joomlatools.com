!function (a, b) {
    "function" == typeof define && define.amd ? define(b) : "object" == typeof exports ? module.exports = b : a.apollo = b()
}(this, function () {
    "use strict";
    var a, b, c, d, e = {}, f = function (a, b) {
        "[object Array]" !== Object.prototype.toString.call(a) && (a = a.split(" "));
        for (var c = 0; c < a.length; c++)b(a[c], c)
    };
    return "classList"in document.documentElement ? (a = function (a, b) {
        return a.classList.contains(b)
    }, b = function (a, b) {
        a.classList.add(b)
    }, c = function (a, b) {
        a.classList.remove(b)
    }, d = function (a, b) {
        a.classList.toggle(b)
    }) : (a = function (a, b) {
        return new RegExp("(^|\\s)" + b + "(\\s|$)").test(a.className)
    }, b = function (b, c) {
        a(b, c) || (b.className += (b.className ? " " : "") + c)
    }, c = function (b, c) {
        a(b, c) && (b.className = b.className.replace(new RegExp("(^|\\s)*" + c + "(\\s|$)*", "g"), ""))
    }, d = function (d, e) {
        (a(d, e) ? c : b)(d, e)
    }), e.hasClass = function (b, c) {
        return a(b, c)
    }, e.addClass = function (a, c) {
        f(c, function (c) {
            b(a, c)
        })
    }, e.removeClass = function (a, b) {
        f(b, function (b) {
            c(a, b)
        })
    }, e.toggleClass = function (a, b) {
        f(b, function (b) {
            d(a, b)
        })
    }, e
}), function (a, b) {
    "function" == typeof define && define.amd ? define("responsivemenu", b(a)) : "object" == typeof exports ? module.responsivemenu = b(a) : a.responsivemenu = b(a)
}(this, function (a) {
    "use strict";
    function b(a, b, c) {
        for (var d = []; a.parentNode && a.parentNode != c;)a = a.parentNode, a.tagName == b && d.push(a);
        return d
    }

    function c(a) {
        function c() {
            var b = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if (b < a.width && !apollo.hasClass(e, a.openclass)) {
                apollo.removeClass(g, a.hideclass);
                var c = document.getElementsByClassName(a.subtoggleclass);
                i(c, function (b, d) {
                    apollo.addClass(c[d].parentNode.getElementsByTagName("ul")[0], a.hideclass), apollo.removeClass(c[d], a.hideclass)
                }), apollo.removeClass(e, [a.openclass, a.fullmenuclass]), apollo.addClass(e, a.hideclass), 1 == a.absolute && apollo.addClass(e, a.absolutemenuclass)
            } else if (b >= a.width) {
                apollo.addClass(g, a.hideclass);
                var c = document.getElementsByClassName(a.subtoggleclass);
                i(c, function (b, d) {
                    apollo.removeClass(c[d].parentNode.getElementsByTagName("ul")[0], a.hideclass), apollo.addClass(c[d], a.hideclass)
                }), apollo.removeClass(e, [a.openclass, a.hideclass]), apollo.addClass(e, a.fullmenuclass), 1 == a.absolute && apollo.hasClass(e, a.absolutemenuclass) && apollo.removeClass(e, a.absolutemenuclass)
            }
        }

        function d() {
            if (1 == a.sticky) {
                var b = a.wrapper.offsetHeight, c = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                if (b >= c && !apollo.hasClass(document.body, a.bodyoverflowhiddenclass))apollo.addClass(document.body, a.bodyoverflowhiddenclass), apollo.addClass(a.wrapper, a.menuoverflowautoclass); else if (c > b && (apollo.hasClass(document.body, a.bodyoverflowhiddenclass) && (apollo.removeClass(document.body, a.bodyoverflowhiddenclass), apollo.removeClass(a.wrapper, a.menuoverflowautoclass)), apollo.hasClass(a.wrapper, a.stickyclass) || apollo.addClass(a.wrapper, a.stickyclass), !apollo.hasClass(e, a.openclass) && !apollo.hasClass(document.body, a.stickyinitiatedclass))) {
                    var d = b.toString() + "px";
                    document.body.setAttribute("style", "padding-top:" + d), apollo.addClass(document.body, a.stickyinitiatedclass)
                }
            }
        }

        e = "" == a.menu ? a.wrapper.getElementsByTagName("ul")[0] : a.menu, apollo.addClass(a.wrapper, a.initiated_class);
        var f = document.createElement(a.toggletype);
        apollo.addClass(f, [a.toggleclass]), "" == a.before_element && (a.before_element = a.wrapper.firstChild), a.before_element.parentNode.insertBefore(f, a.before_element);
        var g = document.getElementsByClassName(a.toggleclass)[0];
        g.innerHTML = a.togglecontent, g.setAttribute("aria-hidden", "true"), g.setAttribute("aria-pressed", "false");
        var h = e.getElementsByTagName("li");
        i(h, function (b, c) {
            var d = h[c].getElementsByTagName("ul")[0];
            if (void 0 != d) {
                var e = document.createElement(a.subtoggletype);
                apollo.addClass(e, [a.subtoggleclass, a.hideclass]);
                var f = d.parentNode;
                f.insertBefore(e, f.firstChild), e.innerHTML = a.subtogglecontent, e.setAttribute("aria-hidden", "true"), e.setAttribute("aria-pressed", "false")
            }
        });
        for (var h = e.getElementsByTagName("li"), j = 0; j < h.length; j++) {
            var k = h[j].getElementsByTagName("ul")[0];
            k && apollo.addClass(k.parentNode, a.parentclass)
        }
        c(), d(), window.addEventListener("resize", function () {
            c(), d()
        }, !0);
        for (var l = e.getElementsByTagName("a"), j = 0; j < l.length; j++)l[j].onfocus = function () {
            var c = this.parentNode.parentNode.querySelectorAll("li");
            if (c)for (var d = 0; d < c.length; d++)apollo.removeClass(c[d], a.focusedclass);
            var f = b(this, "LI", e);
            if (f)for (var d = 0; d < f.length; d++)apollo.addClass(f[d], a.focusedclass)
        };
        g.onclick = function () {
            return apollo.hasClass(e, a.hideclass) ? (apollo.removeClass(e, a.hideclass), apollo.addClass(e, a.openclass), apollo.addClass(g, a.toggleclosedclass)) : apollo.hasClass(e, a.openclass) && (apollo.removeClass(e, a.openclass), apollo.addClass(e, a.hideclass), apollo.removeClass(g, a.toggleclosedclass)), d(), !1
        };
        var m = document.getElementsByClassName(a.subtoggleclass);
        i(m, function (b, c) {
            var e = m[c], f = e.parentNode.getElementsByTagName("ul")[0];
            e.onclick = function () {
                apollo.hasClass(f, a.hideclass) ? (apollo.removeClass(f, a.hideclass), apollo.addClass(e, a.toggleclosedclass)) : apollo.hasClass(f, a.hideclass) || (apollo.addClass(f, a.hideclass), apollo.removeClass(e, a.toggleclosedclass)), d()
            }
        })
    }

    var d, e, f = {}, g = !!document.querySelector && !!a.addEventListener, h = {
        wrapper: document.getElementsByTagName("nav")[0],
        menu: "",
        initiated_class: "rm-initiated",
        before_element: "",
        toggletype: "button",
        toggleclass: "rm-togglebutton",
        toggleclosedclass: "rm-togglebutton--closed",
        togglecontent: "menu",
        subtoggletype: "button",
        subtoggleclass: "rm-subtoggle",
        subtogglecontent: "+",
        sticky: 0,
        absolute: 0,
        hideclass: "rm-closed",
        openclass: "rm-opened",
        focusedclass: "rm-focused",
        width: 600,
        parentclass: "rm-parent",
        fullmenuclass: "rm-fullmenu",
        absolutemenuclass: "rm-absolutemenu",
        bodyoverflowhiddenclass: "rm-bodyoverflowhidden",
        menuoverflowautoclass: "rm-menuoverflowauto",
        stickyclass: "rm-sticky",
        stickyinitiatedclass: "rm-sticky-initiated",
        noresponsivemenuclass: "rm-no-responsive-menu"
    }, i = function (a, b, c) {
        if ("[object Object]" === Object.prototype.toString.call(a))for (var d in a)Object.prototype.hasOwnProperty.call(a, d) && b.call(c, a[d], d, a); else for (var e = 0, f = a.length; f > e; e++)b.call(c, a[e], e, a)
    }, j = function (a, b) {
        var c = {};
        return i(a, function (b, d) {
            c[d] = a[d]
        }), i(b, function (a, d) {
            c[d] = b[d]
        }), c
    };
    return f.init = function (a) {
        return g ? (d = j(h, a || {}), void c(d)) : void(document.body.className += " " + d.noresponsivemenuclass)
    }, f
}), responsivemenu.init({wrapper: document.querySelector(".jt_navigation_container")});