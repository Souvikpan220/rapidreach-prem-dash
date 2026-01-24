let platform = "";
let service = "";
const cooldowns = {};

async function verifyKey() {
  const input = document.getElementById("hotkey");
  const error = document.getElementById("gateError");

  error.innerText = "Checking...";

  try {
    const res = await fetch("/api/verify-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: input.value.trim() })
    });

    if (res.ok) {
      document.getElementById("gate").style.display = "none";
    } else {
      error.innerText = "Access Denied";
    }
  } catch (e) {
    console.error(e);
    error.innerText = "Server error";
  }
}


function openPlatform(p) {
  platform = p;
  document.getElementById("serviceTitle").innerText =
    p === "tiktok" ? "TikTok Services" : "Instagram Services";
  document.getElementById("servicePopup").classList.remove("hidden");
}

function selectService(s) {
  const key = platform + s;
  const now = Date.now();
  const limit =
    platform === "instagram" && s === "likes" ? 20 : 10;

  if (cooldowns[key] && now - cooldowns[key] < limit * 60000) {
    alert(platform === "tiktok"
      ? "TikTok server ratelimit"
      : "Insta server ratelimit");
    return;
  }

  cooldowns[key] = now;
  service = s;
  closePopup("servicePopup");

  document.getElementById("linkTitle").innerText =
    `Submit ${platform} ${s} link`;
  document.getElementById("linkPopup").classList.remove("hidden");
}

function closePopup(id) {
  document.getElementById(id).classList.add("hidden");
}

async function submitOrder() {
  const link = document.getElementById("linkInput").value.trim();
  if (!link) return;

  const now = Date.now();
  const key = `cooldown_${platform}_${service}`;

  // cooldown minutes
  let limit = 10;
  if (platform === "instagram" && service === "likes") {
    limit = 20;
  }

  const lastUsed = localStorage.getItem(key);

  if (lastUsed && now - lastUsed < limit * 60000) {
    alert(
      platform === "tiktok"
        ? "TikTok server ratelimit"
        : "Insta server ratelimit"
    );
    return;
  }

  // save cooldown ONLY on submit
  localStorage.setItem(key, now);

  closePopup("linkPopup");

  await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform, service, link })
  });

  alert("Order placed successfully");
}

  alert("Order placed successfully");
}


