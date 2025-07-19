import QRCode from "qrcode.react";

export default function QRCodeDisplay({ url }) {
  return (
    <div className="flex flex-col items-center mt-2">
      <QRCode value={url} size={128} />
      <a href={url} target="_blank" className="text-blue-600 underline mt-2">Open Link</a>
    </div>
  );
}
