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

    if (res.ok) {
      document.getElementById("gate").style.display = "none";
    } else {
      error.innerText = "Access Denied";
      input.value = "";
    }
  } catch (err) {
    console.error(err);
    error.innerText = "Server error";
  }
}
