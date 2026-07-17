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
        body.setAttribute(
            "data-page",
            pageName
        );

        if (
            /^(class\d+|mark\d+|mark2coaches|mark2dbso|mark3coaches|mark3dvt)$/i
                .test(pageName)
        ) {
            body.classList.add(
                "page-stock-detail"
            );
        }
    }

    var panels =
        document.querySelectorAll(
            ".page-menu-panel"
        );

    function markCurrentPage(panel) {
        var links =
            panel.querySelectorAll("a");

        links.forEach(function (link) {
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
        var accountLink =
            panel.querySelector(
                'a[href="account.html"]'
            );

        if (!accountLink) {
            accountLink =
                document.createElement("a");

            accountLink.href =
                "account.html";

            accountLink.textContent =
                "My Account";

            panel.appendChild(
                accountLink
            );
        }

        markCurrentPage(panel);
    });

    function showStaffLinks() {
        panels.forEach(function (panel) {
            var staffLink =
                panel.querySelector(
                    'a[href="admin-photos.html"]'
                );

            if (!staffLink) {
                staffLink =
                    document.createElement("a");

                staffLink.href =
                    "admin-photos.html";

                staffLink.textContent =
                    "Staff Panel";

                panel.appendChild(
                    staffLink
                );
            }

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
            // Stay hidden when signed out
            // or when the API is unavailable.
        });

    var menus =
        document.querySelectorAll(
            ".page-menu"
        );

    document.addEventListener(
        "click",
        function (event) {
            menus.forEach(function (menu) {
                if (
                    !menu.contains(event.target)
                ) {
                    menu.removeAttribute(
                        "open"
                    );
                }
            });
        }
    );

    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Escape") {
                menus.forEach(
                    function (menu) {
                        menu.removeAttribute(
                            "open"
                        );
                    }
                );
            }
        }
    );
}());
