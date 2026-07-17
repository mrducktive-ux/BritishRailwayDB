(function () {
    "use strict";

    var STORAGE_KEY = "brdbCollectionV1";

    var grid =
        document.getElementById("collectionGrid");

    var message =
        document.getElementById("collectionMessage");

    var searchInput =
        document.getElementById("collectionSearch");

    var statusFilter =
        document.getElementById("collectionStatusFilter");

    var resetButton =
        document.getElementById("resetCollectionButton");

    var percentageText =
        document.getElementById("collectionPercentage");

    var ringText =
        document.getElementById("collectionRingText");

    var progressRing =
        document.getElementById("collectionProgressRing");

    var progressFill =
        document.getElementById("collectionProgressFill");

    var ownedCount =
        document.getElementById("ownedCount");

    var wishlistCount =
        document.getElementById("wishlistCount");

    var missingCount =
        document.getElementById("missingCount");

    var totalCount =
        document.getElementById("totalCount");

    var tabs =
        document.querySelectorAll(".collection-tab");

    var items = {
        trains: [],
        routes: []
    };

    var activeType = "trains";
    var collection = loadCollection();

    function loadCollection() {
        try {
            var saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return {};
            }

            return JSON.parse(saved) || {};
        } catch (error) {
            return {};
        }
    }

    function saveCollection() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(collection)
            );
        } catch (error) {
            showMessage(
                "Your browser could not save your collection."
            );
        }
    }

    function showMessage(text) {
        if (!message) {
            return;
        }

        message.hidden = false;
        message.textContent = text;
    }

    function hideMessage() {
        if (message) {
            message.hidden = true;
        }
    }

    function cleanText(value) {
        return String(value || "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function slugify(value) {
        return cleanText(value)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function getText(element, selector, fallback) {
        var found =
            element.querySelector(selector);

        if (!found) {
            return fallback || "";
        }

        return cleanText(found.textContent);
    }

    function loadPage(filename) {
        return fetch(filename, {
            method: "GET",
            cache: "no-store"
        }).then(function (response) {
            if (!response.ok) {
                throw new Error(
                    "Could not load " + filename
                );
            }

            return response.text();
        });
    }

    function parseTrains(html) {
        var page =
            new DOMParser().parseFromString(
                html,
                "text/html"
            );

        var cards =
            page.querySelectorAll(".train-card");

        return Array.prototype.map.call(
            cards,
            function (card) {
                var name =
                    getText(
                        card,
                        "h3",
                        "Unknown train"
                    );

                var description =
                    getText(
                        card,
                        ".train-content p",
                        "Rolling stock"
                    );

                var image =
                    card.querySelector("img");

                var href =
                    card.getAttribute("href") ||
                    "trains.html";

                return {
                    id:
                        "train-" +
                        slugify(href || name),

                    name: name,

                    description:
                        description,

                    image:
                        image
                            ? image.getAttribute("src")
                            : "",

                    type: "trains"
                };
            }
        );
    }

    function parseRoutes(html) {
        var page =
            new DOMParser().parseFromString(
                html,
                "text/html"
            );

        var cards =
            page.querySelectorAll(".route-card");

        return Array.prototype.map.call(
            cards,
            function (card) {
                var name =
                    getText(
                        card,
                        "h3",
                        "Unknown route"
                    );

                var price =
                    getText(
                        card,
                        ".route-price",
                        "Route pack"
                    );

                var note =
                    getText(
                        card,
                        ".route-note",
                        ""
                    );

                var description = price;

                if (note) {
                    description +=
                        " — " + note;
                }

                return {
                    id:
                        "route-" +
                        slugify(name),

                    name: name,

                    description:
                        description,

                    image: "",

                    type: "routes"
                };
            }
        );
    }

    function getStatus(item) {
        return collection[item.id] || "missing";
    }

    function getStatusText(status) {
        if (status === "owned") {
            return "Owned";
        }

        if (status === "wishlist") {
            return "On your wishlist";
        }

        return "Not owned";
    }

    function changeStatus(item, newStatus) {
        var currentStatus =
            getStatus(item);

        if (currentStatus === newStatus) {
            delete collection[item.id];
        } else {
            collection[item.id] =
                newStatus;
        }

        saveCollection();
        updateStats();
        render();
    }

    function createImage(item) {
        var imageBox =
            document.createElement("div");

        imageBox.className =
            "collection-card-image";

        if (item.image) {
            var image =
                document.createElement("img");

            image.src = item.image;

            image.alt =
                item.name +
                " in Roblox British Railway";

            image.loading = "lazy";

            imageBox.appendChild(image);
        } else {
            var placeholder =
                document.createElement("div");

            placeholder.textContent = "🗺️";

            placeholder.setAttribute(
                "aria-hidden",
                "true"
            );

            placeholder.style.height =
                "100%";

            placeholder.style.display =
                "grid";

            placeholder.style.placeItems =
                "center";

            placeholder.style.fontSize =
                "52px";

            placeholder.style.background =
                "linear-gradient(135deg, " +
                "rgba(51,174,245,0.12), " +
                "rgba(244,196,0,0.10))";

            imageBox.appendChild(
                placeholder
            );
        }

        return imageBox;
    }

    function createButton(
        item,
        status,
        label
    ) {
        var button =
            document.createElement("button");

        var active =
            getStatus(item) === status;

        button.type = "button";

        button.className =
            "collection-action-button " +
            status;

        button.textContent = label;

        button.setAttribute(
            "aria-pressed",
            active ? "true" : "false"
        );

        if (active) {
            button.classList.add("active");
        }

        button.addEventListener(
            "click",
            function () {
                changeStatus(
                    item,
                    status
                );
            }
        );

        return button;
    }

    function createCard(item) {
        var status =
            getStatus(item);

        var card =
            document.createElement("article");

        card.className =
            "collection-card";

        card.setAttribute(
            "data-status",
            status
        );

        card.appendChild(
            createImage(item)
        );

        var content =
            document.createElement("div");

        content.className =
            "collection-card-content";

        var title =
            document.createElement("h3");

        title.textContent = item.name;

        var description =
            document.createElement("p");

        description.textContent =
            item.description;

        var actions =
            document.createElement("div");

        actions.className =
            "collection-card-actions";

        actions.appendChild(
            createButton(
                item,
                "owned",
                "✓ Owned"
            )
        );

        actions.appendChild(
            createButton(
                item,
                "wishlist",
                "★ Wishlist"
            )
        );

        var statusBox =
            document.createElement("div");

        statusBox.className =
            "collection-card-status";

        statusBox.textContent =
            getStatusText(status);

        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(actions);
        content.appendChild(statusBox);

        card.appendChild(content);

        return card;
    }

    function render() {
        if (!grid) {
            return;
        }

        var search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";

        var filter =
            statusFilter
                ? statusFilter.value
                : "all";

        var visible =
            items[activeType].filter(
                function (item) {
                    var itemStatus =
                        getStatus(item);

                    var searchMatches =
                        !search ||
                        item.name
                            .toLowerCase()
                            .indexOf(search) !== -1 ||
                        item.description
                            .toLowerCase()
                            .indexOf(search) !== -1;

                    var filterMatches =
                        filter === "all" ||
                        itemStatus === filter;

                    return (
                        searchMatches &&
                        filterMatches
                    );
                }
            );

        grid.textContent = "";

        if (!visible.length) {
            var empty =
                document.createElement("div");

            empty.className =
                "collection-empty";

            empty.textContent =
                "No items match your search or filter.";

            grid.appendChild(empty);

            return;
        }

        visible.forEach(function (item) {
            grid.appendChild(
                createCard(item)
            );
        });
    }

    function updateStats() {
        var allItems =
            items.trains.concat(
                items.routes
            );

        var owned = 0;
        var wishlist = 0;

        allItems.forEach(function (item) {
            var status =
                getStatus(item);

            if (status === "owned") {
                owned += 1;
            }

            if (status === "wishlist") {
                wishlist += 1;
            }
        });

        var total =
            allItems.length;

        var missing =
            total - owned - wishlist;

        var percentage =
            total > 0
                ? Math.round(
                    owned / total * 100
                )
                : 0;

        if (ownedCount) {
            ownedCount.textContent =
                owned;
        }

        if (wishlistCount) {
            wishlistCount.textContent =
                wishlist;
        }

        if (missingCount) {
            missingCount.textContent =
                missing;
        }

        if (totalCount) {
            totalCount.textContent =
                total;
        }

        if (percentageText) {
            percentageText.textContent =
                percentage + "%";
        }

        if (ringText) {
            ringText.textContent =
                percentage + "%";
        }

        if (progressFill) {
            progressFill.style.width =
                percentage + "%";
        }

        if (progressRing) {
            progressRing.style.background =
                "conic-gradient(" +
                "var(--gold) " +
                percentage +
                "%, " +
                "rgba(255,255,255,0.08) " +
                percentage +
                "%)";
        }
    }

    function selectTab(type) {
        activeType = type;

        Array.prototype.forEach.call(
            tabs,
            function (tab) {
                var selected =
                    tab.getAttribute(
                        "data-collection-type"
                    ) === type;

                tab.classList.toggle(
                    "active",
                    selected
                );

                tab.setAttribute(
                    "aria-pressed",
                    selected
                        ? "true"
                        : "false"
                );
            }
        );

        render();
    }

    Array.prototype.forEach.call(
        tabs,
        function (tab) {
            tab.addEventListener(
                "click",
                function () {
                    selectTab(
                        tab.getAttribute(
                            "data-collection-type"
                        )
                    );
                }
            );
        }
    );

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            render
        );
    }

    if (statusFilter) {
        statusFilter.addEventListener(
            "change",
            render
        );
    }

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            function () {
                var confirmed =
                    window.confirm(
                        "Clear your entire collection and wishlist?"
                    );

                if (!confirmed) {
                    return;
                }

                collection = {};

                try {
                    localStorage.removeItem(
                        STORAGE_KEY
                    );
                } catch (error) {
                    // Collection is still reset.
                }

                updateStats();
                render();
            }
        );
    }

    Promise.all([
        loadPage("trains.html"),
        loadPage("routes.html")
    ])
        .then(function (pages) {
            items.trains =
                parseTrains(pages[0]);

            items.routes =
                parseRoutes(pages[1]);

            if (
                !items.trains.length &&
                !items.routes.length
            ) {
                throw new Error(
                    "No collection items found."
                );
            }

            hideMessage();
            updateStats();
            selectTab("trains");
        })
        .catch(function (error) {
            showMessage(
                "The collection could not be loaded. Please refresh the page."
            );

            if (
                window.console &&
                console.error
            ) {
                console.error(error);
            }
        });
}());
