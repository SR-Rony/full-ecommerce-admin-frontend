import Select from "react-select";

export const searchOptions = [
  { value: "customerName", label: "Name" },

  { value: "customerIds", label: "Customer Id" },

  { value: "email", label: "Email" },
];

const CustomerFilterSelect = ({ value, setQuery }) => {
  const onChange = (e) => {
    setQuery((prev) => {
      return {
        ...prev,
        ["selectedSearchInput"]: e,
      };
    });
  };

  return (
    <div className="w-[7.2rem]  z-30">
      <Select
        options={searchOptions}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder="Select"
      />
    </div>
  );
};

export default CustomerFilterSelect;
