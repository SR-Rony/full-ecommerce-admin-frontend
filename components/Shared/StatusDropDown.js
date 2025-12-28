import { RiArrowDropDownLine } from "react-icons/ri";

const options = [
  { label: "Paid", value: "PAID" },
  { label: "Packed", value: "PACKED" },
  { label: "Partially Shipped", value: "PARTIALLY_SHIPPED" },
  { label: "Fully Shipped", value: "FULLY_SHIPPED" },
];

const StatusDropDown = ({
  selectedOption,
  onChanges,
  dropdownRef,
  isOpen,
  setIsOpen,
  className = "w-full h-full",
}) => {
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    onChanges(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={toggleDropdown}
        className={`bg-white   text-slate-600 font-semibold text-[13px] font-[200] p-2 items-center border rounded-md shadow-lg flex justify-between ${className}`}
      >
        {selectedOption}
        <RiArrowDropDownLine size={18} />
      </button>
      {isOpen && (
        <div
          className={`absolute z-10 mt-2 px-2 bg-white rounded-lg shadow-lg w-[150px] h-[120px] overflow-auto`}
        >
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(option)}
              className="block text-left px-2 py-1 text-gray-800 text-[11px] hover:bg-gray-200 w-full"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropDown;
