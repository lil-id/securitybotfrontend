import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AlertsSummary() {
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate("/dashboard");
    };

    useEffect(() => {
        document.title = "Summary - Wazuh Alerts";
    }, []);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem("authToken");

                if (!token) {
                    navigate("/");
                    return;
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/wazuh/alerts/summary`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const alerts = response.data;

                const ipCounts = alerts.reduce((acc, alert) => {
                    if (!acc[alert.src_ip]) {
                        acc[alert.src_ip] = {
                            count: 0,
                            agent: alert.agent,
                            level: alert.level,
                        };
                    }
                    acc[alert.src_ip].count += 1;
                    acc[alert.src_ip].level = Math.max(
                        acc[alert.src_ip].level,
                        alert.level
                    );
                    return acc;
                }, {});

                const sortedEntries = Object.entries(ipCounts).sort(
                    (a, b) => b[1].level - a[1].level || b[1].count - a[1].count
                );
                setSummaryData(sortedEntries);
            } catch (error) {
                console.error("Error fetching summary data:", error);
                setError("Failed to load summary data.");
            }
            setLoading(false);
        };

        fetchSummary();
    }, [navigate]);

    const handleIpClick = (ip) => {
        navigate(`/dashboard?ip=${ip}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Alerts Summary
                    </h2>
                    <button
                        onClick={handleBackButton}
                        className="bg-red-500 flex items-center text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                            />
                        </svg>
                        Dashboard
                    </button>
                </div>
                <p className="text-gray-600 mb-4">* 1 Hour Ago</p>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700 text-left">
                                    <th className="p-3 border-none">
                                        IP Address
                                    </th>
                                    <th className="p-3 border-none">
                                        Triggered
                                    </th>
                                    <th className="p-3 border-none">Agent</th>
                                    <th className="p-3 border-none">Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryData.map(([ip, data], index) => (
                                    <tr
                                        key={index}
                                        className="border text-center"
                                    >
                                        <td className="p-3 border text-blue-500 cursor-pointer underline" onClick={() => handleIpClick(ip)}>{ip}</td>
                                        <td className="p-3 border">
                                            {data.count}
                                        </td>
                                        <td className="p-3 border">
                                            {data.agent}
                                        </td>
                                        <td className="p-3 border">
                                            {data.level}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
