(function () {
    "use strict";

    var API_BASE =
        "https://brbd-accounts.mrducktive.workers.dev";

    var loadingPanel =
        document.getElementById("photoLoading");

    var signedOutPanel =
        document.getElementById("photoSignedOut");

    var uploader =
        document.getElementById("photoUploader");

    var messageBox =
        document.getElementById("photoMessage");

    var form =
        document.getElementById("photoUploadForm");

    var fileInput =
        document.getElementById("photoFile");

    var titleInput =
        document.getElementById("photoTitle");

    var creditInput =
        document.getElementById("photographerCredit");

    var descriptionInput =
        document.getElementById("photoDescription");

    var descriptionCounter =
        document.getElementById("descriptionCounter");

    var agreement =
        document.getElementById("photoAgreement");

    var submitButton =
        document.getElementById("submitPhotoButton");

    var accountName =
        document.getElementById("uploadAccountName");

    var previewImage =
        document.getElementById("photoPreview");

    var previewEmpty =
        document.getElementById("photoPreviewEmpty");

    var previewUrl = null;
    var defaultCredit = "";

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

    function clearMessage() {
        if (!messageBox) {
            return;
        }

        messageBox.textContent = "";
        messageBox.className = "community-message";
    }

    function showMessage(type, text) {
        if (!messageBox) {
            return;
        }

        messageBox.textContent = text;
        messageBox.className =
            "community-message visible " + type;

        try {
            messageBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } catch (error) {
            messageBox.scrollIntoView();
        }
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
                var data = {};

                if (text) {
                    try {
                        data = JSON.parse(text);
                    } catch (error) {
                        throw new Error(
                            "The BRDB server returned an invalid response."
                        );
                    }
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

                    throw requestError;
                }

                return data;
            });
        });
    }

    function allowedFileType(file) {
        if (!file) {
            return false;
        }

        return (
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/webp"
        );
    }

    function validFileSize(file) {
        var maximumSize =
            3 * 1024 * 1024;

        return (
            file &&
            file.size > 0 &&
            file.size <= maximumSize
        );
    }

    function clearPreview() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            previewUrl = null;
        }

        if (previewImage) {
            previewImage.removeAttribute("src");
            hideElement(previewImage);
        }

        showElement(previewEmpty, "block");
    }

    function showPreview(file) {
        clearPreview();

        if (!file) {
            return;
        }

        if (!allowedFileType(file)) {
            fileInput.value = "";

            showMessage(
                "error",
                "Only JPG, PNG and WebP photos are allowed."
            );

            return;
        }

        if (!validFileSize(file)) {
            fileInput.value = "";

            showMessage(
                "error",
                "The selected photo must be smaller than 3 MB."
            );

            return;
        }

        clearMessage();

        previewUrl =
            URL.createObjectURL(file);

        previewImage.src =
            previewUrl;

        showElement(previewImage, "block");
        hideElement(previewEmpty);
    }

    function updateDescriptionCounter() {
        if (
            !descriptionInput ||
            !descriptionCounter
        ) {
            return;
        }

        descriptionCounter.textContent =
            descriptionInput.value.length +
            " / 500";
    }

    function setWorking(working) {
        if (!submitButton) {
            return;
        }

        submitButton.disabled =
            working;

        submitButton.textContent =
            working
                ? "Uploading photo…"
                : "Submit for review";
    }

    function renderSignedOut() {
        hideElement(loadingPanel);
        hideElement(uploader);
        showElement(signedOutPanel, "block");
    }

    function renderUploader(user) {
        hideElement(loadingPanel);
        hideElement(signedOutPanel);
        showElement(uploader, "grid");

        var visibleName =
            user.display_name ||
            user.discord_username ||
            "BRDB user";

        defaultCredit = visibleName;

        if (accountName) {
            accountName.textContent =
                "Signed in as " + visibleName;
        }

        if (
            creditInput &&
            !creditInput.value.trim()
        ) {
            creditInput.value =
                visibleName;
        }
    }

    function loadAccount() {
        clearMessage();

        showElement(loadingPanel, "block");
        hideElement(signedOutPanel);
        hideElement(uploader);

        apiRequest("/api/me")
            .then(function (data) {
                if (!data.user) {
                    throw new Error(
                        "Your BRDB account could not be loaded."
                    );
                }

                renderUploader(data.user);
            })
            .catch(function (error) {
                if (error.status === 401) {
                    renderSignedOut();
                    return;
                }

                hideElement(loadingPanel);
                hideElement(uploader);
                showElement(signedOutPanel, "block");

                showMessage(
                    "error",
                    error.message ||
                    "The account system could not be reached."
                );
            });
    }

    if (descriptionInput) {
        descriptionInput.addEventListener(
            "input",
            updateDescriptionCounter
        );
    }

    if (fileInput) {
        fileInput.addEventListener(
            "change",
            function () {
                var file =
                    fileInput.files &&
                    fileInput.files.length
                        ? fileInput.files[0]
                        : null;

                showPreview(file);
            }
        );
    }

    if (form) {
        form.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();
                clearMessage();

                if (
                    typeof form.checkValidity === "function" &&
                    !form.checkValidity()
                ) {
                    if (
                        typeof form.reportValidity === "function"
                    ) {
                        form.reportValidity();
                    }

                    return;
                }

                var file =
                    fileInput.files &&
                    fileInput.files.length
                        ? fileInput.files[0]
                        : null;

                if (!file) {
                    showMessage(
                        "error",
                        "Choose a screenshot before submitting."
                    );

                    return;
                }

                if (!allowedFileType(file)) {
                    showMessage(
                        "error",
                        "Only JPG, PNG and WebP photos are allowed."
                    );

                    return;
                }

                if (!validFileSize(file)) {
                    showMessage(
                        "error",
                        "The selected photo must be smaller than 3 MB."
                    );

                    return;
                }

                if (
                    !agreement ||
                    !agreement.checked
                ) {
                    showMessage(
                        "error",
                        "Confirm that you have permission to submit this photo."
                    );

                    return;
                }

                if (
                    !titleInput ||
                    !titleInput.value.trim()
                ) {
                    showMessage(
                        "error",
                        "Enter a title for your photo."
                    );

                    return;
                }

                if (
                    !creditInput ||
                    !creditInput.value.trim()
                ) {
                    showMessage(
                        "error",
                        "Enter the photographer credit."
                    );

                    return;
                }

                var formData =
                    new FormData(form);

                setWorking(true);

                apiRequest(
                    "/api/photos/upload",
                    {
                        method: "POST",
                        body: formData
                    }
                )
                    .then(function (data) {
                        showMessage(
                            "success",
                            data.message ||
                            "Your photo was submitted for review."
                        );

                        form.reset();
                        clearPreview();
                        updateDescriptionCounter();

                        if (creditInput) {
                            creditInput.value =
                                defaultCredit;
                        }
                    })
                    .catch(function (error) {
                        if (error.status === 401) {
                            renderSignedOut();

                            showMessage(
                                "error",
                                "Your login expired. Sign in again before uploading."
                            );

                            return;
                        }

                        showMessage(
                            "error",
                            error.message ||
                            "The photo could not be uploaded."
                        );
                    })
                    .then(function () {
                        setWorking(false);
                    });
            }
        );
    }

    window.addEventListener(
        "beforeunload",
        function () {
            if (previewUrl) {
                URL.revokeObjectURL(
                    previewUrl
                );
            }
        }
    );

    updateDescriptionCounter();
    clearPreview();
    loadAccount();
}());
