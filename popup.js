// Show all saved notice and hyperlinks
function showLinks() {
    chrome.storage.sync.get("links", function (data) {
        var links = data.links;
        var linkList = document.getElementById("linkList");
        linkList.innerHTML = "";
        if (links.length === 0) {
            console.log("No links in storage");
            return;
        } else {
            for (var i = 0; i < links.length; i++) {
                var li = document.createElement("li");
                var deleteButton = document.createElement("button");
                deleteButton.textContent = "X";
                deleteButton.className = "delete-btn";
                if (
                    isSafeLink(links[i]) // Check if the link is safe
                ) {
                    var hyperlink = document.createElement("a");
                    hyperlink.textContent = shortenLink(links[i]);
                    hyperlink.href = links[i];
                    hyperlink.addEventListener("click", openLink);
                    deleteButton.addEventListener("click", function (event) {
                        event.stopPropagation();
                        var link = event.target.nextSibling.href;
                        chrome.runtime.sendMessage({
                            action: "removeLink",
                            link: link,
                        });
                    });
                    li.appendChild(deleteButton);
                    li.appendChild(hyperlink);
                } else {
                    // Notiz
                    var note = document.createElement("span");
                    note.textContent = sanitizeInput(links[i]);
                    note.style.overflowWrap = "break-word";
                    deleteButton.addEventListener("click", function (event) {
                        event.stopPropagation();
                        var link = event.target.nextSibling.textContent;
                        chrome.runtime.sendMessage({
                            action: "removeLink",
                            link: link,
                        });
                    });
                    li.appendChild(deleteButton);
                    li.appendChild(note);
                }
                linkList.appendChild(li);
            }
        }
    });
}

function isSafeLink(link) {
    const safeProtocols = ["http", "https", "chrome:", "edge:", "chrome-extension:"];
    const url = new URL(link);
    return safeProtocols.includes(url.protocol);
}

function sanitizeInput(input) {
    const sanitizedInput = input.replace(/[<>]/g, "");
    return sanitizedInput;
}

function addCurrentTab() {
	chrome.tabs.query({
			active: true,
			currentWindow: true,
		},
		function (tabs) {
			var tab = tabs[0];
			var link = tab.url;
			chrome.runtime.sendMessage({
				action: "addLink",
				link: link,
			});
		}
	);
}

function setDownloadBtnVisible(mode) {
	const donwloadBtn = document.getElementById("downloadbtnbox");
	if (mode === true) {
		console.log("download button shown");
		donwloadBtn.hidden = false;
	} else if (mode === false) {
		console.log("Downloadbutton hidden");
		donwloadBtn.hidden = true;
	}
}

function shortenLink(link) {
	const maxLength = 30;
	if (link.length > maxLength) {
		return link.substring(0, maxLength - 3) + "...";
	} else {
		return link;
	}
}

function openLink(event) {
	var link = event.target.href;
	chrome.tabs.create({
		url: link,
	});
}

function openOptionsPage() {
	chrome.runtime.sendMessage({
		action: "openOption",
	});
}

function addLink() {
	const newLink = document.getElementById("newLink");
	if (newLink.value === "") {
		return;
	}
	const link = sanitizeInput(newLink.value);
	newLink.value = "";

	chrome.runtime.sendMessage({
		action: "addLink",
		link: link,
	});
}



function clearList() {
	chrome.storage.sync.set({
			links: [],
		},
		function () {
			console.log("Liste gelöscht");
		}
	);
}

function showNotify() {
	var testmsg = "Testmessage";
	chrome.runtime.sendMessage({
		action: "notify",
		link: testmsg,
	});
}

function myConfirm(message, title = "Attention") {
	var modal = document.createElement("div");
	modal.style.display = "block";
	modal.style.position = "fixed";
	modal.style.zIndex = "1";
	modal.style.left = "0";
	modal.style.top = "0";
	modal.style.width = "100%";
	modal.style.height = "100%";
	modal.style.backgroundColor =
		"linear-gradient(to bottom right, #2c2c2c, #1c1c1c)";
	modal.classList.toggle("modal");

	var modalContent = document.createElement("div");
	modalContent.style.backgroundColor =
		"linear-gradient(to bottom right, #2c2c2c, #1c1c1c)";
	modalContent.style.display = "block";
	modalContent.style.margin = "8px";
	modalContent.style.padding = "20px";
	modalContent.style.border = "1px solid #888";
	modalContent.style.width = "80%";

	var h = document.createElement("h3");
	h.innerText = title;

	modalContent.appendChild(h);
	var hr = document.createElement("hr");
	modalContent.appendChild(hr);

	var p = document.createElement("p");
	p.innerHTML = message;
	modalContent.appendChild(p);

	var buttonContainer = document.createElement("div");
	buttonContainer.style.display = "flex";
	buttonContainer.style.justifyContent = "center";
	buttonContainer.style.margin = "10px";

	var yesButton = document.createElement("button");
	yesButton.innerHTML = "Okay";
	yesButton.className = "button-with-icon";
	yesButton.addEventListener("click", function (event) {
		event.preventDefault();
		document.body.removeChild(modal);
		return true;
	});

	var br = document.createElement("br");
	var br2 = document.createElement("br");
	var br3 = document.createElement("br");
	modalContent.appendChild(br);

	// var noButton = document.createElement("button");
	// noButton.innerHTML = "Cancel";
	// noButton.className = "button-with-icon";
	// noButton.addEventListener("click", function (event) {
	// 	event.preventDefault();
	// 	document.body.removeChild(modal);
	// 	return false;
	// })

	buttonContainer.appendChild(yesButton);
	buttonContainer.appendChild(br2);
	buttonContainer.appendChild(br3);
	//buttonContainer.appendChild(noButton);
	modalContent.appendChild(buttonContainer);
	modal.appendChild(modalContent);
	document.body.appendChild(modal);
}

function changeDisplayFrame() {
	var mainframe = document.getElementById("main");
	var passframe = document.getElementById("generator");
	passframe.toggleAttribute("hidden");
	mainframe.toggleAttribute("hidden");
}

let generatedPassword = "";

function generatePassword() {
	const numbers = "0123456789";
	const specialCharacters = "!@#$%^&*()_+";
	const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
	const upperCaseLetters = lowerCaseLetters.toUpperCase();
	let characterSet = lowerCaseLetters + upperCaseLetters;
	if (document.getElementById("numbers").checked) {
		characterSet += numbers;
	}
	if (document.getElementById("special-characters").checked) {
		characterSet += specialCharacters;
	}
	const passwordLength = document.getElementById("password-length").value;
	let password = "";
	for (let i = 0; i < passwordLength; i++) {
		const randomIndex = Math.floor(Math.random() * characterSet.length);
		password += characterSet[randomIndex];
	}
	var newpass = document.getElementById("newpass");
	newpass.innerText = password;
	generatedPassword = password;
}

function copyPasswordToClipboard() {
	navigator.clipboard.writeText(generatedPassword);
	var newpass = document.getElementById("newpass");
	newpass.innerText = "Password copied!";
	generatedPassword = "";
}

function getExtensionVersion() {
	const manifest = chrome.runtime.getManifest();
	var version = manifest.version;
	return version;
}

async function downloadTextFile() {
	chrome.storage.sync.get("links", function (data) {
		var links = data.links;
		if (links.length === 0) {
			myConfirm(
				"Cannot download empy list! Please add a URL or a notice to list and try again!"
			);
			return;
		}
		const text = links.join("\n");
		const blob = new Blob([text], {
			type: "text/plain"
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "links.txt";
		a.click();
		myConfirm("Your link & notice list successfully downloaded!", "Information");
	});
}

// init popup and eventhandler
document.addEventListener("DOMContentLoaded", function () {
	showLinks();
	setDownloadBtnVisible(true);
	var addLinkForm = document.getElementById("addLinkForm");
	addLinkForm.addEventListener("submit", function (event) {
		event.preventDefault();
		addLink();
	});
	var addLinkButton = document.getElementById("add-tab-btn");
	addLinkButton.addEventListener("click", function (event) {
		event.preventDefault();
		addCurrentTab();
	});
	var clearButton = document.getElementById("clear-list-btn");
	clearButton.addEventListener("click", function (event) {
		event.preventDefault();
		clearList();
	});
	var optionButton = document.getElementById("option-btn");
	optionButton.addEventListener("click", function (event) {
		event.preventDefault();
		openOptionsPage();
	});

	var notifyButton = document.getElementById("notify-btn");
	notifyButton.addEventListener("click", function (event) {
		event.preventDefault();
		//showNotify();
		//showAlert("Testalert");
		//myConfirm("Test");
		changeDisplayFrame();
	});

	var passlenslider = document.getElementById("password-length");
	var passsizetext = document.getElementById("passlen");
	passsizetext.innerHTML = passlenslider.value;
	passlenslider.addEventListener("input", function (event) {
		event.preventDefault();
		passsizetext.innerHTML = passlenslider.value;
	});

	var genpassButton = document.getElementById("gen-pass-btn");
	genpassButton.addEventListener("click", function (event) {
		event.preventDefault();
		generatePassword();
	});

	var copyPassButton = document.getElementById("copy-pass-btn");
	copyPassButton.addEventListener("click", function (event) {
		event.preventDefault();
		copyPasswordToClipboard();
	});

	var backButton = document.getElementById("back-btn");
	backButton.addEventListener("click", function (event) {
		event.preventDefault();
		changeDisplayFrame();
	});

	const donwloadBtn = document.getElementById("download-list-btn");
	donwloadBtn.addEventListener("click", function (event) {
		event.preventDefault();
		downloadTextFile();
	});
	const VERSIONNUM = getExtensionVersion();
	var version =
		"v" + VERSIONNUM + "\nDevelopment & Design 2022-2023 © S3R43o3 & AI";
	var versiontext = document.getElementById("version-text");
	versiontext.innerText = version;
	chrome.runtime.sendMessage({
		action: "loadIcon",
	});
});

// event listerner @ browser storage
chrome.storage.onChanged.addListener(function (changes, areaName) {
	if (areaName === "sync" && changes.links) {
		showLinks();
	}
});