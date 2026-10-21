// Digital Media Task Scheduler - offline support, sync library cache and notification clicks
const C='dmts-v5';
const A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable.png','./apple-touch-icon.png','./favicon.png','./logo.svg'];
const LIB=/^https:\/\/(cdn\.jsdelivr\.net\/npm\/firebase@|cdnjs\.cloudflare\.com\/ajax\/libs\/qrcodejs\/)/;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=r.url;
  if(LIB.test(u)){e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res})));return}
  if(new URL(u).origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match('./index.html'))))});
self.addEventListener('notificationclick',e=>{e.notification.close();const id=e.notification.tag;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c){c.postMessage({open:id});return c.focus()}}return clients.openWindow('./?task='+encodeURIComponent(id))}))});
