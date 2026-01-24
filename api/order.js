export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { platform, service, link } = req.body;

  const map = {
    tiktok: {
      views: { id: 2409, qty: 800 },
      likes: { id: 2328, qty: 50 }
    },
    instagram: {
      views: { id: 2508, qty: 900 },
      likes: { id: 2806, qty: 50 }
    }
  };

  const svc = map?.[platform]?.[service];
  if (!svc) {
    return res.status(400).json({ error: "Invalid service" });
  }

  // 🔥 FORM-ENCODED BODY (THIS IS THE FIX)
  const params = new URLSearchParams();
  params.append("key", process.env.FALCONSMM_API_KEY);
  params.append("action", "add");
  params.append("service", svc.id);
  params.append("link", link);
  params.append("quantity", svc.qty);

  try {
    const response = await fetch("https://falconsmmpanel.com/api/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const text = await response.text();

    // Log raw response for debugging
    console.log("FalconsMM raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "Invalid response from FalconsMM",
        raw: text
      });
    }

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json({
      success: true,
      order: data.order
    });
  } catch (err) {
    console.error("FalconsMM request failed:", err);
    return res.status(500).json({ error: "Request failed" });
  }
}
