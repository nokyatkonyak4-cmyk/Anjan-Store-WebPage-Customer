import fetch from "node-fetch";
async function run() {
  const res = await fetch("http://localhost:3000/api/send-notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fcmToken: "fake_token" })
  });
  console.log(await res.text());
}
run();
