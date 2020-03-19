"use strict";

let deferredInstallPrompt = null;
const installButton = document.getElementById("install");
installButton.addEventListener("click", installPWA);

// 설치 이벤트 리스너 생성
window.addEventListener("beforeinstallprompt", saveBeforeInstallPromptEvent);

/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
  // 설치 버튼 보여주기
  deferredInstallPrompt = evt;
  installButton.removeAttribute("hidden");
}

/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
  // CODELAB: Add code show install prompt & hide the install button.
  deferredInstallPrompt.prompt();
  // Hide the install button, it can't be called twice.
  evt.srcElement.setAttribute("hidden", true);
  // CODELAB: Log user response to prompt.
  deferredInstallPrompt.userChoice.then(choice => {
    if (choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt", choice);
    } else {
      console.log("User dismissed the A2HS prompt", choice);
    }
    deferredInstallPrompt = null;
  });
}

// CODELAB: Add event listener for appinstalled event
window.addEventListener("appinstalled", logAppInstalled);
/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
function logAppInstalled(evt) {
  // CODELAB: Add code to log the event
  console.log("Weather App was installed.", evt);
}
