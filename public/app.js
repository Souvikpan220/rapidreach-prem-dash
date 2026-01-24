let platform = "";
let service = "";
const cooldowns = {};

async function verifyKey() {
  const key = document.getElementById("hotkey").value;
  const res = await fetch("/config/hotkeys.json");
  const data = await res.json();

  if (data.keys.includes(key)) {
    document.getElementById("gate").style.display = "none";
  } else {
    document.getElementById("gateError").innerText = "Access Denied";
  }
}

function openPlatform(p) {
  platform = p;
  document.getElementById("platformTitle").innerText = p.toUpperCase();
  document.getElementById("servicePopup").classList.remove("hidden");
}

function selectService(s) {
  const key = platform + s;
  const now = Date.now();

  const limit =
    platform === "instagram" && s === "likes" ? 20 : 10;

  if (cooldowns[key] && now - cooldowns[key] < limit * 60000) {
    alert(platform === "tiktok" ? "TikTok server ratelimit" : "Insta server ratelimit");
    return;
  }

  cooldowns[key] = now;
  service = s;
  document.getElementById("servicePopup").classList.add("hidden");
  document.getElementById("linkPopup").classList.remove("hidden");
}

async function submitOrder() {
  const link = document.getElementById("linkInput").value;
  document.getElementById("linkPopup").classList.add("hidden");

  await fetch("/api/order", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ platform, service, link })
  });

  alert("Order placed successfully");
}
