import { useState } from "react";
import Layout from "../components/Layout";
import ReportTabs from "../components/reports/ReportTabs";
import ManualReportTabs from "../components/reports/ManualReportTabs";
import AutomatedReports from "../components/reports/AutomatedReports";
import CalendarFilter from "../components/CalendarFilter";



export default function Reports() {
  const [activeTab, setActiveTab] = useState("manual");

  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-5">
        <h1 className="page-title">Reports and Analytics</h1>
        <p className="text-gray-600">
          Generate comprehensive business reports with enhanced analytics
        </p>
      </div>

      {/* Report Tabs */}
      <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* DISPLAY AREA */}
      <div className="mt-6 ">
        {/* MANUAL REPORTS */}
        {activeTab === "manual" && (
          <ManualReportTabs />
        )}

        {/* AUTOMATED REPORTS */}
        {activeTab === "automated" && (
          <AutomatedReports />
        )}
      </div>
    </Layout>
  );
}
