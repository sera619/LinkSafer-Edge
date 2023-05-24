// Show all saved notice and hyperlinks
function showLinks() {
	chrome.storage.sync.get("links", function (data) {
		var links = data.links;
		var linkList = document.getElementById("linkList");
		linkList.innerHTML = "";
		if (links.length === 0) {
			console.log("No links in storage");
			setDownloadBtnVisible(false);
			return;
		} else {
			setDownloadBtnVisible(true);
			for (var i = 0; i < links.length; i++) {
				var li = document.createElement("li");
				if (
					links[i].startsWith("http") ||
					links[i].startsWith("https") ||
					links[i].startsWith("chrome:") ||
					links[i].startsWith("chrome-extension:")
				) {
					const linkElement = createLinkListElement(links[i]);
					li.appendChild(linkElement);
				} else {
					// Notiz
					const listelement = createNoticeListElement(links[i]);
					li.appendChild(listelement);
				}
				linkList.appendChild(li);
				const line = document.createElement('hr')
				line.className = "line";
				linkList.appendChild(line)
			}
		}
	});
}

function isSafeLink(link) {
	const safeProtocols = ["http", "https", "chrome:", "edge:", "chrome-extension:"];
	try {
		const url = new URL(link);
		return safeProtocols.includes(url.protocol);
	} catch (error) {
		//console.error("Invalid URL:", link);
		return false;
	}
}

function shortenLink(link) {
	const maxLength = 35;
	if (link.length > maxLength) {
		return link.substring(0, maxLength - 3) + "...";
	} else {
		return link;
	}
}

function openLink(event) {
	const link = event.target.href; // Überprüfe, ob der Link auf den Erweiterungsmanager zeigt
	if (link === 'edge://extensions/') {
		return;
	} else {
		chrome.tabs.create({
			url: link,
		});
	}
}


function createLinkListElement(link) {
	const hyperlink = document.createElement("a");
	hyperlink.textContent = shortenLink(link);
	hyperlink.href = link;
	hyperlink.className = "list-url";
	hyperlink.addEventListener("click", openLink);

	const deleteButton = document.createElement("button");
	deleteButton.className = "del-btn";
	deleteButton.innerText = "X";
	deleteButton.addEventListener("click", function (event) {
		event.stopPropagation();
		const noteElement = event.target.parentNode;
		const link = noteElement.firstChild.href;

		chrome.runtime.sendMessage({
			action: "removeLink",
			link: link
		});
	});
	addTooltip(deleteButton, "Remove this entry")
	const addBookmarkButton = document.createElement("button");
	addBookmarkButton.className = "del-btn";
	addBookmarkButton.innerText = "+";
	addBookmarkButton.addEventListener("click", function (event) {
		event.preventDefault();
		const noteElement = event.target.parentNode;
		const link = noteElement.firstChild.href;
		showBookmarkDisplay(link);
	});
	addTooltip(addBookmarkButton, "Add URL to bookmarks")
	const listelement = document.createElement("div");
	listelement.className = "list-element";
	listelement.appendChild(hyperlink);
	listelement.appendChild(addBookmarkButton);
	listelement.appendChild(deleteButton);

	return listelement;
}

function createNoticeListElement(link) {
	const note = document.createElement("div");
	note.className = "list-text";
	note.textContent = link;

	const deleteButton = document.createElement("button");
	deleteButton.className = "del-btn";
	deleteButton.innerText = "X";

	deleteButton.addEventListener("click", function (event) {
		event.stopPropagation();
		const noteElement = event.target.parentNode;
		const link = noteElement.firstChild.textContent;
		chrome.runtime.sendMessage({
			action: "removeLink",
			link: link
		});
	});

	const listelement = document.createElement("div");
	listelement.className = "list-element";
	listelement.appendChild(note);
	listelement.appendChild(deleteButton);

	return listelement;
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

function sanitizeInput(input) {
	const sanitizedInput = input.replace(/<[^>]+>/g, "");
	return sanitizedInput;
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
	//modalContent.style.border = "1px solid #888";
	modalContent.style.width = "80%";

	var h = document.createElement("h3");
	h.innerText = title;

	modalContent.appendChild(h);
	var hr = document.createElement("hr");
	hr.className = "line-anim"
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

function getBookmarkDirs(callback) {
	chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
		var bookmarkList = [];
		bookmarkTreeNodes.forEach(function (node) {
			if (node.children) {
				node.children.forEach(function (child) {
					var title = String(child.title);
					bookmarkList.push(title);
				});
			}
		});
		callback(bookmarkList);
	});
}

function createBookmark() {
    const bookmarkName = document.getElementById("bookmark-name");
    const bookmarkURL = document.getElementById("bookmark-url");
    const bookmarkDirSelect = document.getElementById("bookmark-dir-select");
    const selectedDir = bookmarkDirSelect.options[bookmarkDirSelect.selectedIndex].text;

	if(bookmarkName === ""){
		myConfirm("Please enter a valid name for your new bookmark!", "attention");
		return;
	} else {

		chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
			bookmarkTreeNodes.forEach(function (node) {
				if (node.children) {
					node.children.forEach(function (child) {
						if (child.title === selectedDir) {
							chrome.bookmarks.create({ parentId: child.id, title: bookmarkName.value, url: bookmarkURL.value }, function (newBookmark) {
								//console.log("Bookmark created:", newBookmark);
								myConfirm("The URL: "+bookmarkURL+" successfully saved with name: "+bookmarkName+" !", "success");
								bookmarkName.value = "";
								bookmarkURL.value = "";
							});
						}
					});
				}
			});
		});
	}
}


function showBookmarkDisplay(link) {
	var bookmarkframe = document.getElementById("bookmarkframe");
	var mainframe = document.getElementById("main");
	bookmarkframe.toggleAttribute("hidden");
	mainframe.toggleAttribute("hidden");
	const bookmarkURL = document.getElementById("bookmark-url");
	const bookmarkDirSelect = document.getElementById("bookmark-dir-select");
	bookmarkURL.value = link;

	getBookmarkDirs(function (bookmarkList) {
		for (var i = 0; i < bookmarkList.length; i++) {
			var option = document.createElement('option');
			option.text = bookmarkList[i];
			bookmarkDirSelect.appendChild(option);
			console.log(bookmarkList[i]);
		}
	});
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
	const version = manifest.version;
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
		myConfirm("Your link & notice list successfully downloaded!", "success");
		a.remove();
	});
}

function addTooltip(element, description) {
	var tooltip = document.createElement("div");
	tooltip.className = "tooltip";
	tooltip.textContent = description;
	tooltip.style.visibility = "hidden";
	tooltip.style.position = "absolute";

	document.body.appendChild(tooltip);

	element.addEventListener("mousemove", function (event) {
		var tooltipWidth = tooltip.offsetWidth;
		var tooltipHeight = tooltip.offsetHeight;

		var mouseX = event.clientX;
		var mouseY = event.clientY;

		tooltip.style.top = mouseY - tooltipHeight - 10 + "px";
		tooltip.style.left = mouseX - tooltipWidth / 2 + "px";
		tooltip.style.visibility = "visible";

		// Automatisches Ausblenden nach 3 Sekunden
		setTimeout(function () {
			tooltip.style.visibility = "hidden";
		}, 3000);
	});

	element.addEventListener("mouseout", function () {
		tooltip.style.visibility = "hidden";
	});
}

function restoreTabsFromSyncStorage() {
	chrome.storage.sync.get('savedTabs', function (data) {
		var savedTabs = data.savedTabs || [];

		savedTabs.forEach(function (tab) {
			chrome.tabs.create({
				url: tab.url
			});
		});

		console.log("Tabs restored from sync storage:", savedTabs);
		myConfirm("Last saved tab session successfully restored from sync storage!", "success")
	});
}

function deleteTabsFromSyncStorage() {
	chrome.storage.sync.remove('savedTabs', function () {
		console.log("Tabs deleted from sync storage");
		myConfirm("Tabs deleted from sync storage successfully!", "success");
	});
}


function saveTabsToSyncStorage() {
	chrome.tabs.query({}, function (tabs) {
		var tabData = tabs.filter(function (tab) {
			return tab.url.startsWith("http");
		}).map(function (tab) {
			return {
				url: tab.url,
				title: tab.title,
			};
		});

		chrome.storage.sync.set({
			savedTabs: tabData
		}, function () {
			console.log("Tabs saved to sync storage:", tabData);
			myConfirm("Tab session successfully saved to sync storage", "success")
		});
	});
}


// init popup and eventhandler
document.addEventListener("DOMContentLoaded", function () {
	showLinks();
	setDownloadBtnVisible(true);
	const addLinkForm = document.getElementById("addLinkForm");
	addLinkForm.addEventListener("submit", function (event) {
		event.preventDefault();
		addLink();
	});

	const addLinkButton = document.getElementById("add-tab-btn");
	addLinkButton.addEventListener("click", function (event) {
		event.preventDefault();
		addCurrentTab();
	});
	addTooltip(addLinkButton, "Add active tab to list")

	const clearButton = document.getElementById("clear-list-btn");
	clearButton.addEventListener("click", function (event) {
		event.preventDefault();
		clearList();
	});
	addTooltip(clearButton, "Clear the list")

	const optionButton = document.getElementById("option-btn");
	optionButton.addEventListener("click", function (event) {
		event.preventDefault();
		openOptionsPage();
	});
	addTooltip(optionButton, "Open options/help menu")

	const notifyButton = document.getElementById("notify-btn");
	notifyButton.addEventListener("click", function (event) {
		event.preventDefault();
		changeDisplayFrame();
	});
	addTooltip(notifyButton, "Open passwordgenerator");
	const addNoteButton = document.getElementById("add-note-btn");
	addTooltip(addNoteButton, "Add note to list");

	const saveSessionButton = document.getElementById("save-session-btn");
	saveSessionButton.addEventListener("click", function (event) {
		event.preventDefault();
		saveTabsToSyncStorage();

	})
	addTooltip(saveSessionButton, "Save your current tab session");

	const restoreSessionButton = document.getElementById('restore-session-btn');
	restoreSessionButton.addEventListener("click", function (event) {
		event.preventDefault();
		restoreTabsFromSyncStorage();
	})
	addTooltip(restoreSessionButton, "Restore your saved tab session");

	const clearSessionButton = document.getElementById("clear-session-btn");
	clearSessionButton.addEventListener("click", function(event) {
		event.preventDefault();
		deleteTabsFromSyncStorage();
	})
	addTooltip(clearSessionButton,"Delete saved tab session");


	const passlenslider = document.getElementById("password-length");
	const passsizetext = document.getElementById("passlen");
	passsizetext.innerHTML = passlenslider.value;
	passlenslider.addEventListener("input", function (event) {
		event.preventDefault();
		passsizetext.innerHTML = passlenslider.value;
	});

	const genpassButton = document.getElementById("gen-pass-btn");
	genpassButton.addEventListener("click", function (event) {
		event.preventDefault();
		generatePassword();
	});

	const copyPassButton = document.getElementById("copy-pass-btn");
	copyPassButton.addEventListener("click", function (event) {
		event.preventDefault();
		copyPasswordToClipboard();
	});

	const passBackButton = document.getElementById("back-btn");
	passBackButton.addEventListener("click", function (event) {
		event.preventDefault();
		changeDisplayFrame();
	});

	const bookmarkBackButton = document.getElementById("bookmark-back-btn");
	bookmarkBackButton.addEventListener("click", function (event) {
		event.preventDefault();
		showBookmarkDisplay();
	})

	const addBookmarkButton = document.getElementById('add-bookmark-btn');
	addBookmarkButton.addEventListener("click", function(event){
		event.preventDefault();
		createBookmark();
	})

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