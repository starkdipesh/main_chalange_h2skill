import './StressTriggers.css';

export default function StressTriggers({ triggers = [] }) {
  const triggerEmojis = {
    exam: '📝',
    sleep: '😴',
    chemistry: '⚗️',
    math: '🔢',
    physics: '⚛️',
    mock: '📊',
    competition: '🏆',
    score: '📈',
    time: '⏰',
    family: '👨‍👩‍👧',
    health: '🏥',
    anxiety: '😰',
    confidence: '💪',
    study: '📚',
    default: '📍',
  };

  const getEmoji = (trigger) => {
    const lowerTrigger = trigger.toLowerCase();
    for (const [key, emoji] of Object.entries(triggerEmojis)) {
      if (lowerTrigger.includes(key)) {
        return emoji;
      }
    }
    return triggerEmojis.default;
  };

  return (
    <div className="stress-triggers">
      <h4>🎯 Identified Stress Triggers</h4>
      <div className="triggers-grid">
        {triggers && triggers.length > 0 ? (
          triggers.map((trigger, index) => (
            <div key={index} className="trigger-tag">
              <span className="trigger-emoji">{getEmoji(trigger)}</span>
              <span className="trigger-text">{trigger}</span>
            </div>
          ))
        ) : (
          <p className="no-triggers">No specific triggers identified yet.</p>
        )}
      </div>
    </div>
  );
}
