import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function SketchModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with semi-opaque sketch hatch effect */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Body */}
      <div
        className={`relative w-full ${maxWidth} bg-[#fdfbf7] border-4 border-ink wobbly p-6 sm:p-8 shadow-hard-lg z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto`}
      >
        {/* Decorative Tape Strip */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 h-6 w-32 bg-[#ede7db] border-l-2 border-r-2 border-dashed border-ink/40 shadow-sm rotate-[-1deg]" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 border-b-2 border-dashed border-ink/30 pb-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-ink leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-ink/70 font-body mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 border-2 border-ink rounded-full flex items-center justify-center bg-paper hover:bg-accent-red hover:text-white transition-all shadow-hard-sm active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
