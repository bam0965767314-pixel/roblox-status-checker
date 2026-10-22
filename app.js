const form = document.querySelector("#check-form");
const input = document.querySelector("#user-id");
const button = document.querySelector("#check-button");
const message = document.querySelector("#message");
const result = document.querySelector("#result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userId = input.value.trim();

  if (!/^\d+$/.test(userId) || BigInt(userId) <= 0n) {
    result.classList.add("hidden");
    message.textContent = "กรุณาใส่ User ID เป็นตัวเลขเท่านั้น";
    return;
  }

  button.disabled = true;
  button.textContent = "กำลังตรวจสอบ…";
  message.textContent = "กำลังติดต่อ Roblox…";
  result.classList.add("hidden");

  try {
    const response = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "เกิดข้อผิดพลาด");

    document.querySelector("#display-name").textContent = data.displayName || data.username;
    document.querySelector("#username").textContent = "@" + data.username;
    document.querySelector("#user-id-label").textContent = "User ID: " + data.userId;
    document.querySelector("#avatar-letter").textContent = (data.displayName || data.username || "R").slice(0, 1).toUpperCase();

    const dot = document.querySelector("#status-dot");
    dot.className = "status-dot " + (data.online ? "online" : "offline");
    document.querySelector("#status-text").textContent = data.online ? "ONLINE" : "OFFLINE";
    const detail = {
      0: "ผู้เล่นแสดงสถานะออฟไลน์",
      1: "ผู้เล่นออนไลน์บน Roblox",
      2: "ผู้เล่นกำลังอยู่ในเกม",
      3: "ผู้เล่นกำลังใช้ Roblox Studio",
      4: "Roblox ส่งสถานะ Invisible"
    };
    document.querySelector("#status-detail").textContent =
      detail[data.presenceType] || "สถานะที่ Roblox ส่งกลับมา";
    document.querySelector("#profile-link").href = data.profileUrl;
    document.querySelector("#checked-at").textContent =
      "ตรวจสอบล่าสุด: " + new Date(data.checkedAt).toLocaleString("th-TH");
    message.textContent = "ตรวจสอบสำเร็จ";
    result.classList.remove("hidden");
  } catch (error) {
    message.textContent = error.message || "ตรวจสอบไม่สำเร็จ กรุณาลองใหม่";
  } finally {
    button.disabled = false;
    button.textContent = "ตรวจสอบ";
  }
});
