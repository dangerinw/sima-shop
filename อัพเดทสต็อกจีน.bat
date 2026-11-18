@echo off
chcp 65001 > nul
echo =======================================================
echo  🇨🇳 PUBG SIAM - ระบบซิงก์สต็อกคลังจีนอัตโนมัติ
echo =======================================================
echo.
echo กำลังดึงข้อมูลไอดีจากร้านจีนทั้ง 3 ร้าน (XMGG, XF, XueGaoKK)...
echo คัดไอดีราคาต่ำกว่า 500 บาทออกทั้งหมด...
echo.

node scripts/syncChinaStock.js --all

if %errorlevel% neq 0 (
    echo.
    echo ❌ เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาตรวจสอบอินเทอร์เน็ต
    pause
    exit /b %errorlevel%
)

echo.
echo 🚀 กำลังอัปเดตไฟล์ขึ้นระบบและ Deploy บน Vercel...
git add new-react-app/public/data/china_stock.json
git commit -m "chore(stock): manual sync China inventory"
git push origin main

echo.
echo =======================================================
echo  ✅ ซิงก์สต็อกและส่งขึ้นเว็บเรียบร้อยแล้ว!
echo  🌐 เว็บไซต์: https://siamshop-th.vercel.app/
echo =======================================================
echo.
pause
