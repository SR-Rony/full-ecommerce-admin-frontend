import Multiselect from 'multiselect-react-dropdown';
import PropTypes from 'prop-types';

const MultiSelectDropdown = ({
    options,
    selectedValues,
    onSelect,
    onRemove,
    displayValue
}) => {
    return (
        <Multiselect
        placeholder='Search vendor sites'
            options={options} // Options to display in the dropdown
            selectedValues={selectedValues} // Pre-selected values
            onSelect={onSelect} // Function will trigger on select event
            onRemove={onRemove} // Function will trigger on remove event
            displayValue={displayValue} // Property name to display in the dropdown options
        />
    );
};

// Type checking for props
MultiSelectDropdown.propTypes = {
    options: PropTypes.array.isRequired,
    selectedValues: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    displayValue: PropTypes.string.isRequired,
};

// Default props
MultiSelectDropdown.defaultProps = {
    selectedValues: [],
};

export default MultiSelectDropdown;
