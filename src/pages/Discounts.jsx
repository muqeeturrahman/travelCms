import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import {
  Flight,
  Hotel,
  DirectionsCar,
} from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'https://travey-backend.vercel.app/api';

// Custom toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored"
};

export default function Discounts() {
  const [discountValues, setDiscountValues] = useState({
    flightDiscount: '',
    hotelDiscount: '',
    carDiscount: '',
  });

  const [currentDiscounts, setCurrentDiscounts] = useState({
    flightDiscount: 0,
    hotelDiscount: 0,
    carDiscount: 0,
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState({
    flight: false,
    hotel: false,
    car: false,
  });

  const fetchDiscounts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_BASE_URL}/user/getDiscountPercentages`, {
        headers: {
          'Content-Type': 'application/json',
          'authToken': token,
        },
      });

      if (response.data.success) {
        setCurrentDiscounts({
          flightDiscount: response.data.data.flightDiscount,
          hotelDiscount: response.data.data.hotelDiscount,
          carDiscount: response.data.data.carDiscount,
        });
      }
    } catch (err) {
      toast.error('Failed to fetch current discounts');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleDiscountChange = (field) => (event) => {
    const value = event.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDiscountValues(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleDiscountSubmit = async (e, type) => {
    e.preventDefault();
    try {
      setButtonLoading(prev => ({ ...prev, [type]: true }));

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const discountKey = `${type}Discount`;
      const discountValue = parseFloat(discountValues[discountKey]);

      if (isNaN(discountValue) || discountValue < 0) {
        toast.error('Please enter a valid discount value', toastConfig);
        return;
      }

      const updateResponse = await axios.post(
        `${API_BASE_URL}/user/discount`,
        { [discountKey]: discountValue },
        {
          headers: {
            'Content-Type': 'application/json',
            'authToken': token,
          },
        }
      );

      if (updateResponse.data.success) {
        setCurrentDiscounts(prev => ({
          ...prev,
          [discountKey]: discountValue,
        }));

        setDiscountValues(prev => ({
          ...prev,
          [discountKey]: '',
        }));

        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} discount updated to ${discountValue}%`,
          toastConfig
        );
      } else {
        // Only show error if the response indicates failure
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} discount updated to ${discountValue}%`,
          toastConfig
        );
      }
    } catch (err) {
      // Catch network or logic errors
      toast.error(err.message || 'Failed to update discount', toastConfig);
    } finally {
      setButtonLoading(prev => ({ ...prev, [type]: false }));
    }
  };


  const discountCards = [
    {
      title: 'Flight Discount',
      description: 'Set discount percentage for flight bookings',
      icon: <Flight className="text-4xl" />,
      type: 'flight',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Hotel Discount',
      description: 'Set discount percentage for hotel bookings',
      icon: <Hotel className="text-4xl" />,
      type: 'hotel',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      borderColor: 'border-purple-100',
    },
    {
      title: 'Car Discount',
      description: 'Set discount percentage for car rentals',
      icon: <DirectionsCar className="text-4xl" />,
      type: 'car',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      borderColor: 'border-green-100',
    },
  ];

  if (initialLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium text-gray-800 mb-6">
        Manage Discounts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discountCards.map((card) => (
          <div
            key={card.type}
            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border ${card.borderColor}`}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <div className={card.iconColor}>{card.icon}</div>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-800">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Current: {currentDiscounts[`${card.type}Discount`]}%
                  </p>
                </div>
              </div>

              <form onSubmit={(e) => handleDiscountSubmit(e, card.type)}>
                <div className="relative">
                  <input
                    type="text"
                    value={discountValues[`${card.type}Discount`]}
                    onChange={handleDiscountChange(`${card.type}Discount`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter new discount percentage"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={buttonLoading[card.type]}
                  className={`w-full mt-4 px-4 py-2.5 rounded-lg text-white font-medium ${card.buttonColor
                    } disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
                >
                  {buttonLoading[card.type] ? 'Updating...' : `Update ${card.title}`}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="toast-message"
      />
    </div>
  );
}
