# Roblox Status Checker (มือถือ + คอม)

เว็บไซต์ธีมดำ-แดงสำหรับค้นหาด้วย Roblox User ID และเรียก Roblox Presence API ผ่านเซิร์ฟเวอร์ Node.js

## ทดลองบนคอม Windows
1. ติดตั้ง Node.js รุ่น LTS หากยังไม่มี
2. แตก ZIP นี้
3. เปิดโฟลเดอร์ `roblox-status-checker-online`
4. คลิกแถบที่อยู่ของ File Explorer พิมพ์ `cmd` แล้วกด Enter
5. รัน:
   ```bash
   npm install
   npm start
   ```
6. เปิด `http://localhost:3000`

## นำขึ้นออนไลน์ฟรีด้วย Render
1. สร้างบัญชี GitHub และ Render (ต้องทำเองในบัญชีของคุณ)
2. สร้าง GitHub repository ใหม่ แล้วอัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้
3. เข้า Render Dashboard แล้วเลือก **New + → Blueprint**
4. เชื่อม repository ที่อัปโหลดไว้ แล้วเลือกไฟล์ `render.yaml`
5. กดสร้าง/Deploy service และรอจนเสร็จ
6. เปิด URL `https://ชื่อบริการ.onrender.com` ที่ Render แสดงให้ ทั้งมือถือและคอมเข้าได้

## หมายเหตุ
- ฉันไม่สามารถสร้างบัญชี GitHub/Render หรือเผยแพร่เว็บเข้า account ของคุณแทนได้จากที่นี่ จึงยังไม่มี public URL จริงจนกว่าคุณจะ Deploy ตามขั้นตอน
- แผนฟรีอาจพักเว็บเมื่อไม่มีการใช้งาน และใช้เวลาปลุกกลับมา
- สถานะมาจาก Roblox Presence API และอาจไม่แสดงตัวตนออนไลน์ได้อย่างสมบูรณ์ หากผู้ใช้จำกัดความเป็นส่วนตัว หรือ Roblox เปลี่ยนข้อกำหนด API
- เว็บไซต์นี้ไม่ใช่เว็บไซต์ทางการของ Roblox
