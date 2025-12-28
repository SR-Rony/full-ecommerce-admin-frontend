import { isValidArray } from '@/utils/func';
import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
  
const KeywordSelectInput = ({ value = [], keys,placeholder, setProductData,minHeight } = {}) => {
    const [text,setText] =useState('');

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          minHeight:minHeight|| '70px', // Set the height you desire
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
        // Split by comma and trim whitespace
        const values = inputValue ? [...new Set(inputValue.split(',').map(v => v.trim()).filter(Boolean))] : "";
      
        if (keys) {
            setProductData((prev) => {
                // Get existing values
                const existingValues = isValidArray(value) ? value.flat(Infinity).map(item => {
                    const val = typeof item === 'object' ? item.value || item : item;
                    return val;
                }).filter(Boolean) : [];

                // Combine existing and new values, and remove duplicates using Set
                const allValues = [...new Set([...existingValues, ...values])];

                return {
                    ...prev,
                    [keys]: allValues
                };
            });
        }
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

    const onChange = (keys, e) => {
       if(keys){
        setProductData((prev) => {
            const newValues = isValidArray([e].flat(Infinity)) ? [e].flat(Infinity).map(item => {
                const val = typeof item === 'object' ? item.value || item : item;
                return val;
            }).filter(Boolean) : [];
            
            // Remove duplicates using Set
            const uniqueValues = [...new Set(newValues)];

            return {
                ...prev,
                [keys]: uniqueValues
            };
        });
        setText('');
       }
    };

    let options = isValidArray(value)?value.flat(Infinity).map(item => {
        const  val =typeof item === 'object'?item.value ||item:item;
        return {
            value:val,
            label:val,
        };
    }).filter(Boolean):[];
    return (
        <div>
            <CreatableSelect
                placeholder={placeholder||""}
                isMulti
                isClearable
                isOptionDisabled={(option) => option.isDisabled}
                onCreateOption={handleCreate}
                onChange={(e)=> onChange(keys,e)}
                value={options}
                inputValue={text||""}
                onInputChange={(val) => setText(val)}
                onKeyDown={(e) =>{
                handleKeyDown(e);
                }}
                menuIsOpen={false}
                styles={customStyles}
                components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
            />
        </div>
    );
};

export default KeywordSelectInput;
