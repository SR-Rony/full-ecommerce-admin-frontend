import Loader from "@/shared/Loader/Loader";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaSlidersH } from "react-icons/fa";
import { MdPayments, MdPriceChange } from "react-icons/md";
import { searchOptions } from "./OrderFilterSelect";
import PaymentStatusSelectInput from "./PaymentStatusSelectInput";

const FilterOrders = ({
  setQuery,
  query,
  resetHandler,
  fetchOrdersQueries,
  setActiveRange,
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

  const resetHandlerClick = async () => {
    if (setActiveRange) {
      setActiveRange("");
    }
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
    await fetchOrdersQueries({...query,sort:"createdAt.desc",sortOption:{ label: "Created At (DESC)", value: "createdAt.desc" }});
    setIsFilterRequest(false);
  };

  const defaultOptionSet = () => {
    setQuery((prev) => {
      return {
        ...prev,
        selectedSearchInput: searchOptions[0],
      };
    });
  };
  return (
    <div>
      <div className="relative inline-block text-left z-30" ref={dropdownRef}>
        <button
          onClick={() => {
            setQuery((prev) => {
              return {
                ...prev,
                selectedSearchInput: "",
              };
            });
            toggleDropdown();
          }}
          type="button"
          className="flex items-center gap-2 cursor-pointer w-full py-2 text-sm font-medium border border-transparent rounded-md focus:ring-white relative"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
          <FaSlidersH size={14} className="" /> Filter
        </button>

        {isOpen && (
          <div
            className=" origin-top-right absolute lg:right-[0px] mt-2 w-[300px]  h-[200px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
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
            <div className="overflow-y-auto h-auto px-6 pb-5 bg-white border-l border-r">
              <div className="pt-5">
                <div className="">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <strong>Date Range</strong>
                  </div>
                  <div className="pt-2 flex  items-center gap-3">
                    <div className="w-[50%] ">
                      <p htmlFor="" className="pb-1">
                        Start Date
                      </p>
                      <input
                        value={
                          query?.startDate
                            ? moment(query?.startDate).format("YYYY-MM-DD")
                            : new Date()
                        }
                        className="text-[13px] cursor-pointer  rounded-sm w-full"
                        min={0}
                        type="date"
                        placeholder="Start Date"
                        onChange={(e) => {
                          handleChange("startDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[50%]">
                      <p htmlFor="" className="pb-1">
                        End Date
                      </p>
                      <input
                        value={
                          query?.endDate
                            ? moment(query?.endDate).format("YYYY-MM-DD")
                            : new Date()
                        }
                        className="text-[13px] cursor-pointer w-full rounded-sm"
                        min={0}
                        type="date"
                        placeholder="End Date"
                        onChange={(e) => {
                          handleChange("endDate", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="">
                  <div className="flex items-center gap-2">
                    <MdPriceChange size={15} />
                    <strong>Order Amount</strong>
                  </div>
                  <div className="pt-2 flex  items-center gap-3">
                    <input
                      className="w-[50%] text-sm rounded-sm"
                      min={0}
                      value={query?.minPrice || ""}
                      type="number"
                      onChange={(e) => handleChange("minPrice", e.target.value)}
                      placeholder="Min"
                    />
                    <input
                      className="w-[50%] text-sm rounded-sm"
                      min={0}
                      value={query?.maxPrice || ""}
                      type="number"
                      onChange={(e) => handleChange("maxPrice", e.target.value)}
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
              {/* <div className='pt-5 pb-5'>

                                <div className=''>
                                    <div className='flex items-center gap-2'>
                                        <GrStatusGoodSmall />

                                        <strong>Order Status</strong></div>
                                    <div className='pt-2'>
                                        <OrderStatusSelectInput keys={"trackingStatus"} placeholder={""} setQuery={setQuery} value={query?.trackingStatus} />
                                    </div>
                                </div>
                            </div> */}
              <div className="pt-5 pb-5">
                <div className="">
                  <div className="flex items-center gap-2">
                    <MdPayments />
                    <strong>Payment Status</strong>
                  </div>
                  <div className="pt-2">
                    <PaymentStatusSelectInput
                      keys={"paymentStatus"}
                      placeholder={""}
                      setQuery={setQuery}
                      value={query?.paymentStatus}
                      minHeight={"100%"}
                    />
                  </div>
                </div>
              </div>
              {/* <div className='pt-5'>

                                <div className=''>
                                    <div className='flex items-center gap-2'>
                                        <AiFillDatabase />
                                        <strong>Order Ids</strong></div>
                                    <div className='pt-2'>
                                        <OrderIdsSelectInput keys={"orderIds"} placeholder={""} setQuery={setQuery} value={query?.orderIds} />
                                    </div>
                                </div>

                            </div> */}
              {/* <div className="pt-5">
                <div className="">
                  <div className="flex items-center gap-2">
                    <SiPivotaltracker />
                    <strong>Tracking Numbers</strong>
                  </div>
                  <div className="pt-2">
                    <OrderTrackingNumberSelectInput
                      keys={"trackingNumbers"}
                      placeholder={""}
                      setQuery={setQuery}
                      value={query?.trackingNumbers}
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <div className="flex justify-end gap-4 px-4 bg-white  border-l border-r border-b pb-3 rounded-b-md">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => {
                  defaultOptionSet();
                  toggleDropdown();
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
                    await filterHandlerClick();
                    defaultOptionSet();
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

export default FilterOrders;
