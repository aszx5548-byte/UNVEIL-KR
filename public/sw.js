/* UNVEIL 통합 사이트 서비스워커 — 사주 / 별자리 / 탄생석 3개 앱을 하나의 스코프로 관리합니다. */
var CACHE_NAME = 'unveil-web-v3';
var ASSETS = [
  '/',
  '/index.html',
  '/saju/',
  '/saju/index.html',
  '/zodiac/',
  '/zodiac/index.html',
  '/birthstone/',
  '/birthstone/index.html',
  '/birthstone/html2canvas.min.js',
  '/manifest.json',
  '/saju/manifest.json',
  '/favicon.svg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      // 개별 파일이 하나라도 실패하면 설치 전체가 실패하므로 각각 처리합니다.
      return Promise.all(ASSETS.map(function(url){
        return cache.add(url).catch(function(){});
      }));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Network-first: 온라인이면 항상 최신 버전을 보여주고, 네트워크가 없을 때만 캐시로 대체합니다.
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  if(new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(function(response){
      // 정상 응답만 캐시합니다. 404·500 을 캐시하면 네트워크가 끊겼을 때
      // 그 오류 페이지가 그대로 다시 나옵니다.
      if(response && response.ok && response.type === 'basic'){
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(e.request, copy); });
      }
      return response;
    }).catch(function(){
      return caches.match(e.request).then(function(hit){
        if(hit) return hit;
        // 페이지 이동일 때만 홈으로 대체합니다.
        // 이미지나 스크립트 요청에 HTML 을 돌려주면 오히려 오류가 납니다.
        if(e.request.mode === 'navigate') return caches.match('/index.html');
        return Response.error();
      });
    })
  );
});
