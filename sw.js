// 서비스 워커: 앱 화면(껍데기)만 캐시해서 오프라인에서도 앱이 열리게 합니다.
// MQTT(WebSocket)와 카메라 영상은 캐시하지 않고 항상 실시간으로 받습니다.
// 파일을 수정해서 다시 배포할 때는 아래 버전 숫자를 올려야 폰이 새 파일을 받습니다.
const CACHE = "fire-robot-v1";
const SHELL = [
  "./",
  "./index.html",
  "./mqtt.min.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // 같은 출처의 GET 요청만 처리 (카메라 주소, 브로커 등 다른 출처는 건드리지 않음)
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // 화면 이동 요청: 네트워크 우선, 실패하면 캐시된 화면
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }
  // 나머지(스크립트, 아이콘 등): 캐시 우선
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }))
  );
});
