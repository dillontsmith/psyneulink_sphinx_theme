var jQuery = (typeof(window) != 'undefined') ? window.jQuery : require('jquery');

// Sphinx theme nav state
function ThemeNav () {

    var nav = {
        navBar: null,
        win: null,
        winScroll: false,
        winResize: false,
        linkScroll: false,
        winPosition: 0,
        winHeight: null,
        docHeight: null,
        isRunning: false
    };

    nav.enable = function (withStickyNav) {
        var self = this;

        // TODO this can likely be removed once the theme javascript is broken
        // out from the RTD assets. This just ensures old projects that are
        // calling `enable()` get the sticky menu on by default. All other cals
        // to `enable` should include an argument for enabling the sticky menu.
        if (typeof(withStickyNav) == 'undefined') {
            withStickyNav = true;
        }

        if (self.isRunning) {
            // Only allow enabling nav logic once
            return;
        }

        self.isRunning = true;
        jQuery(function ($) {
            self.init($);

            self.reset();
            self.win.on('hashchange', self.reset);

            if (withStickyNav) {
                // Set scroll monitor
                self.win.on('scroll', function () {
                    if (!self.linkScroll) {
                        if (!self.winScroll) {
                            self.winScroll = true;
                            requestAnimationFrame(function() { self.onScroll(); });
                        }
                    }
                });
            }

            // Set resize monitor
            self.win.on('resize', function () {
                if (!self.winResize) {
                    self.winResize = true;
                    requestAnimationFrame(function() { self.onResize(); });
                }
            });

            self.onResize();
        });

    };

    // TODO remove this with a split in theme and Read the Docs JS logic as
    // well, it's only here to support 0.3.0 installs of our theme.
    nav.enableSticky = function() {
        this.enable(true);
    };

    nav.init = function ($) {
        var doc = $(document),
            self = this;

        this.navBar = $('div.psyneulink-side-scroll:first');
        this.win = $(window);

        // Add dev mode tag to all relevant sections
        document.querySelectorAll(
            '.technical-note'
        ).forEach(
            function (t) {
                t.classList.add('dev-mode-contingent');
                t.querySelectorAll('.anchorjs-link').forEach(
                    function (anchor) {
                        anchor.classList.add('dev-mode-link');
                    }
                )
            }
        );
        // set display status for methods
        document.querySelectorAll(
            '#class-reference .method'
        ).forEach(
            function (m) {
                if (m.querySelector('code').textContent[0] === '_') {
                    m.classList.add('dev-mode-contingent');
                    m.querySelectorAll('.anchorjs-link').forEach(
                        function (anchor) {
                            anchor.classList.add('dev-mode-link');
                        }
                    )
                }
            }
        );
        // set display status for attributes
        document.querySelectorAll(
            '#class-reference .attribute'
        ).forEach(
            function (m) {
                if (m.querySelector('code').textContent[0] === '_') {
                    m.classList.add('dev-mode-contingent');
                    m.querySelectorAll('.anchorjs-link').forEach(
                        function (anchor) {
                            anchor.classList.add('dev-mode-link');
                        }
                    )
                }
            }
        );

        // Setup dev mode
        function devMode_set(newStatus) {
            localStorage.setItem('dev-mode-enabled', newStatus);
            displaySetting = newStatus ? 'inherit' : 'none'
            // set display status for technical notes
            document.querySelectorAll(
                '.dev-mode-contingent'
            ).forEach(
                function (e) {
                    e.style.display = displaySetting
                }
            );
        }
        function devMode_toggle(){
            devMode_set($(this).is(':checked'))
        }
        var devMode = (localStorage.getItem('dev-mode-enabled') == 'true');
        devMode_set(devMode);
        var switch_html =
            "            <label class=\"switch\">\n" +
            "              <div class=\"switch-txt\">\n" +
            "                Dev Mode\n" +
            "              </div>\n" +
            "              <div class=\"switch-ctrl\">\n" +
            `                <input type=\"checkbox\" ${devMode?'checked':''}>\n` +
            "                <span class=\"slider round\"></span>\n" +
            "              </div>\n" +
            "            </label>";

        var div = document.createElement('div');
        div.innerHTML = switch_html.trim();
        $(div.querySelector('input')).change(devMode_toggle);
        document.querySelector('.psyneulink-dev-mode-toggle').appendChild(div.firstChild)

        // Set up javascript UX bits
        $(document)
            // Shift nav in mobile when clicking the menu.
            .on('click', "[data-toggle='psyneulink-left-menu-nav-top']", function() {
                $("[data-toggle='wy-nav-shift']").toggleClass("shift");
                $("[data-toggle='rst-versions']").toggleClass("shift");
            })

            // Nav menu link click operations
            .on('click', ".psyneulink-menu-vertical .current ul li a", function() {
                var target = $(this);
                // Close menu when you click a link.
                $("[data-toggle='wy-nav-shift']").removeClass("shift");
                $("[data-toggle='rst-versions']").toggleClass("shift");
                // Handle dynamic display of l3 and l4 nav lists
                self.toggleCurrent(target);
                self.hashChange();
            })
            .on('click', "[data-toggle='rst-current-version']", function() {
                $("[data-toggle='rst-versions']").toggleClass("shift-up");
            })

        // Make tables responsive
        $("table.docutils:not(.field-list,.footnote,.citation)")
            .wrap("<div class='wy-table-responsive'></div>");

        // Add extra class to responsive tables that contain
        // footnotes or citations so that we can target them for styling
        $("table.docutils.footnote")
            .wrap("<div class='wy-table-responsive footnote'></div>");
        $("table.docutils.citation")
            .wrap("<div class='wy-table-responsive citation'></div>");

        // Add expand links to all parents of nested ul
        $('.psyneulink-menu-vertical ul').not('.simple').siblings('a').each(function () {
            var link = $(this);
                expand = $('<span class="toctree-expand"></span>');
            expand.on('click', function (ev) {
                self.toggleCurrent(link);
                ev.stopPropagation();
                return false;
            });
            link.prepend(expand);
        });

        // Replace "Parameters" in class references with "Arguments"

        var sphinxSections = document.querySelectorAll('dl.class tr.field-odd.field th.field-name')
        // When we update sphinx on build server, switch to query below
        // var sphinxSections = document.querySelectorAll('dl.py.class dl.field-list.simple dt.field-odd')

        sphinxSections.forEach((i) => {
            if (i.textContent === 'Parameters:') {
                i.textContent = 'Arguments:'
            }
        })

        // Adjust spans for each section in TOC for scrolling that's consistent with side menu

        var tocSections = document.querySelectorAll('#psyneulink-article #contents a.reference.internal')

        tocSections.forEach(
            (section) => {
                let utilities = window.utilities;
                let href = section.getAttribute('href')
                let span = document.querySelector(`span${href}`)
                span.style.display = 'block';
                span.style.position = 'relative';
            }
        )

        var nonTocNavSections = document.querySelectorAll('.psyneulink-article .section')

        nonTocNavSections.forEach(
            (section) => {
                let span = section.querySelector('span')
                if (span && span.textContent === ''){
                    span.style.display = 'block';
                    span.style.position = 'relative';
                }
            }
        );
    };

    nav.reset = function () {
        // Get anchor from URL and open up nested nav
        var anchor = encodeURI(window.location.hash) || '#';

        try {
            var vmenu = $('.psyneulink-menu-vertical');
            var link = vmenu.find('[href="' + anchor + '"]');
            if (link.length === 0) {
                // this link was not found in the sidebar.
                // Find associated id element, then its closest section
                // in the document and try with that one.
                var id_elt = $('.document [id="' + anchor.substring(1) + '"]');
                var closest_section = id_elt.closest('div.section');
                link = vmenu.find('[href="#' + closest_section.attr("id") + '"]');
                if (link.length === 0) {
                    // still not found in the sidebar. fall back to main section
                    link = vmenu.find('[href="#"]');
                }
            }
            // If we found a matching link then reset current and re-apply
            // otherwise retain the existing match
            if (link.length > 0) {
                $('.psyneulink-menu-vertical .current').removeClass('current');
                link.addClass('current');
                link.closest('li.toctree-l1').addClass('current');
                link.closest('li.toctree-l1').parent().addClass('current');
                link.closest('li.toctree-l1').addClass('current');
                link.closest('li.toctree-l2').addClass('current');
                link.closest('li.toctree-l3').addClass('current');
                link.closest('li.toctree-l4').addClass('current');
            }
        }
        catch (err) {
            console.log("Error expanding nav for anchor", err);
        }

    };

    nav.onScroll = function () {
        this.winScroll = false;
        var newWinPosition = this.win.scrollTop(),
            winBottom = newWinPosition + this.winHeight,
            navPosition = this.navBar.scrollTop(),
            newNavPosition = navPosition + (newWinPosition - this.winPosition);
        if (newWinPosition < 0 || winBottom > this.docHeight) {
            return;
        }
        this.navBar.scrollTop(newNavPosition);
        this.winPosition = newWinPosition;
    };

    nav.onResize = function () {
        this.winResize = false;
        this.winHeight = this.win.height();
        this.docHeight = $(document).height();
    };

    nav.hashChange = function () {
        this.linkScroll = true;
        this.win.one('hashchange', function () {
            this.linkScroll = false;
        });
    };

    nav.toggleCurrent = function (elem) {
        var parent_li = elem.closest('li');
        parent_li.siblings('li.current').removeClass('current');
        parent_li.siblings().find('li.current').removeClass('current');
        parent_li.find('> ul li.current').removeClass('current');
        parent_li.toggleClass('current');
    }

    return nav;
};

module.exports.ThemeNav = ThemeNav();

if (typeof(window) != 'undefined') {
    window.SphinxRtdTheme = {
        Navigation: module.exports.ThemeNav,
        // TODO remove this once static assets are split up between the theme
        // and Read the Docs. For now, this patches 0.3.0 to be backwards
        // compatible with a pre-0.3.0 layout.html
        StickyNav: module.exports.ThemeNav,
    };
}

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// https://gist.github.com/paulirish/1579671
// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

$(".sphx-glr-thumbcontainer").removeAttr("tooltip");
$("table").removeAttr("border");

// This code replaces the default sphinx gallery download buttons
// with the 3 download buttons at the top of the page

var downloadNote = $(".sphx-glr-download-link-note.admonition.note");
if (downloadNote.length >= 1) {
    var tutorialUrlArray = $("#tutorial-type").text().split('/');
        tutorialUrlArray[0] = tutorialUrlArray[0] + "_source"

    var githubLink = "https://github.com/psyneulink/tutorials/blob/master/" + tutorialUrlArray.join("/") + ".py",
        notebookLink = $(".reference.download")[1].href,
        notebookDownloadPath = notebookLink.split('_downloads')[1].split('/').pop(),
        colabLink = "https://colab.research.google.com/github/psyneulink/tutorials/blob/gh-pages/_downloads/" + notebookDownloadPath;

    $("#google-colab-link").wrap("<a href=" + colabLink + " data-behavior='call-to-action-event' data-response='Run in Google Colab' target='_blank'/>");
    $("#download-notebook-link").wrap("<a href=" + notebookLink + " data-behavior='call-to-action-event' data-response='Download Notebook'/>");
    $("#github-view-link").wrap("<a href=" + githubLink + " data-behavior='call-to-action-event' data-response='View on Github' target='_blank'/>");
} else {
    $(".psyneulink-call-to-action-links").hide();
}
