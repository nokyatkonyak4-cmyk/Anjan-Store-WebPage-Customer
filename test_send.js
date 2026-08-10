import fetch from "node-fetch";

async function run() {
  const res = await fetch("http://localhost:3000/api/send-notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fcmToken: "c_vM3Q9gQfK8jPZp9Uq6Yt:APA91bF... fake token",
      title: "Test Notification",
      body: "This is a test from Express"
    })
  });
  console.log(res.status, await res.text());
}
run();
