export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { text = "", user_name = "" } = req.body;

  // Immediately respond to Slack to avoid timeout
  res.status(200).send(`✅ Triggered ToolJet with name: "${text}" by @${user_name}`);

  // Fire ToolJet webhook in background
  try {
    await fetch('https://v3-lts-eetestsystem.tooljet.com/api/v2/webhooks/workflows/d25e2426-2e8c-4547-8802-1a2ad793840d/trigger?environment=development', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer a1ea08fa-c4f0-4d9b-8a08-543300054da1'
      },
      body: JSON.stringify({ name: text })
    });
  } catch (err) {
    console.error("ToolJet trigger failed:", err);
  }
}
