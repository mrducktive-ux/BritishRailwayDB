(function () {
    "use strict";

    var API =
        "https://britishrailway.fandom.com/api.php";

    var REDIRECT =
        "https://britishrailway.fandom.com/wiki/" +
        "Special:Redirect/file/";

    var data =
        window.BRDB_COLLECTION_DATA || {};

    var pageCache = {};
    var trainCache = null;

    function clean(value) {
        return String(value || "")
            .replace(/\u00a0/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function normal(value) {
        return clean(value)
            .toLowerCase()
            .replace(/&amp;|&/g, " and ")
            .replace(/[“”"'’]/g, "")
            .replace(
                /british railways?/g,
                "br"
            )
            .replace(
                /first great western/g,
                "fgw"
            )
            .replace(
                /great western railway/g,
                "gwr"
            )
            .replace(
                /transport for wales/g,
                "tfw"
            )
            .replace(
                /arriva trains wales/g,
                "atw"
            )
            .replace(
                /arriva trains northern/g,
                "atn"
            )
            .replace(
                /virgin trains/g,
                "virgin"
            )
            .replace(
                /northern rail/g,
                "northern"
            )
            .replace(
                /\bclass\b|\blivery\b/g,
                " "
            )
            .replace(
                /\bmark\b/g,
                " mk "
            )
            .replace(
                /[^a-z0-9]+/g,
                " "
            )
            .replace(/\s+/g, " ")
            .trim();
    }

    function score(
        firstValue,
        secondValue
    ) {
        var first =
            normal(firstValue);

        var second =
            normal(secondValue);

        if (!first || !second) {
            return 0;
        }

        if (first === second) {
            return 10000;
        }

        if (
            first.indexOf(second) !== -1 ||
            second.indexOf(first) !== -1
        ) {
            return (
                7000 -
                Math.abs(
                    first.length -
                    second.length
                )
            );
        }

        var firstWords =
            first.split(" ");

        var secondWords =
            second.split(" ");

        var matches = 0;

        firstWords.forEach(
            function (word) {
                if (
                    word.length > 1 &&
                    secondWords.indexOf(
                        word
                    ) !== -1
                ) {
                    matches += 1;
                }
            }
        );

        if (!matches) {
            return 0;
        }

        return (
            matches * 250 +
            Math.round(
                matches /
                Math.max(
                    firstWords.length,
                    secondWords.length
                ) *
                1000
            )
        );
    }

    function directSource(image) {
        if (!image) {
            return "";
        }

        var source =
            image.getAttribute(
                "data-src"
            ) ||
            image.getAttribute(
                "src"
            ) ||
            "";

        if (
            !source ||
            source.indexOf("data:") === 0
        ) {
            var sourceSet =
                image.getAttribute(
                    "data-srcset"
                ) ||
                image.getAttribute(
                    "srcset"
                ) ||
                "";

            var choices =
                sourceSet.split(",");

            source =
                choices.length
                    ? clean(
                        choices[
                            choices.length - 1
                        ]
                    ).split(" ")[0]
                    : "";
        }

        if (
            source.indexOf("//") === 0
        ) {
            source =
                "https:" + source;
        }

        return source;
    }

    function wikiSource(image) {
        if (!image) {
   function wikiSource(image) {
    if (!image) {
        return "";
    }

    var fileName =
        image.getAttribute("data-image-name") ||
        image.getAttribute("data-image-key") ||
        "";

    var parent = image.parentNode;

    if (
        !fileName &&
        parent &&
        parent.getAttribute
    ) {
        var href =
            parent.getAttribute("href") || "";

        href =
            href.split("?")[0]
                .split("#")[0];

        var fileMarker =
            "/wiki/File:";

        var normalMarker =
            "/wiki/";

        if (
            href.indexOf(fileMarker) !==wiki/";

        if (
            href.indexOf(fileMarker) !== -1
        ) {
            fileName =
                href.substring(
                    href.indexOf(fileMarker) +
                    fileMarker.length
                );
        } else if (
            href.indexOf(normalMarker) !== -1
        ) {
            var possibleName =
                href.substring(
                    href.indexOf(normalMarker) +
                    normalMarker.length
                );

            if (
                /\.(png|jpg|jpeg|gif|webp)$/i
                    .test(possibleName)
            ) {
                fileName = possibleName;
            }
        }

        if (fileName) {
            try {
                fileName =
                    decodeURIComponent(fileName);
            } catch (error) {
                // Keep original filename.
            }
        }
    }

    if (fileName) {
        return (
            REDIRECT +
            encodeURIComponent(
                clean(fileName)
            )
        );
    }

    return directSource(image);
}
        cells,
        choices
    ) {
        var index;
        var choice;

        for (
            index = 0;
            index < cells.length;
            index += 1
        ) {
            var heading =
                normal(
                    cells[index]
                        .textContent
                );

            for (
                choice = 0;
                choice < choices.length;
                choice += 1
            ) {
                if (
                    heading.indexOf(
                        normal(
                            choices[choice]
                        )
                    ) !== -1
                ) {
                    return index;
                }
            }
        }

        return -1;
    }

    function extractRows(html) {
        var page =
            new DOMParser()
                .parseFromString(
                    html,
                    "text/html"
                );

        var results = [];

        var tables =
            page.querySelectorAll(
                "table"
            );

        Array.prototype
            .forEach.call(
                tables,
                function (table) {
                    var rows =
                        table
                            .querySelectorAll(
                                "tr"
                            );

                    if (!rows.length) {
                        return;
                    }

                    var headers =
                        rows[0]
                            .querySelectorAll(
                                "th,td"
                            );

                    var titleIndex =
                        headingIndex(
                            headers,
                            [
                                "Livery",
                                "Item/Bundle",
                                "Item"
                            ]
                        );

                    var imageIndex =
                        headingIndex(
                            headers,
                            [
                                "Outside view",
                                "Image(s)",
                                "Images",
                                "Image"
                            ]
                        );

                    if (
                        titleIndex === -1 ||
                        imageIndex === -1
                    ) {
                        return;
                    }

                    Array.prototype
                        .forEach.call(
                            rows,
                            function (
                                row,
                                rowIndex
                            ) {
                                if (
                                    rowIndex === 0
                                ) {
                                    return;
                                }

                                var cells =
                                    row
                                        .querySelectorAll(
                                            "th,td"
                                        );

                                if (
                                    cells.length <=
                                    Math.max(
                                        titleIndex,
                                        imageIndex
                                    )
                                ) {
                                    return;
                                }

                                var title =
                                    clean(
                                        cells[
                                            titleIndex
                                        ].textContent
                                    );

                                var images =
                                    cells[
                                        imageIndex
                                    ].querySelectorAll(
                                        "img"
                                    );

                                var source = "";

                                Array.prototype
                                    .some.call(
                                        images,
                                        function (
                                            image
                                        ) {
                                            source =
                                                wikiSource(
                                                    image
                                                );

                                            return Boolean(
                                                source
                                            );
                                        }
                                    );

                                if (
                                    title &&
                                    source
                                ) {
                                    results.push({
                                        title:
                                            title,

                                        source:
                                            source
                                    });
                                }
                            }
                        );
                }
            );

        return results;
    }

function loadWiki(pageName) {
    if (pageCache[pageName]) {
        return pageCache[pageName];
    }

    if (!loadWiki.queue) {
        loadWiki.queue = [];
        loadWiki.running = false;
    }

    pageCache[pageName] =
        new Promise(
            function (resolve) {
                loadWiki.queue.push({
                    pageName: pageName,
                    resolve: resolve
                });

                runNext();
            }
        );

    function runNext() {
        if (
            loadWiki.running ||
            !loadWiki.queue.length
        ) {
            return;
        }

        loadWiki.running = true;

        var job =
            loadWiki.queue.shift();

        var url =
            API +
            "?origin=*" +
            "&action=parse" +
            "&redirects=1" +
            "&prop=text" +
            "&format=json" +
            "&formatversion=2" +
            "&page=" +
            encodeURIComponent(
                job.pageName
            );

        requestPage(0);

        function requestPage(attempt) {
            fetch(
                url,
                {
                    method: "GET",
                    mode: "cors",
                    credentials: "omit",
                    cache: "no-store"
                }
            )
                .then(
                    function (response) {
                        if (!response.ok) {
                            throw new Error(
                                "Wiki request failed"
                            );
                        }

                        return response.json();
                    }
                )
                .then(
                    function (result) {
                        if (
                            result.parse &&
                            result.parse.text
                        ) {
                            finish(
                                extractRows(
                                    result.parse.text
                                )
                            );

                            return;
                        }

                        finish([]);
                    }
                )
                .catch(
                    function (error) {
                        if (attempt < 1) {
                            window.setTimeout(
                                function () {
                                    requestPage(
                                        attempt + 1
                                    );
                                },
                                700
                            );

                            return;
                        }

                        if (
                            window.console &&
                            console.error
                        ) {
                            console.error(
                                "Photo page failed: " +
                                job.pageName,
                                error
                            );
                        }

                        finish([]);
                    }
                );
        }

        function finish(rows) {
            job.resolve(rows);

            window.setTimeout(
                function () {
                    loadWiki.running =
                        false;

                    runNext();
                },
                200
            );
        }
    }

    return pageCache[pageName];
}

    function loadTrainPhotos() {
        if (trainCache) {
            return trainCache;
        }

        trainCache =
            fetch(
                "trains.html?photo-map=4",
                {
                    method: "GET",
                    cache: "no-store"
                }
            )
                .then(
                    function (
                        response
                    ) {
                        if (
                            !response.ok
                        ) {
                            throw new Error(
                                "Train page failed"
                            );
                        }

                        return response
                            .text();
                    }
                )
                .then(
                    function (html) {
                        var page =
                            new DOMParser()
                                .parseFromString(
                                    html,
                                    "text/html"
                                );

                        var map = {};

                        var cards =
                            page
                                .querySelectorAll(
                                    ".train-card"
                                );

                        Array.prototype
                            .forEach.call(
                                cards,
                                function (
                                    card
                                ) {
                                    var title =
                                        card
                                            .querySelector(
                                                "h3"
                                            );

                                    var source =
                                        directSource(
                                            card
                                                .querySelector(
                                                    "img"
                                                )
                                        );

                                    if (
                                        title &&
                                        source
                                    ) {
                                        map[
                                            normal(
                                                title
                                                    .textContent
                                            )
                                        ] =
                                            source;
                                    }
                                }
                            );

                        return map;
                    }
                )
                .catch(
                    function () {
                        return {};
                    }
                );

        return trainCache;
    }

    function activeCategory() {
        var tab =
            document.querySelector(
                ".collection-tab.active"
            );

        if (!tab) {
            return "trains";
        }

        return (
            tab.getAttribute(
                "data-collection-type"
            ) ||
            "trains"
        );
    }

    function findItem(
        card,
        category
    ) {
        var title =
            card.querySelector("h3");

        if (
            !title ||
            !data[category]
        ) {
            return null;
        }

        var name =
            normal(
                title.textContent
            );

        var matches =
            data[category].filter(
                function (item) {
                    return (
                        normal(
                            item.name
                        ) === name
                    );
                }
            );

        if (matches.length <= 1) {
            return (
                matches[0] ||
                null
            );
        }

        var cardText =
            normal(
                card.textContent
            );

        var best =
            matches[0];

        var bestScore = -1;

        matches.forEach(
            function (item) {
                var itemScore =
                    score(
                        item.parent,
                        cardText
                    );

                if (
                    itemScore >
                    bestScore
                ) {
                    bestScore =
                        itemScore;

                    best =
                        item;
                }
            }
        );

        return best;
    }

    function pageFor(item) {
        if (
            item.category ===
            "weekly"
        ) {
            if (
                item.id ===
                "event-skipper-142"
            ) {
                return "Class_142";
            }

            return "Weekly_Items";
        }

        if (
            /^Class \d+$/.test(
                item.parent
            )
        ) {
            return item.parent
                .replace(
                    / /g,
                    "_"
                );
        }

        var specialPages = {
            "Mark 2 coaches":
                "Mark_2_coaches",

            "Mark 2 DBSO":
                "Mark_2_Driving_Brake_Standard_Open",

            "Mark 3 coaches":
                "Mark_3_coaches",

            "Mark 3 DVT":
                "Mark_3_Driving_Van_Trailer"
        };

        return (
            specialPages[
                item.parent
            ] ||
            ""
        );
    }

    function bestPhoto(
        item,
        rows
    ) {
        var queries = [
            item.name,
            item.note,
            item.name +
                " " +
                item.note
        ];

        var best = "";
        var bestScore = 0;

        rows.forEach(
            function (row) {
                queries.forEach(
                    function (
                        query
                    ) {
                        var rowScore =
                            score(
                                query,
                                row.title
                            );

                        if (
                            rowScore >
                            bestScore
                        ) {
                            bestScore =
                                rowScore;

                            best =
                                row.source;
                        }
                    }
                );
            }
        );

        return bestScore >= 500
            ? best
            : "";
    }

    function install(
        card,
        item,
        source
    ) {
        var box =
            card.querySelector(
                ".collection-card-image"
            );

        if (
            !source ||
            !box ||
            !document.body
                .contains(card)
        ) {
            card.setAttribute(
                "data-photo-state",
                "missing"
            );

            return;
        }

        var image =
            document.createElement(
                "img"
            );

        image.alt =
            item.name +
            " in Roblox British Railway";

        image.loading =
            "lazy";

        image.decoding =
            "async";

        image.referrerPolicy =
            "no-referrer";

        image.addEventListener(
            "load",
            function () {
                if (
                    !document.body
                        .contains(card)
                ) {
                    return;
                }

                box.textContent = "";

                box.appendChild(
                    image
                );

                card.setAttribute(
                    "data-photo-state",
                    "loaded"
                );
            }
        );

        image.addEventListener(
            "error",
            function () {
                card.setAttribute(
                    "data-photo-state",
                    "missing"
                );
            }
        );

        image.src = source;
    }

    function applyCard(
        card,
        category
    ) {
        if (
            card.getAttribute(
                "data-photo-state"
            )
        ) {
            return;
        }

        if (
            category === "routes"
        ) {
            card.setAttribute(
                "data-photo-state",
                "missing"
            );

            return;
        }

        var item =
            findItem(
                card,
                category
            );

        if (!item) {
            card.setAttribute(
                "data-photo-state",
                "missing"
            );

            return;
        }

        card.setAttribute(
            "data-photo-state",
            "loading"
        );

        if (
            category === "trains"
        ) {
            loadTrainPhotos()
                .then(
                    function (map) {
                        install(
                            card,
                            item,
                            map[
                                normal(
                                    item.name
                                )
                            ] || ""
                        );
                    }
                );

            return;
        }

        var pageName =
            pageFor(item);

        if (!pageName) {
            card.setAttribute(
                "data-photo-state",
                "missing"
            );

            return;
        }

        loadWiki(pageName)
            .then(
                function (rows) {
                    install(
                        card,
                        item,
                        bestPhoto(
                            item,
                            rows
                        )
                    );
                }
            );
    }

    function applyVisible() {
        var category =
            activeCategory();

        var cards =
            document.querySelectorAll(
                "#collectionGrid " +
                ".collection-card"
            );

        Array.prototype
            .forEach.call(
                cards,
                function (card) {
                    applyCard(
                        card,
                        category
                    );
                }
            );
    }

    function start() {
        var grid =
            document.getElementById(
                "collectionGrid"
            );

        if (!grid) {
            return;
        }

        if (
            window.MutationObserver
        ) {
            new MutationObserver(
                function () {
                    window.setTimeout(
                        applyVisible,
                        0
                    );
                }
            ).observe(
                grid,
                {
                    childList: true
                }
            );
        }

        var tabs =
            document.querySelectorAll(
                ".collection-tab"
            );

        Array.prototype
            .forEach.call(
                tabs,
                function (tab) {
                    tab.addEventListener(
                        "click",
                        function () {
                            window.setTimeout(
                                applyVisible,
                                25
                            );
                        }
                    );
                }
            );

        applyVisible();
    }

    start();
}());
