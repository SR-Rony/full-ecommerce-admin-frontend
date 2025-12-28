import Select from "react-select";

export const searchOptions = [
  { value: "orderIds", label: "Order Id" },
  // { value: 'customerName', label: 'Name' },
  { value: "email", label: "Email" },
  { value: "trackingNumbers", label: "Track Num..." },
];

const OrderFilterSelect = ({ value, setQuery, smallDivice }) => {
  const onChange = (e) => {
    setQuery((prev) => {
      return {
        ...prev,
        ["selectedSearchInput"]: e,
      };
    });
  };
  return (
    <div className={`   ${smallDivice ? "w-full" : "w-[7.2rem]"} `}>
      <Select
        options={searchOptions}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder="Select"
        className="z-[35]"
      />
    </div>
  );
};

export default OrderFilterSelect;
