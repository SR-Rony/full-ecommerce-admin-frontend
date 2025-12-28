
import Select from "react-select";

const SelectProducts = ({ defaultOptions,options,handleInputChange, onChange: onChanges, minHeight } = {}) => {
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: minHeight || '60px', // Set the height you desire
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

    if (!(options?.length > 0)) return null;
    return (
        <div>
            <Select
                isMulti
                placeholder="Select Products"
                onChange={onChanges}
                value={defaultOptions}
                options={options}
                styles={customStyles}
                onInputChange={(value) => {
                    handleInputChange(value);
                }}
                components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
            />
        </div>
    );
};

export default SelectProducts;
