// api/slack-tooljet.js (Ultra-minimal test for immediate response)
export default async function handler(req, res) {
  console.log("Received Slack request."); // This confirms it's hit
  return res.status(200).json({
    response_type: "ephemeral",
    text: "Direct ACK!",
  });
}
