import { isValidArray } from "@/utils/func";
import { RiArrowDropDownLine } from "react-icons/ri";
const options = [
  {
    label: "All Sites",
    value: "all",
  },
  {
    label: "Hammer & Bell",
    value: "hb",
  },
  {
    label: "Auctropin",
    value: "auctropin",
  },
];
const OrderSiteStatus = ({
  query,
  onChanges,
  data,
  setData,
  align,
  setPopup,
  noAllSite,
}) => {
  const toggleDropdown = () => {
    setData((prev) => {
      return {
        ...prev,
        siteMenuFilterOpen: !prev?.siteMenuFilterOpen,
      };
    });
  };

  const handleOptionSelect = (option) => {
    onChanges(option);
    setData((prev) => {
      return {
        ...prev,
        siteMenuFilterOpen: false,
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
        {query?.site?.label}
        <RiArrowDropDownLine size={18} />
      </button>
      {data?.siteMenuFilterOpen && (
        <div
          className={`absolute   top-full   ${
            align == "left" ? "left-0" : "right-0"
          }     z-10 mt-1 w-[140px] bg-white rounded-md shadow-lg  p-1  overflow-hidden`}
        >
          {isValidArray(options) &&
            options.filter((e)=>!noAllSite || e.value!="all").map((option, i) => (
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

export default OrderSiteStatus;
