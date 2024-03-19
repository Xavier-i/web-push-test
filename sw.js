// self.addEventListener('push', event => {
//     const data = event.data.json();
//     console.log('Push Received...');
//     self.registration.showNotification(data.title, {
//         body: 'Notified by your Node Server',
//         icon: 'http://image.ibb.co/frYOFd/tmlogo.png'
//     });
// });

self.addEventListener("push", (event) => {
    try {
      const payload = event.data?.json();
      console.log('Push Received!!', payload);
      if (!payload) return;
      event.waitUntil(
        self.registration.showNotification(payload.title, {
          body: payload.body,
        })
      );
    } catch (e) {
      console.error("[SW] Error handling push event", e);
    }
  });