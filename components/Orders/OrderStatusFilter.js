import Loader from '@/shared/Loader/Loader';
import { isValidArray } from '@/utils/func';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FaFilter } from "react-icons/fa";
export const optionStatusFilter = [
  {
    label: 'All',
    value: 'CANCELLED,PAID,PACKED,PARTIALLY_SHIPPED,FULLY_SHIPPED',
  },

  {
    label: 'Paid',
    value: 'PAID',
  },
  {
    label: 'Packed',
    value: 'PACKED',
  },
  {
    label: 'Partially Shipped',
    value: 'PARTIALLY_SHIPPED',
  },
  {
    label: 'Fully Shipped',
    value: 'FULLY_SHIPPED',
  },
  {
    label: 'Cancelled',
    value: 'CANCELLED',
  },
  // {label:"Pending",value:"PENDING"}

];

export const defaultOptionStatusFilter = [

  {
    label: 'Paid',
    value: 'PAID',
  },
  {
    label: 'Packed',
    value: 'PACKED',
  },
  {
    label: 'Partially Shipped',
    value: 'PARTIALLY_SHIPPED',
  },
  {
    label: 'Fully Shipped',
    value: 'FULLY_SHIPPED',
  },
  {
    label: 'Cancelled',
    value: 'CANCELLED',
  },
  // {label:"Pending",value:"PENDING"}
];
const OrderStatusFilter = ({ trackingStatus, fetchOrdersQueries, defaultOptions, query, setQuery, resetHandler }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetRequest, setIsResetRequest] = useState(false);
  const [isFilterRequest, setIsFilterRequest] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    
    document.addEventListener('mousedown', closeDropdown);

    return () => {
      document.removeEventListener('mousedown', closeDropdown);
    };

  }, []);

  const resetHandlerClick = async () => {
    setIsResetRequest(true);
    const saveQuery = { ...query, ['trackingStatus']: defaultOptions,selectedLabelStatus:isValidArray(defaultOptions)?defaultOptions[0]:{} };

    setQuery(saveQuery);

    const sortQuery = { ...query, ['trackingStatus']: "PENDING,PACKED,PARTIALLY_SHIPPED,FULLY_SHIPPED",selectedLabelStatus:isValidArray(defaultOptions)?defaultOptions[0]:{} };
    await fetchOrdersQueries(sortQuery);

    setIsResetRequest(false);
  };

  const filterHandlerClick = async (status) => {

    const filterQuery = { ...query,
       ['trackingStatus']: status?.value,
       selectedLabelStatus: status
      };

      //console.log(filterQuery);
    setIsFilterRequest(true);

    if (query && query?.startDate) {
      if (!query?.endDate) {
        query['endDate'] = new Date();
      }
    }
    await fetchOrdersQueries(filterQuery);
    setIsFilterRequest(false);
  };

  return (
    <div>
      <div className="relative inline-block text-left z-20" ref={dropdownRef}>
        <button
          onClick={() => {
            if (router?.pathname !== '/admin/orders/pending') {
              toggleDropdown();
            }
          }}
          type="button"
          className="flex items-center !capitalize gap-1 cursor-pointer w-full py-2 text-sm font-medium  border border-transparent rounded-md focus:ring-white relative"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >

          <FaFilter size={13} />
          {
          router?.pathname == '/admin/orders/pending'? "Pending": query?.selectedLabelStatus?.label || "All"
          }

        </button>

        {isOpen && (
          <div
            className="origin-top-right  p-4 absolute md:right-[0px]  mt-2 w-[200px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className='flex items-center justify-between border-b pb-2'>
              <div className='flex items-center gap-1'>   <FaFilter size={13} />        <span>Status</span></div>
              {
                isResetRequest ? <Loader bg="transparent" width={'w-5'} height={'h-5'} /> : <button onClick={() => resetHandlerClick()}>Reset</button>
              }
            </div>
            <div className="py-1">
              {optionStatusFilter.map((option, index) => (
                <div className="relative" key={index}>
                  <button

                    type="button"
                    className={`block ${index < optionStatusFilter.length - 1 ? "border-b" : ""} !text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                    role="menuitem"
                    onClick={() => {
                      filterHandlerClick(option);
                      toggleDropdown();
                    }}
                  >
                    {option.label}
                  </button>
                </div>

              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusFilter;
