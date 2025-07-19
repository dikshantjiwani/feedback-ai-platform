import {QRCode} from "react-qrcode";

export default function QRCodeDisplay({ url }) {
  return (
    <div className="flex flex-col items-center mt-2">
      <QRCode value={url} size={128} />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline mt-2"
      >
        Open Link
      </a>
    </div>
  );
}

