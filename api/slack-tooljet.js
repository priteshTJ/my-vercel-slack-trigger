export default async function handler(req, res) {
  // Log the incoming request body to debug what Slack sends
  console.log("Slack Request Body:", req.body);

  // Send an immediate, simple acknowledgment
  try {
    return res.status(200).json({
      response_type: "ephemeral", // Start with ephemeral for testing, less intrusive
      text: "Vercel received your command!",
    });
  } catch (error) {
    console.error("Error sending initial Slack response:", error);
    // Fallback: If even the JSON response fails, try plain text (less ideal for Slack)
    res.status(500).send("Error processing command.");
  }
}
