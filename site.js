(function () {
    var panels = document.querySelectorAll(".page-menu-panel");
    var currentFile =
        window.location.pathname.split("/").pop() || "index.html";

    for (var p = 0; p < panels.length; p++) {
        var panel = panels[p];
        var accountLink = panel.querySelector('a[href="account.html"]');

        if (!accountLink) {
            accountLink = document.createElement("a");
            accountLink.href = "account.html";
            accountLink.textContent = "My Account";
            panel.appendChild(accountLink);
        }

        if (currentFile === "account.html") {
            accountLink.className = "current";
            accountLink.setAttribute("aria-current", "page");
        }
    }

    var menus = document.querySelectorAll(".page-menu");

    document.addEventListener("click", function (event) {
        for (var i = 0; i < menus.length; i++) {
            if (!menus[i].contains(event.target)) {
                menus[i].removeAttribute("open");
            }
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" || event.keyCode === 27) {
            for (var i = 0; i < menus.length; i++) {
                menus[i].removeAttribute("open");
            }
        }
    });
}());
