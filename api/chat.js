const convo = require("../conversation");

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function ruleReply(message, file) {
  if (file) {
    if (file.snippet !== undefined) return convo.fileReplies.text(file.name, file.snippet);
    if ((file.type || "").startsWith("image/")) return convo.fileReplies.image(file.name);
    return convo.fileReplies.other(file.name);
  }
  for (const r of convo.rules) {
    if (r.match.test(message)) return pick(r.replies);
  }
  return pick(convo.fallback);
}

// Optional: set ANTHROPIC_API_KEY in Vercel to get AI replies instead of rules.
async function aiReply(history, message, file) {
  const content = file
    ? `${message || ""}\n[Attached file: ${file.name}${file.snippet ? `\nContent:\n${file.snippet}` : ""}]`
    : message;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.MODEL || "claude-sonnet-5-5",
      max_tokens: 400,
      system: `You are ${convo.persona}, texting a friend. Write short, casual, warm messages. Separate each text bubble with a line containing only ---. Max 3 bubbles, no markdown.`,
      messages: [...history.slice(-10), { role: "user", content }],
    }),
  });
  if (!res.ok) throw new Error("AI request failed");
  const data = await res.json();
  const text = data.content.map((b) => b.text || "").join("");
  return text.split(/\n-{3,}\n/).map((s) => s.trim()).filter(Boolean);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { message = "", file = null, history = [] } = req.body || {};
  let messages;
  try {
    messages = process.env.ANTHROPIC_API_KEY
      ? await aiReply(history, message, file)
      : ruleReply(message, file);
  } catch {
    messages = ruleReply(message, file);
  }
  res.status(200).json({ messages });
};
