import { FileText, Bot } from "lucide-react";

export default function ReportTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-evenly items-center gap-2 p-2 w-full bg-lightGray rounded-full ">
      {/* Manual Reports */}
      <button
        onClick={() => setActiveTab("manual")}
        className={`flex items-center justify-center w-full gap-2 px-6 py-2 md:py-2 lg:py-2 rounded-full border transition
          ${activeTab === "manual"
            ? "bg-darkGreen text-white border-darkGreen shadow-md"
            : "bg-softWhite text-gray-700 border-gray-300 hover:bg-gray-100"
          }
        `}
      >
        <FileText size={20} />
        <span className="text-sm">Manual Reports</span>
      </button>

      {/* Automated Reports */}
      <button
        onClick={() => setActiveTab("automated")}
        className={`flex items-center justify-center w-full gap-2 px-6 py-2 md:py-2 lg:py-2 rounded-full border transition
          ${activeTab === "automated"
            ? "bg-navyBlue text-white  border-navyBlue shadow-md"
            : "bg-softWhite text-gray-700 border-gray-300 hover:bg-gray-100"
          }
        `}
      >
        <Bot size={20} />
        <span className="text-sm">Automated Reports</span>
      </button>
    </div>
  );
}
