import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ip, setIp] = useState("");
    const [error, setError] = useState("");
    const [recommendationError, setRecommendationError] = useState("");
    const navigate = useNavigate();

    const token = useRef(null);

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

    const getRecommendation = async () => {
        try {
            const fullLog = `196.251.85.250 - - [25/Feb/2025:10:46:11 +0000] "GET /login.rsp HTTP/1.1" 404 454 "-" "Hello World"`;
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/ai/recommendation`, {
                    body: JSON.stringify({ fullLog })
                }
            );
            console.log(response.data);
            setRecommendationError(""); // Clear any previous recommendation error
        } catch (err) {
            setRecommendationError("Failed to get recommendation or Service Unavailable");
            console.log(err.status, recommendationError);
        }
    };

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
                    <button onClick={getRecommendation} className="bg-green-500 flex items-center text-white px-4 py-2 rounded-lg hover:bg-green-600">
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
                                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                            />
                        </svg>
                        Recommendation
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
                        {recommendationError && (
                            <p className="text-center text-red-500 mb-3">{recommendationError}</p>
                        )}
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
                                                <td className="p-3 border">{log.timestamp}</td>
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