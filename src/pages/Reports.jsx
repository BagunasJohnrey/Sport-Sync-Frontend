import Layout from "../components/Layout";
import ExportButton from "../components/ExportButton";


export default function Reports() {
  return (
    <Layout>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title">
            Reports and Analytics
          </h1>
          <p className="text-gray-600">
            Generate comprehensive business reports with enhanced analytics
          </p>
        </div>
        <div className="p-6">
          <ExportButton />
        </div>
        
      </div>
    </Layout>
  );
}