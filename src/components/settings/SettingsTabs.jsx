import { Shield, Bell, Database } from "lucide-react";
import Tabs from "../../components/Tabs";
import Security from "../../components/settings/Security";
import Alerts from "../../components/settings/Alerts";
import Backup from "../../components/settings/Backup";


export default function ManualReportTabs() {
  const tabsData = [
    { id: "security", label: "Security", icon: Shield, content: <Security /> },
    { id: "alerts", label: "Alerts", icon: Bell, content: <Alerts /> },
    { id: "backup", label: "Backup", icon: Database, content: <Backup /> },
    
  ];

  return <Tabs tabs={tabsData} initialTab="security" />;
}
