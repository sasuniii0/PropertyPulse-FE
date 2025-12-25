// Payment Popup Component
const CloseIcon = () => <span className="text-xl">✕</span>;
const AlertIcon = () => <span className="text-2xl">⚠️</span>;


export interface AgentPaymentData {
  planName?: string;
  planPrice?: number;
  nextDueDate?: string;
  paymentDaysRemaining: number;
  paymentStatus: 'active' | 'due_soon' | 'expired';
}

export interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  agentData: AgentPaymentData | null;
  onPayNow: () => void;
}

export const PaymentPopup = ({ isOpen, onClose, agentData, onPayNow }: PaymentPopupProps) => {
  if (!isOpen || !agentData) return null;

  const daysRemaining = agentData?.paymentDaysRemaining || 0;
  const isExpired = daysRemaining <= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className={`${isExpired ? 'bg-red-500' : 'bg-orange-500'} text-white p-5 rounded-t-lg relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            <CloseIcon />
          </button>
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              <AlertIcon />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isExpired ? 'Payment Required' : 'Payment Reminder'}
              </h2>
              <p className="text-sm text-white text-opacity-90 mt-1">
                {isExpired 
                  ? 'Your subscription has expired' 
                  : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Plan Details */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Current Plan</span>
                <span className="font-semibold text-gray-900">
                  {agentData?.planName || 'Premium Plan'}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Monthly Fee</span>
                <span className="font-bold text-lg text-teal-600">
                  LKR {agentData?.planPrice?.toLocaleString() || '5,000'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Due Date</span>
                <span className="font-medium text-gray-900">
                  {agentData?.nextDueDate || 'Jan 30, 2025'}
                </span>
              </div>
            </div>

            {/* Warning Message */}
            <div className={`${isExpired ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'} border p-4 rounded-lg`}>
              <p className="text-sm text-gray-700">
                {isExpired ? (
                  <>
                    <strong>Your account access is limited.</strong> Please complete your payment to continue managing your listings and accessing all features.
                  </>
                ) : (
                  <>
                    <strong>Payment due soon!</strong> Complete your payment before the due date to avoid service interruption.
                  </>
                )}
              </p>
            </div>

            {/* Features Included */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Plan Includes:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Unlimited property listings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Advanced analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Featured listing placement</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onPayNow}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Pay Now
            </button>
            {!isExpired && (
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Remind Later
              </button>
            )}
          </div>

          {/* Support Link */}
          <div className="text-center mt-4">
            <a href="/support" className="text-xs text-gray-500 hover:text-teal-600 transition-colors">
              Need help? Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};