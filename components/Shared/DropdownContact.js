import { isValidArray } from "@/utils/func";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const DropdownContact = ({ options, selectedOption, onChanges }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    onChanges(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit">
      <button
        onClick={toggleDropdown}
        className="bg-white text-[#999ea6] font-[200] py-2 px-4  items-center border rounded-[4px] shadow-lg flex justify-between"
      >
        {selectedOption ? selectedOption : "All Categories"}
        <RiArrowDropDownLine size={18} />
      </button>
      {isOpen && (
        <div className="absolute w-full min-w-[300px]  max-w-[400px] z-10 border p-1 mt-2 bg-white rounded-[4px] shadow-lg h-[220px] overflow-auto">
          <button
            onClick={() =>
              handleOptionSelect({ name: "All Categories", value: "All" })
            }
            className="block text-left px-4 py-2 text-gray-800 hover:bg-slate-100  duration-200  rounded-[3px]  w-full"
          >
            All Categories
          </button>
          {isValidArray(options) &&
            options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(option)}
                className="block text-left px-4 py-2 text-gray-800 hover:bg-slate-100 duration-200 rounded-[3px]  w-full"
              >
                {option?.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default DropdownContact;
