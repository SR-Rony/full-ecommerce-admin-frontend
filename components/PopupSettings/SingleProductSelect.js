
import { useFullStage } from "@/hooks/useFullStage";
import { getProducts } from "@/utils/instance";
import _ from 'lodash';
import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
const IndicatorComponent = (props) => {
    return <div />; // You can customize this to an empty div or any other element
};
const SingleProductSelect = ({ onChange: onChanges, minHeight,value } = {}) => {
    const [popupProductSelects, setPopupProductSelects] = useState([]);
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

    const fetchPopupProducts = async () => {
        try {
            if (!popupProductSelects?.length) {
                const res = await getProducts({ page: 1 });
                if (Array.isArray(res?.data?.data) && res.data?.data.length > 0) {
                    const catItems = res.data?.data.map(itm => {
                        return {
                            id: itm?._id,
                            label: itm?.title,
                            value: itm?.slug
                        };
                    });
                    setPopupProductSelects(catItems);
                }
            }
        } catch (error) { /* empty */ }

    };

    function handleDebounceFn(inputValue) {
        setPopupProductSelects([]);
        if (inputValue) {
            getProducts({ q: inputValue, page: 1 }).then((res) => {
                if (res?.data?.success) {
                    if (Array.isArray(res?.data?.data) && res.data?.data.length > 0) {
                        const catItems = res.data?.data.map(itm => {
                            return {
                                id: itm?._id,
                                label: itm?.title,
                                value: itm?.slug
                            };
                        });
                        setPopupProductSelects(catItems);
                    } else {
                        setPopupProductSelects([]);
                    }
                }

            }).catch(err => {
                setPopupProductSelects([]);
            });
        }
    }

    const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

    function handleChange(value) {
        debounceFn(value);
    };

    useEffect(() => {
        fetchPopupProducts();
    }, []);
    return (
        <div>
            <Select
                isMulti={false}
                placeholder="Select Products"
                onChange={onChanges}
                value={value}
                onInputChange={(value) => {
                    handleChange(value);
                }}
                options={popupProductSelects}
                styles={customStyles}
                components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
            />
        </div>
    );
};

export default SingleProductSelect;
