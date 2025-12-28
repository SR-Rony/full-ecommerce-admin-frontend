import { isValidArray } from "@/utils/func";
import { RiArrowDropDownLine } from "react-icons/ri";
const options = [
  { label: "Created At (ASC)", value: "createdAt.asc" },
  { label: "Created At (DESC)", value: "createdAt.desc" },
  { label: "Updated At (ASC)", value: "updatedAt.asc" },
  { label: "Updated At (DESC)", value: "updatedAt.desc" },
  { label: "Order ID (ASC)", value: "orderId.asc" },
  { label: "Order ID (DESC)", value: "orderId.desc" },
  { label: "Email (ASC)", value: "email.asc" },
  { label: "Email (DESC)", value: "email.desc" },
  { label: "Status (ASC)", value: "status.asc" },
  { label: "Status (DESC)", value: "status.desc" },
];
const OrderSortOptions = ({
  query,
  onChanges,
  data,
  setData,
  align,
  setPopup,
}) => {
  const toggleDropdown = () => {
    setData((prev) => {
      return {
        ...prev,
        sortFilterOptionOpen: !prev?.sortFilterOptionOpen,
      };
    });
  };

  const handleOptionSelect = (option) => {
    onChanges(option);
    setData((prev) => {
      return {
        ...prev,
        sortFilterOptionOpen: false,
      };
    });
    setPopup && setPopup(false);
  };

  // console.log(query?.site,'query?.site');
  return (
    <div className="w-auto relative">
      <button
        onClick={toggleDropdown}
        className={` ${
          setPopup
            ? "bg-slate-100   hover:bg-slate-200  text-slate=700 rounded-[3px]"
            : " bg-white text-[#333]  rounded-md"
        } font-[200] py-[7px] pl-3  items-center   shadow-[3px] flex justify-between`}
      >
        {query?.sortOption?.label||""}
        <RiArrowDropDownLine size={18} />
      </button>
      {data?.sortFilterOptionOpen && (
        <div
          className={`absolute  shadow-2xl top-full   ${
            align == "left" ? "left-0" : "right-0"
          }     z-10 mt-1 w-[250px] bg-white rounded-md shadow-lg  p-1  overflow-hidden`}
        >
          {isValidArray(options) &&
            options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(option)}
                className="block text-left px-4 py-2 text-gray-800 hover:bg-slate-100 w-full rounded"
              >
                {option.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default OrderSortOptions;
