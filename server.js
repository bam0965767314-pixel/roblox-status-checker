const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(express.static(__dirname)));

app.post("/api/check", async (req, res) => {
  const rawId = String(req.body?.userId ?? "").trim();

  // Roblox User IDs are numeric. Keep input validation on the server too.
  if (!/^\d{1,20}$/.test(rawId) || BigInt(rawId) <= 0n) {
    return res.status(400).json({
      error: "กรุณาใส่ Roblox User ID เป็นตัวเลขที่ถูกต้อง"
    });
  }

  const userId = Number(rawId);
  if (!Number.isSafeInteger(userId)) {
    return res.status(400).json({ error: "User ID นี้ยาวเกินกว่าที่ระบบรองรับ" });
  }

  try {
    // Check that this user ID exists and get their public profile name.
    const userResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    if (userResponse.status === 404) {
      return res.status(404).json({ error: "ไม่พบ Roblox User ID นี้" });
    }
    if (!userResponse.ok) {
      throw new Error(`Roblox user API returned ${userResponse.status}`);
    }
    const user = await userResponse.json();

    // Presence API is a POST endpoint. Call it from the server to avoid browser CORS issues.
    const presenceResponse = await fetch("https://presence.roblox.com/v1/presence/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ userIds: [userId] })
    });

    if (!presenceResponse.ok) {
      throw new Error(`Roblox presence API returned ${presenceResponse.status}`);
    }

    const presenceData = await presenceResponse.json();
    const presence = presenceData.userPresences?.[0];
    if (!presence) {
      throw new Error("Roblox did not return a presence record");
    }

    // 0 = offline; 1 = online; 2 = in an experience; 3 = in Studio.
    const presenceType = Number(presence.userPresenceType);
    const online = presenceType !== 0;

    const statusLabels = {
      0: "OFFLINE",
      1: "ONLINE",
      2: "IN GAME",
      3: "IN STUDIO",
      4: "INVISIBLE"
    };

    res.json({
      userId,
      username: user.name,
      displayName: user.displayName,
      profileUrl: `https://www.roblox.com/users/${userId}/profile`,
      online,
      presenceType,
      status: statusLabels[presenceType] || (online ? "ONLINE" : "OFFLINE"),
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Presence check failed:", error.message);
    res.status(502).json({
      error: "ตรวจสอบ Roblox ไม่สำเร็จในตอนนี้ กรุณาลองใหม่อีกครั้ง"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Roblox Status Checker running at http://localhost:${PORT}`);
});
