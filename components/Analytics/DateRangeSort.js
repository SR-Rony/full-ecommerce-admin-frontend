import { useEffect, useRef, useState } from 'react';
import { FaFilter, FaSort } from "react-icons/fa";

const DateRangeSort = ({fetchProductsQueries,query,setQuery}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isResetRequest, setIsResetRequest] = useState(false);
  const [isFilterRequest, setIsFilterRequest] = useState(false);
  const dropdownRef = useRef(null);

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

  const options = [
    {
      label: 'Today',
      value: 1,
    },
    {
      label: 'Last 7 days',
      value: 7,
    },
    {
      label: 'Last 15 days',
      value: 15,
    },
   
  ];

  const sortHandlerClick = async (query) => {
    setQuery(query);
  await  fetchProductsQueries(query.value);
};
  return (
    <div>
      <div className="relative inline-block text-left z-20" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          type="button"
          className="flex items-center gap-1 cursor-pointer w-full py-2 text-sm font-medium  border border-transparent rounded-md focus:ring-white relative"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
         <FaFilter/>
 {query?.label || options[1].label}
        </button>

        {isOpen && (
          <div
            className="origin-top-right  p-2 absolute right-[0px] w-[170px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
         
            <div className="">
              {options.map((option, index) => (
                    <div className="relative"key={index}>
                      <button
                      
                        type="button"
                        className={`block ${index < options.length - 1 ? "border-b" : ""} !text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                        role="menuitem"
                        onClick={() =>{
                          sortHandlerClick(option);
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

export default DateRangeSort;
