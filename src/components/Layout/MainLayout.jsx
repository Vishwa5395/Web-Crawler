// src/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
// import Navbar from "../pages/navbar.jsx";
// import Apps from '../pages/core.jsx';
// import CrawlForm from '../pages/crawlForm.jsx'
// import CrawlProgress from '../pages/crawlProgress.jsx'
// import SummaryCards from '../pages/summary.jsx'
// import LinksList from '../pages/linksList.jsx'
// import LinkChart from '../pages/chart.jsx'
// import ReportSection from '../pages/report.jsx'
import WebCrawlerDashboard from "../pages/WebCrawlerDashboard";

const MainLayout = () => {
  return (
    <>
      <WebCrawlerDashboard/>
      <main className="p-0">
        <Outlet /> {/* Where nested routes will be rendered */}
      </main>
    </>
  );
};

export default MainLayout;
