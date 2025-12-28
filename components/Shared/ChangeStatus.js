import { isValidArray } from '@/utils/func';
import { RiArrowDropDownLine } from 'react-icons/ri';

const ChangeStatus = ({ options, query, onChanges,orderSingleDetails, orderData,setOrderData }) => {

  const toggleDropdown = () => {
    setOrderData((prev)=>{
      return {
        ...prev,
        menuOpen:!prev?.menuOpen
      };
    });
  };

  const handleOptionSelect = (option) => {
    onChanges(option);
    setOrderData((prev)=>{
      return {
        ...prev,
        menuOpen:false
      };
    });
  };

  return (
    <div className="w-auto relative inline-block ">
      {!isValidArray(orderSingleDetails?.orderIds) ? <button
        // onClick={toggleDropdown}
        className="bg-white cursor-not-allowed text-[#abb2bc] opacity-40 font-[200] py-[7px] px-2  items-center border rounded-md shadow-lg flex justify-between"
      >
        Change Status
        <RiArrowDropDownLine size={18} />

      </button> : <button
        onClick={toggleDropdown}
        className="bg-white text-[#333] font-[200] py-[7px] px-3  items-center border rounded-md shadow-lg flex justify-between"
      >
        Change Status
        <RiArrowDropDownLine size={18} />

      </button>}
      {orderData?.menuOpen&&isValidArray(orderSingleDetails?.orderIds) && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg h-[170px] overflow-auto">
          {isValidArray(options) && options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(option)}
              className="block text-left px-4 py-2 text-gray-800 hover:bg-gray-200 w-full"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChangeStatus;
