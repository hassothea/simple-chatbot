// Predefined conversation. Edit freely.
// Each rule: `match` (regex, case-insensitive) and `replies` (array of possible answers).
// Each answer is an array of short messages, sent one after another like texting.
module.exports = {
  persona: "Mia",
  greeting: ["hey! 👋", "I'm Mia. what can I help you with today?"],
  fileReplies: {
    text: (name, snippet) => [
      `got your file, ${name}`,
      snippet ? `it starts with: "${snippet}"` : "it looks empty though",
      "want me to go through it with you?",
    ],
    image: (name) => [`nice, I can see you sent ${name} 📷`, "what would you like to know about it?"],
    other: (name) => [`thanks, I received ${name}`, "tell me what you'd like to do with it"],
  },
  rules: [
    { match: /\b(hi|hello|hey|yo|good (morning|afternoon|evening))\b/,
      replies: [["hey there 🙂", "how's your day going?"], ["hi!", "good to see you. what's up?"]] },
    { match: /how are you|how's it going|how r u/,
      replies: [["doing good, thanks for asking", "how about you?"]] },
    { match: /\b(price|pricing|cost|plan|plans)\b/,
      replies: [["happy to explain pricing", "we have a free plan and a paid plan", "which one are you leaning toward?"]] },
    { match: /\b(help|support|problem|issue|broken|error)\b/,
      replies: [["sorry you're running into that 😕", "can you tell me what happened, step by step?"]] },
    { match: /\b(hours|open|opening|close|closing)\b/,
      replies: [["we're open Monday to Friday, 9am to 6pm", "anything else you'd like to know?"]] },
    { match: /\b(contact|email|phone|call)\b/,
      replies: [["you can reach the team at hello@example.com", "they usually reply within a day"]] },
    { match: /\b(thanks|thank you|thx|ty)\b/,
      replies: [["anytime!", "ping me if you need anything else 😊"]] },
    { match: /\b(bye|goodbye|see you|cya)\b/,
      replies: [["bye for now 👋", "take care!"]] },
  ],
  fallback: [
    ["hmm, I'm not sure I got that", "could you say it another way?"],
    ["good question", "can you give me a bit more detail?"],
  ],
};
