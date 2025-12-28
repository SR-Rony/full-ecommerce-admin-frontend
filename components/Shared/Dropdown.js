import { isValidArray } from '@/utils/func';
import { useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

const Dropdown = ({ options,selectedOption,onChanges }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    onChanges(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block ">
      <button
        onClick={toggleDropdown}
        className="bg-white text-[#999ea6] font-[200] py-2 px-4  items-center border rounded-md shadow-lg flex justify-between"
      >
        {selectedOption}
        <RiArrowDropDownLine size={18}/>

      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg h-[120px] overflow-auto">
        
          {isValidArray(options)&&options.map((option,i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(option)}
              className="block text-left px-4 py-2 text-gray-800 hover:bg-gray-200 w-full"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
