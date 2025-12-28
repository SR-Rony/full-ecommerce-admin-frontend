
import { isValidArray } from "@/utils/func";
import Select from "react-select";

const TransferCategoriesSelect = ({selectedOptions,onInputChange,searchOptions,updateData, onChange: onChanges,minHeight } = {}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight:minHeight|| '60px', // Set the height you desire
    }),
    input: (provided, state) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
  };
  const IndicatorComponent = (props) => {
    return <div />; // You can customize this to an empty div or any other element
  };
  selectedOptions = isValidArray(selectedOptions) ?selectedOptions.filter(item => item.value !==updateData?._id):[];
  searchOptions = isValidArray(searchOptions) ?searchOptions.filter(item => item.value !==updateData?._id):[];
  return (
    <div>
      <Select
        isMulti
        placeholder="Select Transfer Categories"
        onChange={onChanges}
        value={selectedOptions }
        onInputChange={onInputChange}
        options={searchOptions}
        styles={customStyles}
        components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
      />
    </div>
  );
};

export default TransferCategoriesSelect;
