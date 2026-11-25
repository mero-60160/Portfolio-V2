import { useEffect } from 'react';

export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onDone, 2600);
    return () => clearTimeout(id);
  }, [toast, onDone]);

  return (
    <div className="toast-region" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast">
          <span className="toast__dot" aria-hidden="true" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
