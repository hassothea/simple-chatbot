const log = document.getElementById("log");
const form = document.getElementById("form");
const text = document.getElementById("text");
const fileInput = document.getElementById("file");
const chip = document.getElementById("chip");
const chipName = document.getElementById("chipName");
const history = [];
let pending = null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const scroll = () => (log.scrollTop = log.scrollHeight);

function bubble(who, str, extra = "") {
  const d = document.createElement("div");
  d.className = `msg ${who} ${extra}`;
  d.textContent = str;
  log.appendChild(d);
  scroll();
}

function typing() {
  const d = document.createElement("div");
  d.className = "msg them typing";
  d.innerHTML = "<i></i><i></i><i></i>";
  log.appendChild(d);
  scroll();
  return d;
}

// Send each reply as its own bubble, with a typing pause based on length.
async function sayAll(parts) {
  for (const p of parts) {
    const t = typing();
    await sleep(Math.min(400 + p.length * 35, 2200));
    t.remove();
    bubble("them", p);
  }
  history.push({ role: "assistant", content: parts.join("\n") });
}

async function send(message, file) {
  const t0 = typing();
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, file, history }),
    });
    const data = await res.json();
    t0.remove();
    await sayAll(data.messages);
  } catch {
    t0.remove();
    await sayAll(["oops, my connection dropped", "try again in a sec?"]);
  }
}

fileInput.addEventListener("change", async () => {
  const f = fileInput.files[0];
  if (!f) return;
  if (f.size > 2 * 1024 * 1024) { alert("Please choose a file under 2 MB."); fileInput.value = ""; return; }
  pending = { name: f.name, type: f.type, size: f.size };
  if (f.type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(f.name)) {
    pending.snippet = (await f.text()).slice(0, 2000).trim();
  }
  chipName.textContent = f.name;
  chip.hidden = false;
});

document.getElementById("chipX").onclick = () => { pending = null; fileInput.value = ""; chip.hidden = true; };

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = text.value.trim();
  if (!message && !pending) return;
  const file = pending;
  text.value = "";
  pending = null; fileInput.value = ""; chip.hidden = true;
  if (file) bubble("me", `📎 ${file.name}`, "file");
  if (message) bubble("me", message);
  history.push({ role: "user", content: message || `[sent file ${file.name}]` });
  await send(message, file);
});

(async () => {
  await sayAll(["hey! 👋", "I'm Mia. what can I help you with today?"]);
})();
