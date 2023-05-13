// Show all saved notice and hyperlinks
function showLinks() {
    chrome.storage.sync.get('links', function(data) {
        var links = data.links;
        var linkList = document.getElementById('linkList');
        linkList.innerHTML = '';
        for (var i = 0; i < links.length; i++) {
            var li = document.createElement('li');
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.className = "delete-btn";
            if (links[i].startsWith('http') || links[i].startsWith('https')) {
                // Link
                var hyperlink = document.createElement('a');
                hyperlink.textContent = shortenLink(links[i]);
                hyperlink.href = links[i];
                hyperlink.addEventListener('click', openLink);
                deleteButton.addEventListener('click', function(event) {
                    event.stopPropagation();
                    var link = event.target.nextSibling.href;
                    chrome.runtime.sendMessage({action: 'removeLink', link: link});
                });
                li.appendChild(deleteButton);
                li.appendChild(hyperlink);
            } else {
                // Notiz
                var note = document.createElement('span');
                note.textContent = links[i];
                deleteButton.addEventListener('click', function(event) {
                    event.stopPropagation();
                    var link = event.target.nextSibling.textContent;
                    chrome.runtime.sendMessage({action: 'removeLink', link: link});
                });
                li.appendChild(deleteButton);
                li.appendChild(note);
            }
            linkList.appendChild(li);
        }
    });
}
function addCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        var link = tab.url;
        chrome.runtime.sendMessage({action: 'addLink', link: link});
    });
}


function shortenLink(link) {
    var maxLength = 30;
    if (link.length > maxLength) {
        return link.substring(0, maxLength - 3) + '...';
    } else {
        return link;
    }
}

function openLink(event) {
    var link = event.target.href;
    chrome.tabs.create({url: link});
}

function openOptionsPage(){
    chrome.runtime.sendMessage({action:'openOption'});
}

function addLink() {
    var newLink = document.getElementById('newLink');
    if (newLink.value === ""){
        return;
    }
    var link = newLink.value;
    newLink.value = '';
    chrome.runtime.sendMessage({action: 'addLink', link: link});
}

function clearList() {
    chrome.storage.sync.set({links: []}, function() {
        console.log('Liste gelöscht');
    });
}

// init popup and eventhandler
document.addEventListener('DOMContentLoaded', function() {
    showLinks();
    var addLinkForm = document.getElementById('addLinkForm');
    addLinkForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addLink();
    });
    var addLinkButton = document.getElementById("add-tab-btn");
    addLinkButton.addEventListener('click', function(event) {
        event.preventDefault();
        addCurrentTab()
    })
    var clearButton = document.getElementById("clear-list-btn");
    clearButton.addEventListener('click', function(event){
        event.preventDefault();
        clearList();
    })
    var optionButton = document.getElementById("option-btn");
    optionButton.addEventListener('click', function(event){
        event.preventDefault();
        openOptionsPage();
    })
    const VERSIONNUM = "1.4.1"
    var version ="v"+VERSIONNUM+"\nDevelopment & Design 2022-2023 © S3R43o3 & AI";
    var versiontext = document.getElementById("version-text");
    versiontext.innerText = version;

});

// event listerner @ browser storage
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === 'sync' && changes.links) {
        showLinks();
    }
});
