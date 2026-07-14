(function () {
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
