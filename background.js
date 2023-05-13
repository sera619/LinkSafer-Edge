// Hintergrundseite
chrome.runtime.onInstalled.addListener(function () {
    // Initialisiere den Speicher
    chrome.storage.sync.set({
        links: []
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
    if (type === "github") {
        chrome.tabs.create({
            url: 'https://www.github.com/sera619'
        });
    } else if (type === "codepen") {
        chrome.tabs.create({
            url: 'https://www.codepen.io/sera619'
        });
    } else if (type === "youtube") {
        chrome.tabs.create({
            url: 'https://www.youtube.com/@S3R43o3'
        });
    } else if (type === "thm") {
        chrome.tabs.create({
            url: 'https://www.tryhackme.com/p/S3R43o3'
        });
    } else {
        return;
    }
}

function openNotification(message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '/assets/img/icon64.png',
        title: 'Benachrichtigung',
        message: message
    });
}

function changeAddonIcon(iconPath) {
    chrome.action.setIcon({ path: iconPath });
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
    }
});
