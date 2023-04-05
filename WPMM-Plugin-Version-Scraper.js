// ==UserScript==
// @name        Copy Wordpress Plugin Update Versions
// @description A userscript that adds a button to the Wordpress update page that copies the plugin versions to the clipboard.
// @match       *://*/wp-admin/update-core.php
// @match       *://*/wp-admin/network/update-core.php
// @grant       none
// @version     1.0
// @license     MIT
// @author      Danny Hale
// @namespace   https://github.com/DannyHaleLR
// @include     https://github.com/
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @updateURL   https://raw.githubusercontent.com/DannyHaleLR/userscripts/master/WPMM-Plugin-Version-Scraper.js
// @downloadURL https://raw.githubusercontent.com/DannyHaleLR/userscripts/master/WPMM-Plugin-Version-Scraper.js
// @supportURL  https://github.com/DannyHaleLR/userscripts/issues
// ==/UserScript==

const updatePluginsBtn = document.getElementsByName("upgrade-plugins")[0].getElementsByTagName('p')[0];

var copy = [];

updatePluginsBtn.insertAdjacentHTML('beforeend', '<button id="copy-versions" type="button" style="margin-left:20px;" class="button">Copy version numbers</button>');

const copyButton = document.getElementById("copy-versions");

copyButton.addEventListener("click", copyVersionNumbers);

function copyVersionNumbers() {
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

    copy.push("🟢 " + pluginName + ": Previous version " + installedVersion + " → Updated to " + updateVersion + ".")

  }

  copy = copy.join("\r\n");

  copyTextToClipboard(copy);
}


function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');

    console.log(successful);
    if (successful) {
      copyButton.innerHTML = 'Copied to clipboard!';
      setTimeout(function() {
        copyButton.innerHTML = 'Copy version numbers';
      }, 1000);
    }
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    copyButton.innerHTML = 'Copied to clipboard!';
    setTimeout(function() {
      copyButton.innerHTML = 'Copy version numbers';
    }, 1000);
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}
