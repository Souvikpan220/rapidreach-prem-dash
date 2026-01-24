console.log("app.js loaded");

let platform = "";
let service = "";

/* ================= LOGIN ================= */

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
      const gate = document.getElementById("gate");
      gate.classList.add("hidden");
      gate.style.pointerEvents = "none";

      const main = document.getElementById("mainContent");
      main.classList.remove("hidden");
    } else {
      error.innerText = "Access Denied";
      input.value = "";
    }
  } catch (err) {
    console.error(err);
    error.innerText = "Server error";
  }
}

/* ================= PLATFORM BUTTONS ================= */

function openPlatform(p) {
  platform = p;

  const title = document.getElementById("serviceTitle");
  title.innerText =
    p === "tiktok" ? "TikTok Services" : "Instagram Services";

  document.getElementById("servicePopup").classList.remove("hidden");
}

/* ================= SERVICE ================= */

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

/* ================= SUBMIT ================= */

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
