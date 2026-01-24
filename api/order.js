export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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

  try {
    const response = await fetch("https://falconsmmpanel.com/api/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key: process.env.FALCONSMM_API_KEY,
        action: "add",
        service: svc.id,
        link: link,
        quantity: svc.qty
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("FalconsMM API error:", data);
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json({
      success: true,
      order: data.order
    });
  } catch (err) {
    console.error("Order API failed:", err);
    return res.status(500).json({ error: "API request failed" });
  }
}
