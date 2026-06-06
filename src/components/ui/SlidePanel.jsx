import PropTypes from "prop-types";
import { useEffect } from "react";
import Button from "./Button";

function SlidePanel({ isOpen, title, description, children, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-on-surface/35 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        aria-label="Cerrar panel"
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-outline-variant/30 bg-surface-container-lowest shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slide-panel-title"
      >
        <header className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-6 py-5">
          <div>
            <h3 id="slide-panel-title" className="font-display text-headline-md text-on-surface">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-body-md text-on-surface-variant">
                {description}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            icon="close"
            className="min-h-10 shrink-0 px-3"
            aria-label="Cerrar panel"
            onClick={onClose}
          />
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </aside>
    </div>
  );
}

SlidePanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

SlidePanel.defaultProps = {
  description: "",
};

export default SlidePanel;
