import { useState, useEffect } from 'react';
import './FeedbackList.css';
import { FaUserGraduate, FaChalkboardTeacher, FaStar, FaCommentDots, FaListAlt } from 'react-icons/fa';

function FeedbackList({ refresh }) {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:5000/api/feedback");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                let data;
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                    if (!Array.isArray(data)) {
                        throw new Error(`API did not return feedback data. Response: ${JSON.stringify(data)}`);
                    }
                    setFeedback(data);
                } else {
                    const text = await response.text();
                    throw new Error(`API did not return feedback data. Response: ${text}`);
                }
            } catch (err) {
                console.error('Failed to fetch feedback:', err);
                setError('Failed to load feedback. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, [refresh]);

    if (loading) {
        return (
            <div className="feedback-list-container">
                <p className="feedback-status">Loading feedback...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="feedback-list-container">
                <p className="feedback-status error">{error}</p>
            </div>
        );
    }

    if (feedback.length === 0) {
        return (
            <div className="feedback-list-container">
                <p className="feedback-status no-feedback">No feedback submitted yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div className="feedback-list-container">
            <h2 className="list-title">
                <FaListAlt className="title-icon" /> All Student Feedback
            </h2>
            <div id="feedbackList" className="feedback-grid">
                {feedback.map(item => (
                    <div key={item._id || item.id} className="feedback-item animated-card">
                        <h3 className="item-name">
                            <FaUserGraduate className="item-icon" /> {item.name}
                        </h3>
                        <p className="item-detail">
                            <FaChalkboardTeacher className="item-icon" /> Course: <strong>{item.course}</strong>
                        </p>
                        <p className="item-detail">
                            <FaChalkboardTeacher className="item-icon" /> Faculty: <strong>{item.faculty}</strong>
                        </p>
                        <p className="item-detail">
                            <FaStar className="item-icon rating-star-icon" /> Rating:
                            <span className="rating-display">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < item.rating ? 'filled-star' : 'empty-star'} />
                                ))}
                                <span className="rating-text"> ({item.rating}/5)</span>
                            </span>
                        </p>
                        <p className="item-comment">
                            <FaCommentDots className="item-icon" /> Comment: <span className="comment-text">{item.comment || 'No comment provided.'}</span>
                        </p>
                        <span className="item-date">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeedbackList;
