import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm.jsx';
import FeedbackList from './components/FeedbackList';
import FeedbackStats from './components/FeedbackStats';
import './App.css';
import { FaEdit, FaChartPie, FaListAlt } from 'react-icons/fa';

function App() {
    const [refreshList, setRefreshList] = useState(0);

    const handleFeedbackSubmitted = () => {
        setRefreshList(prev => prev + 1);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="app-title">Student Feedback Manager</h1>
                <nav className="App-nav">
                    <ul>
                        <li>
                            <Link to="/submit-feedback">
                                <FaEdit className="nav-icon" /> Submit Feedback
                            </Link>
                        </li>
                        <li>
                            <Link to="/view-feedback">
                                <FaListAlt className="nav-icon" /> View Feedback
                            </Link>
                        </li>
                        <li>
                            <Link to="/feedback-stats">
                                <FaChartPie className="nav-icon" /> Feedback Stats
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="App-main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/submit-feedback"
                        element={<FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />}
                    />
                    <Route
                        path="/view-feedback"
                        element={<FeedbackList refresh={refreshList} />}
                    />
                     <Route
                        path="/feedback-stats"
                        element={<FeedbackStats refresh={refreshList} />}
                    />
                </Routes>
            </main>
            <footer className="App-footer">
                <p>&copy; {new Date().getFullYear()} Student Feedback App. All rights reserved.</p>
            </footer>
        </div>
    );
}

const Home = () => (
    <div className="home-page">
        <h2>Welcome to the Student Feedback Portal!</h2>
        <p>
            Use the navigation above to submit your valuable feedback or view what others have shared.
            Your input helps us improve!
        </p>
        <p>
            This platform allows students to easily provide anonymous or identified feedback on courses
            and faculty members. You can also see overall statistics and browse through all submissions.
        </p>
         
    </div>
);

export default App;