import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { FaUsers, FaSpinner, FaSadTear } from 'react-icons/fa'; 

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
    '#FF197C', '#19FFED', '#197CFF', '#8042FF', '#C0C0C0',
    '#8A2BE2', '#DEB887', '#5F9EA0', '#D2691E', '#FF7F50'
];

function FeedbackStats({ refresh }) {
    const [facultyStats, setFacultyStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalFeedbackCount, setTotalFeedbackCount] = useState(0);

    const fetchFacultyStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://backend-sf-form.vercel.app/api/feedback/faculty-stats");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const formattedStats = data.map(item => ({
                name: item._id, 
                value: item.count 
            }));

            const totalCount = formattedStats.reduce((sum, item) => sum + item.value, 0);
            setTotalFeedbackCount(totalCount);
            setFacultyStats(formattedStats);

        } catch (err) {
            console.error("Fetch error for faculty stats:", err);
            setError('Failed to load faculty feedback statistics. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacultyStats();
    }, [refresh]);

    if (loading) {
        return (
            <div className="feedback-stats-container">
                <p className="feedback-stats-status"><FaSpinner className="spinner" /> Loading faculty statistics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="feedback-stats-container">
                <p className="feedback-stats-status error"><FaSadTear /> {error}</p>
            </div>
        );
    }

    if (facultyStats.length === 0 || totalFeedbackCount === 0) {
        return (
            <div className="feedback-stats-container">
                <p className="feedback-stats-status no-stats">No faculty feedback data to display statistics yet.</p>
            </div>
        );
    }

    // `facultyStats` directly serves as the data for the pie chart
    const pieChartData = facultyStats;

    return (
        <div className="feedback-stats-container">
            <h2 className="stats-title">
                <FaUsers className="title-icon" /> Feedback Distribution by Faculty
            </h2>
            <p className="total-feedback-count">Total Feedback Submissions: <strong>{totalFeedbackCount}</strong></p>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} submissions`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="stats-summary">
                <h3>Summary:</h3>
                <ul>
                    {pieChartData.map((entry, index) => (
                        <li key={`summary-${entry.name}`}>
                            <span className="summary-color-box" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            {entry.name}: <strong>{entry.value}</strong> submissions
                            ({totalFeedbackCount > 0 ? ((entry.value / totalFeedbackCount) * 100).toFixed(1) : 0}%)
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FeedbackStats;
