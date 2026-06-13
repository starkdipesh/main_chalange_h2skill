import './BurnoutMeter.css';

export default function BurnoutMeter({ riskLevel = 'Low' }) {
  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6366f1';
    }
  };

  const getRiskPercentage = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 25;
      case 'medium':
        return 60;
      case 'high':
        return 90;
      default:
        return 50;
    }
  };

  const percentage = getRiskPercentage(riskLevel);
  const color = getRiskColor(riskLevel);

  return (
    <div className="burnout-meter">
      <h4>⚡ Burnout Risk Level</h4>
      <div className="meter-container">
        <div className="meter-bar">
          <div
            className="meter-fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          ></div>
        </div>
        <div
          className="meter-label"
          style={{
            color: color,
          }}
        >
          {riskLevel}
        </div>
      </div>
      <p className="meter-description">
        {riskLevel?.toLowerCase() === 'low' &&
          'You seem to be managing well. Keep up the self-care!'}
        {riskLevel?.toLowerCase() === 'medium' &&
          'Consider increasing rest and stress management techniques.'}
        {riskLevel?.toLowerCase() === 'high' &&
          'Your wellbeing needs immediate attention. Reach out for support.'}
      </p>
    </div>
  );
}
