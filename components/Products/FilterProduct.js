import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { useEffect, useRef, useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import { MdFeaturedPlayList, MdOpenWith } from "react-icons/md";
import { TbCategoryFilled } from "react-icons/tb";

import { IoIosColorFilter } from "react-icons/io";
import CategoriesSelect from "./CategoriesSelect";

const FilterProduct = ({
  setQuery,
  query,
  resetHandler,
  fetchProductsQueries,
  setPopup,
}) => {
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
    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);
  const handleChange = (keys, value) => {
    setQuery((prev) => {
      return {
        ...prev,
        [keys]: value,
      };
    });
  };

  const categoriesHandle = (selectedOptions) => {
    if (selectedOptions.length) {
      const catItems = selectedOptions.map((itm) => itm?.value);
      setQuery((prev) => {
        return {
          ...prev,
          categories: catItems,
        };
      });
    } else {
      setQuery((prev) => {
        return {
          ...prev,
          categories: [],
        };
      });
    }
  };

  const defaultOptionsCategories = isValidArray(query.categories)
    ? query.categories
      .flat(Infinity)
      .map((item) => {
        const val = typeof item === "object" ? item.value || item : item;
        return {
          value: val,
          label: val,
        };
      })
      .filter(Boolean)
    : [];
  const resetHandlerClick = async () => {
    setIsResetRequest(true);
    await resetHandler();
    setIsResetRequest(false);
  };
  const filterHandlerClick = async () => {
    setIsFilterRequest(true);
    if (query && query?.startDate) {
      if (!query?.endDate) {
        query["endDate"] = new Date();
      }
    }
    await fetchProductsQueries(query);
    setIsFilterRequest(false);
  };

  return (
    <div>
      <div className="relative inline-block text-left z-30" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          type="button"
          className={`flex items-center gap-2 cursor-pointer w-full  text-sm font-medium border border-transparent  focus:ring-white relative   ${setPopup
              ? "bg-slate-100  px-2 py-1 rounded-[3px] hover:bg-slate-200"
              : "px-0 py-2 rounded-md"
            }  `}
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
          <FaSlidersH size={14} className="" /> Filter
        </button>

        {isOpen && (
          <div
            className={`  ${setPopup
                ? " fixed top-0 left-0  inset-0 m-auto  mt-6 w-11/12    sm:w-8/12 h-[85%]"
                : "absolute right-[0px]  origin-top-right w-[300px]    h-[480px] mt-2"
              }   ounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="pt-4 border-b px-6 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {" "}
                  <FaSlidersH size={14} className="" /> <span>Filter</span>
                </div>
                {isResetRequest ? (
                  <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                ) : (
                  <button onClick={() => resetHandlerClick()}>Reset</button>
                )}
              </div>
            </div>
            <div className="overflow-y-auto h-[350px] px-6">

              <div className="pt-2">
                <div className="">
                  <div className="flex items-center gap-2">
                    <IoIosColorFilter />

                    <strong>Type</strong>
                  </div>
                  <div className="pt-2 flex  items-center gap-3 w-full">
                    <select id="type"className="w-full"onChange={(e)=>handleChange("type", e.target.value)}>
                      <option value="All" selected={query?.type=="All"}>All</option>
                      <option value="General"selected={query?.type=="General"}>General</option>
                      <option value="Cycle"selected={query?.type=="Cycle"}>Cycle</option>
                      <option value="Bundle"selected={query?.type=="Bundle"}>Bundle</option>
                    </select>
                   
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <div className="">
                  <div className="flex items-center gap-2">
                    <MdFeaturedPlayList />

                    <strong>Featured</strong>
                  </div>
                  <div className="pt-2 flex  items-center gap-3">
                  <select id="type"className="w-full"  onChange={(e)=>handleChange("featured", e.target.value)}>
                      <option value="All"selected={query?.featured=='All'}>All</option>
                      <option value="Featured"selected={query?.featured=='Featured'}>Featured</option>
                      <option value="None Featured"selected={query?.featured=='None Featured'}>None Featured</option>
                    </select>

                  </div>
                </div>
              </div>
              <div className="pt-5">
                <div className="">
                  <div className="flex items-center gap-2">
                    <MdOpenWith />

                    <strong>Active</strong>
                  </div>
                  <div className="pt-2 flex  items-center gap-3">
                  <select id="type" className="w-full" onChange={(e)=>handleChange("active", e.target.value)}>
                      <option value="All"selected={query?.active=='All'}>All</option>
                      <option value="Active"selected={query?.active=='Active'}>Active</option>
                      <option value="None Active"selected={query?.active=='None Active'}>None Active</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <div className="">
                  <div className="flex items-center gap-2">
                    <TbCategoryFilled size={15} />
                    <strong>Categories</strong>
                  </div>
                  <div className="pt-2">
                    <CategoriesSelect
                      onChange={categoriesHandle}
                      defaultOptions={defaultOptionsCategories}
                    />
                  </div>
                </div>
              </div>

            </div>
            <div className="mt-4 flex justify-end gap-4 px-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => {
                  toggleDropdown();
                  setPopup && setPopup(false);
                }}
              >
                Cancel
              </button>
              {isFilterRequest ? (
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"
                >
                  <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                  onClick={async () => {
                    setPopup && setPopup(false);
                    await filterHandlerClick();
                    toggleDropdown();
                  }}
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterProduct;
