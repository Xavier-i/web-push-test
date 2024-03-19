const publicVapidKey = 'BCoPJ1OgDyyKcIeY4kVJoEwnFNifZtzv4Fwr4Ev2-SP4MRoWrRNzVwWW3TWtKPDttTlV10oJ1LnDdi_uwQL9QrE';

// Utility function to convert the VAPID key to a Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4); // Ensure proper padding
    const base64 = (base64String + padding)
        .replace(/\-/g, '+') // Convert '-' to '+'
        .replace(/_/g, '/'); // Convert '_' to '/'

    const rawData = window.atob(base64); // Decode base64 string
    const outputArray = new Uint8Array(rawData.length); // Create a new Uint8Array based on the decoded string

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i); // Convert each character to its ASCII value
    }
    return outputArray;
}

//Check for service worker
// if ('serviceWorker' in navigator) {
//     send().catch(error => console.error(error));
// }

//Function to register service worker and subscribe to push
async function registerServiceWorkerAndSubscribe() {
    // Register Service Worker
    console.log('Registering service worker...');
    const register = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
    });
    console.log('Service Worker Registered...');

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;
    console.log('Service Worker is ready.');

    // Subscribe to Push
    subscribeUserToPush(register);
}

async function subscribeUserToPush(register) {
    try {
        console.log('Registering Push...');
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
        console.log('Push Registered...');

        // Send Push Notification
        console.log('Sending Push...');
        await fetch('http://localhost:3000/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });
        console.log('Push Sent...');
    } catch (error) {
        console.error('Error subscribing to push', error);
    }
}

document.getElementById('subscribe').addEventListener('click', () => {
    registerServiceWorkerAndSubscribe().catch(error => console.error('Error with service worker registration', error));
});
