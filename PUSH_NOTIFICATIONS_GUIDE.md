# Setting up Automated Push Notifications

To get real OS-level push notifications working when you update an order, you need to configure your VAPID key and deploy a background script to Firebase.

## Part 1: Configure the VAPID Key (Web Push Certificate)
This allows your customers' browsers to securely receive messages.

1. Go to your [Firebase Console](https://console.firebase.google.com/) and open your **anjan-store-f3931** project.
2. Click the **Gear Icon** (⚙️) next to "Project Overview" in the top left and select **Project settings**.
3. Go to the **Cloud Messaging** tab.
4. Scroll down to the **Web configuration** section and click **Generate Key Pair**.
5. Copy the string of characters it generates.
6. Come back to **AI Studio**, click the **Settings menu** (the gear icon in the top right corner).
7. Go to **Environment Variables**.
8. Add a new variable:
   - Name: `VITE_FIREBASE_VAPID_KEY`
   - Value: *(paste your copied key here)*

---

## Part 2: Automate Notifications with Cloud Functions
Because this is a serverless application, you need to tell Firebase to run a background script whenever an order changes to push the notification. You will do this from your computer's terminal.

### 1. Set up Firebase Functions locally
Open your terminal (Command Prompt / Terminal) on your computer and run:
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```
- Select your project: `anjan-store-f3931`
- Language: **JavaScript**
- ESLint: **No**
- Install dependencies: **Yes**

### 2. Add the Notification Script
Open the new `functions/index.js` file that was created on your computer and replace everything inside it with this code:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendOrderUpdateNotification = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Only run if the status actually changed
    if (newValue.status === previousValue.status) return null;

    // Get the customer ID
    const customerId = newValue.customerId;

    // 1. Fetch the user's FCM Token from the 'users' collection
    const userDoc = await admin.firestore().collection("users").doc(customerId).get();
    if (!userDoc.exists) return console.log("User not found");
    
    const fcmToken = userDoc.data().fcmToken;
    if (!fcmToken) return console.log("No FCM token for user, cannot send push");

    // 2. Format the message based on the status
    let message = `Your order status is now: ${newValue.status}`;
    if (newValue.status === "Bill Sent") message = "Your final bill is ready. Please confirm your order.";
    if (newValue.status === "Out for Delivery") message = `Your order is out for delivery! PIN: ${newValue.deliveryOtp || ''}`;
    if (newValue.status === "Delivered") message = "Your order has been delivered. Thank you!";

    // 3. Create the Push Notification payload
    const payload = {
      token: fcmToken,
      notification: {
        title: "Anjan Store Order Update",
        body: message,
      },
      data: {
        orderId: context.params.orderId,
        click_action: "OPEN_ORDER"
      }
    };

    // 4. Send the notification via Firebase Cloud Messaging
    try {
      await admin.messaging().send(payload);
      console.log("Notification sent successfully to", customerId);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  });
```

### 3. Deploy the Function to Firebase
Back in your terminal, deploy the script to Google's servers:
```bash
firebase deploy --only functions
```

### You're Done!
Now, whenever your Store Manager dashboard updates an order to "Out for Delivery" or "Bill Sent", Firebase's servers will automatically see that change, look up the customer's `fcmToken`, and beam a push notification to their phone or desktop!
