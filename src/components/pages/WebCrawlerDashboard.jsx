import React from "react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { Download, ArrowRight, Loader2, Globe, PieChart, FileText, Home, BarChart3, ChevronDown, X, Search, ExternalLink, Moon, Sun, Clock, Trash2, Eye, Calendar, Menu } from "lucide-react";
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import CrawlReportPDF from './CrawlReportPDF';
import { useEffect } from "react";
import jsPDF from "jspdf";
import Login from "./Login";
import Signup from "./Signup";
import { useAuth0 } from "@auth0/auth0-react";



// Sample data for demonstration
// const sampleData = {
//   url: "https://example.com",
//   totalLinks: 24,
//   totalHits: 156,
//   mostVisitedLink: "https://example.com/products",
//   mostVisitedHits: 42,
//   statusCodes: {
//     "200": 18,
//     "301": 4,
//     "404": 2
//   },
//   links: [
//     { url: "https://example.com/products", hits: 42, status: 200 },
//     { url: "https://example.com/about", hits: 38, status: 200 },
//     { url: "https://example.com/contact", hits: 27, status: 200 },
//     { url: "https://example.com/blog", hits: 21, status: 200 },
//     { url: "https://example.com/services", hits: 18, status: 200 },
//     { url: "https://example.com/faq", hits: 10, status: 200 }
//   ]
// };

// // Sample history data
// const sampleHistory = [
//   {
//     id: 1,
//     url: "https://example.com",
//     timestamp: "2024-01-15T10:30:00Z",
//     totalLinks: 24,
//     totalHits: 156,
//     status: "completed",
//     duration: "2m 34s"
//   },
//   {
//     id: 2,
//     url: "https://another-site.com",
//     timestamp: "2024-01-14T15:45:00Z",
//     totalLinks: 18,
//     totalHits: 89,
//     status: "completed",
//     duration: "1m 52s"
//   },
//   {
//     id: 3,
//     url: "https://demo-website.org",
//     timestamp: "2024-01-13T09:15:00Z",
//     totalLinks: 31,
//     totalHits: 203,
//     status: "completed",
//     duration: "3m 12s"
//   },
//   {
//     id: 4,
//     url: "https://test-site.net",
//     timestamp: "2024-01-12T14:20:00Z",
//     totalLinks: 12,
//     totalHits: 67,
//     status: "failed",
//     duration: "0m 45s"
//   }
// ];

// Colors
const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"];

export default function WebCrawlerDashboard() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [history, setHistory] = useState([]);
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [reportText, setReportText] = useState("");
  const [isCrawling, setIsCrawling] = useState(false); // controls which button is shown
  const [crawlStopped, setCrawlStopped] = useState(false); // hides both after stop
  const [linkMap, setLinkMap] = useState({});
  const [expandedURL, setExpandedURL] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleSubmit = async () => {
    if (!url) return;
    setIsCrawling(true);
    setCrawlStopped(false);
    setIsLoading(true);
    setProgress(0);
    setData(null);

    const startTime = Date.now();
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 400);

    try {
      const response = await fetch("http://localhost:5000/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseURL: url }),
      });

      const result = await response.json();
      clearInterval(interval);
      setProgress(100);
      setIsLoading(false);

      const links = Object.entries(result.crawled || {}).map(([linkUrl, hits]) => ({
        url: linkUrl,
        hits,
        status: 200,
      }));

      const mostVisited = links.reduce((max, link) =>
        link.hits > max.hits ? link : max,
        links[0] || { url, hits: 0 }
      );

      const crawlData = {
        url,
        totalLinks: links.length,
        totalHits: links.reduce((sum, l) => sum + l.hits, 0),
        mostVisitedLink: mostVisited.url,
        mostVisitedHits: mostVisited.hits,
        statusCodes: { 200: links.length },
        links,
      };

      setData(crawlData);
      setIsCrawling(false);

      setLinkMap(prev => ({
        ...prev,
        [url]: crawlData.links
      }));
      // const report = Object.entries(result.crawled || {})
      //   .map(([url, hits]) => `URL: ${url} , Hits: ${hits}`)
      //   .join('\n');

      // console.log("📄 FINAL REPORT\n" + report);

      // setReportText(report);
      const endTime = Date.now();
      const durationMs = endTime - startTime;

      function formatDuration(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor(ms / 1000 / 60);
        return `${minutes}m ${seconds}s`;
      }

      const newHistoryItem = {
        id: Date.now(),
        url,
        timestamp: new Date().toISOString(),
        totalLinks: crawlData.totalLinks,
        totalHits: crawlData.totalHits,
        status: "completed",
        duration: formatDuration(durationMs)
      };


      setHistory(prev => [newHistoryItem, ...prev]);
      setExpandedURL(null);

    } catch (err) {
      clearInterval(interval);
      setIsLoading(false);
      console.error("Crawl error:", err);
      alert("Crawling failed: " + err.message);
    }

  };




  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/report");
        const result = await response.json();

        const formatted = result.map(item => ({
          id: Date.now() + Math.random(),
          url: item.baseURL,
          timestamp: item.timestamp || new Date().toISOString(),
          totalLinks: item.totalLinks,
          totalHits: item.totalHits,
          status: "completed",
          duration: item.duration || "-"
        }));

        // Also build the linkMap from MongoDB response
        const newMap = {};
        result.forEach(item => {
          if (item.baseURL && item.links && item.links.length > 0) {
            newMap[item.baseURL] = item.links;
          }
        });

        setHistory(formatted);
        setLinkMap(newMap); // 👈 ensures click works after reload


        setHistory(formatted);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);
  const handleGenerateReport = () => {
    alert("Report generation started! This would download a PDF or CSV in a real application.");
  };

  const handleDeleteHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleViewHistory = (historyItem) => {

    setCurrentPage("dashboard");
  };

  const filteredLinks = data?.links.filter(link =>
    link.url.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredHistory = history.filter(item =>
    item.url.toLowerCase().includes(historySearchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString() + " " + new Date(timestamp).toLocaleTimeString();
  };


  const handleCancel = async () => {
    await fetch("http://localhost:5000/api/cancel", {
      method: "POST"
    });

    setIsCrawling(false);
    setCrawlStopped(true);
  };

  const handleDeleteAllHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all history?")) return;

    try {
      await fetch("http://localhost:5000/api/history", {
        method: "DELETE",
      });

      setHistory([]); // Clear UI
    } catch (err) {
      alert("Failed to delete history");
      console.error(err);
    }
  };

  const generateReport = async (type = "csv") => {
    if (!data || !data.links || data.links.length === 0) {
      alert("No crawl data to export.");
      return;
    }

    if (type === "csv") {
      // Keep your existing CSV logic
      const headers = ["URL", "Hits", "Status"];
      const rows = data.links.map(link => [link.url, link.hits, link.status]);

      let csvContent = [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "crawl-report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (type === "pdf") {
      // New creative PDF generation
      try {
        const pdfBlob = await pdf(<CrawlReportPDF data={data} />).toBlob();
        const url = URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `crawl-report-${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF report.");
      }
    }
  };

  // Theme colors
  const themeClass = darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900";
  const cardClass = darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200";
  const buttonClass = "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700";
  const inputClass = darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300";

  const renderDashboard = () => (
    <>
    
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Web Crawler & Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">Analyze website structure and discover insights from link data</p>
      </div>

      {/* URL Input Card */}
      <div className={`${cardClass} rounded-xl shadow-lg mb-8 overflow-hidden`}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Start Crawling</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Globe className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} size={18} />
                </div>
                <input
                  type="url"
                  placeholder="Enter a website URL (e.g. https://example.com)"
                  className={`w-full pl-10 p-3 rounded-lg border ${inputClass} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter a complete URL including http:// or https://
              </p>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (!crawlStopped && (
                !isCrawling ? (
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Start Crawl
                  </button>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                  >
                    Stop Crawl
                  </button>
                )
              )) : (
                <h1>Please <button className="text-blue-400" onClick={(e) => loginWithRedirect()}>LOGIN</button> to Start Crawling ☺️</h1>
              )}


            </div>
          </div>
        </div>

        {/* Progress Bar (shown during loading) */}
        {isLoading && (
          <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Crawling in progress...</h3>
              <span className="text-sm font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {progress < 30 ? "Discovering links..." :
                progress < 60 ? "Analyzing content..." :
                  progress < 90 ? "Processing data..." :
                    "Finalizing results..."}
            </p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {data && (
        <>
          {/* Summary Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Crawl Results</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Analysis for <span className="font-medium text-blue-500">{data.url}</span>
                </p>
              </div>
              {reportText && (
                <pre className="bg-gray-900 text-green-400 p-4 mt-4 rounded">
                  {reportText}
                </pre>
              )}

              {data && data.links.length > 0 && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => generateReport("csv")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Download CSV
                  </button>
                  <button
                    onClick={() => generateReport("pdf")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Download PDF
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${cardClass} p-6 rounded-xl shadow-lg relative overflow-hidden group`}>
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent transform transition-transform duration-300 group-hover:translate-x-2"></div>
              <h3 className="text-sm font-semibold mb-1 text-gray-500 dark:text-gray-400">Total Links</h3>
              <p className="text-4xl font-bold">{data.totalLinks}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Globe className="mr-2 text-blue-500" size={16} />
                <span>Discovered URLs</span>
              </div>
            </div>

            <div className={`${cardClass} p-6 rounded-xl shadow-lg relative overflow-hidden group`}>
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent transform transition-transform duration-300 group-hover:translate-x-2"></div>
              <h3 className="text-sm font-semibold mb-1 text-gray-500 dark:text-gray-400">Total Hits</h3>
              <p className="text-4xl font-bold">{data.totalHits}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <BarChart3 className="mr-2 text-indigo-500" size={16} />
                <span>Link references</span>
              </div>
            </div>

            <div className={`${cardClass} p-6 rounded-xl shadow-lg relative overflow-hidden group`}>
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-500/10 to-transparent transform transition-transform duration-300 group-hover:translate-x-2"></div>
              <h3 className="text-sm font-semibold mb-1 text-gray-500 dark:text-gray-400">Most Visited</h3>
              <p className="text-sm font-medium truncate text-blue-500">{data.mostVisitedLink}</p>
              <p className="text-3xl font-bold">{data.mostVisitedHits} hits</p>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <PieChart className="mr-2 text-purple-500" size={16} />
                <span>{Math.round((data.mostVisitedHits / data.totalHits) * 100)}% of total traffic</span>
              </div>
            </div>
          </div>

          {/* Charts and Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Bar Chart */}
            <div className={`${cardClass} p-6 rounded-xl shadow-lg lg:col-span-2`}>
              <h3 className="text-lg font-semibold mb-6">Link Hits Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.links.map(link => ({
                      name: link.url.replace(/^https?:\/\//, '').replace(/^www\./, ''),
                      hits: link.hits
                    }))}
                    margin={{ top: 5, right: 20, bottom: 50, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis
                      dataKey="name"
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                      tick={{ fill: darkMode ? "#9ca3af" : "#4b5563" }}
                      tickLine={{ stroke: darkMode ? "#6b7280" : "#9ca3af" }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                      tick={{ fill: darkMode ? "#9ca3af" : "#4b5563" }}
                      tickLine={{ stroke: darkMode ? "#6b7280" : "#9ca3af" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                        color: darkMode ? "#f3f4f6" : "#1f2937",
                        border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb"
                      }}
                    />
                    <Bar
                      dataKey="hits"
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className={`${cardClass} p-6 rounded-xl shadow-lg`}>
              <h3 className="text-lg font-semibold mb-6">Status Code Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={Object.entries(data.statusCodes).map(([code, count], index) => ({
                        name: `HTTP ${code}`,
                        value: count
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {Object.entries(data.statusCodes).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                        color: darkMode ? "#f3f4f6" : "#1f2937",
                        border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb"
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {Object.entries(data.statusCodes).map(([code, count], index) => (
                  <div key={code} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs">HTTP {code}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={`${cardClass} rounded-xl shadow-lg overflow-hidden`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-lg font-semibold">Discovered Links</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search URLs..."
                    className={`pl-10 p-2 text-sm rounded-lg border ${inputClass} w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto" style={{ maxHeight: "400px" }}>
              <table className="w-full text-left">
                <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} text-xs uppercase sticky top-0`}>
                  <tr>
                    <th className="px-6 py-3 font-medium">URL</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Hits</th>
                    <th className="px-6 py-3 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLinks.map((link, index) => (
                    <tr
                      key={index}
                      className={`hover:${darkMode ? "bg-gray-700" : "bg-gray-50"} transition-colors`}
                    >
                      <td className="px-6 py-4 truncate max-w-xs">
                        <div className="flex items-center">
                          <span>{link.url}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${link.status === 200 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                          link.status === 301 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}>
                          HTTP {link.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{link.hits}</td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredLinks.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No matching links found</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredLinks.length} of {data.links.length} links
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderHistory = () => (
    <>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crawl History</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage your previous crawling sessions</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded w-64"
        />
        <button
          onClick={handleDeleteAllHistory}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete All History
        </button>
      </div>


      {/* History Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${cardClass} p-6 rounded-xl shadow-lg`}>
          <h3 className="text-sm font-semibold mb-1 text-gray-500 dark:text-gray-400">Total Sessions</h3>
          <p className="text-3xl font-bold">{history.length}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="mr-2 text-blue-500" size={16} />
            <span>All time</span>
          </div>
        </div>

        <div className={`${cardClass} p-6 rounded-xl shadow-lg`}>
          <h3 className="text-sm font-semibold mb-1 text-gray-500 dark:text-gray-400">Successful</h3>
          <p className="text-3xl font-bold text-green-500">{history.filter(h => h.status === 'completed').length}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>{Math.round((history.filter(h => h.status === 'completed').length / history.length) * 100)}% success rate</span>
          </div>
        </div>

        <div className={`${cardClass} p-6 rounded-xl shadow-lg`}>
          <h3 className="text-sm font-semibold mb-1 text-gray-500 dark:text-gray-400">Failed</h3>
          <p className="text-3xl font-bold text-red-500">{history.filter(h => h.status === 'failed').length}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Needs attention</span>
          </div>
        </div>

        <div className={`${cardClass} p-6 rounded-xl shadow-lg`}>
          <h3 className="text-sm font-semibold mb-1 text-gray-500 dark:text-gray-400">Total Links</h3>
          <p className="text-3xl font-bold">{history.reduce((sum, h) => sum + h.totalLinks, 0)}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Links discovered</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className={`${cardClass} rounded-xl shadow-lg overflow-hidden`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold">Crawl Sessions</h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} size={16} />
              </div>
              <input
                type="text"
                placeholder="Search URLs..."
                className={`pl-10 p-2 text-sm rounded-lg border ${inputClass} w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} text-xs uppercase`}>
              <tr>
                <th className="px-6 py-3 font-medium">URL</th>
                <th className="px-6 py-3 font-medium">Date & Time</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-center">Links</th>
                <th className="px-6 py-3 font-medium text-center">Hits</th>
                <th className="px-6 py-3 font-medium text-center">Duration</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredHistory.map(item => (
                <React.Fragment key={item.id}>
                  <tr
                    className={`hover:${darkMode ? "bg-gray-700" : "bg-gray-50"} transition-colors cursor-pointer`}
                    onClick={() => setExpandedURL(expandedURL === item.url ? null : item.url)}
                  >
                    <td className="px-6 py-4 truncate max-w-xs font-medium text-blue-600">
                      {item.url}
                    </td>
                    <td className="px-6 py-4">{formatDate(item.timestamp)}</td>
                    <td className="px-6 py-4 text-center">{item.status}</td>
                    <td className="px-6 py-4 text-center">{item.totalLinks}</td>
                    <td className="px-6 py-4 text-center">{item.totalHits}</td>
                    <td className="px-6 py-4 text-center">{item.duration || "-"}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row toggle
                          handleDeleteHistory(item.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="Delete session"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>

                  {expandedURL === item.url && linkMap[item.url] && (
                    <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                      <td colSpan="7" className="px-6 py-4">
                        <h4 className="text-sm font-semibold text-blue-500 mb-2">Discovered Links</h4>
                        <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700 dark:text-gray-200 max-h-40 overflow-y-auto">
                          {linkMap[item.url].map((link, index) => (
                            <li key={index}>
                              🔗 {link.url} — Hits: {link.hits}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))}
            </tbody>

          </table>

          {filteredHistory.length === 0 && (
            <div className="py-12 text-center">
              <Clock className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No crawl history found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {historySearchTerm ? "Try adjusting your search terms" : "Start crawling websites to see your history here"}
              </p>
            </div>
          )}
        </div>

        {filteredHistory.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredHistory.length} of {history.length} sessions
          </div>
        )}
      </div>
    </>
  );
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  console.log("Current User", user);

  return (
    <div className={`min-h-screen ${themeClass} transition-colors duration-200`}>
      {/* Navigation Bar */}
      <nav className={`${darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-white border-b border-gray-200"} sticky top-0 z-10`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Globe className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Web-Crawler</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setCurrentPage("dashboard")}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentPage === "dashboard" ? "text-blue-500" : "hover:text-blue-500"}`}
              >
                <Home size={16} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentPage("history")}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentPage === "history" ? "text-blue-500" : "hover:text-blue-500"}`}
              >
                <Clock size={16} />
                <span>History</span>
              </button>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated && (
                <span className="text-sm font-medium px-3 py-1 rounded-full dark:bg-gray-700">
                  Hello, <span className="text-blue-500 font-semibold">{user.name}</span>
                </span>
              )}
              {isAuthenticated ? (
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg" onClick={() => logout()}>LogOut</button>
              ) : (
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg" onClick={() => loginWithRedirect()}>LogIn/SignUp</button>
              )}
              <button
                className={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                className={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                className={`p-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className={`md:hidden mt-4 pb-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex flex-col space-y-4 pt-4">
                {/* Navigation Links */}
                <button
                  onClick={() => {
                    setCurrentPage("dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 text-left px-3 py-2 rounded-lg transition-colors ${currentPage === "dashboard"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : `hover:${darkMode ? "bg-gray-700" : "bg-gray-100"}`
                    }`}
                >
                  <Home size={18} />
                  <span className="font-medium">Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentPage("history");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 text-left px-3 py-2 rounded-lg transition-colors ${currentPage === "history"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : `hover:${darkMode ? "bg-gray-700" : "bg-gray-100"}`
                    }`}
                >
                  <Clock size={18} />
                  <span className="font-medium">History</span>
                </button>

                {/* User Info & Auth */}
                <div className={`pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  {isAuthenticated && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Hello, <span className="text-blue-500 font-semibold">{user.name}</span>
                      </span>
                    </div>
                  )}

                  {isAuthenticated ? (
                    <button
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      LogOut
                    </button>
                  ) : (
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                      onClick={() => {
                        loginWithRedirect();
                        setMobileMenuOpen(false);
                      }}
                    >
                      LogIn/SignUp
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {currentPage === "login" ? (
          <Login onSwitchPage={setCurrentPage} darkMode={darkMode} />
        ) : currentPage === "signup" ? (
          <Signup onSwitchPage={setCurrentPage} darkMode={darkMode} />
        ) : currentPage === "dashboard" ? (
          renderDashboard()
        ) : (
          renderHistory()
        )}
      </main>


      <footer className={`${darkMode ? "bg-gray-800 border-t border-gray-700" : "bg-gray-50 border-t border-gray-200"} py-8 mt-12`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1 rounded">
                <Globe className="text-white" size={16} />
              </div>
              <span className="font-medium">Web-Crawler</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Get in touch:</span>
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:tiwarivishwanath5395@gmail.com"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${darkMode
                    ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                    : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm font-medium">Email</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/vishwanath-tiwari-779528287/"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${darkMode
                    ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                    : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>

                <a
                  href="https://github.com/Vishwa5395"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${darkMode
                    ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                    : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Web-Crawler. Built with React & Tailwind CSS.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                Made with ❤️ for web analysis and SEO insights
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}