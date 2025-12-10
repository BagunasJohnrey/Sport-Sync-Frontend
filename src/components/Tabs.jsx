import { useState, useRef, useEffect } from "react";

export default function Tabs({ tabs, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id);
  const [indicatorStyles, setIndicatorStyles] = useState({ width: 0, left: 0 });
  const tabRefs = useRef([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const currentTab = tabRefs.current[activeIndex];
    if (currentTab) {
      const { offsetWidth, offsetLeft } = currentTab;
      setIndicatorStyles({ width: offsetWidth, left: offsetLeft });
    }
  }, [activeTab, tabs]);

  return (
    <div>
      {/* Tabs Header */}
      <div className="relative flex items-center justify-evenly bg-softWhite border border-gray-300 shadow-md rounded-xl gap-3 px-5 py-1 mb-6 border-b overflow-x-auto hide-scrollbar">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => setActiveTab(tab.id)}
            // FIX: Added whitespace-nowrap and flex-shrink-0
            className="relative flex items-center gap-2 px-4 py-2 rounded-t-lg transition text-gray-600 hover:text-darkGreen whitespace-nowrap flex-shrink-0"
          >
            {tab.icon && <tab.icon size={18} />}
            <span className="text-sm lg:text-md xl:text-lg">{tab.label}</span>
          </button>
        ))}

        {/* Active Tab Indicator */}
        <span
          className="absolute bottom-0 h-1 bg-darkGreen rounded-t-full transition-all duration-300"
          style={{
            width: indicatorStyles.width,
            left: indicatorStyles.left,
          }}
        />
      </div>

      {/* Tabs Content */}
      <div>
        {tabs.map((tab) => activeTab === tab.id && <div key={tab.id}>{tab.content}</div>)}
      </div>
    </div>
  );
}