document.addEventListener('DOMContentLoaded', function() {
    var githubBtn = document.getElementById("social-github");
    githubBtn.addEventListener('click', function(event){
        event.preventDefault();
        chrome.runtime.sendMessage({action: "openSocial", link:'github'});
    })
    var ytBtn = document.getElementById("social-youtube");
    ytBtn.addEventListener("click", function(event){
        event.preventDefault();
        chrome.runtime.sendMessage({action: "openSocial", link: 'youtube'});
    })
    var codepenBtn = document.getElementById("social-codepen");
    codepenBtn.addEventListener("click", function(event){
        event.preventDefault();
        chrome.runtime.sendMessage({action: "openSocial", link: "codepen"});
    })
    var thmBtn = document.getElementById("social-thm");
    thmBtn.addEventListener("click", function(event){
        event.preventDefault();
        chrome.runtime.sendMessage({action: "openSocial", link: "thm"});
    })
    const VERSION = "1.5.8";
    var versiontext = document.getElementById("version");
    versiontext.innerText = VERSION;
});