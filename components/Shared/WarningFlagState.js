import { isValidArray } from '@/utils/func';
import { RiArrowDropDownLine } from 'react-icons/ri';
const options = [
    {
        label: 'All Warning Flags',
        value: "all",
        keys:"hasWarningFlag"

    },
    {
        label: 'Only Warning Flags',
        value: true,
        keys:"hasWarningFlag"

    },
    {
        label: 'None Warning Flags',
        keys: 'hasWarningFlag',
        value:false,

    },
];
const WarningFlagState = ({ query, onChanges, data, setData }) => {

    const toggleDropdown = () => {
        setData((prev) => {
            return {
                ...prev,
                siteDemandMenuOpen: !prev?.siteDemandMenuOpen
            };
        });
    };

    const handleOptionSelect = (option) => {
        onChanges(option);
        setData((prev) => {
            return {
                ...prev,
                siteDemandMenuOpen: false
            };
        });
    };

    // console.log(query?.site,'query?.site');
    return (
        <div className="w-auto relative">
         <button
                onClick={toggleDropdown}
                className="bg-white text-[#333] font-[200] py-[7px] px-3  items-center  rounded-md shadow-lg flex justify-between"
            >
                {query?.demand?.label}
                <RiArrowDropDownLine size={18} />

            </button>
            {data?.siteDemandMenuOpen && (
                <div className="absolute z-10 mt-1 w-[200px] bg-white rounded-md shadow-lg h-[140px] ">
                    {isValidArray(options) && options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => handleOptionSelect(option)}
                            className="block text-left px-4 py-2 text-gray-800 hover:bg-gray-200 w-full"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WarningFlagState;
