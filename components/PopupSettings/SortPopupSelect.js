import Loader from '@/shared/Loader/Loader';
import { useEffect, useRef, useState } from 'react';
import { FaSort } from "react-icons/fa";

const SortPopup = ({fetchPopupsQueries,query,setQuery,resetHandler}) => {
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
      label: 'Latest',
      value: 'latest',
    },
    {
      label: 'Oldest',
      value: 'oldest',
    }
  ];
  const resetHandlerClick = async () => {
    setIsResetRequest(true);
    await resetHandler();
    setIsResetRequest(false);
};
  const sortHandlerClick = async (sort) => {
    const sortQuery = { ...query, ['sort']: sort };
    setQuery(sortQuery);
    setIsFilterRequest(true);
    if (query && query?.startDate) {
        if (!query?.endDate) {
            query['endDate'] = new Date();
        }
    }
    await fetchPopupsQueries(sortQuery);
    setIsFilterRequest(false);
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
         <FaSort size={18}/>
 {query?.sort?.label ||"Latest"}
        </button>

        {isOpen && (
          <div
            className="origin-top-right  p-4 absolute -right-[180px]  mt-2 w-[240px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
                 <div className='flex items-center justify-between border-b pb-2'>
                                <div className='flex items-center gap-1'>   <FaSort size={18}/>        <span>Sort</span></div>
                                {
                                    isResetRequest ? <Loader bg="transparent" width={'w-5'} height={'h-5'} /> : <button onClick={() => resetHandlerClick()}>Reset</button>
                                }
                            </div>
            <div className="py-1">
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

export default SortPopup;
