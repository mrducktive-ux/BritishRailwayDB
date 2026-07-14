(function () {
    "use strict";

    // IMPORTANT: Your Cloudflare Worker uses ONE "p" in "suport".
    var WORKER_URL = "https://brbd-suport-checker.mrducktive.workers.dev";

    var form = document.getElementById("supporterCheckerForm");
    var usernameInput = document.getElementById("robloxUsername");
    var button = document.getElementById("checkSupporterButton");
    var resultBox = document.getElementById("supporterCheckResult");

    if (!form || !usernameInput || !button || !resultBox) {
        return;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showResult(type, title, message, extraHtml) {
        resultBox.className = "verifier-result visible " + type;
        resultBox.innerHTML =
            '<h3 class="verifier-title">' + escapeHtml(title) + "</h3>" +
            "<p>" + message + "</p>" +
            (extraHtml || "");
    }

    function setLoading(isLoading) {
        button.disabled = isLoading;
        button.textContent = isLoading
            ? "Checking..."
            : "Check Supporter Status";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = usernameInput.value.replace(/^\s+|\s+$/g, "");

        if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
            showResult(
                "error",
                "Invalid username",
                "Enter the Roblox account username, not the display name."
            );
            return;
        }

        setLoading(true);

        showResult(
            "loading",
            "Checking Roblox...",
            "Looking for BRDB support passes owned by <strong>" +
                escapeHtml(username) +
                "</strong>."
        );

        var requestUrl =
            WORKER_URL +
            "/check?username=" +
            encodeURIComponent(username) +
            "&t=" +
            new Date().getTime();

        fetch(requestUrl, {
            method: "GET",
            mode: "cors",
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        })
            .then(function (response) {
                return response.text().then(function (text) {
                    var data;

                    try {
                        data = JSON.parse(text);
                    } catch (error) {
                        throw new Error(
                            "The checker returned an invalid response."
                        );
                    }

                    if (!response.ok || !data.ok) {
                        throw new Error(
                            data.error ||
                            "The account could not be checked."
                        );
                    }

                    return data;
                });
            })
            .then(function (data) {
                var accountName = escapeHtml(data.user.username);
                var displayName = escapeHtml(
                    data.user.displayName || data.user.username
                );

                if (!data.supporter || !data.highestTier) {
                    showResult(
                        "not-owned",
                        "No support pass found",
                        '<strong>' +
                            displayName +
                            "</strong> (@" +
                            accountName +
                            ") does not currently own one of the six BRDB support passes."
                    );
                    return;
                }

                var ownedPasses = data.ownedPasses || [];
                var ownedHtml = "";

                if (ownedPasses.length > 0) {
                    ownedHtml = '<div class="owned-pass-list">';

                    for (var i = 0; i < ownedPasses.length; i++) {
                        ownedHtml +=
                            "<span>" +
                            escapeHtml(ownedPasses[i].name) +
                            "</span>";
                    }

                    ownedHtml += "</div>";
                }

                showResult(
                    "success",
                    "Verified supporter ✓",
                    '<strong>' +
                        displayName +
                        "</strong> (@" +
                        accountName +
                        ")",
                    '<div class="verified-tier">' +
                        escapeHtml(data.highestTier.name) +
                        "</div>" +
                        "<p>Highest BRDB support tier found on this account.</p>" +
                        ownedHtml
                );
            })
            .catch(function (error) {
                showResult(
                    "error",
                    "Could not check Roblox",
                    escapeHtml(
                        error && error.message
                            ? error.message
                            : "The checker could not connect."
                    ) +
                    '<br><br>Worker address being used:<br><code>' +
                    escapeHtml(WORKER_URL) +
                    "</code>"
                );
            })
            .then(function () {
                setLoading(false);
            });
    });
}());
