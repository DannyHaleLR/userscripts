// ==UserScript==
// @name        Copy Wordpress Plugin Update Versions
// @description A userscript that adds a button to the Wordpress update page that copies the plugin versions to the clipboard.
// @match       *://*/wp-admin/update-core.php
// @match       *://*/wp-admin/network/update-core.php
// @grant       none
// @version     1.1.0
// @license     MIT
// @author      Danny Hale
// @namespace   https://github.com/DannyHaleLR
// @updateURL   https://raw.githubusercontent.com/DannyHaleLR/userscripts/main/WPMM-Plugin-Version-Scraper.js
// @downloadURL https://raw.githubusercontent.com/DannyHaleLR/userscripts/main/WPMM-Plugin-Version-Scraper.js
// @supportURL  https://github.com/DannyHaleLR/userscripts/issues
// ==/UserScript==

const updatePluginsBtn = document.getElementsByName("upgrade-plugins")[0].getElementsByTagName('p')[0];

var wordpressVersion = document.getElementsByClassName("wp-current-version")[0].innerHTML;

wordpressVersion = wordpressVersion.replace('Current version: ', '');

const updateWordpressBtn = document.getElementById("upgrade");

updateWordpressBtn.addEventListener("click", function() {
  setCookie('WPUpgraded', wordpressVersion, 1)
});

updatePluginsBtn.insertAdjacentHTML('beforeend', '<button id="copy-versions" type="button" style="margin-left:20px;" class="button">Copy version numbers</button>');

const copyButton = document.getElementById("copy-versions");

copyButton.addEventListener("click", copyVersionNumbers);

function copyVersionNumbers() {

  var copy = [];

  if (getCookie('WPUpgraded')) {
    copy.push("🟢 <b>Wordpress Core</b>: Previous version " + getCookie('WPUpgraded') + " → Updated to " + wordpressVersion + ".");
  } else {
    copy.push("🟢 <b>Wordpress Core</b>: Latest Version (" + wordpressVersion + ").");
  }

  const table = document.getElementsByClassName("plugins")[0];
  for (var i = 0, row; row = table.rows[i]; i++) {

    const pluginText = row.getElementsByClassName("plugin-title")[0].getElementsByTagName('p')[0];

    var versionText = pluginText.innerHTML;
    const pluginName = pluginText.getElementsByTagName('strong')[0].innerHTML;

    var start_pos = versionText.indexOf('have version ') + 13;
    var end_pos = versionText.indexOf(' installed.',start_pos);
    var text_to_get = versionText.substring(start_pos,end_pos);

    var installedVersion = text_to_get;

    var start_pos = versionText.indexOf('Update to ') + 10;
    var end_pos = versionText.indexOf('. ',start_pos);
    var text_to_get = versionText.substring(start_pos,end_pos);

    var updateVersion = text_to_get;

    copy.push("🟢 <b>" + pluginName + "</b>: Previous version " + installedVersion + " <b>→</b> Updated to " + updateVersion + ".")

  }

  copy = copy.join("<br>");

  copyToClip(copy);
}

//FUNCTIONS

function copyToClip(str) {

  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }

  document.addEventListener("copy", listener);
  var successful = document.execCommand('copy');

  if (successful) {
    copyButton.innerHTML = 'Copied to clipboard!';
    setTimeout(function() {
      copyButton.innerHTML = 'Copy version numbers';
    }, 1000);
  }

  copyButton.innerHTML = 'Copied to clipboard!';
};

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}