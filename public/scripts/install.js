"use strict";

let deferredInstallPrompt = null;
const installButton = document.getElementById("install");
installButton.addEventListener("click", installPWA);

// 설치 프롬프트 이벤트 리스너 설정
window.addEventListener("beforeinstallprompt", saveBeforeInstallPromptEvent);
function saveBeforeInstallPromptEvent(evt) {
  deferredInstallPrompt = evt;
  installButton.removeAttribute("hidden");
}

// PWA 설치
function installPWA(evt) {
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(choice => {
    if (choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt", choice);
      evt.srcElement.setAttribute("hidden", true);
    } else {
      console.log("User dismissed the A2HS prompt", choice);
    }
    deferredInstallPrompt = null;
  });
}

// 앱 설치 완료 로그 출력
window.addEventListener("appinstalled", logAppInstalled);
function logAppInstalled(evt) {
  console.log("앱 설치가 완료되었습니다", evt);
}
