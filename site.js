(function () {
    "use strict";

    var API_BASE =
        "https://brbd-accounts.mrducktive.workers.dev";

    var body = document.body;

    var currentFile =
        window.location.pathname
            .split("/")
            .pop() || "index.html";

    var pageName =
        currentFile.replace(/\.html$/i, "") ||
        "index";

    if (body) {
        body.setAttribute("data-page", pageName);

        if (
            /^(class\d+|mark\d+|mark2coaches|mark2dbso|mark3coaches|mark3dvt)$/i
                .test(pageName)
        ) {
            body.classList.add("page-stock-detail");
        }
    }

    var panels =
        document.querySelectorAll(
            ".page-menu-panel"
        );

    function ensureLink(
        panel,
        href,
        text
    ) {
        var link =
            panel.querySelector(
                'a[href="' + href + '"]'
            );

        if (!link) {
            link =
                document.createElement("a");

            link.href = href;
            link.textContent = text;

            panel.appendChild(link);
        }

        return link;
    }

    function markCurrentPage(panel) {
        var links =
            panel.querySelectorAll("a");

        links.forEach(function (link) {
            link.classList.remove("current");
            link.removeAttribute("aria-current");

            var href =
                (
                    link.getAttribute("href") ||
                    ""
                ).split("#")[0];

            if (href === currentFile) {
                link.classList.add("current");

                link.setAttribute(
                    "aria-current",
                    "page"
                );
            }
        });
    }

    panels.forEach(function (panel) {
        ensureLink(
            panel,
            "community.html",
            "Community Photos"
        );

        ensureLink(
            panel,
            "submit-photo.html",
            "Submit a Photo"
        );

        ensureLink(
            panel,
            "account.html",
            "My Account"
        );

        markCurrentPage(panel);
    });

    function showStaffLinks() {
        panels.forEach(function (panel) {
            var staffLink =
                ensureLink(
                    panel,
                    "admin-photos.html",
                    "Staff Panel"
                );

            staffLink.hidden = false;
            staffLink.style.display = "";

            markCurrentPage(panel);
        });
    }

    fetch(
        API_BASE + "/api/me",
        {
            method: "GET",
            credentials: "include",
            cache: "no-store"
        }
    )
        .then(function (response) {
            if (!response.ok) {
                return null;
            }

            return response.json();
        })
        .then(function (data) {
            if (
                data &&
                data.user &&
                Number(data.user.is_admin) === 1
            ) {
                showStaffLinks();
            }
        })
        .catch(function () {
            // Admin link stays hidden.
        });

    var menus =
        document.querySelectorAll(
            ".page-menu"
        );

    document.addEventListener(
        "click",
        function (event) {
            menus.forEach(function (menu) {
                if (!menu.contains(event.target)) {
                    menu.removeAttribute("open");
                }
            });
        }
    );

    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Escape") {
                menus.forEach(function (menu) {
                    menu.removeAttribute("open");
                });
            }
        }
    );
}());
