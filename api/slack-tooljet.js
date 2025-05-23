export default async function handler(req, res) {
  // Extract response_url and other data from Slack's request body
  const { text, user_name, response_url } = req.body || {};

  // 1. Immediately send an ephemeral (or in_channel) acknowledgment
  // This tells Slack you've received the command and are working on it.
  res.status(200).json({
    response_type: "ephemeral", // or "in_channel"
    text: "⏳ Your request is being processed...",
  });

  // 2. Perform the potentially long-running operation asynchronously
  // DO NOT `await` this part if you want the first response to go out immediately.
  // The 'await' here will still block the current function execution,
  // making the initial response send after the fetch is complete.
  // To truly make it async AFTER the first response, you'd typically
  // put the fetch in a separate process or use a messaging queue.
  // However, for Vercel, simply placing it after the `res.json` is sufficient
  // as Vercel will continue execution in the background after the response is sent.

  (async () => { // Use an IIFE or separate async function to run this part in the background
    try {
      const payload = {
        name: text || "No name",
      };

      const tooljetResponse = await fetch("https://v3-lts-eetestsystem.tooljet.com/api/v2/webhooks/workflows/d25e2426-2e8c-4547-8802-1a2ad793840d/trigger?environment=development", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer a1ea08fa-c4f0-4d9b-8a08-543300054da1",
        },
        body: JSON.stringify(payload),
      });

      let followUpMessageText;
      let followUpMessageType = "in_channel"; // Or "ephemeral"

      if (!tooljetResponse.ok) {
        const errorText = await tooljetResponse.text();
        console.error(`ToolJet trigger failed: ${errorText}`);
        followUpMessageText = `❌ ToolJet workflow failed: ${errorText}`;
        followUpMessageType = "ephemeral";
      } else {
        followUpMessageText = "✅ ToolJet workflow completed successfully!";
      }

      // 3. Send a follow-up message to the response_url
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
      }

    } catch (err) {
      console.error("Error in background ToolJet trigger:", err);
      // In case of an unexpected error, try to send a follow-up error message
      if (response_url) {
        await fetch(response_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            response_type: "ephemeral",
            text: `⚠️ An unexpected error occurred: ${err.message}`,
          }),
        });
      }
    }
  })();
  // No return needed here as the first res.json already sent the response
  // and the rest runs asynchronously.
}
