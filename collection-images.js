(function () {
    "use strict";

    var imageMap = {};
    var imagesReady = false;

    function cleanText(value) {
        return String(value || "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function normalise(value) {
        return cleanText(value).toLowerCase();
    }

    function buildImageMap(html) {
        var page =
            new DOMParser().parseFromString(
                html,
                "text/html"
            );

        var cards =
            page.querySelectorAll(
                ".train-card"
            );

        Array.prototype.forEach.call(
            cards,
            function (card) {
                var title =
                    card.querySelector("h3");

                var image =
                    card.querySelector("img");

                if (
                    !title ||
                    !image ||
                    !image.getAttribute("src")
                ) {
                    return;
                }

                imageMap[
                    normalise(
                        title.textContent
                    )
                ] =
                    image.getAttribute("src");
            }
        );
    }

    function findExactPhoto(card) {
        var title =
            card.querySelector("h3");

        if (title) {
            var titlePhoto =
                imageMap[
                    normalise(
                        title.textContent
                    )
                ];

            if (titlePhoto) {
                return titlePhoto;
            }
        }

        var badges =
            card.querySelectorAll(
                ".collection-card-badge"
            );

        for (
            var index = 0;
            index < badges.length;
            index += 1
        ) {
            var badgePhoto =
                imageMap[
                    normalise(
                        badges[index].textContent
                    )
                ];

            if (badgePhoto) {
                return badgePhoto;
            }
        }

        return "";
    }

    function findMentionedPhoto(card) {
        var cardText =
            normalise(
                card.textContent
            );

        var trainNames =
            Object.keys(imageMap);

        trainNames.sort(
            function (first, second) {
                return (
                    second.length -
                    first.length
                );
            }
        );

        for (
            var index = 0;
            index < trainNames.length;
            index += 1
        ) {
            var trainName =
                trainNames[index];

            if (
                cardText.indexOf(
                    trainName
                ) !== -1
            ) {
                return imageMap[
                    trainName
                ];
            }
        }

        return "";
    }

    function findPhoto(card) {
        return (
            findExactPhoto(card) ||
            findMentionedPhoto(card)
        );
    }

    function applyPhoto(card) {
        if (
            card.getAttribute(
                "data-photo-checked"
            ) === "true"
        ) {
            return;
        }

        var imageSource =
            findPhoto(card);

        var imageBox =
            card.querySelector(
                ".collection-card-image"
            );

        if (
            !imageSource ||
            !imageBox
        ) {
            card.setAttribute(
                "data-photo-checked",
                "true"
            );

            return;
        }

        var title =
            card.querySelector("h3");

        var image =
            document.createElement(
                "img"
            );

        image.src =
            imageSource;

        image.alt =
            title
                ? title.textContent +
                    " in Roblox British Railway"
                : "British Railway item";

        image.loading =
            "lazy";

        imageBox.textContent =
            "";

        imageBox.appendChild(
            image
        );

        card.setAttribute(
            "data-photo-checked",
            "true"
        );
    }

    function applyAllPhotos() {
        if (!imagesReady) {
            return;
        }

        var cards =
            document.querySelectorAll(
                "#collectionGrid " +
                ".collection-card"
            );

        Array.prototype.forEach.call(
            cards,
            applyPhoto
        );
    }

    function watchCollectionGrid() {
        var grid =
            document.getElementById(
                "collectionGrid"
            );

        if (
            !grid ||
            !window.MutationObserver
        ) {
            return;
        }

        var observer =
            new MutationObserver(
                function () {
                    applyAllPhotos();
                }
            );

        observer.observe(
            grid,
            {
                childList: true
            }
        );
    }

    function loadPhotos() {
        fetch(
            "trains.html?photos=1",
            {
                method: "GET",
                cache: "no-store"
            }
        )
            .then(
                function (response) {
                    if (!response.ok) {
                        throw new Error(
                            "Could not load train photos."
                        );
                    }

                    return response.text();
                }
            )
            .then(
                function (html) {
                    buildImageMap(html);

                    imagesReady = true;

                    applyAllPhotos();
                }
            )
            .catch(
                function (error) {
                    if (
                        window.console &&
                        console.error
                    ) {
                        console.error(error);
                    }
                }
            );
    }

    watchCollectionGrid();
    loadPhotos();
}());
