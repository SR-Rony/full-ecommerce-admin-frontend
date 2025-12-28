
import Select from "react-select";

const ProductsSelectInput = ({selectedOptions,keys,isSingleProduct, onInputChange,searchOptions, onChange: onChanges,minHeight } = {}) => {
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

  return (
    <div>
      <Select
        isMulti={isSingleProduct? false: true}
        placeholder="Search to selects"
        onChange={(e) =>{
          onChanges(keys,e);
        }}
        value={selectedOptions}
        onInputChange={(value) =>{
          onInputChange(value);
        }}
        options={searchOptions}
        styles={customStyles}
        components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
      />
    </div>
  );
};

export default ProductsSelectInput;
