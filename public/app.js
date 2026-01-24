let platform = "";
let service = "";
const cooldowns = {};

async function verifyKey() {
  const input = document.getElementById("hotkey");
  const error = document.getElementById("gateError");
  const btn = document.getElementById("unlockBtn");

  error.innerText = "";
  btn.innerText = "Checking...";
  btn.disabled = true;

  const res = await fetch("/api/verify-key", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: input.value.trim() })
  });

  if (res.ok) {
    document.getElementById("gate").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("gate").style.display = "none";
    }, 300);
  } else {
    error.innerText = "❌ Access Denied";
    btn.innerText = "Unlock Access";
    btn.disabled = false;
    input.value = "";
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
    alert(
      platform === "tiktok"
        ? "TikTok server ratelimit"
        : "Insta server ratelimit"
    );
    return;
  }

  cooldowns[key] = now;
  service = s;
  document.getElementById("servicePopup").classList.add("hidden");
  document.getElementById("linkPopup").classList.remove("hidden");
}

async function submitOrder() {
  const link = document.getElementById("linkInput").value.trim();
  if (!link) return;

  document.getElementById("linkPopup").classList.add("hidden");

  await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform, service, link })
  });

  alert("Order placed successfully");
}
