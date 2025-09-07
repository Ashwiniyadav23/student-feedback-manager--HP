import { useState } from 'react';
import './FeedbackForm.css';
import { FaPaperPlane, FaCheckCircle, FaTimesCircle, FaStar, FaRegStar, FaLightbulb } from 'react-icons/fa';

function FeedbackForm({ onFeedbackSubmitted }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [course, setCourse] = useState('');
    const [faculty, setFaculty] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [feedbackDate, setFeedbackDate] = useState(new Date().toISOString().split('T')[0]);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        if (rating === 0) {
            setMessage('Please select a rating!');
            setIsError(true);
            setIsSubmitting(false);
            return;
        }
        if (!isAnonymous && (!name || !email)) {
            setMessage('Name and Email are required unless submitting anonymously.');
            setIsError(true);
            setIsSubmitting(false);
            return;
        }
        if (!course || !faculty) {
            setMessage('Course and Faculty are required.');
            setIsError(true);
            setIsSubmitting(false);
            return;
        }

        const feedbackData = {
            name: isAnonymous ? 'Anonymous' : name,
            email: isAnonymous ? 'anonymous@example.com' : email,
            course,
            faculty,
            rating,
            comment: comment, // Correctly named 'comment'
            feedbackDate,
        };

        try {
            // *** CRUCIAL FIX HERE: Construct the full API URL ***
            const apiUrl = "https://backend-sf-form.vercel.app/api/feedback";

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            let data = {};
            if (response.headers.get('content-type')?.includes('application/json')) {
                data = await response.json();
            }

            if (response.ok) {
                setMessage(data.message || 'Feedback submitted successfully!');
                setIsError(false);
                setName('');
                setEmail('');
                setCourse('');
                setFaculty('');
                setRating(0);
                setComment('');
                setFeedbackDate(new Date().toISOString().split('T')[0]);
                setIsAnonymous(false);
                if (onFeedbackSubmitted) {
                    onFeedbackSubmitted();
                }
            } else {
                setMessage(`Error: ${data.message || 'Something went wrong!'}`);
                setIsError(true);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage('Network error or server unavailable. Please try again.');
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="feedback-form-container">
            <h2 className="form-title">
                Share Your Feedback
                <FaPaperPlane className="title-icon" />
            </h2>
            <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-group-anon">
                    <input
                        type="checkbox"
                        id="isAnonymous"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <label htmlFor="isAnonymous" className="checkbox-label">Submit Anonymously</label>
                </div>

                {!isAnonymous && (
                    <>
                        <div className="form-group">
                            <label htmlFor="name">Your Name:</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isAnonymous}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Your Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={!isAnonymous}
                                className="form-input"
                            />
                        </div>
                    </>
                )}
                <div className="form-group">
                    <label htmlFor="course">Course:</label>
                    <div className="select-wrapper">
                        <select
                            id="course"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            required
                            className="form-select"
                        >
                            <option value="">Select a Course</option>
                            <option value="BCA Year 1 (2024-2027)">BCA Year 1 (2024-2027)</option>
                            <option value="BCA Year 2 (2025-2028)">BCA Year 2 (2025-2028)</option>
                            <option value="BCA Year 3 (2026-2029)">BCA Year 3 (2026-2029)</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="faculty">Faculty:</label>
                    <div className="select-wrapper">
                        <select
                            id="faculty"
                            value={faculty}
                            onChange={(e) => setFaculty(e.target.value)}
                            required
                            className="form-select"
                        >
                            <option value="">Select a Faculty Member</option>
                            <option value="Meenakshi">Meenakshi</option>
                            <option value="Kiranpreet">Kiranpreet</option>
                            <option value="Karuna">Karuna</option>
                            <option value="Ashwini">Ashwini</option>
                            <option value="Pratieksha">Pratieksha</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Overall Rating:</label>
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? 'filled' : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => {}}
                                onMouseLeave={() => {}}
                            >
                                {star <= rating ? <FaStar /> : <FaRegStar />}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Suggestions or Comments: <FaLightbulb className="label-icon" /></label>
                    <textarea
                        id="comment"
                        rows="5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="form-textarea"
                        placeholder="Share your thoughts here, positive or suggestions for improvement..."
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="feedbackDate">Date of Feedback:</label>
                    <input
                        type="date"
                        id="feedbackDate"
                        value={feedbackDate}
                        onChange={(e) => setFeedbackDate(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>Submitting...</>
                    ) : (
                        <>Submit Feedback <FaPaperPlane /></>
                    )}
                </button>
            </form>
            {message && (
                <p className={`message-alert ${isError ? 'error' : 'success'} ${message ? 'show' : ''}`}>
                    {isError ? <FaTimesCircle className="message-icon" /> : <FaCheckCircle className="message-icon" />}
                    {message}
                </p>
            )}
        </div>
    );
}
export default FeedbackForm;
