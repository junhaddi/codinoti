"use strict";

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// 캐시 파일 목록
const FILES_TO_CACHE = ["/", "/index.html", "/offline.html", "/scripts/install.js"];

self.addEventListener("install", evt => {
  console.log("[ServiceWorker] Install");
  // 파일 캐싱 작업
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  console.log("[ServiceWorker] Activate");
  // 캐시에서 오래된 데이터 삭제(CACHE_NAME 변수를 변경해야 작동합니다)
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", evt => {
  console.log("[ServiceWorker] Fetch", evt.request.url);
  if (evt.request.mode !== "navigate") {
    return;
  }
  // 오프라인 페이지 열기
  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.open(CACHE_NAME).then(cache => {
        return cache.match("offline.html");
      });
    })
  );
});
