const styles = `
  .confess-header-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 10px;
    color: white;
    text-shadow: 2px 2px rgb(116, 116, 116);
    text-transform: uppercase;
    cursor: pointer;
    border: solid 2px black;
    letter-spacing: 1px;
    font-weight: 600;
    font-size: 17px;
    background-color: hsl(49deg 98% 60%);
    border-radius: 50px;
    position: relative;
    overflow: hidden;
    transition: all 0.5s ease;
  }

  .confess-header-btn:active {
    transform: scale(0.9);
    transition: all 100ms ease;
  }

  .confess-header-btn svg {
    transition: all 0.5s ease;
    z-index: 2;
  }

  .play {
    transition: all 0.5s ease;
    transition-delay: 300ms;
  }

  .confess-header-btn:hover svg {
    transform: scale(3) translate(50%);
  }

  .now {
    position: absolute;
    left: 0;
    transform: translateX(-100%);
    transition: all 0.5s ease;
    z-index: 2;
  }

  .confess-header-btn:hover .now {
    transform: translateX(10px);
    transition-delay: 300ms;
  }

  .confess-header-btn:hover .play {
    transform: translateX(200%);
    transition-delay: 300ms;
  }
`;

// Inject styles once
if (typeof document !== 'undefined' && !document.getElementById('confess-header-btn-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'confess-header-btn-styles';
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export function ConfessHeaderButton({ onClick, disabled = false, isLoading = false }) {
  return (
    <button
      className="confess-header-btn"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {disabled ? (
        <span>NO POST</span>
      ) : (
        <>
          <svg
            className="play"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="5 3 19 12 5 21" />
          </svg>
          <span className="now">POST</span>
        </>
      )}
    </button>
  );
}
