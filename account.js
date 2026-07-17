(function () {
    "use strict";

    var API_BASE =
        "https://brbd-accounts.mrducktive.workers.dev";

    var loadingPanel =
        document.getElementById("accountLoading");

    var signedOutPanel =
        document.getElementById("accountSignedOut");

    var dashboard =
        document.getElementById("accountDashboard");

    var messageBox =
        document.getElementById("accountMessage");

    var apiStatus =
        document.getElementById("accountApiStatus");

    var discordLoginButton =
        document.getElementById("discordLoginButton");

    var displayName =
        document.getElementById("accountDisplayName");

    var discordUsername =
        document.getElementById("accountDiscordUsername");

    var avatar =
        document.getElementById("accountAvatar");

    var avatarFallback =
        document.getElementById("accountAvatarFallback");

    var badges =
        document.getElementById("accountBadges");

    var createdAt =
        document.getElementById("accountCreatedAt");

    var lastLogin =
        document.getElementById("accountLastLogin");

    var supporterTier =
        document.getElementById("accountSupporterTier");

    var supportCardTier =
        document.getElementById("supportCardTier");

    var supportCheckedText =
        document.getElementById("supportCheckedText");

    var form =
        document.getElementById("profileForm");

    var robloxUsername =
        document.getElementById("robloxUsername");

    var favouriteTrain =
        document.getElementById("favouriteTrain");

    var favouriteRoute =
        document.getElementById("favouriteRoute");

    var bio =
        document.getElementById("profileBio");

    var bioCounter =
        document.getElementById("bioCounter");

    var saveButton =
        document.getElementById("saveProfileButton");

    var resetButton =
        document.getElementById("resetProfileButton");

    var verifyButton =
        document.getElementById("verifySupportButton");

    var logoutButton =
        document.getElementById("logoutButton");
var unsavedIndicator =
    document.getElementById("unsavedIndicator");

var staffPanelNavLink =
    document.getElementById("staffPanelNavLink");

var staffPanelCard =
    document.getElementById("staffPanelCard");
    var savedUser = null;

    if (discordLoginButton) {
        discordLoginButton.href =
            API_BASE + "/auth/discord";
    }

    function hideElement(element) {
        if (!element) {
            return;
        }

        element.hidden = true;
        element.style.display = "none";
    }

    function showElement(element, displayType) {
        if (!element) {
            return;
        }

        element.hidden = false;
        element.style.display = displayType || "";
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showMessage(type, text) {
        if (!messageBox) {
            return;
        }

        messageBox.className =
            "account-message visible " + type;

        messageBox.innerHTML =
            escapeHtml(text);
    }

    function clearMessage() {
        if (!messageBox) {
            return;
        }

        messageBox.className =
            "account-message";

        messageBox.innerHTML = "";
    }

    function setApiStatus(online, text) {
        if (!apiStatus) {
            return;
        }

        apiStatus.className =
            "account-api-status " +
            (online ? "online" : "offline");

        apiStatus.textContent = text;
    }

    function apiRequest(path, options) {
        var requestOptions = options || {};

        requestOptions.credentials = "include";
        requestOptions.cache = "no-store";

        return fetch(
            API_BASE + path,
            requestOptions
        ).then(function (response) {
            return response.text().then(function (text) {
                var data;

                try {
                    data = text
                        ? JSON.parse(text)
                        : {};
                } catch (error) {
                    throw new Error(
                        "The Accounts API returned an invalid response."
                    );
                }

                if (!response.ok || data.ok === false) {
                    var requestError =
                        new Error(
                            data.error ||
                            data.details ||
                            "The request failed."
                        );

                    requestError.status =
                        response.status;

                    requestError.data = data;

                    throw requestError;
                }

                return data;
            });
        });
    }

    function makeDate(value) {
        if (!value) {
            return null;
        }

        var text = String(value);

        if (
            text.indexOf("T") === -1 &&
            text.indexOf(" ") !== -1
        ) {
            text =
                text.replace(" ", "T") + "Z";
        }

        var date = new Date(text);

        if (isNaN(date.getTime())) {
            return null;
        }

        return date;
    }

    function formatDate(value) {
        var date = makeDate(value);

        if (!date) {
            return value || "—";
        }

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }

    function formatDateTime(value) {
        var date = makeDate(value);

        if (!date) {
            return value || "Not checked yet";
        }

        return date.toLocaleString(
            "en-GB",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    function buildBadges(user) {
        if (!badges) {
            return;
        }

        var html =
            '<span class="account-badge">' +
            "Discord account" +
            "</span>";

        var tier =
            user.supporter_tier || "None";

        if (tier !== "None") {
            html +=
                '<span class="account-badge supporter">' +
                escapeHtml(tier) +
                "</span>";
        }

        if (Number(user.is_admin) === 1) {
            html +=
                '<span class="account-badge admin">' +
                "BRDB Admin" +
                "</span>";
        }

        badges.innerHTML = html;
    }

    function setAvatar(user) {
        if (!avatar || !avatarFallback) {
            return;
        }

        var avatarName =
            user.discord_username ||
            user.display_name ||
            "B";

        var fallbackText =
            avatarName
                .substring(0, 1)
                .toUpperCase();

        avatarFallback.textContent =
            fallbackText || "B";

        if (user.avatar_url) {
            avatar.src =
                user.avatar_url;

            avatar.alt =
                (user.display_name ||
                    user.discord_username ||
                    "BRDB user") +
                " Discord avatar";

            avatar.className =
                "account-avatar visible";

            avatarFallback.className =
                "account-avatar-fallback hidden";

            avatar.onerror = function () {
                avatar.removeAttribute("src");

                avatar.className =
                    "account-avatar";

                avatarFallback.className =
                    "account-avatar-fallback";
            };
        } else {
            avatar.removeAttribute("src");

            avatar.className =
                "account-avatar";

            avatarFallback.className =
                "account-avatar-fallback";
        }
    }

    function updateBioCounter() {
        if (!bioCounter || !bio) {
            return;
        }

        bioCounter.textContent =
            bio.value.length + " / 300";
    }

    function markChanged() {
        if (!unsavedIndicator) {
            return;
        }

        unsavedIndicator.textContent =
            "Unsaved changes";

        unsavedIndicator.className =
            "account-unsaved changed";
    }

    function markSaved() {
        if (!unsavedIndicator) {
            return;
        }

        unsavedIndicator.textContent =
            "Saved";

        unsavedIndicator.className =
            "account-unsaved";
    }

    function fillForm(user) {
        if (robloxUsername) {
            robloxUsername.value =
                user.roblox_username || "";
        }

        if (favouriteTrain) {
            favouriteTrain.value =
                user.favourite_train || "";
        }

        if (favouriteRoute) {
            favouriteRoute.value =
                user.favourite_route || "";
        }

        if (bio) {
            bio.value =
                user.bio || "";
        }

        updateBioCounter();
        markSaved();
    }

    function renderUser(user) {
        if (!user) {
            throw new Error(
                "The Accounts API did not return a user."
            );
        }

        savedUser = user;

        hideElement(loadingPanel);
        hideElement(signedOutPanel);
        showElement(dashboard, "block");

        if (displayName) {
            displayName.textContent =
                user.display_name ||
                user.discord_username ||
                "BRDB User";
        }

        if (discordUsername) {
            discordUsername.textContent =
                "@" +
                (user.discord_username || "unknown");
        }

        setAvatar(user);
        buildBadges(user);
        fillForm(user);
if (Number(user.is_admin) === 1) {
    showElement(staffPanelNavLink);
    showElement(staffPanelCard, "block");
} else {
    hideElement(staffPanelNavLink);
    hideElement(staffPanelCard);
}
        if (createdAt) {
            createdAt.textContent =
                formatDate(user.created_at);
        }

        if (lastLogin) {
            lastLogin.textContent =
                formatDateTime(
                    user.last_login_at
                );
        }

        var tier =
            user.supporter_tier || "None";

        if (supporterTier) {
            supporterTier.textContent = tier;
        }

        if (supportCardTier) {
            supportCardTier.textContent = tier;
        }

        if (supportCheckedText) {
            if (user.supporter_checked_at) {
                supportCheckedText.textContent =
                    "Last checked: " +
                    formatDateTime(
                        user.supporter_checked_at
                    );
            } else {
                supportCheckedText.textContent =
                    "Not checked yet.";
            }
        }

        if (verifyButton) {
            verifyButton.disabled =
                !user.roblox_username;
        }
    }

    function renderSignedOut() {
        hideElement(loadingPanel);
        hideElement(dashboard);
        showElement(signedOutPanel, "block");

        setApiStatus(
            true,
            "Accounts API online"
        );
    }
hideElement(staffPanelNavLink);
hideElement(staffPanelCard);
    function setWorking(
        button,
        working,
        normalText,
        workingText
    ) {
        if (!button) {
            return;
        }

        button.disabled = working;

        button.textContent =
            working
                ? workingText
                : normalText;
    }

    function showLoginMessage() {
        var loginResult = null;

        try {
            var params =
                new URLSearchParams(
                    window.location.search
                );

            loginResult =
                params.get("login");
        } catch (error) {
            loginResult = null;
        }

        if (loginResult === "success") {
            showMessage(
                "success",
                "Discord login successful. Welcome to your BRDB account!"
            );
        } else if (
            loginResult === "discord_denied"
        ) {
            showMessage(
                "info",
                "Discord login was cancelled."
            );
        } else if (
            loginResult === "banned"
        ) {
            showMessage(
                "error",
                "This BRDB account is banned."
            );
        }

        if (
            loginResult &&
            window.history &&
            window.history.replaceState
        ) {
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        }
    }

    function loadAccount() {
        clearMessage();

        showElement(loadingPanel, "grid");
        hideElement(signedOutPanel);
        hideElement(dashboard);

        setApiStatus(
            true,
            "Connecting…"
        );

        apiRequest("/api/me")
            .then(function (data) {
                setApiStatus(
                    true,
                    "Accounts API online"
                );

                renderUser(data.user);
                showLoginMessage();
            })
            .catch(function (error) {
                if (error.status === 401) {
                    renderSignedOut();
                    showLoginMessage();
                    return;
                }

                hideElement(loadingPanel);
                hideElement(dashboard);
                showElement(
                    signedOutPanel,
                    "block"
                );

                setApiStatus(
                    false,
                    "Accounts API unavailable"
                );

                showMessage(
                    "error",
                    error.message ||
                    "The account could not be loaded."
                );
            });
    }

    if (form) {
        form.addEventListener(
            "input",
            function () {
                updateBioCounter();
                markChanged();
            }
        );

        form.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();
                clearMessage();

                setWorking(
                    saveButton,
                    true,
                    "Save profile",
                    "Saving…"
                );

                apiRequest(
                    "/api/profile",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            roblox_username:
                                robloxUsername
                                    ? robloxUsername.value
                                    : "",
                            bio:
                                bio
                                    ? bio.value
                                    : "",
                            favourite_train:
                                favouriteTrain
                                    ? favouriteTrain.value
                                    : "",
                            favourite_route:
                                favouriteRoute
                                    ? favouriteRoute.value
                                    : ""
                        })
                    }
                )
                    .then(function (data) {
                        renderUser(data.user);

                        showMessage(
                            "success",
                            "Your BRDB profile has been saved."
                        );
                    })
                    .catch(function (error) {
                        showMessage(
                            "error",
                            error.message ||
                            "The profile could not be saved."
                        );
                    })
                    .then(function () {
                        setWorking(
                            saveButton,
                            false,
                            "Save profile",
                            "Saving…"
                        );
                    });
            }
        );
    }

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            function () {
                if (savedUser) {
                    fillForm(savedUser);
                    clearMessage();
                }
            }
        );
    }

    if (verifyButton) {
        verifyButton.addEventListener(
            "click",
            function () {
                clearMessage();

                if (
                    !robloxUsername ||
                    !robloxUsername.value.trim()
                ) {
                    showMessage(
                        "error",
                        "Save a Roblox username before verifying supporter status."
                    );

                    return;
                }

                setWorking(
                    verifyButton,
                    true,
                    "Verify supporter tier",
                    "Checking Roblox…"
                );

                apiRequest(
                    "/api/verify-supporter",
                    {
                        method: "POST"
                    }
                )
                    .then(function (data) {
                        if (data.user) {
                            renderUser(data.user);
                        }

                        if (
                            data.supporter &&
                            data.highestTier
                        ) {
                            showMessage(
                                "success",
                                "Verified as " +
                                data.highestTier.name +
                                "."
                            );
                        } else {
                            showMessage(
                                "info",
                                "No BRDB support pass was found on that Roblox account."
                            );
                        }
                    })
                    .catch(function (error) {
                        showMessage(
                            "error",
                            error.message ||
                            "Supporter verification failed."
                        );
                    })
                    .then(function () {
                        setWorking(
                            verifyButton,
                            false,
                            "Verify supporter tier",
                            "Checking Roblox…"
                        );

                        if (
                            savedUser &&
                            !savedUser.roblox_username
                        ) {
                            verifyButton.disabled =
                                true;
                        }
                    });
            }
        );
    }

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            function () {
                clearMessage();

                setWorking(
                    logoutButton,
                    true,
                    "Sign out",
                    "Signing out…"
                );

                apiRequest(
                    "/auth/logout",
                    {
                        method: "POST"
                    }
                )
                    .then(function () {
                        savedUser = null;

                        hideElement(dashboard);
                        showElement(
                            signedOutPanel,
                            "block"
                        );

                        showMessage(
                            "success",
                            "You have been signed out."
                        );
                    })
                    .catch(function (error) {
                        showMessage(
                            "error",
                            error.message ||
                            "Sign out failed."
                        );
                    })
                    .then(function () {
                        setWorking(
                            logoutButton,
                            false,
                            "Sign out",
                            "Signing out…"
                        );
                    });
            }
        );
    }

    window.setTimeout(function () {
        if (
            loadingPanel &&
            !loadingPanel.hidden &&
            loadingPanel.style.display !== "none"
        ) {
            hideElement(loadingPanel);
            hideElement(dashboard);
            showElement(
                signedOutPanel,
                "block"
            );

            setApiStatus(
                false,
                "Connection timed out"
            );

            showMessage(
                "error",
                "The account request took too long. Refresh the page and try again."
            );
        }
    }, 15000);

    loadAccount();
}());
