(function () {
    "use strict";

    var API_URL =
        "https://britishrailway.fandom.com/api.php";

    var data =
        window.BRDB_COLLECTION_DATA || {};

    var wikiCache = {};
    var trainImagePromise = null;

    var pageNames = {
        "Class 47": "Class_47",
        "Class 86": "Class_86",
        "Class 90": "Class_90",
        "Class 142": "Class_142",
        "Class 150": "Class_150",
        "Class 153": "Class_153",
        "Class 156": "Class_156",
        "Class 158": "Class_158",
        "Class 159": "Class_159",
        "Class 170": "Class_170",
        "Class 171": "Class_171",
        "Class 180": "Class_180",
        "Class 220": "Class_220",
        "Class 221": "Class_221",
        "Class 230": "Class_230",
        "Class 231": "Class_231",
        "Class 321": "Class_321",
        "Class 322": "Class_322",
        "Class 350": "Class_350",
        "Class 745": "Class_745",
        "Class 755": "Class_755",
        "Class 756": "Class_756",
        "Class 800": "Class_800",
        "Class 801": "Class_801",
        "Class 802": "Class_802",
        "Class 803": "Class_803",
        "Class 805": "Class_805",
        "Class 807": "Class_807",

        "Mark 2 coaches":
            "Mark_2_coaches",

        "Mark 2 DBSO":
            "Mark_2_Driving_Brake_Standard_Open",

        "Mark 3 coaches":
            "Mark_3_coaches",

        "Mark 3 DVT":
            "Mark_3_Driving_Van_Trailer"
    };

    var specialPages = {
        "event-skipper-142":
            "Class_142"
    };

    var aliases = {
        "47-green": [
            "BR Two-tone Green",
            "Two-tone Green",
            "BR Green"
        ],

        "47-grey": [
            "GB Railfreight Distribution",
            "Railfreight Distribution"
        ],

        "150-gmpte": [
            "GMPTE / Regional Black",
            "GMPTE",
            "Regional Railways Black"
        ],

        "142-br-bifold": [
            "British Railways (Bifold)",
            "British Railway (Bifold)"
        ],

        "weekly-br-blue-heritage": [
            "BR Blue 86 101 & Mk3 DVT 82115",
            "BR Blue 86 101 and Mk3 DVT 82115"
        ],

        "weekly-pretendolino": [
            "BR Blue 86 101 & Mk3 DVT 82115",
            "BR Blue ": [
            "Pretendolino",
            "Pretendelino",
            "Pretendolino Set"
        ],

        "weekly-dutch-321": [
            "NS (NSE) 321 334 Amsterdam",
            "NS/NSE Dutch Class 321 334"
        ],

        "weekly-silk-221": [
            "VT Silk 221 101",
            "Virgin Trains Silk 221 101"
        ],

        "weekly-silk-800": [
            "VT Silk 800 101",
            "Virgin Trains Silk 800 101"
        ],

        "weekly-electric-blue-86": [
            "Electric Blue 86 259",
            "Electric Blue Class 86 259"
        ],

        "weekly-short-221": [
            "VT 221 144 (2 car)",
            "Virgin Trains 221 144 (2 car)"
        ],

        "weekly-swt-cracker": [
            "SWT Cracker 159 103"
        ],

        "weekly-northern-156": [
            "Northern Prototype Class 156",
            "Northern Prototype 156"
        ],

        "weekly-overground-321": [
            "London Overground 321 414"
        ],

        "weekly-one-dbso": [
            "ONE Anglia Mark 2 DBSO 9710",
            "ONE Anglia DBSO 9710"
        ],

        "weekly-ht-802": [
            "Hull Trains Anniversary 802 305",
            "Hull Trains 802 305"
        ],

        "weekly-white-80x": [
            "Blank White 80X",
            "White 80X"
        ],

        "weekly-anglia-86": [
            "Anglia Railways UK 86 227",
            "Anglia Railways 86 227"
        ],

        "weekly-police-47": [
            "British Transport Police 47 829",
            "BTP 47 829"
        ],

        "weekly-cop26-230": [
            "Vivarail COP26 230 001",
            "COP26 230 001"
        ],

        "weekly-dual-fuel-180": [
            "Grand Central Dual Fuel 180 112",
            "Dual Fuel 180 112"
        ],

        "weekly-tfw-test-230": [
            "Transport for Wales Test Train 230",
            "TFW Test Train 230"
        ],

        "weekly-northern-150": [
            "Northern Prototype Class 150",
            "Northern Prototype 150"
        ],

        "weekly-pride-set": [
            "Pride Set",
            "220 005, 350 375 & 800 008"
        ],

        "weekly-lnwr-150": [
            "LNWR Marston Vale Line 150/1",
            "LNWR Marston Vale 150/1"
        ],

        "event-skipper-142": [
            "BR Skipper"
        ]
    };

    function cleanText(value) {
        return String(value || "")
            .replace(/\u00a0/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function normalise(value) {
        return cleanText(value)
            .toLowerCase()
            .replace(/&amp;/g, " and ")
            .replace(/&/g, " and ")
            .replace(/[“”"'’]/g, "")
            .replace(/\bclass\b/g, " ")
            .replace(/\bmark\b/g, " mk ")
            .replace(/\blivery\b/g, " ")
            .replace(/[()/:,.-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function tokens(value) {
        var words =
            normalise(value).split(" ");

        return words.filter(
            function (word) {
                return word.length > 1;
            }
        );
    }

    function scoreMatch(query, candidate) {
        var first =
            normalise(query);

        var second =
            normalise(candidate);

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
            tokens(first);

        var secondWords =
            tokens(second);

        var matches = 0;

        firstWords.forEach(
            function (word) {
                if (
                    secondWords.indexOf(word) !== -1
                ) {
                    matches += 1;
                }
            }
        );

        if (!matches) {
            return 0;
        }

        var coverage =
            matches /
            Math.max(
                firstWords.length,
                secondWords.length
            );

        return (
            matches * 150 +
            Math.round(coverage * 500)
        );
    }

    function imageSource(image) {
        if (!image) {
            return "";
        }

        var source =
            image.getAttribute("data-src") ||
            image.getAttribute("src") ||
            "";

        if (
            !source ||
            source.indexOf("data:") === 0
        ) {
            var sourceSet =
                image.getAttribute("srcset") ||
                image.getAttribute(
                    "data-srcset"
                ) ||
                "";

            var choices =
                sourceSet.split(",");

            if (choices.length) {
                source =
                    cleanText(
                        choices[
                            choices.length - 1
                        ]
                    ).split(" ")[0];
            }
        }

        if (
            source.indexOf("//") === 0
        ) {
            source =
                "https:" + source;
        }

        source = source.replace(
            /\/scale-to-width-down\/\d+/g,
            ""
        );

        source = source.replace(
            /\/smart\/width\/\d+\/height\/\d+/g,
            ""
        );

        return source;
    }

    function findHeaderIndex(
        cells,
        possibleNames
    ) {
        for (
            var index = 0;
            index < cells.length;
            index += 1
        ) {
            var heading =
                normalise(
                    cells[index].textContent
                );

            for (
                var nameIndex = 0;
                nameIndex <
                    possibleNames.length;
                nameIndex += 1
            ) {
                if (
                    heading.indexOf(
                        normalise(
                            possibleNames[
                                nameIndex
                            ]
                        )
                    ) !== -1
                ) {
                    return index;
                }
            }
        }

        return -1;
    }

    function extractWikiRows(html) {
        var page =
            new DOMParser().parseFromString(
                html,
                "text/html"
            );

        var results = [];
        var tables =
            page.querySelectorAll("table");

        Array.prototype.forEach.call(
            tables,
            function (table) {
                var headerRow =
                    table.querySelector(
                        "thead tr"
                    ) ||
                    table.querySelector("tr");

                if (!headerRow) {
                    return;
                }

                var headerCells =
                    headerRow.querySelectorAll(
                        "th, td"
                    );

                var titleIndex =
                    findHeaderIndex(
                        headerCells,
                        [
                            "Livery",
                            "Item/Bundle",
                            "Item"
                        ]
                    );

                var imageIndex =
                    findHeaderIndex(
                        headerCells,
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

                var rows =
                    table.querySelectorAll("tr");

                Array.prototype.forEach.call(
                    rows,
                    function (row) {
                        if (row === headerRow) {
                            return;
                        }

                        var cells =
                            row.querySelectorAll(
                                "th, td"
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
                            cleanText(
                                cells[
                                    titleIndex
                                ].textContent
                            );

                        var image =
                            cells[
                                imageIndex
                            ].querySelector("img");

                        var source =
                            imageSource(image);

                        if (
                            title &&
                            source
                        ) {
                            results.push({
                                title: title,
                                image: source
                            });
                        }
                    }
                );
            }
        );

        return results;
    }

    function loadWikiPage(pageName) {
        if (wikiCache[pageName]) {
            return wikiCache[pageName];
        }

        var url =
            API_URL +
            "?origin=*" +
            "&action=parse" +
            "&redirects=1" +
            "&prop=text" +
            "&format=json" +
            "&formatversion=2" +
            "&page=" +
            encodeURIComponent(pageName);

        wikiCache[pageName] =
            fetch(url, {
                method: "GET",
                mode: "cors",
                cache: "force-cache"
            })
                .then(
                    function (response) {
                        if (!response.ok) {
                            throw new Error(
                                "Wiki request failed."
                            );
                        }

                        return response.json();
                    }
                )
                .then(
                    function (responseData) {
                        if (
                            !responseData.parse ||
                            !responseData.parse.text
                        ) {
                            throw new Error(
                                "Wiki page had no content."
                            );
                        }

                        return extractWikiRows(
                            responseData.parse.text
                        );
                    }
                )
                .catch(
                    function (error) {
                        if (
                            window.console &&
                            console.error
                        ) {
                            console.error(
                                "Could not load " +
                                pageName,
                                error
                            );
                        }

                        return [];
                    }
                );

        return wikiCache[pageName];
    }

    function loadTrainImages() {
        if (trainImagePromise) {
            return trainImagePromise;
        }

        trainImagePromise =
            fetch(
                "trains.html?collection-images=2",
                {
                    method: "GET",
                    cache: "no-store"
                }
            )
                .then(
                    function (response) {
                        if (!response.ok) {
                            throw new Error(
                                "Train page failed."
                            );
                        }

                        return response.text();
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

                        var imageMap = {};
                        var cards =
                            page.querySelectorAll(
                                ".train-card"
                            );

                        Array.prototype
                            .forEach.call(
                                cards,
                                function (card) {
                                    var title =
                                        card.querySelector(
                                            "h3"
                                        );

                                    var image =
                                        card.querySelector(
                                            "img"
                                        );

                                    var source =
                                        imageSource(
                                            image
                                        );

                                    if (
                                        title &&
                                        source
                                    ) {
                                        imageMap[
                                            normalise(
                                                title
                                                    .textContent
                                            )
                                        ] = source;
                                    }
                                }
                            );

                        return imageMap;
                    }
                )
                .catch(
                    function () {
                        return {};
                    }
                );

        return trainImagePromise;
    }

    function activeCategory() {
        var activeTab =
            document.querySelector(
                ".collection-tab.active"
            );

        if (!activeTab) {
            return "trains";
        }

        return (
            activeTab.getAttribute(
                "data-collection-type"
            ) ||
            "trains"
        );
    }

    function cardParentTexts(card) {
        var values = [];
        var badges =
            card.querySelectorAll(
                ".collection-card-badge"
            );

        Array.prototype.forEach.call(
            badges,
            function (badge) {
                values.push(
                    normalise(
                        badge.textContent
                    )
                );
            }
        );

        return values;
    }

    function findItem(card, category) {
        var title =
            card.querySelector("h3");

        if (
            !title ||
            !data[category]
        ) {
            return null;
        }

        var wantedName =
            normalise(
                title.textContent
            );

        var possible =
            data[category].filter(
                function (item) {
                    return (
                        normalise(item.name) ===
                        wantedName
                    );
                }
            );

        if (possible.length === 1) {
            return possible[0];
        }

        var parentTexts =
            cardParentTexts(card);

        for (
            var index = 0;
            index < possible.length;
            index += 1
        ) {
            if (
                parentTexts.indexOf(
                    normalise(
                        possible[index].parent
                    )
                ) !== -1
            ) {
                return possible[index];
            }
        }

        return possible[0] || null;
    }

    function queriesForItem(item) {
        var queries = [
            item.name
        ];

        if (aliases[item.id]) {
            queries =
                aliases[item.id].concat(
                    queries
                );
        }

        return queries;
    }

    function findBestWikiImage(
        item,
        rows
    ) {
        var queries =
            queriesForItem(item);

        var bestImage = "";
        var bestScore = 0;

        rows.forEach(
            function (row) {
                queries.forEach(
                    function (query) {
                        var score =
                            scoreMatch(
                                query,
                                row.title
                            );

                        if (
                            score > bestScore
                        ) {
                            bestScore = score;
                            bestImage =
                                row.image;
                        }
                    }
                );
            }
        );

        if (bestScore < 250) {
            return "";
        }

        return bestImage;
    }

    function pageForItem(item) {
        if (
            specialPages[item.id]
        ) {
            return specialPages[
                item.id
            ];
        }

        if (
            item.category === "weekly"
        ) {
            return "Weekly_Items";
        }

        return pageNames[
            item.parent
        ] || "";
    }

    function setCardImage(
        card,
        item,
        source
    ) {
        if (
            !source ||
            !document.body.contains(card)
        ) {
            card.setAttribute(
                "data-photo-state",
                "missing"
            );

            return;
        }

        var imageBox =
            card.querySelector(
                ".collection-card-image"
            );

        if (!imageBox) {
            return;
        }

        var image =
            document.createElement("img");

        image.src = source;

        image.alt =
            item.name +
            " in Roblox British Railway";

        image.loading = "lazy";

        image.addEventListener(
            "error",
            function () {
                image.remove();

                card.setAttribute(
                    "data-photo-state",
                    "missing"
                );
            }
        );

        imageBox.textContent = "";
        imageBox.appendChild(image);

        card.setAttribute(
            "data-photo-state",
            "loaded"
        );
    }

    function applyTrainPhoto(
        card,
        item
    ) {
        loadTrainImages().then(
            function (imageMap) {
                var source =
                    imageMap[
                        normalise(
                            item.name
                        )
                    ] || "";

                setCardImage(
                    card,
                    item,
                    source
                );
            }
        );
    }

    function applyWikiPhoto(
        card,
        item
    ) {
        var pageName =
            pageForItem(item);

        if (!pageName) {
            card.setAttribute(
                "data-photo-state",
                "missing"
            );

            return;
        }

        loadWikiPage(pageName).then(
            function (rows) {
                var source =
                    findBestWikiImage(
                        item,
                        rows
                    );

                setCardImage(
                    card,
                    item,
                    source
                );
            }
        );
    }

    function applyCardPhoto(
        card,
        category
    ) {
        var currentState =
            card.getAttribute(
                "data-photo-state"
            );

        if (
            currentState === "loading" ||
            currentState === "loaded" ||
            currentState === "missing"
        ) {
            return;
        }

        if (category === "routes") {
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

        if (category === "trains") {
            applyTrainPhoto(
                card,
                item
            );

            return;
        }

        applyWikiPhoto(
            card,
            item
        );
    }

    function applyVisiblePhotos() {
        var category =
            activeCategory();

        var cards =
            document.querySelectorAll(
                "#collectionGrid " +
                ".collection-card"
            );

        Array.prototype.forEach.call(
            cards,
            function (card) {
                applyCardPhoto(
                    card,
                    category
                );
            }
        );
    }

    function watchGrid() {
        var grid =
            document.getElementById(
                "collectionGrid"
            );

        if (!grid) {
            return;
        }

        if (window.MutationObserver) {
            var observer =
                new MutationObserver(
                    function () {
                        window.setTimeout(
                            applyVisiblePhotos,
                            0
                        );
                    }
                );

            observer.observe(
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

        Array.prototype.forEach.call(
            tabs,
            function (tab) {
                tab.addEventListener(
                    "click",
                    function () {
                        window.setTimeout(
                            applyVisiblePhotos,
                            20
                        );
                    }
                );
            }
        );
    }

    watchGrid();
    applyVisiblePhotos();
}());
