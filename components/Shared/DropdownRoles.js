import { isValidArray } from '@/utils/func';
import { useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

const DropdownRoles = ({ options,selectedOption,onChanges }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    onChanges(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={toggleDropdown}
        className="border-[#ccc]   h-[55.2px] font-[200] py-2 px-4  items-center border rounded-sm w-full shadow-lg flex justify-between"
      >
        {selectedOption?.name}
        <RiArrowDropDownLine size={18}/>

      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg  overflow-auto">
        
          {isValidArray(options)&&options.map((option,i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(option)}
              className="block text-left px-4 py-2 text-gray-800 hover:bg-gray-200 w-full"
            >
              {option?.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownRoles;
