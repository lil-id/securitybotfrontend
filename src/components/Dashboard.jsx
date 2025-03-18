import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ip, setIp] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const token = useRef(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const ipParam = queryParams.get("ip");
        if (ipParam) {
            setIp(ipParam);
            fetchData();
        }
    }, [location]);    

    useEffect(() => {
        token.current = localStorage.getItem("authToken");
        if (!token.current) {
            navigate("/");
            return;
        }
    }, [navigate]);

    useEffect(() => {
        document.title = "Dashboard - Wazuh Alerts";
    }, []);

    const summaryDashboard = async () => {
        navigate("/summary");
    };

    function formatTimestamp(isoString) {
        const date = new Date(isoString);
    
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(date.getUTCDate()).padStart(2, "0");
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    const fetchData = async () => {
        try {
            if (!ip) {
                setError("Please enter IP address");
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/wazuh/alerts/${ip}`,
                {
                    headers: { Authorization: `Bearer ${token.current}` },
                }
            );

            if (response.data.length === 0) {
                setError("No data found");
            } else {
                setError(""); // Clear any previous error
            }

            setData(response.data);
        } catch (err) {
            setError("Failed to load data");
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl bg-white rounded-lg p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
                        Search Alerts
                    </h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 flex items-center text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                            />
                        </svg>
                        Logout
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="Enter IP address"
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={fetchData}
                        className="bg-blue-500 flex items-center text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                        Search
                    </button>
                    <button onClick={summaryDashboard} className="bg-amber-500 flex items-center text-white px-4 py-2 rounded-lg hover:bg-amber-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                            />
                        </svg>
                        Summary
                    </button>
                </div>

                {loading ? (
                    <p className="text-center">Click summary to view available IP address</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700 text-left">
                                        <th className="p-3 border-none">Timestamp</th>
                                        <th className="p-3 border-none">Agent</th>
                                        <th className="p-3 border-none">Description</th>
                                        <th className="p-3 border-none">Level</th>
                                        <th className="p-3 border-none">Source IP</th>
                                        <th className="p-3 border-none">Groups</th>
                                        <th className="p-3 border-none">Full Log</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(data) && data.length > 0 ? (
                                        data.map((log, index) => (
                                            <tr key={index} className="border text-center">
                                                <td className="p-3 border">{formatTimestamp(log.timestamp)}</td>
                                                <td className="p-3 border">{log.agent}</td>
                                                <td className="p-3 border">{log.description}</td>
                                                <td className="p-3 border">{log.level}</td>
                                                <td className="p-3 border">{log.src_ip}</td>
                                                <td className="p-3 border">{log.groups}</td>
                                                <td className="p-3 border">{log.full_log}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="p-3 border text-center">
                                                No data found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}