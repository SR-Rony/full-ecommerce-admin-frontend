
import { isValidArray, isValidEmail } from '@/utils/func';
import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const BulkContactEmailListsSelect = ({ value = [], placeholder, setEditorData, minHeight } = {}) => {
    const [text, setText] = useState('');

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: minHeight || '70px', // Set the height you desire
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
    const handleCreate = (inputValue) => {
        const commaToArr = inputValue.split(",").filter(Boolean);// generateTextToWordArray(inputValue).filter(Boolean);
        const items = isValidArray(commaToArr) ? commaToArr.map((_itVal) => {
            return {
                label: _itVal,
                value: _itVal,
            };
        }) : [{
            label: inputValue,
            value: inputValue,
        }];
        setEditorData((prev) => {
            return {
                ...prev,
                emailLists: isValidArray([value, items].flat(Infinity)) ? [value, items].flat(Infinity).map(item => {
                    const val = typeof item === 'object' ? item.value  : item;
                    return val;
                }).filter(item =>{
                  return  isValidEmail(item);
                }) : []
            };
        });
        setText("");
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && text !== '') {
            event.preventDefault();
            const inputValue = text;
            handleCreate(inputValue);
            setText('');
        }
    };

    const onChange = (e) => {
        setEditorData((prev) => {
            return {
                ...prev,
                emailLists: isValidArray([e].flat(Infinity)) ? [e].flat(Infinity).map(item => {
                    const val = typeof item === 'object' ? item.value: item;
                    return val;
                }).filter(item =>{
                    return  isValidEmail(item);
                  })  : []
            };
        });
        setText('');
    };

    let options = isValidArray(value) ? value.flat(Infinity).map(item => {
        const val = typeof item === 'object' ? item.value  : item;
        return {
            value: val,
            label: val,
        };
    }).filter(item =>{
        return  isValidEmail(item?.value);
      }) : [];
   
    return (
        <div>
            <CreatableSelect
                placeholder={placeholder || ""}
                isMulti
                isClearable
                isOptionDisabled={(option) => option.isDisabled}
                onCreateOption={handleCreate}
                onChange={(e) => onChange(e)}
                value={options}
                inputValue={text || ""}
                onInputChange={(val) => setText(val)}
                onKeyDown={(e) => {
                    handleKeyDown(e);
                }}
                menuIsOpen={false}
                styles={customStyles}
                components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
            />
        </div>
    );
};

export default BulkContactEmailListsSelect;
