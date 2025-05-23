module.exports = async function handler(req, res) {

res.status(200).json({
      response_type: "in_channel", // or "ephemeral"
      text: "✅ ToolJet workflow triggered successfully!",
    });
  
  try {
    const { text, user_name } = req.body || {};
    const payload = {
      name: text || "No name",
    };

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
      throw new Error(`ToolJet trigger failed: ${errorText}`);
    }

    return res.status(200).send("✅ ToolJet workflow triggered successfully!");
  } catch (err) {
    console.error("ToolJet trigger failed:", err);
    return res.status(500).send(`❌ Failed to trigger ToolJet workflow: ${err.message}`);
  }
};
