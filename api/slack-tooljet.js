import querystring from "querystring";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const params = querystring.parse(body);
      const name = params.text || "";
      const user = params.user_name || "unknown";

      // Respond to Slack immediately
      res
        .status(200)
        .setHeader("Content-Type", "text/plain")
        .send(`✅ ToolJet workflow triggered with name: "${name}" by @${user}`);

      // Trigger ToolJet in background
      const payload = { name };

      try {
        await fetch("https://v3-lts-eetestsystem.tooljet.com/api/v2/webhooks/workflows/d25e2426-2e8c-4547-8802-1a2ad793840d/trigger?environment=development", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer a1ea08fa-c4f0-4d9b-8a08-543300054da1",
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error("❌ Failed to trigger ToolJet:", error);
      }
    });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    res.status(500).send("Internal Server Error");
  }
}
