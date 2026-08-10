import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Firebase Admin
  if (!getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.VITE_FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.VITE_FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

    if (privateKey && clientEmail && projectId) {
      initializeApp({
        credential: cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      console.log("Firebase Admin initialized successfully.");
    } else {
      console.warn("Firebase Admin credentials not found. Push notifications via API will fail.");
    }
  }

  // API routes FIRST
  app.post("/api/send-notification", async (req, res) => {
    // Add CORS headers so the Store Manager app can call this API from a different domain
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    try {
      const { fcmToken, title, body, data } = req.body;

      if (!fcmToken) {
        return res.status(400).json({ error: 'Missing fcmToken' });
      }

      const payload = {
        token: fcmToken,
        notification: {
          title: title || 'Anjan Store Update',
          body: body || 'You have a new update regarding your order.',
        },
        data: data || {},
      };

      if (!getApps().length) {
        return res.status(500).json({ error: 'Firebase Admin not initialized. Check ENV vars.' });
      }

      const response = await getMessaging().send(payload);
      return res.status(200).json({ success: true, response });
    } catch (error: any) {
      console.error('Error sending push notification:', error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
