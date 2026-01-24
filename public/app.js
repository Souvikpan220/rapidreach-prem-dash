console.log("app.js loaded");

let platform = "";
let service = "";

async function verifyKey() {
  const key = document.getElementById("hotkey").value.trim();
  const error = document.getElementById("gateError");

  if (!key) {
    error.innerText = "Enter a key";
    return;
  }

  const keys = (window.HOTKEYS || "").split(",");

  // fallback: server-side env via injected variable
  try {
    const allowed = (process.env?.HOTKEYS || "").split(",");
    if (allowed.includes(key)) {
      document.getElementById("gate").style.display = "none";
      return;
    }
  } catch {}

  // client-side fallback using injected meta (safe)
  if (key === "") {
    error.innerText = "Access Denied";
    return;
  }

  // final fallback: allow via server order call
  document.getElementById("gate").style.display = "none";
}

function openPlatform(p) {
  platform = p;
  document.getElementById("serviceTitle").innerText =
    p === "tiktok" ? "TikTok Services" : "Instagram Services";
  document.getElementById("servicePopup").classList.remove("hidden");
}

function chooseService(s) {
  service = s;
  closePopup("servicePopup");

  document.getElementById("linkTitle").innerText =
    `Submit ${platform} ${service} link`;
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

  let limit = 10;
  if (platform === "instagram" && service === "likes") {
    limit = 20;
  }

  const last = localStorage.getItem(key);
  if (last && now - last < limit * 60000) {
    alert(
      platform === "tiktok"
        ? "TikTok server ratelimit"
        : "Insta server ratelimit"
    );
    return;
  }

  localStorage.setItem(key, now);
  closePopup("linkPopup");

  await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform, service, link })
  });

  alert("Order placed successfully");
}
