(function () {
    var WORKER_URL = "https://brbd-support-checker.mrducktive.workers.dev";

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

    function showResult(type, html) {
        resultBox.className = "verifier-result visible " + type;
        resultBox.innerHTML = html;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = usernameInput.value.replace(/^\s+|\s+$/g, "");

        if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
            showResult(
                "error",
                '<h3 class="verifier-title">Invalid username</h3>' +
                '<p>Enter the account username, not a display name.</p>'
            );
            return;
        }

        button.disabled = true;
        button.textContent = "Checking...";
        showResult(
            "loading",
            '<h3 class="verifier-title">Checking Roblox...</h3>' +
            '<p>Looking for BRDB support passes owned by <strong>' +
            escapeHtml(username) +
            "</strong>.</p>"
        );

        fetch(
            WORKER_URL + "/check?username=" + encodeURIComponent(username),
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        )
            .then(function (response) {
                return response.json().then(function (data) {
                    return {
                        ok: response.ok,
                        data: data
                    };
                });
            })
            .then(function (result) {
                if (!result.ok || !result.data.ok) {
                    throw new Error(
                        result.data && result.data.error
                            ? result.data.error
                            : "The account could not be checked."
                    );
                }

                var data = result.data;
                var accountName = escapeHtml(data.user.username);
                var displayName = escapeHtml(data.user.displayName || data.user.username);

                if (!data.supporter || !data.highestTier) {
                    showResult(
                        "not-owned",
                        '<h3 class="verifier-title">No support pass found</h3>' +
                        '<p class="verifier-account"><strong>' +
                        displayName +
                        "</strong> (@" +
                        accountName +
                        ")</p>" +
                        "<p>This Roblox account does not currently own one of the six BRDB support passes.</p>"
                    );
                    return;
                }

                var owned = data.ownedPasses || [];
                var ownedHtml = "";

                for (var i = 0; i < owned.length; i++) {
                    ownedHtml +=
                        "<span>" +
                        escapeHtml(owned[i].name) +
                        "</span>";
                }

                showResult(
                    "success",
                    '<h3 class="verifier-title">Verified supporter ✓</h3>' +
                    '<p class="verifier-account"><strong>' +
                    displayName +
                    "</strong> (@" +
                    accountName +
                    ")</p>" +
                    '<div class="verified-tier">' +
                    escapeHtml(data.highestTier.name) +
                    "</div>" +
                    "<p>Highest BRDB support tier found on this account.</p>" +
                    (ownedHtml
                        ? '<div class="owned-pass-list">' + ownedHtml + "</div>"
                        : "")
                );
            })
            .catch(function (error) {
                showResult(
                    "error",
                    '<h3 class="verifier-title">Could not check Roblox</h3>' +
                    "<p>" +
                    escapeHtml(error.message || "Try again shortly.") +
                    "</p>"
                );
            })
            .then(function () {
                button.disabled = false;
                button.textContent = "Check Supporter Status";
            });
    });
}());
