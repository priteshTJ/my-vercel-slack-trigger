// api/slack-tooljet.js

export default async function handler(req, res) {
  // 1. Acknowledge Slack right away
  res.status(200).send("🛠️ ToolJet workflow is being triggered...");

  // 2. Continue in the background
  try {
    const { text } = req.body || {};
    const payload = {
      name: text || "No name",
    };

    await fetch("https://v3-lts-eetestsystem.tooljet.com/api/v2/webhooks/workflows/d25e2426-2e8c-4547-8802-1a2ad793840d/trigger?environment=development", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer a1ea08fa-c4f0-4d9b-8a08-543300054da1",
      },
      body: JSON.stringify(payload),
    });

    // Optional: Log or send delayed message to Slack webhook
  } catch (err) {
    console.error("Background trigger failed:", err);
  }
}
