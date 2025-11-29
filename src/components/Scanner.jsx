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
                // You can handle scanned code here
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
      {/* Define custom animation styles. 
        This moves the line from top to bottom and back.
      */}
      <style>{`
        @keyframes scanner-line {
          0% { top: 0; box-shadow: 0 0 4px rgba(239,68,68,0.8); }
          50% { top: 100%; box-shadow: 0 0 4px rgba(239,68,68,0.8); }
          100% { top: 0; box-shadow: 0 0 4px rgba(239,68,68,0.8); }
        }
        .animate-scanner-line {
          animation: scanner-line 2.5s linear infinite;
        }
      `}</style>

      {/* Button to open scanner */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-softWhite text-deepBlue p-3 rounded-lg border border-gray-300 hover:shadow-sm transition flex items-center justify-center"
      >
        <Scan size={20} />
      </button>

      {/* Scanner modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-charcoalBlack/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-4 relative space-y-3 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-gray-700">
                <Scan size={20} />
                <h2 className="font-semibold">Scan Barcode</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Scanner Container */}
            <div className="relative flex flex-col items-center justify-center h-64 bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover opacity-80"
                muted
                autoPlay
              />

              {/* --- Visual Guides --- */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* 1. The Focus Rectangle (added overflow-hidden) */}
                <div className="w-64 h-32 border-2 border-green-400 rounded-lg relative shadow-[0_0_0_1000px_rgba(0,0,0,0.5)] overflow-hidden">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1"></div>

                  {/* 2. Moving Red Laser Line */}
                  <div className="absolute left-0 w-full h-[2px] bg-red-500 animate-scanner-line"></div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-2 text-center font-medium">
              Align barcode within the frame
            </p>
          </div>
        </div>
      )}
    </div>
  );
}