export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // Respond to Slack immediately
  res.status(200).send("✅ ToolJet workflow is being triggered...");

  // Continue in background
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

  } catch (err) {
    console.error("⚠️ ToolJet trigger failed:", err);
    // You could also log this to a Slack webhook or notify somewhere
  }
}
