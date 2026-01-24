let platform = "";
let service = "";
const cooldowns = {};

function openPlatform(p) {
  platform = p;
  document.getElementById("platformTitle").innerText =
    p === "tiktok" ? "TikTok Services" : "Instagram Services";
  document.getElementById("servicePopup").classList.remove("hidden");
}

function chooseService(s) {
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
  closePopup("servicePopup");
  document.getElementById("linkPopup").classList.remove("hidden");
}

function closePopup(id) {
  document.getElementById(id).classList.add("hidden");
}

async function submitOrder() {
  const link = document.getElementById("linkInput").value.trim();
  if (!link) return;

  closePopup("linkPopup");

  await fetch("/api/order-v2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform, service, link })
  });

  alert("Order placed successfully");
}
