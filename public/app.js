console.log("app.js loaded");

let platform = "";
let service = "";

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

    function openPlatform(p) {
  // store selected platform
  platform = p;

  // set popup title
  const title = document.getElementById("serviceTitle");
  if (title) {
    title.innerText =
      p === "tiktok" ? "TikTok Services" : "Instagram Services";
  }

  // open service popup
  const popup = document.getElementById("servicePopup");
  if (popup) {
    popup.classList.remove("hidden");
  }
}


    if (res.ok) {
       document.getElementById("gate").classList.add("hidden");
      const gate = document.getElementById("gate");
gate.classList.add("hidden");
gate.style.pointerEvents = "none";
    } else {
      error.innerText = "Access Denied";
      input.value = "";
    }
  } catch (err) {
    console.error(err);
    error.innerText = "Server error";
  }
}




