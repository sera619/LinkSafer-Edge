// Hintergrundseite
const ICON_DEFAULT_PATHS = {
    "16":chrome.runtime.getURL("/assets/img/icons/normal/icon16.png"),
    "32":chrome.runtime.getURL("/assets/img/icons/normal/icon32.png"),
    "48":chrome.runtime.getURL("/assets/img/icons/normal/icon48.png"),
    "64":chrome.runtime.getURL("/assets/img/icons/normal/icon64.png"),
    "96":chrome.runtime.getURL("/assets/img/icons/normal/icon96.png"),
    "128":chrome.runtime.getURL( "/assets/img/icons/normal/icon128.png"),
    "256":chrome.runtime.getURL("/assets/img/icons/normal/icon256.png")
}
chrome.runtime.onInstalled.addListener(function () {
    // Initialisiere den Speicher
    chrome.storage.sync.set({
        links: [],
        iconPath: ICON_DEFAULT_PATHS
    }, function () {
        console.log('Linklist initialized!');
    });
});

// add link to browser storage
function addLink(link) {
    chrome.storage.sync.get('links', function (data) {
        var links = data.links;
        links.push(link);
        chrome.storage.sync.set({
            links: links
        }, function () {
            console.log('Link added:', link);
        });
    });
}

function saveAddonIcon(iconPath) {
    chrome.storage.sync.set({
        iconPath: iconPath
    }, function () {
        savedIconPath = iconPath;
        console.log('Addon icon saved:', iconPath);
    });
}

// Funktion zum Laden des gespeicherten Add-On-Icons
function loadAddonIcon() {
    chrome.storage.sync.get('iconPath', function (data) {
        var iconPath = data.iconPath;
        if (iconPath) {
            changeAddonIcon(iconPath);
            savedIconPath = iconPath;
            console.log('Addon icon loaded:', iconPath);
        }
    });
}



// remove hyperlink or notice from browser storage
function removeLink(link) {
    chrome.storage.sync.get('links', function (data) {
        var links = data.links;
        var index = links.indexOf(link);
        if (index > -1) {
            links.splice(index, 1);
            chrome.storage.sync.set({
                links: links
            }, function () {
                console.log('Link removed:', link);
            });
        }
    });
}

function openOptionsPage() {
    chrome.tabs.create({
        url: 'src/options.html'
    });
}

function openSocialLink(type) {
    const validTypes = ["github", "codepen", "youtube", "thm"];

    if (validTypes.includes(type)) {
        let url;
        if (type === "github") {
            url = 'https://www.github.com/sera619';
        } else if (type === "codepen") {
            url = 'https://www.codepen.io/sera619';
        } else if (type === "youtube") {
            url = 'https://www.youtube.com/@S3R43o3';
        } else if (type === "thm") {
            url = 'https://www.tryhackme.com/p/S3R43o3';
        }

        chrome.tabs.create({ url });
    } else {
        console.error("Invalid social link type:", type);
    }
}
function openNotification(message) {
    // validate and clear message for injections
    const validMessage = sanitizeMessage(message); 
    chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('/assets/img/icons/hacker/icon64.png'),
        title: 'Benachrichtigung',
        message: validMessage
    });
}

function sanitizeMessage(message) {
    const injectionRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    const sanitizedMessage = message.replace(injectionRegex, '');    
    return sanitizedMessage;
}

function changeAddonIcon(iconPath) {
    chrome.action.setIcon({
        path: iconPath
    });
    console.log("Icon updated");
}


// listen on events from popup window
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'addLink') {
        addLink(request.link);
    } else if (request.action === 'removeLink') {
        removeLink(request.link);
    } else if (request.action === 'openOption') {
        openOptionsPage();
    } else if (request.action === 'openSocial') {
        openSocialLink(request.link);
    } else if (request.action === 'notify') {
        openNotification(request.link);
    } else if (request.action === 'changeIcon') {
        changeAddonIcon(request.link);
        saveAddonIcon(request.link);
    }else if (request.action === 'loadIcon') {
        loadAddonIcon();
    }
});