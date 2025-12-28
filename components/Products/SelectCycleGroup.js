import Select from "react-select";

const options = [
    {
        label:"Trt Packages",
        value:"Trt Packages"
    },
    {
        label:"Mass & Off-Season Cycles",
        value:"Mass & Off-Season Cycles"
    },
    {
        label:"Cutting & Prep Cycles",
        value:"Cutting & Prep Cycles"
    },
    {
        label:"Strength Cycles",
        value:"Strength Cycles"
    },
    {
        label:"Lean Muscle Mass Cycles",
        value:"Lean Muscle Mass Cycles"
    },
    {
        label:"Post Cycle Therapy & Sexual",
        value:"Post Cycle Therapy & Sexual"
    },

];
const SelectCycleGroup = ({ productData, setProductData } = {}) => {

    return (
        <div className=""><div className="w-full shadow-lg">

            <Select
                options={options}
                value={productData?.selectCycleGroup}
                onChange={(value) => {
                    setProductData((prev) => {
                        const prevCycle = prev?.cycle || {};
                        return {
                            ...prev,
                            cycle: {
                                ...prevCycle,
                                cycleGroup: value?.value
                            },
                            selectCycleGroup: value
                        };
                    });
                }}
                placeholder="Please select cycle group"
                isMulti={false}
            />
        </div>
        </div>
    );
};

export default SelectCycleGroup;
