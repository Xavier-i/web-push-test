const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3000;

// VAPID keys
const publicVapidKey = 'BCoPJ1OgDyyKcIeY4kVJoEwnFNifZtzv4Fwr4Ev2-SP4MRoWrRNzVwWW3TWtKPDttTlV10oJ1LnDdi_uwQL9QrE';
const privateVapidKey = '2NLvXfdnG5yCQUK2hFDC7PF9ap6lQhPDy5Nn7hOYJPs';

webPush.setVapidDetails('mailto:example@yourdomain.org', publicVapidKey, privateVapidKey);

// Store the push subscription object
let pushSubscription;

// Subscribe Route
app.post('/subscribe', (req, res) => {
  pushSubscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: "Subscription successful!" });
  console.log("Register subscribe")
  webPush.sendNotification(pushSubscription, payload).catch(error => console.error(error));
});

// Function to send the notification
const sendNotification = () => {
  const payload = JSON.stringify({ title: "Notification from Node Server" });
  console.log("push")
  webPush.sendNotification(pushSubscription, payload)
    .catch(error => console.error(error));
};

// Send a notification every 30 seconds
setInterval(sendNotification, 30000);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
