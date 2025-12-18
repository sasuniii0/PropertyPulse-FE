interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  className?: string; // optional className for custom sizing
}

export default function Modal({ children, onClose, title, className = '' }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
      onClick={onClose} // clicking backdrop closes modal
    >
      <div
        className={`bg-white rounded-lg shadow-lg relative w-full max-w-2xl p-6 ${className}`}
        onClick={e => e.stopPropagation()} // prevent closing when clicking inside
      >
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
