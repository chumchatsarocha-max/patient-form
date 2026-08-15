import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * เปิดให้เครื่องอื่นในวงแลนเข้าทดสอบ dev server ได้
   *
   * Next 16 บล็อก request ที่มายัง /_next/* จาก origin อื่นนอกจาก localhost เป็นค่าเริ่มต้น
   * เปิดผ่าน IP แล้ว JS chunk บางตัวจะได้ 503 → โค้ดฝั่ง client โหลดไม่ครบ
   * อาการที่เห็นคือหน้าฟอร์มค้างที่ "กำลังเชื่อมต่อ" และ session ไม่โผล่ในหน้าเจ้าหน้าที่
   *
   * ครอบคลุมทั้ง 192.168.x.x และ 10.x.x.x เผื่อ subnet เปลี่ยนตอนย้ายเราเตอร์
   * มีผลเฉพาะ `next dev` — production ไม่ได้ใช้ค่านี้
   */
  allowedDevOrigins: ["192.168.1.*", "192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
