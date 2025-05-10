import { X, Phone } from 'lucide-react';

interface CrisisAlertProps {
  onClose: () => void;
}

export function CrisisAlert({ onClose }: CrisisAlertProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 p-4">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md animate-fadeIn">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Phone className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Crisis Support Available</p>
              <button 
                onClick={onClose}
                className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-150"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm leading-5">
              If you're experiencing thoughts of suicide or severe distress, please call 988
              for immediate support (24/7 Suicide & Crisis Lifeline).
            </p>
            <div className="mt-2">
              <a
                href="tel:988"
                className="inline-flex items-center px-3 py-1.5 border border-red-500 text-xs font-medium rounded-lg bg-white text-red-700 hover:bg-red-50 transition-colors duration-150"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call 988 Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}