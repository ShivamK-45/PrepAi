import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useMockInterview } from '../hooks/useMockInterview';
import '../style/mockSetup.scss';

const MockSetup = () => {
    const navigate = useNavigate();
    const { loading, error, handleInitialize } = useMockInterview();
    const resumeInputRef = useRef();

    // Form state
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFileName, setResumeFileName] = useState('');
    const [inputMode, setInputMode] = useState('role'); // 'role' or 'description'
    const [selectedRole, setSelectedRole] = useState('');
    const [customRole, setCustomRole] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [duration, setDuration] = useState(15);
    const [micTested, setMicTested] = useState(false);
    const [micPermission, setMicPermission] = useState(false);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            setResumeFileName(file.name);
        } else {
            setResumeFile(null);
            setResumeFileName('');
        }
    };

    // Test microphone
    const handleMicTest = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicPermission(true);
            setMicTested(true);
            
            // Stop the stream after testing
            stream.getTracks().forEach(track => track.stop());
            
            alert('✅ Microphone is working! You can now start the interview.');
        } catch (err) {
            console.error('Microphone access denied:', err);
            alert('❌ Microphone access denied. Please allow microphone permission to continue.');
            setMicPermission(false);
            setMicTested(false);
        }
    };

    // Start interview
    const handleStartInterview = async () => {
        // Validation
        if (!resumeFile) {
            alert('Please upload your resume');
            return;
        }

        const jobRoleValue = inputMode === 'role' 
            ? (selectedRole === 'other' ? customRole : selectedRole)
            : null;

        const jobDescValue = inputMode === 'description' ? jobDescription : null;

        if (!jobRoleValue && !jobDescValue) {
            alert('Please select a job role or provide job description');
            return;
        }

        if (!micTested) {
            alert('Please test your microphone before starting');
            return;
        }

        try {
            const data = await handleInitialize({
                resumeFile,
                jobRole: jobRoleValue || 'General Interview',
                jobDescription: jobDescValue || '',
                duration
            });

            // Navigate to live interview page with session data
            navigate(`/live-interview/${data.sessionId}`, {
                state: { sessionData: data }
            });
        } catch (err) {
            console.error('Failed to start interview:', err);
            alert(`Failed to start interview: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="mock-setup-loading">
                <h2>Setting up your interview...</h2>
                <p>Please wait while we prepare your questions</p>
            </div>
        );
    }    return (
        <div className="mock-setup">
            <div className="setup-header">
                <h1>Setup Mock Interview</h1>
                <p>Configure your AI interview session</p>
            </div>

            <div className="setup-grid-2x2">
                {/* Step 1: Upload Resume */}
                <section className="setup-section">
                    <div className="section-header">
                        <span className="step-number">1</span>
                        <h2>Upload Your Resume</h2>
                    </div>
                    
                    <label className="file-upload" htmlFor="resume">
                        <div className="upload-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="16 16 12 12 8 16"/>
                                <line x1="12" y1="12" x2="12" y2="21"/>
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                            </svg>
                        </div>
                        {resumeFileName ? (
                            <p className="file-name">✓ {resumeFileName}</p>
                        ) : (
                            <>
                                <p className="upload-title">Click to upload or drag & drop</p>
                                <p className="upload-subtitle">PDF or DOCX (Max 3MB)</p>
                            </>
                        )}
                        <input
                            ref={resumeInputRef}
                            onChange={handleFileChange}
                            hidden
                            type="file"
                            id="resume"
                            accept=".pdf,.docx"
                        />
                    </label>
                </section>

                {/* Step 2: Job Details */}
                <section className="setup-section">
                    <div className="section-header">
                        <span className="step-number">2</span>
                        <h2>Job Details</h2>
                    </div>

                    {/* Toggle between role and description */}
                    <div className="input-mode-toggle">
                        <button
                            className={`toggle-btn ${inputMode === 'role' ? 'active' : ''}`}
                            onClick={() => setInputMode('role')}
                        >
                            Quick Role Selection
                        </button>
                        <button
                            className={`toggle-btn ${inputMode === 'description' ? 'active' : ''}`}
                            onClick={() => setInputMode('description')}
                        >
                            Custom Job Description
                        </button>
                    </div>

                    {inputMode === 'role' ? (
                        <div className="role-selection">
                            <div className="role-grid">
                                {['Full Stack Developer', 'Frontend Engineer', 'Backend Developer', 'DevOps Engineer', 'Data Scientist'].map(role => (
                                    <label key={role} className="role-card">
                                        <input
                                            type="radio"
                                            name="jobRole"
                                            value={role}
                                            checked={selectedRole === role}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                        />
                                        <span>{role}</span>
                                    </label>
                                ))}
                                <label className="role-card">
                                    <input
                                        type="radio"
                                        name="jobRole"
                                        value="other"
                                        checked={selectedRole === 'other'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span>Other</span>
                                </label>
                            </div>
                            {selectedRole === 'other' && (
                                <input
                                    type="text"
                                    className="custom-role-input"
                                    placeholder="Enter custom role (e.g., ML Engineer)"
                                    value={customRole}
                                    onChange={(e) => setCustomRole(e.target.value)}
                                />
                            )}
                        </div>
                    ) : (
                        <textarea
                            className="job-description-input"
                            placeholder="Paste the full job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={8}
                        />
                    )}
                </section>

                {/* Step 3: Duration */}
                <section className="setup-section">
                    <div className="section-header">
                        <span className="step-number">3</span>
                        <h2>Interview Duration</h2>
                    </div>

                    <div className="duration-options">
                        {[
                            { value: 10, questions: '5-6 questions' },
                            { value: 15, questions: '7-8 questions' },
                            { value: 20, questions: '10-12 questions' }
                        ].map(option => (
                            <label key={option.value} className="duration-card">
                                <input
                                    type="radio"
                                    name="duration"
                                    value={option.value}
                                    checked={duration === option.value}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                />
                                <span className="duration-time">{option.value} minutes</span>
                                <span className="duration-questions">{option.questions}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Step 4: Microphone Check */}
                <section className="setup-section">
                    <div className="section-header">
                        <span className="step-number">4</span>
                        <h2>Microphone Check</h2>
                    </div>

                    <div className="mic-test">
                        <button 
                            className={`test-mic-btn ${micTested ? 'tested' : ''}`}
                            onClick={handleMicTest}
                        >
                            {micTested ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    Microphone Tested
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                    </svg>
                                    Test Microphone
                                </>
                            )}
                        </button>
                        <p className="mic-note">
                            {micTested 
                                ? '✅ Microphone is ready!' 
                                : '⚠️ Please test your microphone'}
                        </p>
                    </div>
                </section>
            </div>

            <div className="setup-actions">
                {/* Error Display */}
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                {/* Start Button */}
                <button
                    className="start-interview-btn"
                    onClick={handleStartInterview}
                    disabled={!resumeFile || !micTested || loading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                    </svg>
                    Start AI Interview
                </button>
            </div>
        </div>
    );
};

export default MockSetup;