export default async function handler(req, res) {
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

  const svc = map[platform][service];

  await fetch("https://falconsmm.com/api/v2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: process.env.FALCONSMM_API_KEY,
      action: "add",
      service: svc.id,
      link,
      quantity: svc.qty
    })
  });

  res.status(200).end();
}
