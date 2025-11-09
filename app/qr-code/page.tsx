import QRCode from "react-qr-code";

export default function QRCodePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Scan to Connect with Mohamed Ibrahim
      </h1>
      <QRCode
        value="https://moe-portfolio.vercel.app/contact-card"
        size={256}
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
}
