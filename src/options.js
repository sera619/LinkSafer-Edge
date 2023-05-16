const ICON_DEFAULT_PATHS = {
    "16": chrome.runtime.getURL("/assets/img/icons/normal/icon16.png"),
    "32": chrome.runtime.getURL("/assets/img/icons/normal/icon32.png"),
    "48": chrome.runtime.getURL("/assets/img/icons/normal/icon48.png"),
    "64": chrome.runtime.getURL("/assets/img/icons/normal/icon64.png"),
    "96": chrome.runtime.getURL("/assets/img/icons/normal/icon96.png"),
    "128": chrome.runtime.getURL("/assets/img/icons/normal/icon128.png"),
    "256": chrome.runtime.getURL("/assets/img/icons/normal/icon256.png")
};

const ICON_BINARY_PATHS = {
    "16": chrome.runtime.getURL("/assets/img/icons/binarycode/icon16.png"),
    "32": chrome.runtime.getURL("/assets/img/icons/binarycode/icon32.png"),
    "48": chrome.runtime.getURL("/assets/img/icons/binarycode/icon48.png"),
    "64": chrome.runtime.getURL("/assets/img/icons/binarycode/icon64.png"),
    "96": chrome.runtime.getURL("/assets/img/icons/binarycode/icon96.png"),
    "128": chrome.runtime.getURL("/assets/img/icons/binarycode/icon128.png"),
    "256": chrome.runtime.getURL("/assets/img/icons/binarycode/icon256.png")
}
const ICON_WEB_KEY_PATHS = {
    "16": chrome.runtime.getURL("/assets/img/icons/web-security/icon16.png"),
    "32": chrome.runtime.getURL("/assets/img/icons/web-security/icon32.png"),
    "48": chrome.runtime.getURL("/assets/img/icons/web-security/icon48.png"),
    "64": chrome.runtime.getURL("/assets/img/icons/web-security/icon64.png"),
    "96": chrome.runtime.getURL("/assets/img/icons/web-security/icon96.png"),
    "128": chrome.runtime.getURL("/assets/img/icons/web-security/icon128.png"),
    "256": chrome.runtime.getURL("/assets/img/icons/web-security/icon256.png")
}
const ICON_HACKER_PATHS = {
    "16": chrome.runtime.getURL("/assets/img/icons/hacker/icon16.png"),
    "32": chrome.runtime.getURL("/assets/img/icons/hacker/icon32.png"),
    "48": chrome.runtime.getURL("/assets/img/icons/hacker/icon48.png"),
    "64": chrome.runtime.getURL("/assets/img/icons/hacker/icon64.png"),
    "96": chrome.runtime.getURL("/assets/img/icons/hacker/icon96.png"),
    "128": chrome.runtime.getURL("/assets/img/icons/hacker/icon128.png"),
    "256": chrome.runtime.getURL("/assets/img/icons/hacker/icon256.png")
}
const ICON_SMART_KEY_PATHS = {
    "16": chrome.runtime.getURL("/assets/img/icons/smart-key/icon16.png"),
    "32": chrome.runtime.getURL("/assets/img/icons/smart-key/icon32.png"),
    "48": chrome.runtime.getURL("/assets/img/icons/smart-key/icon48.png"),
    "64": chrome.runtime.getURL("/assets/img/icons/smart-key/icon64.png"),
    "96": chrome.runtime.getURL("/assets/img/icons/smart-key/icon96.png"),
    "128": chrome.runtime.getURL("/assets/img/icons/smart-key/icon128.png"),
    "256": chrome.runtime.getURL("/assets/img/icons/smart-key/icon256.png")
}
function changeIcon(icontype) {
    chrome.runtime.sendMessage({
        action: 'changeIcon',
        link: icontype
    });
}

function changePreviewIcon(icontype) {
    var iconpreview = document.getElementById("previewimg");
    switch (icontype) {
        case "normal":
            iconpreview.src = chrome.runtime.getURL("/assets/img/icons/normal/icon128.png");
            break;
        case "binary":
            iconpreview.src = chrome.runtime.getURL("/assets/img/icons/binarycode/icon128.png");
            break;
        case "web-key":
            iconpreview.src = chrome.runtime.getURL("/assets/img/icons/web-security/icon128.png");
            break;
        case "smart-key":
            iconpreview.src = chrome.runtime.getURL("/assets/img/icons/smart-key/icon128.png");
            break;
        case "hacker":
            iconpreview.src = chrome.runtime.getURL("/assets/img/icons/hacker/icon128.png");
            break;
        default:
            break;
    }
}

function isEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }
    for (let key in obj1) {
        if (!obj2.hasOwnProperty(key)) {
            return false;
        }

        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
}

function getExtensionVersion() {
    const manifest = chrome.runtime.getManifest();
    return manifest.version;
}


function getSavedIconPath(callback) {
    if (savedIconPath) {
        callback(savedIconPath);
    } else {
        chrome.storage.sync.get('iconPath', function (data) {
            var iconPath = data.iconPath;
            if (iconPath) {
                callback(iconPath);
            } else {
                callback(null);
            }
        });
    }
}
var savedIconPath;

document.addEventListener('DOMContentLoaded', function () {
    // const colorSchemeBtn = document.getElementById("change-scheme-btn");
    // const root = document.documentElement;
    // colorSchemeBtn.addEventListener("click", function(event) {
    //     event.preventDefault();
    //     root.setAttribute("data-color-scheme", "light");
    // });
    var githubBtn = document.getElementById("social-github");
    githubBtn.addEventListener('click', function (event) {
        event.preventDefault();
        chrome.runtime.sendMessage({
            action: "openSocial",
            link: 'github'
        });
    })
    var ytBtn = document.getElementById("social-youtube");
    ytBtn.addEventListener("click", function (event) {
        event.preventDefault();
        chrome.runtime.sendMessage({
            action: "openSocial",
            link: 'youtube'
        });
    })
    var codepenBtn = document.getElementById("social-codepen");
    codepenBtn.addEventListener("click", function (event) {
        event.preventDefault();
        chrome.runtime.sendMessage({
            action: "openSocial",
            link: "codepen"
        });
    })
    var thmBtn = document.getElementById("social-thm");
    thmBtn.addEventListener("click", function (event) {
        event.preventDefault();
        chrome.runtime.sendMessage({
            action: "openSocial",
            link: "thm"
        });
    })
    let changeIconBtn = document.getElementById("change-icon-btn");
    let selectBtn = document.getElementById("iconselect");
    selectBtn.addEventListener("change", function (event) {
        event.preventDefault();
        changePreviewIcon(this.value)
    })
    console.log(selectBtn.value);
    changeIconBtn.addEventListener("click", function (event) {
        event.preventDefault();
        changeIcon(selectBtn.value);
    })
    getSavedIconPath(function (iconPath) {
        if (iconPath) {
            savedIconPath = iconPath;
            if (isEqual(savedIconPath, ICON_DEFAULT_PATHS)) {
                console.log('Gespeicherter Icon-Pfad:', iconPath);
                selectBtn.value = "normal";
            } else if (isEqual(savedIconPath, ICON_BINARY_PATHS)) {
                selectBtn.value = "binary";
            } else if (isEqual(savedIconPath, ICON_HACKER_PATHS)) {
                selectBtn.value = "hacker";
            } else if (isEqual(savedIconPath, ICON_SMART_KEY_PATHS)) {
                selectBtn.value = "smart-key";
            } else if (isEqual(savedIconPath, ICON_WEB_KEY_PATHS)) {
                selectBtn.value = "web-key";
            }
            changePreviewIcon(selectBtn.value)

        } else {
            console.log('Kein gespeicherter Icon-Pfad gefunden.');
        }
    });


    const VERSION = getExtensionVersion();
    let versiontext = document.getElementById("version");
    versiontext.innerText = VERSION;
});