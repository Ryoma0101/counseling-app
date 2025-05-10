import { CreditCard } from 'lucide-react';

export function PaymentButton() {
  const handlePaymentClick = () => {
    alert('Connected to payment API. This would redirect to Stripe in a production app.');
  };
  
  return (
    <button
      onClick={handlePaymentClick}
      className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150"
    >
      <CreditCard size={16} />
      <span>Upgrade</span>
    </button>
  );
}