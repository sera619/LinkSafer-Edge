// Show all saved notice and hyperlinks
function showLinks() {
    chrome.storage.sync.get('links', function (data) {
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
                deleteButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    var link = event.target.nextSibling.href;
                    chrome.runtime.sendMessage({
                        action: 'removeLink',
                        link: link
                    });
                });
                li.appendChild(deleteButton);
                li.appendChild(hyperlink);
            } else {
                // Notiz
                var note = document.createElement('span');
                note.textContent = links[i];
                deleteButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    var link = event.target.nextSibling.textContent;
                    chrome.runtime.sendMessage({
                        action: 'removeLink',
                        link: link
                    });
                });
                li.appendChild(deleteButton);
                li.appendChild(note);
            }
            linkList.appendChild(li);
        }
    });
}

function addCurrentTab() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        var tab = tabs[0];
        var link = tab.url;
        chrome.runtime.sendMessage({
            action: 'addLink',
            link: link
        });
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
    chrome.tabs.create({
        url: link
    });
}

function openOptionsPage() {
    chrome.runtime.sendMessage({
        action: 'openOption'
    });
}

function addLink() {
    var newLink = document.getElementById('newLink');
    if (newLink.value === "") {
        return;
    }
    var link = newLink.value;
    newLink.value = '';
    chrome.runtime.sendMessage({
        action: 'addLink',
        link: link
    });
}

function clearList() {
    chrome.storage.sync.set({
        links: []
    }, function () {
        console.log('Liste gelöscht');
    });
}

function showNotify() {
    var testmsg = "Testmessage"
    chrome.runtime.sendMessage({
        action: 'notify',
        link: testmsg
    });
}

function showAlert(msg) {
    alert(msg);
}

function myConfirm(message) {
    var modal = document.createElement('div');
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'linear-gradient(to bottom right, #2c2c2c, #1c1c1c)';
    modal.classList.toggle("modal");

    var modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'linear-gradient(to bottom right, #2c2c2c, #1c1c1c)';
    modalContent.style.display = "block";
    modalContent.style.margin = '8px';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.width = '80%';

    var h = document.createElement("h3");
    h.innerText = "Attention";
    modalContent.appendChild(h);
    var hr = document.createElement("hr");
    modalContent.appendChild(hr);


    var p = document.createElement('p');
    p.innerHTML = message;
    modalContent.appendChild(p);

    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.margin = "10px";

    var yesButton = document.createElement('button');
    yesButton.innerHTML = 'Okay';
    yesButton.className = 'button-with-icon';
    yesButton.onclick = function () {
        document.body.removeChild(modal);
        return true;
    };

    var br = document.createElement("br");
    var br2 = document.createElement("br");
    var br3 = document.createElement("br");
    modalContent.appendChild(br);

    var noButton = document.createElement('button');
    noButton.innerHTML = 'Cancel';
    noButton.className = 'button-with-icon';
    noButton.onclick = function () {
        document.body.removeChild(modal);
        return false;
    };

    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(br2);
    buttonContainer.appendChild(br3);
    
    buttonContainer.appendChild(noButton);

    modalContent.appendChild(buttonContainer);

    modal.appendChild(modalContent);

    document.body.appendChild(modal);
}





// init popup and eventhandler
document.addEventListener('DOMContentLoaded', function () {
    showLinks();
    var addLinkForm = document.getElementById('addLinkForm');
    addLinkForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addLink();
    });
    var addLinkButton = document.getElementById("add-tab-btn");
    addLinkButton.addEventListener('click', function (event) {
        event.preventDefault();
        addCurrentTab()
    })
    var clearButton = document.getElementById("clear-list-btn");
    clearButton.addEventListener('click', function (event) {
        event.preventDefault();
        clearList();
    })
    var optionButton = document.getElementById("option-btn");
    optionButton.addEventListener('click', function (event) {
        event.preventDefault();
        openOptionsPage();
    })

    var notifyButton = document.getElementById("notify-btn");
    notifyButton.addEventListener("click", function (event) {
        event.preventDefault();
        //showNotify();
        //showAlert("Testalert");
        myConfirm("Test");

    })


    const VERSIONNUM = "1.5.8"
    var version = "v" + VERSIONNUM + "\nDevelopment & Design 2022-2023 © S3R43o3 & AI";
    var versiontext = document.getElementById("version-text");
    versiontext.innerText = version;

});

// event listerner @ browser storage
chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName === 'sync' && changes.links) {
        showLinks();
    }
});