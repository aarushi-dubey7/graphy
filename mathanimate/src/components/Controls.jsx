export default function Controls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  sceneIndex,
  sceneCount,
  onSeek,
}) {
  const btnStyle = {
    background: 'none',
    border: '1px solid #444',
    color: '#fff',
    fontSize: '18px',
    padding: '4px 12px',
    cursor: 'pointer',
    borderRadius: '4px',
    margin: '0 4px',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: '#111',
        borderTop: '1px solid #222',
      }}
    >
      <button style={btnStyle} onClick={onPrev} title="Previous scene">◀</button>
      <button
        style={btnStyle}
        onClick={isPlaying ? onPause : onPlay}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button style={btnStyle} onClick={onNext} title="Next scene">▶▶</button>

      <input
        type="range"
        min={0}
        max={Math.max(0, sceneCount - 1)}
        value={sceneIndex}
        onChange={(e) => onSeek(Number(e.target.value))}
        style={{ flex: 1, accentColor: '#4af4ff', cursor: 'pointer' }}
      />

      <span style={{ color: '#aaa', fontSize: '13px', whiteSpace: 'nowrap' }}>
        Scene {sceneIndex + 1} / {sceneCount}
      </span>
    </div>
  );
}
