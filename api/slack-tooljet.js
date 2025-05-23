module.exports = async function handler(req, res) {
  // Immediately respond to Slack
  res.status(200).send("✅ Processing your request...");

  try {
    const { text } = req.body || {};
    const payload = {
      name: text || "No name",
    };

    // Trigger ToolJet workflow in the background
    const response = await fetch("https://v3-lts-eetestsystem.tooljet.com/api/v2/webhooks/workflows/d25e2426-2e8c-4547-8802-1a2ad793840d/trigger?environment=development", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer a1ea08fa-c4f0-4d9b-8a08-543300054da1",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ToolJet trigger failed:", errorText);
    }
  } catch (err) {
    console.error("ToolJet trigger failed:", err.message);
  }
};
