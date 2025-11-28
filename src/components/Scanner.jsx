import { useState, useRef, useEffect } from "react";
import { X, Scan } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function Scanner() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        const firstDeviceId = videoInputDevices[0]?.deviceId;

        if (videoRef.current && firstDeviceId) {
          codeReader.current.decodeFromVideoDevice(
            firstDeviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                console.log("Scanned code:", result.getText());
                // You can handle scanned code here (e.g., add product to cart)
              }
              if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err);
              }
            }
          );
        }
      })
      .catch(console.error);

    return () => {
      codeReader.current?.reset();
    };
  }, [isOpen]);

  return (
    <div>
      {/* Button to open scanner */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-softWhite text-deepBlue p-3 rounded-lg border border-gray-300 hover:shadow-sm transition flex items-center justify-center"
      >
        <Scan size={20} />
      </button>

      {/* Scanner modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-charcoalBlack/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-4 relative space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-gray-700">
                <Scan size={20} />
                <h2>Barcode Scanner</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Scanner */}
            <div className="flex flex-col items-center justify-center h-42 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                autoPlay
              />
            </div>

            <p className="text-sm text-gray-400 mt-2 text-center">
              Place barcode in the scanner area.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
