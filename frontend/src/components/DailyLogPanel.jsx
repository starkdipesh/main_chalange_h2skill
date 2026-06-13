import { useState } from 'react';
import BurnoutMeter from './BurnoutMeter';
import StressTriggers from './StressTriggers';
import './DailyLogPanel.css';

export default function DailyLogPanel() {
  const [journalText, setJournalText] = useState('');
  const [mood, setMood] = useState(5);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: journalText,
          mood: parseInt(mood),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze journal');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const moodEmojis = ['😢', '😞', '😕', '😐', '🙂', '😊', '😄', '😆', '🤩', '🌟'];
  const moodLabels = [
    'Very Low',
    'Low',
    'Below Average',
    'Average',
    'Good',
    'Very Good',
    'Great',
    'Excellent',
    'Outstanding',
    'Perfect',
  ];

  return (
    <section className="daily-log-panel">
      <div className="panel-header">
        <h2>📝 Daily Wellness Log</h2>
        <p className="profile-indicator">Target Exam: JEE Advanced</p>
      </div>

      {/* Journal Input */}
      <div className="journal-section">
        <label htmlFor="journal-input" className="section-label">
          How are you feeling today? Share your thoughts, anxieties, and progress.
        </label>
        <textarea
          id="journal-input"
          className="journal-textarea"
          placeholder="Write freely about your exam prep journey, stress points, sleep quality, mock exams, specific subjects you're struggling with, or any emotional concerns..."
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Mood Slider */}
      <div className="mood-section">
        <label className="section-label">
          Current Mood/Energy Level: {moodLabels[parseInt(mood) - 1]}
        </label>
        <div className="mood-slider-container">
          <span className="mood-label mood-label-low">😢</span>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="mood-slider"
            disabled={loading}
          />
          <span className="mood-label mood-label-high">🌟</span>
        </div>
        <div className="mood-display">
          <span className="mood-emoji">{moodEmojis[parseInt(mood) - 1]}</span>
          <span className="mood-value">{mood}/10</span>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        className="btn-analyze"
        onClick={handleAnalyze}
        disabled={loading || journalText.trim().length === 0}
      >
        {loading ? (
          <>
            <span className="spinner-small"></span> Analyzing...
          </>
        ) : (
          '🔍 Analyze Wellness'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="analysis-results">
          <h3>✨ AI Wellness Insights</h3>

          {/* Burnout Meter */}
          <BurnoutMeter riskLevel={analysis.burnoutRisk} />

          {/* Emotional Pattern */}
          <div className="emotional-pattern">
            <h4>💭 Emotional Pattern</h4>
            <p>{analysis.emotionalPatterns}</p>
          </div>

          {/* Stress Triggers */}
          {analysis.hiddenTriggers && (
            <StressTriggers triggers={analysis.hiddenTriggers} />
          )}

          <div className="analysis-timestamp">
            Last analyzed: {new Date(analysis.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </section>
  );
}
