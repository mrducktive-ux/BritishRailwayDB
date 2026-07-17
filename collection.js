(function () {
    "use strict";

    var COLLECTION_KEY = "brdbCollectionV2";
    var OLD_KEY = "brdbCollectionV1";
    var COIN_KEY = "brdbCoinBalanceV1";

    var categories = [
        "trains",
        "liveries",
        "weekly",
        "routes"
    ];

    var data = window.BRDB_COLLECTION_DATA;
    var activeType = "trains";
    var groups = {};
    var allItems = [];

    function byId(id) {
        return document.getElementById(id);
    }

    var grid = byId("collectionGrid");
    var message = byId("collectionMessage");
    var searchInput = byId("collectionSearch");
    var statusFilter = byId("collectionStatusFilter");
    var resetButton = byId("resetCollectionButton");
    var coinInput = byId("currentCoinsInput");

    var tabs =
        document.querySelectorAll(".collection-tab");

    var ui = {
        percentage:
            byId("collectionPercentage"),

        ringText:
            byId("collectionRingText"),

        ring:
            byId("collectionProgressRing"),

        progress:
            byId("collectionProgressFill"),

        owned:
            byId("ownedCount"),

        wishlist:
            byId("wishlistCount"),

        missing:
            byId("missingCount"),

        total:
            byId("totalCount"),

        cost:
            byId("wishlistCost"),

        needed:
            byId("coinsNeeded"),

        remaining:
            byId("coinsRemaining"),

        affordCard:
            byId("affordabilityCard"),

        affordStatus:
            byId("affordabilityStatus"),

        affordMessage:
            byId("affordabilityMessage")
    };

    function readJson(key) {
        try {
            var value =
                localStorage.getItem(key);

            return value
                ? JSON.parse(value)
                : null;
        } catch (error) {
            return null;
        }
    }

    var collection =
        readJson(COLLECTION_KEY);

    if (
        !collection ||
        typeof collection !== "object"
    ) {
        collection =
            readJson(OLD_KEY) || {};
    }

    var currentCoins = 0;

    try {
        currentCoins = parseInt(
            localStorage.getItem(COIN_KEY),
            10
        );
    } catch (error) {
        currentCoins = 0;
    }

    if (
        isNaN(currentCoins) ||
        currentCoins < 0
    ) {
        currentCoins = 0;
    }

    function saveCollection() {
        try {
            localStorage.setItem(
                COLLECTION_KEY,
                JSON.stringify(collection)
            );
        } catch (error) {
            showMessage(
                "Your browser could not save your collection."
            );
        }
    }

    function saveCoins() {
        try {
            localStorage.setItem(
                COIN_KEY,
                String(currentCoins)
            );
        } catch (error) {
            showMessage(
                "Your browser could not save your coin balance."
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

    function formatNumber(value) {
        var number = Math.max(
            0,
            Math.round(
                Number(value) || 0
            )
        );

        return String(number).replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
        );
    }

    function categoryName(category) {
        var names = {
            trains: "Train",
            liveries: "Livery",
            weekly: "Weekly / event item",
            routes: "Route pack"
        };

        return names[category] || "Item";
    }

    function categoryEmoji(category) {
        var emojis = {
            trains: "🚆",
            liveries: "🎨",
            weekly: "⭐",
            routes: "🗺️"
        };

        return emojis[category] || "📦";
    }

    function buildDatabase() {
        groups = {};
        allItems = [];

        categories.forEach(
            function (category) {
                var categoryItems =
                    data[category] || [];

                categoryItems.forEach(
                    function (item) {
                        var group;

                        allItems.push(item);

                        if (
                            !groups[
                                item.purchaseId
                            ]
                        ) {
                            groups[
                                item.purchaseId
                            ] = {
                                items: [],
                                price:
                                    item.price,
                                priceType:
                                    item.priceType,
                                requires: []
                            };
                        }

                        group =
                            groups[
                                item.purchaseId
                            ];

                        group.items.push(item);

                        if (
                            item.priceType ===
                            "coins"
                        ) {
                            group.price =
                                item.price;

                            group.priceType =
                                "coins";
                        }

                        (
                            item.requires || []
                        ).forEach(
                            function (
                                requirement
                            ) {
                                if (
                                    group.requires
                                        .indexOf(
                                            requirement
                                        ) === -1
                                ) {
                                    group.requires
                                        .push(
                                            requirement
                                        );
                                }
                            }
                        );
                    }
                );
            }
        );

        migrateOldStatuses();
    }

    function migrateOldStatuses() {
        var changed = false;

        allItems.forEach(
            function (item) {
                if (
                    !collection[
                        item.purchaseId
                    ] &&
                    collection[item.id]
                ) {
                    collection[
                        item.purchaseId
                    ] =
                        collection[item.id];

                    changed = true;
                }
            }
        );

        if (changed) {
            saveCollection();
        }
    }

    function statusFor(item) {
        return (
            collection[
                item.purchaseId
            ] ||
            collection[item.id] ||
            "missing"
        );
    }

    function groupStatus(purchaseId) {
        return (
            collection[purchaseId] ||
            "missing"
        );
    }

    function statusLabel(status) {
        if (status === "owned") {
            return "Owned";
        }

        if (status === "wishlist") {
            return "On your wishlist";
        }

        return "Not owned";
    }

    function changeStatus(
        item,
        newStatus
    ) {
        var group =
            groups[item.purchaseId];

        var current =
            groupStatus(
                item.purchaseId
            );

        if (group) {
            group.items.forEach(
                function (groupItem) {
                    delete collection[
                        groupItem.id
                    ];
                }
            );
        }

        if (current === newStatus) {
            delete collection[
                item.purchaseId
            ];
        } else {
            collection[
                item.purchaseId
            ] = newStatus;
        }

        saveCollection();
        updateAll();
    }

    function groupName(purchaseId) {
        var group =
            groups[purchaseId];

        if (
            !group ||
            !group.items.length
        ) {
            return purchaseId;
        }

        if (group.items.length === 1) {
            return group.items[0].name;
        }

        if (group.items.length === 2) {
            return (
                group.items[0].name +
                " + " +
                group.items[1].name
            );
        }

        return (
            group.items[0].name +
            " + " +
            (
                group.items.length - 1
            ) +
            " more"
        );
    }

    function getPrice(item) {
        if (
            item.priceType ===
            "coins"
        ) {
            return {
                text:
                    "🪙 " +
                    formatNumber(
                        item.price
                    ) +
                    " coins",

                type: "coins"
            };
        }

        if (
            item.priceType ===
            "free"
        ) {
            return {
                text: "Free",
                type: "free"
            };
        }

        if (
            item.priceType ===
            "unavailable"
        ) {
            return {
                text: "Unavailable",
                type: "unavailable"
            };
        }

        return {
            text:
                "Event unlock / unavailable",

            type: "unlock"
        };
    }

    function makeBadge(
        text,
        className,
        priceType
    ) {
        var badge =
            document.createElement(
                "span"
            );

        badge.className =
            className;

        badge.textContent =
            text;

        if (priceType) {
            badge.setAttribute(
                "data-price-type",
                priceType
            );
        }

        return badge;
    }

    function makeImage(item) {
        var box =
            document.createElement(
                "div"
            );

        var placeholder =
            document.createElement(
                "div"
            );

        var emoji =
            document.createElement(
                "span"
            );

        var label =
            document.createElement(
                "small"
            );

        box.className =
            "collection-card-image";

        placeholder.style.height =
            "100%";

        placeholder.style.display =
            "grid";

        placeholder.style.placeItems =
            "center";

        placeholder.style.alignContent =
            "center";

        placeholder.style.gap =
            "8px";

        placeholder.style.background =
            "linear-gradient(" +
            "135deg, " +
            "rgba(51,174,245,0.12), " +
            "rgba(244,196,0,0.10)" +
            ")";

        emoji.textContent =
            categoryEmoji(
                item.category
            );

        emoji.style.fontSize =
            "54px";

        emoji.setAttribute(
            "aria-hidden",
            "true"
        );

        label.textContent =
            categoryName(
                item.category
            );

        label.style.color =
            "var(--text-muted)";

        label.style.fontWeight =
            "800";

        label.style.textTransform =
            "uppercase";

        placeholder.appendChild(
            emoji
        );

        placeholder.appendChild(
            label
        );

        box.appendChild(
            placeholder
        );

        return box;
    }

    function makeButton(
        item,
        status,
        label
    ) {
        var button =
            document.createElement(
                "button"
            );

        var active =
            statusFor(item) ===
            status;

        button.type = "button";

        button.className =
            "collection-action-button " +
            status;

        button.textContent =
            label;

        button.setAttribute(
            "aria-pressed",
            active
                ? "true"
                : "false"
        );

        if (active) {
            button.classList.add(
                "active"
            );
        }

        if (
            status === "wishlist" &&
            (
                item.priceType ===
                    "unlock" ||
                item.priceType ===
                    "unavailable"
            )
        ) {
            button.disabled = true;

            button.textContent =
                "Unavailable";
        } else {
            button.addEventListener(
                "click",
                function () {
                    changeStatus(
                        item,
                        status
                    );
                }
            );
        }

        return button;
    }

    function makeCard(item) {
        var status =
            statusFor(item);

        var group =
            groups[item.purchaseId];

        var price =
            getPrice(item);

        var card =
            document.createElement(
                "article"
            );

        var content =
            document.createElement(
                "div"
            );

        var title =
            document.createElement(
                "h3"
            );

        var description =
            document.createElement(
                "p"
            );

        var meta =
            document.createElement(
                "div"
            );

        var actions =
            document.createElement(
                "div"
            );

        var statusBox =
            document.createElement(
                "div"
            );

        card.className =
            "collection-card";

        card.setAttribute(
            "data-status",
            status
        );

        content.className =
            "collection-card-content";

        title.textContent =
            item.name;

        description.textContent =
            item.note ||
            item.parent ||
            categoryName(
                item.category
            );

        meta.className =
            "collection-card-meta";

        actions.className =
            "collection-card-actions";

        statusBox.className =
            "collection-card-status";

        statusBox.textContent =
            statusLabel(status);

        meta.appendChild(
            makeBadge(
                price.text,
                "collection-card-price",
                price.type
            )
        );

        if (item.parent) {
            meta.appendChild(
                makeBadge(
                    item.parent,
                    "collection-card-badge"
                )
            );
        }

        if (
            group &&
            group.items.length > 1
        ) {
            meta.appendChild(
                makeBadge(
                    "Pack unlocks " +
                        group.items.length +
                        " items",

                    "collection-card-badge"
                )
            );
        }

        if (
            item.countsTowardCompletion ===
            false
        ) {
            meta.appendChild(
                makeBadge(
                    "Not included in completion %",

                    "collection-card-badge"
                )
            );
        }

        if (
            item.requires &&
            item.requires.length
        ) {
            meta.appendChild(
                makeBadge(
                    "Requires: " +
                        item.requires
                            .map(
                                groupName
                            )
                            .join(", "),

                    "collection-card-badge"
                )
            );
        }

        actions.appendChild(
            makeButton(
                item,
                "owned",
                "✓ Owned"
            )
        );

        actions.appendChild(
            makeButton(
                item,
                "wishlist",
                "★ Wishlist"
            )
        );

        content.appendChild(
            title
        );

        content.appendChild(
            description
        );

        content.appendChild(
            meta
        );

        content.appendChild(
            actions
        );

        content.appendChild(
            statusBox
        );

        card.appendChild(
            makeImage(item)
        );

        card.appendChild(
            content
        );

        return card;
    }

    function render() {
        if (
            !grid ||
            !data ||
            !data[activeType]
        ) {
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
            data[activeType].filter(
                function (item) {
                    var searchable =
                        (
                            item.name +
                            " " +
                            item.parent +
                            " " +
                            item.note
                        ).toLowerCase();

                    var searchMatches =
                        !search ||
                        searchable.indexOf(
                            search
                        ) !== -1;

                    var filterMatches =
                        filter === "all" ||
                        statusFor(item) ===
                            filter;

                    return (
                        searchMatches &&
                        filterMatches
                    );
                }
            );

        grid.textContent = "";

        if (!visible.length) {
            var empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "collection-empty";

            empty.textContent =
                "No items match your search or filter.";

            grid.appendChild(
                empty
            );

            return;
        }

        visible.forEach(
            function (item) {
                grid.appendChild(
                    makeCard(item)
                );
            }
        );
    }

    function calculatePlan() {
        var selected = [];
        var selectedLookup = {};
        var included = {};
        var automatic = 0;
        var unavailable = [];
        var cost = 0;

        Object.keys(groups).forEach(
            function (purchaseId) {
                if (
                    groupStatus(
                        purchaseId
                    ) === "wishlist"
                ) {
                    selected.push(
                        purchaseId
                    );

                    selectedLookup[
                        purchaseId
                    ] = true;
                }
            }
        );

        function include(
            purchaseId,
            isAutomatic
        ) {
            var group =
                groups[purchaseId];

            if (
                !group ||
                included[purchaseId] ||
                groupStatus(
                    purchaseId
                ) === "owned"
            ) {
                return;
            }

            included[
                purchaseId
            ] = true;

            if (
                isAutomatic &&
                !selectedLookup[
                    purchaseId
                ]
            ) {
                automatic += 1;
            }

            if (
                group.priceType ===
                    "unlock" ||
                group.priceType ===
                    "unavailable"
            ) {
                unavailable.push(
                    groupName(
                        purchaseId
                    )
                );
            }

            group.requires.forEach(
                function (
                    requirement
                ) {
                    include(
                        requirement,
                        true
                    );
                }
            );
        }

        selected.forEach(
            function (purchaseId) {
                include(
                    purchaseId,
                    false
                );
            }
        );

        Object.keys(included).forEach(
            function (purchaseId) {
                var group =
                    groups[purchaseId];

                if (
                    group &&
                    group.priceType ===
                        "coins" &&
                    typeof group.price ===
                        "number" &&
                    group.price > 0
                ) {
                    cost +=
                        group.price;
                }
            }
        );

        return {
            selected:
                selected.length,

            automatic:
                automatic,

            unavailable:
                unavailable,

            cost:
                cost
        };
    }

    function updatePlanner() {
        var plan =
            calculatePlan();

        var needed =
            Math.max(
                0,
                plan.cost -
                    currentCoins
            );

        var remaining =
            Math.max(
                0,
                currentCoins -
                    plan.cost
            );

        ui.cost.textContent =
            formatNumber(
                plan.cost
            );

        ui.needed.textContent =
            formatNumber(
                needed
            );

        ui.remaining.textContent =
            formatNumber(
                remaining
            );

        if (!plan.selected) {
            ui.affordCard.setAttribute(
                "data-status",
                "empty"
            );

            ui.affordStatus.textContent =
                "Add some items";

            ui.affordMessage.textContent =
                "Choose items you want to buy.";

            return;
        }

        if (
            plan.unavailable.length
        ) {
            ui.affordCard.setAttribute(
                "data-status",
                "needed"
            );

            ui.affordStatus.textContent =
                "Requirement unavailable";

            ui.affordMessage.textContent =
                "A required item is currently unavailable.";

            return;
        }

        if (needed === 0) {
            ui.affordCard.setAttribute(
                "data-status",
                "affordable"
            );

            ui.affordStatus.textContent =
                "You can afford it!";

            ui.affordMessage.textContent =
                plan.automatic
                    ? "Includes " +
                        plan.automatic +
                        " required purchase(s)."
                    : "Your current balance covers the wishlist.";

            return;
        }

        ui.affordCard.setAttribute(
            "data-status",
            "needed"
        );

        ui.affordStatus.textContent =
            formatNumber(needed) +
            " more needed";

        ui.affordMessage.textContent =
            plan.automatic
                ? "Total includes " +
                    plan.automatic +
                    " required purchase(s)."
                : "Keep saving for your wishlist.";
    }

    function updateStats() {
        var counted =
            allItems.filter(
                function (item) {
                    return (
                        item
                            .countsTowardCompletion !==
                        false
                    );
                }
            );

        var owned = 0;
        var wishlist = 0;
        var total =
            counted.length;

        counted.forEach(
            function (item) {
                if (
                    statusFor(item) ===
                    "owned"
                ) {
                    owned += 1;
                } else if (
                    statusFor(item) ===
                    "wishlist"
                ) {
                    wishlist += 1;
                }
            }
        );

        var missing =
            Math.max(
                0,
                total -
                    owned -
                    wishlist
            );

        var percentage =
            total
                ? Math.round(
                    owned /
                    total *
                    100
                )
                : 0;

        ui.owned.textContent =
            formatNumber(owned);

        ui.wishlist.textContent =
            formatNumber(wishlist);

        ui.missing.textContent =
            formatNumber(missing);

        ui.total.textContent =
            formatNumber(total);

        ui.percentage.textContent =
            percentage + "%";

        ui.ringText.textContent =
            percentage + "%";

        ui.progress.style.width =
            percentage + "%";

        ui.ring.style.background =
            "conic-gradient(" +
            "var(--gold) " +
            percentage +
            "%, " +
            "rgba(255,255,255,0.08) " +
            percentage +
            "%)";
    }

    function updateAll() {
        updateStats();
        updatePlanner();
        render();
    }

    function selectTab(type) {
        if (
            categories.indexOf(
                type
            ) === -1
        ) {
            return;
        }

        activeType = type;

        Array.prototype.forEach.call(
            tabs,
            function (tab) {
                var selected =
                    tab.getAttribute(
                        "data-collection-type"
                    ) === type;

                if (selected) {
                    tab.classList.add(
                        "active"
                    );
                } else {
                    tab.classList.remove(
                        "active"
                    );
                }

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

    function setUpEvents() {
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

        if (coinInput) {
            coinInput.value =
                String(
                    currentCoins
                );

            coinInput.addEventListener(
                "input",
                function () {
                    var value =
                        parseInt(
                            coinInput.value,
                            10
                        );

                    currentCoins =
                        !isNaN(value) &&
                        value >= 0
                            ? value
                            : 0;

                    saveCoins();
                    updatePlanner();
                }
            );
        }

        if (resetButton) {
            resetButton.addEventListener(
                "click",
                function () {
                    var confirmed =
                        window.confirm(
                            "Clear your entire collection and wishlist? " +
                            "Your coin balance will stay saved."
                        );

                    if (!confirmed) {
                        return;
                    }

                    collection = {};

                    try {
                        localStorage.removeItem(
                            COLLECTION_KEY
                        );

                        localStorage.removeItem(
                            OLD_KEY
                        );
                    } catch (error) {
                        /*
                        It still resets for
                        this page visit.
                        */
                    }

                    updateAll();
                }
            );
        }
    }

    function start() {
        if (!data) {
            showMessage(
                "The collection database could not be loaded. " +
                "Please refresh the page."
            );

            return;
        }

        buildDatabase();

        if (!allItems.length) {
            showMessage(
                "The collection database is empty."
            );

            return;
        }

        hideMessage();
        setUpEvents();
        updateAll();
        selectTab("trains");
    }

    start();
}());
