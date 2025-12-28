import Loader from '@/shared/Loader/Loader';
import { isValidArray } from '@/utils/func';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { FaCalendarAlt, FaSlidersH } from 'react-icons/fa';
import { MdOpenWith } from "react-icons/md";
import { TbCategoryFilled } from "react-icons/tb";

import CategoriesSelectInput from './CategoriesSelectInput';

const FilterProduct = ({ setQuery, query, resetHandler, fetchPopupsQueries }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isResetRequest, setIsResetRequest] = useState(false);
    const [isFilterRequest, setIsFilterRequest] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', closeDropdown);

        return () => {
            document.removeEventListener('mousedown', closeDropdown);
        };
    }, []);
    const handleChange = (keys, value) => {
        setQuery((prev) => {
            return {
                ...prev,
                [keys]: value
            };
        });
    };

    const categoriesHandle = (selectedOptions) => {
        if (selectedOptions.length) {
            const catItems = selectedOptions.map(itm => itm?.value);
            setQuery((prev) => {
                return {
                    ...prev,
                    categories: catItems
                };
            });
        } else {
            setQuery((prev) => {
                return {
                    ...prev,
                    categories: []
                };
            });
        }
    };

    const defaultOptionsCategories = isValidArray(query.categories) ? query.categories.flat(Infinity).map(item => {
        const val = typeof item === 'object' ? item.value || item : item;
        return {
            value: val,
            label: val,
        };
    }).filter(Boolean) : [];
    
    const resetHandlerClick = async () => {
        setIsResetRequest(true);
        await resetHandler();
        setIsResetRequest(false);
    };
    const filterHandlerClick = async () => {
        setIsFilterRequest(true);
        if (query && query?.startDate) {
            if (!query?.endDate) {
                query['endDate'] = new Date();
            }
        }
        await fetchPopupsQueries(query);
        setIsFilterRequest(false);
    };
    return (
        <div>
            <div className="relative inline-block text-left z-20" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    type="button"
                    className="flex items-center gap-2 cursor-pointer w-full py-2 text-sm font-medium border border-transparent rounded-md focus:ring-white relative"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                >

                    <FaSlidersH size={14} className="" />  Filter

                </button>

                {isOpen && (
                    <div
                        className=" origin-top-right absolute -right-[240px] mt-2 w-[300px]  h-[420px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <div className="pt-4 border-b px-6 pb-2">
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>      <FaSlidersH size={14} className="" />         <span>Filter</span></div>
                                {
                                    isResetRequest ? <Loader bg="transparent" width={'w-5'} height={'h-5'} /> : <button onClick={() => resetHandlerClick()}>Reset</button>
                                }
                            </div>
                        </div>
                        <div className='overflow-y-auto h-[350px] px-6'>
                            <div className='pt-5'>

                                <div className=''>
                                    <div className='flex items-center gap-2'>
                                        <FaCalendarAlt />
                                        <strong>Date Range</strong></div>
                                    <div className='pt-2 flex  items-center gap-3'>
                                        <div className='w-[50%] '>
                                            <p htmlFor="" className='pb-1'>Start Date</p>
                                            <input value={query?.startDate ? moment(query?.startDate).format("YYYY-MM-DD") : new Date()} className="text-[13px] cursor-pointer  rounded-sm w-full" min={0} type="date" placeholder='Start Date' onChange={(e) => {
                                                handleChange('startDate', e.target.value);
                                            }}
                                            />
                                        </div>
                                        <div className='w-[50%]'>
                                            <p htmlFor="" className='pb-1'>End Date</p>
                                            <input value={query?.endDate ? moment(query?.endDate).format("YYYY-MM-DD") : new Date()} className="text-[13px] cursor-pointer w-full rounded-sm" min={0} type="date" placeholder='End Date' onChange={(e) => {
                                                handleChange('endDate', e.target.value);
                                            }} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                           
                            <div className='pt-5'>

                                <div className=''>
                                    <div className='flex items-center gap-2'>
                                        <MdOpenWith />

                                        <strong>Active</strong></div>
                                    <div className='pt-2 flex  items-center gap-3'>
                                        <div className='w-[50%] '>
                                            <p className='p-[4px] text-center border text-sm rounded-sm cursor-pointer' style={{
                                                background: query.isActive == true && '#60a5fa',
                                                color: query.isActive == true && 'white',

                                            }} onClick={() => handleChange("isActive", true)}>Active </p>

                                        </div>
                                        <div className='w-[50%]'>
                                            <p className='p-[4px] text-center border text-sm rounded-sm cursor-pointer' style={{
                                                background: query.isActive == false && '#60a5fa',
                                                color: query.isActive == false && 'white',

                                            }} onClick={() => handleChange("isActive", false)}>Inactive </p>

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='pt-5'>

                                <div className=''>
                                    <div className='flex items-center gap-2'>
                                        <TbCategoryFilled size={15} />
                                        <strong>Categories</strong></div>
                                    <div className='pt-2'>
                                        <CategoriesSelectInput onChange={categoriesHandle} defaultOptions={defaultOptionsCategories} />
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="flex justify-end gap-4 px-4 relative -top-7">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                onClick={toggleDropdown}
                            >
                                Cancel
                            </button>
                            {isFilterRequest ? <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                            >
                                <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                            </button> : <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                                onClick={async () => {
                                    await filterHandlerClick();
                                    toggleDropdown();
                                }}
                            >
                                  Apply
                            </button>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterProduct;
