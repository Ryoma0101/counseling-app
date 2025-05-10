import { useState } from 'react';
import { MapPin } from 'lucide-react';

export function ReferralForm() {
  const [zipCode, setZipCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (zipCode.match(/^\d{5}$/)) {
      window.open(`https://www.findtreatment.gov/locator?zipcode=${zipCode}`, '_blank');
      setZipCode('');
      setIsOpen(false);
    }
  };
  
  return (
    <>
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1 transition-colors duration-150"
        >
          <MapPin size={16} />
          <span>Find professional help nearby</span>
        </button>
        
        {isOpen && (
          <form onSubmit={handleSubmit} className="mt-2 flex space-x-2">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              pattern="\d{5}"
              className="flex-grow px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
              required
            />
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-150"
            >
              Find
            </button>
          </form>
        )}
      </div>
    </>
  );
}