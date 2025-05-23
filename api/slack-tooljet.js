export default async function handler(req, res) {
  const { text, user_name, response_url } = req.body || {};

  // 1. Send the immediate acknowledgment to Slack first.
  // This tells Slack the command was received and prevents timeouts.
  try {
    res.status(200).json({
      response_type: "in_channel", // Or "ephemeral"
      text: "⏳ Triggering ToolJet workflow...",
    });
  } catch (initialResponseError) {
    // Log if the initial response itself fails, but don't block the ToolJet call
    console.error("Error sending initial Slack acknowledgment:", initialResponseError);
  }

  // 2. IMPORTANT: Do NOT await the ToolJet fetch in the main function flow.
  // Run it as an independent async operation that doesn't block the main response.
  // Vercel will attempt to keep the function alive briefly for such operations,
  // but there's no guarantee for very long tasks.
  (async () => {
    try {
      const payload = {
        name: text || "No name",
      };

      const tooljetResponse = await fetch("https://v3-lts-eetestsystem.com/api/v2/webhooks/workflows/d25e2426-2e8c-4547-8802-1a2ad793840d/trigger?environment=development", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer a1ea08fa-c4f0-4d9b-8a08-543300054da1",
        },
        body: JSON.stringify(payload),
      });

      let followUpMessageText;
      let followUpMessageType = "in_channel";

      if (!tooljetResponse.ok) {
        const errorText = await tooljetResponse.text();
        console.error(`ToolJet trigger failed: ${errorText}`);
        followUpMessageText = `❌ ToolJet workflow failed: ${errorText}`;
        followUpMessageType = "ephemeral"; // Send errors ephemeral to the user
      } else {
        followUpMessageText = "✅ ToolJet workflow completed!";
      }

      // 3. Send a follow-up message to Slack using the response_url
      if (response_url) {
        await fetch(response_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            response_type: followUpMessageType,
            text: followUpMessageText,
          }),
        });
      } else {
          console.warn("response_url not available, cannot send follow-up message.");
      }

    } catch (err) {
      console.error("Error in background ToolJet trigger process:", err);
      // Attempt to send a follow-up error message if response_url is available
      if (response_url) {
        await fetch(response_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            response_type: "ephemeral",
            text: `⚠️ An unexpected error occurred during ToolJet trigger: ${err.message}`,
          }),
        });
      }
    }
  })();
  // No explicit 'return' needed at the end of the handler, as the response is already sent.
}
