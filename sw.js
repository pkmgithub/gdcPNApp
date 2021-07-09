/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, serviceworker, es6 */

'use strict';

var parentClientId ;


self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});



self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const data = event.data.json();
  const title = data["title"];

  const options = {
    body: 'message from Backend',
    icon: '/images/icon.png',
    badge: '/images/badge.png',
    vibrate: [100, 50, 100],
  };
  options.body = data["body"]

  event.waitUntil(self.registration.showNotification(title, options));

    // Send a message to the client.
    parentClientId.postMessage({
      msg: "Hey I just got a NOTIFCATIONO ALERT  from you!",
      url:"seems to work"
    });

});





/*
self.addEventListener('push', function(event) {
  event.waitUntil(
    self.clients.matchAll().then(function(clientList) {
      var focused = clientList.some(function(client) {
        return client.focused;
      });

      var notificationMessage;
      if (focused) {
        notificationMessage = 'You\'re still here, thanks!';
      } else if (clientList.length > 0) {
        notificationMessage = 'You haven\'t closed the page, ' +
                              'click here to focus it!';
      } else {
        notificationMessage = 'You have closed the page, ' +
                              'click here to re-open it!';
      }
      return self.registration.showNotification('ServiceWorker Cookbook', {
        body: notificationMessage,
      });
    })
  );
});
*/


self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});

self.addEventListener("message", function (event) {
  event.source.postMessage("Responding to " + event.data);
});

self.addEventListener('fetch', event => {
  event.waitUntil(async function() {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!event.clientId) return;

    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;

    parentClientId = client;

    // Send a message to the client.
    client.postMessage({
      msg: "Hey I just got a fetch from you!",
      url: event.request.url
    });

  }());
});

