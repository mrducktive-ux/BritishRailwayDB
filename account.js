(function () {
    "use strict";

    var API_BASE = "https://brdb-accounts.mrducktive.workers.dev";

    var loadingPanel = document.getElementById("accountLoading");
    var signedOutPanel = document.getElementById("accountSignedOut");
    var dashboard = document.getElementById("accountDashboard");
    var messageBox = document.getElementById("accountMessage");
    var apiStatus = document.getElementById("accountApiStatus");

    var displayName = document.getElementById("accountDisplayName");
    var discordUsername = document.getElementById("accountDiscordUsername");
    var avatar = document.getElementById("accountAvatar");
    var avatarFallback = document.getElementById("accountAvatarFallback");
    var badges = document.getElementById("accountBadges");

    var createdAt = document.getElementById("accountCreatedAt");
    var lastLogin = document.getElementById("accountLastLogin");
    var supporterTier = document.getElementById("accountSupporterTier");
    var supportCardTier = document.getElementById("supportCardTier");
    var supportCheckedText = document.getElementById("supportCheckedText");

    var form = document.getElementById("profileForm");
    var robloxUsername = document.getElementById("robloxUsername");
    var favouriteTrain = document.getElementById("favouriteTrain");
    var favouriteRoute = document.getElementById("favouriteRoute");
    var bio = document.getElementById("profileBio");
    var bioCounter = document.getElementById("bioCounter");
    var saveButton = document.getElementById("saveProfileButton");
    var resetButton = document.getElementById("resetProfileButton");
    var verifyButton = document.getElementById("verifySupportButton");
    var logoutButton = document.getElementById("logoutButton");
    var unsavedIndicator = document.getElementById("unsavedIndicator");

    var savedUser = null;

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showMessage(type, text) {
        messageBox.className = "account-message visible " + type;
        messageBox.innerHTML = escapeHtml(text);
    }

    function clearMessage() {
        messageBox.className = "account-message";
        messageBox.innerHTML = "";
    }

    function setApiStatus(online, text) {
        apiStatus.className = "account-api-status " + (online ? "online" : "offline");
        apiStatus.textContent = text;
    }

    function apiRequest(path, options) {
        var requestOptions = options || {};
        requestOptions.credentials = "include";
        requestOptions.cache = "no-store";

        return fetch(API_BASE + path, requestOptions)
            .then(function (response) {
                return response.text().then(function (text) {
                    var data;

                    try {
                        data = text ? JSON.parse(text) : {};
                    } catch (error) {
                        throw new Error("The Accounts API returned an invalid response.");
                    }

                    if (!response.ok || data.ok === false) {
                        var requestError = new Error(
                            data.error || data.details || "The request failed."
                        );
                        requestError.status = response.status;
                        requestError.data = data;
                        throw requestError;
                    }

                    return data;
                });
            });
    }

    function formatDate(value) {
        if (!value) {
            return "—";
        }

        var date = new Date(String(value).replace(" ", "T") + "Z");

        if (isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function formatDateTime(value) {
        if (!value) {
            return "Not checked yet";
        }

        var date = new Date(String(value).replace(" ", "T") + "Z");

        if (isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function buildBadges(user) {
        var html = '<span class="account-badge">Discord account</span>';
        var tier = user.supporter_tier || "None";

        if (tier !== "None") {
            html +=
                '<span class="account-badge supporter">' +
                escapeHtml(tier) +
                "</span>";
        }

        if (Number(user.is_admin) === 1) {
            html += '<span class="account-badge admin">BRDB Admin</span>';
        }

        badges.innerHTML = html;
    }

    function setAvatar(user) {
        var fallbackText =
            (user.display_name || user.discord_username || "B")
                .charAt(0)
                .toUpperCase();

        avatarFallback.textContent = fallbackText;

        if (user.avatar_url) {
            avatar.src = user.avatar_url;
            avatar.alt = (user.display_name || user.discord_username) + " Discord avatar";
            avatar.className = "account-avatar visible";
            avatarFallback.className = "account-avatar-fallback hidden";

            avatar.onerror = function () {
                avatar.className = "account-avatar";
                avatarFallback.className = "account-avatar-fallback";
            };
        } else {
            avatar.removeAttribute("src");
            avatar.className = "account-avatar";
            avatarFallback.className = "account-avatar-fallback";
        }
    }

    function updateBioCounter() {
        bioCounter.textContent = bio.value.length + " / 300";
    }

    function markChanged() {
        unsavedIndicator.textContent = "Unsaved changes";
        unsavedIndicator.className = "account-unsaved changed";
    }

    function markSaved() {
        unsavedIndicator.textContent = "Saved";
        unsavedIndicator.className = "account-unsaved";
    }

    function fillForm(user) {
        robloxUsername.value = user.roblox_username || "";
        favouriteTrain.value = user.favourite_train || "";
        favouriteRoute.value = user.favourite_route || "";
        bio.value = user.bio || "";
        updateBioCounter();
        markSaved();
    }

    function renderUser(user) {
        savedUser = user;

        loadingPanel.hidden = true;
        signedOutPanel.hidden = true;
        dashboard.hidden = false;

        displayName.textContent =
            user.display_name || user.discord_username || "BRDB User";
        discordUsername.textContent =
            "@" + (user.discord_username || "unknown");

        setAvatar(user);
        buildBadges(user);
        fillForm(user);

        createdAt.textContent = formatDate(user.created_at);
        lastLogin.textContent = formatDateTime(user.last_login_at);

        var tier = user.supporter_tier || "None";
        supporterTier.textContent = tier;
        supportCardTier.textContent = tier;

        if (user.supporter_checked_at) {
            supportCheckedText.textContent =
                "Last checked: " + formatDateTime(user.supporter_checked_at);
        } else {
            supportCheckedText.textContent = "Not checked yet.";
        }

        verifyButton.disabled = !user.roblox_username;
    }

    function renderSignedOut() {
        loadingPanel.hidden = true;
        dashboard.hidden = true;
        signedOutPanel.hidden = false;
        setApiStatus(true, "Accounts API online");
    }

    function setWorking(button, working, normalText, workingText) {
        button.disabled = working;
        button.textContent = working ? workingText : normalText;
    }

    function loadAccount() {
        clearMessage();

        apiRequest("/api/me")
            .then(function (data) {
                setApiStatus(true, "Accounts API online");
                renderUser(data.user);
                showLoginMessage();
            })
            .catch(function (error) {
                if (error.status === 401) {
                    renderSignedOut();
                    showLoginMessage();
                    return;
                }

                loadingPanel.hidden = true;
                signedOutPanel.hidden = false;
                setApiStatus(false, "Accounts API unavailable");
                showMessage(
                    "error",
                    error.message || "The account could not be loaded."
                );
            });
    }

    function showLoginMessage() {
        var params = new URLSearchParams(window.location.search);
        var loginResult = params.get("login");

        if (loginResult === "success") {
            showMessage("success", "Discord login successful. Welcome to your BRDB account!");
        } else if (loginResult === "discord_denied") {
            showMessage("info", "Discord login was cancelled.");
        } else if (loginResult === "banned") {
            showMessage("error", "This BRDB account is banned.");
        }

        if (loginResult && window.history && window.history.replaceState) {
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        }
    }

    form.addEventListener("input", function () {
        updateBioCounter();
        markChanged();
    });

    resetButton.addEventListener("click", function () {
        if (savedUser) {
            fillForm(savedUser);
            clearMessage();
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearMessage();
        setWorking(saveButton, true, "Save profile", "Saving…");

        apiRequest("/api/profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roblox_username: robloxUsername.value,
                bio: bio.value,
                favourite_train: favouriteTrain.value,
                favourite_route: favouriteRoute.value
            })
        })
            .then(function (data) {
                renderUser(data.user);
                showMessage("success", "Your BRDB profile has been saved.");
            })
            .catch(function (error) {
                showMessage("error", error.message || "The profile could not be saved.");
            })
            .then(function () {
                setWorking(saveButton, false, "Save profile", "Saving…");
            });
    });

    verifyButton.addEventListener("click", function () {
        clearMessage();

        if (!robloxUsername.value.trim()) {
            showMessage("error", "Save a Roblox username before verifying supporter status.");
            return;
        }

        setWorking(
            verifyButton,
            true,
            "Verify supporter tier",
            "Checking Roblox…"
        );

        apiRequest("/api/verify-supporter", {
            method: "POST"
        })
            .then(function (data) {
                renderUser(data.user);

                if (data.supporter) {
                    showMessage(
                        "success",
                        "Verified as " + data.highestTier.name + "."
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
                    error.message || "Supporter verification failed."
                );
            })
            .then(function () {
                setWorking(
                    verifyButton,
                    false,
                    "Verify supporter tier",
                    "Checking Roblox…"
                );

                if (savedUser && !savedUser.roblox_username) {
                    verifyButton.disabled = true;
                }
            });
    });

    logoutButton.addEventListener("click", function () {
        clearMessage();
        setWorking(logoutButton, true, "Sign out", "Signing out…");

        apiRequest("/auth/logout", {
            method: "POST"
        })
            .then(function () {
                savedUser = null;
                dashboard.hidden = true;
                signedOutPanel.hidden = false;
                showMessage("success", "You have been signed out.");
            })
            .catch(function (error) {
                showMessage("error", error.message || "Sign out failed.");
            })
            .then(function () {
                setWorking(logoutButton, false, "Sign out", "Signing out…");
            });
    });

    loadAccount();
}());
