import { useState, useEffect } from 'react';
import DailyLogPanel from './components/DailyLogPanel';
import ChatPanel from './components/ChatPanel';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  useEffect(() => {
    // Verify backend connection on load
    fetch('/api/health')
      .then((res) => res.json())
      .then(() => setLoading(false))
      .catch((err) => {
        console.error('Backend connection failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Initializing wellness tracker...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🌿 Mental Wellness Tracker</h1>
          <p className="header-subtitle">
            Your AI-powered companion for exam preparation wellness
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="dashboard-grid">
          <DailyLogPanel onAnalysis={setCurrentAnalysis} />
          <ChatPanel analysis={currentAnalysis} />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with ❤️ for students. All data is processed securely and
          privately.
        </p>
      </footer>
    </div>
  );
}

export default App;
