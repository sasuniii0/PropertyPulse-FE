export interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPayNow: () => void;
}

export const PaymentPopup: React.FC<PaymentPopupProps> = ({
  isOpen,
  onClose,
  onPayNow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[360px] text-center">
        <h2 className="text-lg font-bold mb-4">Payment Required</h2>
        <p className="mb-4">
          Your subscription/payment is pending. Please pay to continue.
        </p>

        <div className="flex justify-between gap-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            onClick={onClose}
          >
            Later
          </button>

          <button
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
            onClick={onPayNow}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};
