import useClickOutSide from "@/hooks/useClickOutside";
import { useFullStage } from "@/hooks/useFullStage";
import Paginate from "@/shared/Paginate/Paginate";
import { isValidArray } from "@/utils/func";
import { BulkRemoveTestCustomer, EntireRemoveAllTestCustomer, getCustomers } from "@/utils/instance";
import _ from "lodash";
import momentTZ from "moment-timezone";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsFilter } from "react-icons/bs";
import { FaCaretDown, FaCaretUp, FaPlus, FaPlusCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import EmptyTableSectionTwo from "../EmptyDataSection/EmptyTableSectionTwo";
import CustomerActiveModal from "../Modals/Customer/CustomerActiveModal";
import CustomerBlockedModal from "../Modals/Customer/CustomerBlockedModal";
import CustomerCreateModal from "../Modals/Customer/CustomerCreateModal";
import CustomerDetailsModal from "../Modals/Customer/CustomerDetailsModal";
import CustomerEmailVerifiedModal from "../Modals/Customer/CustomerEmailVerifiedModal";
import OrderSiteStatus from "../Shared/OrderSiteStatus";
import ActionCustomers from "./ActionCustomers";
import CustomerFilterSelect, { searchOptions } from "./CustomerFilterSelect";
import CustomerStatusFilter from "./CustomerStatusFilter";
import FilterCustomers from "./FilterCustomers";
import SearchCustomers from "./SearchCustomers";
const Customer = (params = {}) => {
  const {
    customerName,
    email,
    isEmailVerified,
    isAccountApproved,
    isBlocked,
    customerIds,
    startDate,
    endDate,
    isTestCustomer = false,
    sort,
  } = params;
  const [allData, setAllData] = useState([]);
  const { Customer } = useFullStage();
  const [customerSingleDetails, setCustomerSingleDetails] =
    Customer.CustomerSingleDetails;
  const [customerPage, setCustomerPage, customerLimit, setCustomerLimit] =
    Customer.CustomerPaginate;
  const [customers, setCustomers] = Customer.Customers;
  const [initPaginate, setInitPaginate] = useState(false);
  const [isRequestCustomer, setIsRequestCustomer] = useState(false);
  const [query, setQuery] = useState({
    site: { label: "All Sites", value: "" },
    siteUserOption: { label: "All", value: "", keys: "isBlocked" },
  });
  const [activeTab, setActiveTab] = useState("Profile");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isPopup, setPopup] = useState(false);
  const popupRef = useRef(null);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [isEmailVerifiedModalOpen, setIsEmailVerifiedModalOpen] =
    useState(false);
  const [customerUpdateData, setCustomerUpdateData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const pathname =usePathname();
  // Create a state variable to track selected items
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortIconSelect, setSortIconSelect] = useState({
    isName: true,
    isEmail: true,
    isMailVerified: true,
    isStatus: true,
    isDate: true,
  });
  const router = useRouter();
  const resetQuery = {
    selectedSearchInput: searchOptions[0],

    isTestCustomer: isTestCustomer,
    site: {
      label: "All",
      value: "all",
    },
    siteUserOption: { label: "All", value: "", keys: "isBlocked" },

  };
  const [actionType, setActionType] = useState({});
  const [customerDetailsModalOpen, setCustomerDetailsModalOpen] =
    useState(false);
  const [customerCreateModalOpen, setCustomerCreateModalOpen] = useState(false);
  useEffect(() => {
    if (params && Object.values(params).length) {
      setQuery({ ...query, ...params });
    }
  }, [params]);
  // Function to handle the "Select All" checkbox click event
  const handleSelectAllClick = () => {
    setSelectAllChecked(!selectAllChecked);
    setCustomerData((prev) => {
      return {
        ...prev,
        menuOpen: !selectAllChecked,
      };
    });
    // Update the state of individual checkboxes in the tbody
    if (selectAllChecked) {
      setCustomerSingleDetails((prev) => {
        return {
          ...prev,
          customerIds: [],
        };
      });
      setSelectedItems([]);
    } else {
      const allIds = isValidArray(customers?.data)
        ? customers?.data.map((item) => item._id)
        : [];

      setSelectedItems(allIds);
      setCustomerSingleDetails((prev) => {
        return {
          ...prev,
          customerIds: allIds,
        };
      });
    }
  };

  // Function to handle individual checkbox clicks
  const handleCheckboxClick = (id) => {
    setCustomerData((prev) => {
      return {
        ...prev,
        menuOpen: true,
      };
    });

    if (selectedItems.includes(id)) {
      const lists = selectedItems.filter((item) => item !== id);
      if (lists.length == 0) {
        setCustomerData((prev) => {
          return {
            ...prev,
            menuOpen: false,
          };
        });
      }
      setSelectedItems(lists);
      setCustomerSingleDetails((prev) => {
        return {
          ...prev,
          customerIds: lists,
        };
      });
    } else {
      const allIds = [...selectedItems, id];
      setSelectedItems(allIds);
      setCustomerSingleDetails((prev) => {
        return {
          ...prev,
          customerIds: allIds,
        };
      });
    }

    // Check if all individual checkboxes are selected and update the "Select All" checkbox accordingly
    const allSelected = selectedItems.length === allData.length;

    setSelectAllChecked(allSelected);
  };

  const fetchCustomersInitLoad = async () => {
    try {
      setIsRequestCustomer(true);
      const queryFilter = {
        customerIds: customerIds ?? "",
        customerName: customerName ?? "",
        isTestCustomer:  pathname === "/admin/customers/test-customers/" ? pathname === "/admin/customers/test-customers/" || isTestCustomer : isTestCustomer ?? isTestCustomer,
        email: email ?? "",
        startDate: startDate ?? "",
        endDate: endDate ?? "",
        sort: sort ?? "latest",
        page: 1,
        limit: customerLimit,
      };
      const res = await getCustomers(queryFilter);
      setIsRequestCustomer(false);
      const customerIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?._id)
        : [];
      setAllData(customerIdsArr);
      setCustomers(res?.data);
    } catch (error) {
      //console.log(error);
      setIsRequestCustomer(false);
      /* empty */
    }
  };

  useEffect(() => {
    fetchCustomersInitLoad(resetQuery);
    setQuery((prev) => {
      return {
        ...prev,
        selectedSearchInput: searchOptions[0],
      };
    });
  }, []);

  const fetchCustomersQueries = async (val) => {
    try {
      setIsRequestCustomer(true);
      const res = await getCustomers(val || query);

      // if(res?.data?.success==false){
      //   ToastEmitter('error',res?.data?.message);
      // }
      setIsRequestCustomer(false);
      const customerIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?._id)
        : [];
      setAllData(customerIdsArr);
      setCustomers(res?.data);
    } catch (error) {
      //  ToastEmitter('error',error?.response?.data.message);
      // //console.log(error);
      setIsRequestCustomer(false);
      return false;
      /* empty */
    }
  };

  const fetchPaginateCustomers = async () => {
    try {
      setIsRequestCustomer(true);
      const queryFilter = {
        ...query,
        page: customerPage || 1,
        limit: customerLimit,
      };
      const res = await getCustomers(queryFilter);

      setIsRequestCustomer(false);
      const customerIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?._id)
        : [];
      setAllData(customerIdsArr);
      setCustomers(res?.data);
    } catch (error) {
      setIsRequestCustomer(false);
      /* empty */
    }
  };

  useMemo(() => {
    if (initPaginate) {
      fetchPaginateCustomers();
    }
  }, [customerPage]);

  function handleDebounceFn(val) {
    fetchCustomersQueries(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function handleChange(value) {
    const val = { ...query, q: value };
    setQuery(val);
    debounceFn(val);
  }
  const resetHandler = async () => {

    setQuery(resetQuery);
    await fetchCustomersQueries(resetQuery);
    return true;
  };

  const handleSort = async (sort) => {
    setQuery((prev) => {
      return {
        ...prev,
        sort: sort,
      };
    });
    const queryFilter = { ...query, sort: sort, page: 1, limit: customerLimit };
    await fetchCustomersQueries(queryFilter);
  };
  const sortChangeHandler = (keys, sort) => {
    setSortIconSelect((prev) => {
      return {
        ...prev,
        [keys]: sort,
      };
    });
  };

  const manuallyOpenedRef = useRef(false); // ⬅️ Track manual table click

  const handleSingleCustomer = (customer) => {
    let customerId = null;

    if (typeof customer === "object" && customer?._id) {
      customerId = customer._id;
    } else if (typeof customer === "string") {
      customerId = customer;
    }

    if (!customerId) return;

    manuallyOpenedRef.current = true; // ✅ Mark as manually opened

    // Update the URL if not already set
    if (router.query.customerId !== customerId) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, customerId },
        },
        undefined,
        { shallow: true }
      );
    }

    // Set details only if it's a full object and different
    if (
      typeof customer === "object" &&
      customer?._id &&
      customerSingleDetails?._id !== customer._id
    ) {
      setCustomerSingleDetails(customer);
    }

    setActiveTab("Profile");
    setCustomerDetailsModalOpen(true);
  };

  useEffect(() => {
    const queryCustomerId = router?.query?.customerId;
    if (!queryCustomerId) return;

    // Skip if already opened manually
    if (manuallyOpenedRef.current) {
      manuallyOpenedRef.current = false; // Reset flag
      return;
    }

    // If modal not open or different customer selected
    if (
      !customerDetailsModalOpen ||
      customerSingleDetails?._id !== queryCustomerId
    ) {
      handleSingleCustomer(queryCustomerId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.customerId]);

  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      await fetchCustomersQueries({ ...query, site });
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };

  useClickOutSide(popupRef, () => {
    setPopup(false);
  });

  const handleBulkRemoveTestCustomer = async () => {

    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete selected test customer`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await BulkRemoveTestCustomer(customerSingleDetails?.customerIds);
          if (res.data.success) {
            setCustomerPage(1);
            setSelectAllChecked(false);
            setSelectedItems([]);
            const isTestPath = router.pathname == '/admin/customers/test-customers';
            fetchPaginateCustomers({ isTestCustomer: isTestPath });
            Swal.fire({
              title: "Success",
              text: res?.data?.message,
              icon: "success",
            });
          }
        } catch (error) {
          console.log(error, 'bulk remove');
          Swal.fire({
            title: "Error!",
            text: error?.response?.data?.message,
            icon: "error",
          });
        }
      }
    });
  };
  const handleEntireAllRemoveTestCustomer = async () => {

    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete entire all test customers`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await EntireRemoveAllTestCustomer();
          if (res.data.success) {
            setCustomerPage(1);
            setSelectAllChecked(false);
            setSelectedItems([]);
            const isTestPath = router.pathname == '/admin/customers/test-customers';
            fetchPaginateCustomers({ isTestCustomer: isTestPath });
            Swal.fire({
              title: "Success",
              text: res?.data?.message,
              icon: "success",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error?.response?.data?.message,
            icon: "error",
          });
        }
      }
    });
  };
  return (
    <div>
      <div className="box my-4">
        <div className="text-right bg-white rounded-[4px]   px-8 pt-4 flex gap-2 justify-end uppercase">
          {" "}
          <p>{isTestCustomer == true ? "Total Test Customers" : "Total Customers"} ({customers?.paginate?.totalCount || 0})</p>{" "}
        </div>

        {/* <|==================| Large Screen |=================|> */}
        <div className="hidden lg:block">
          <div className="flex  justify-between px-8 pt-4 flex-wrap">
            <div className="flex  flex-wrap  items-center gap-4">
              <h5 className="box-title my-auto">Customers</h5>
              <CustomerFilterSelect
                value={query?.selectedSearchInput}
                setQuery={setQuery}
              />
              <SearchCustomers onChangeHandler={handleChange} query={query} />
            </div>

            <div className="">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <FilterCustomers
                    setQuery={setQuery}
                    query={query}
                    resetHandler={resetHandler}
                    isTestCustomer={isTestCustomer}
                    fetchCustomersQueries={fetchCustomersQueries}
                  />
                </div>{" "}
                <div className={` rounded-sm p-[7px] px-2 cursor-pointer z-50`}>
                  <OrderSiteStatus
                    data={customerData}
                    setData={setCustomerData}
                    query={query}
                    onChanges={onChangeSiteType}
                  />
                </div>
                |
                {selectedItems?.length !== 0 && customerData?.menuOpen && (
                  <>
                    <div>
                      <ActionCustomers
                        setSelectedItems={setSelectedItems}
                        setCustomerUpdateData={setCustomerUpdateData}
                        value={customerUpdateData}
                        setIsBlockedModalOpen={setIsBlockedModalOpen}
                        setIsActiveModalOpen={setIsActiveModalOpen}
                        actionType={actionType}
                        setActionType={setActionType}
                        setIsEmailVerifiedModalOpen={
                          setIsEmailVerifiedModalOpen
                        }
                      />
                    </div>{" "}
                    |
                  </>
                )}

                <div>
                  <CustomerStatusFilter
                    setQuery={setQuery}
                    query={query}
                    resetHandler={resetHandler}
                    fetchCustomersQueries={fetchCustomersQueries}
                  />
                </div>

                |
                {isTestCustomer === true && <>
                  <div className="flex justify-end items-center gap-4">

                    {isValidArray(customerSingleDetails?.customerIds) && <button className="flex items-center gap-2 border px-3 py-2 rounded-md" onClick={() => {
                      handleBulkRemoveTestCustomer();
                    }}>
                      <MdDeleteOutline size={20} />
                      Bulk Delete Test Customer
                    </button>}

                  </div>

                </>}
                <button
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    setCustomerUpdateData({ site: "hb", isTestCustomer: false });
                    setCustomerCreateModalOpen(true);
                  }}
                >
                  <FaPlus size={14} /> Add customer
                </button>

              </div>

            </div>
          </div>
        </div>
        {/* <|==================| Small Screen |=================|> */}
        <div className=" block  lg:hidden">
          <div
            className="flex  justify-between px-4
           pt-4 flex-wrap gap-3"
          >
            <div className="flex  flex-wrap  items-center gap-4">
              <h5 className="box-title my-auto">Customers</h5>
              <CustomerFilterSelect
                value={query?.selectedSearchInput}
                setQuery={setQuery}
              />
              <SearchCustomers onChangeHandler={handleChange} query={query} />
            </div>

            <div className="">
              <div className="flex items-center gap-4 flex-wrap ">
                <button
                  onClick={() => {
                    setPopup(true);
                  }}
                  className="flex items-center gap-1 cursor-pointer border border-blue-500 text-blue-500 px-2 py-1 rounded-[3px]  "
                >
                  <BsFilter size={16} />
                </button>
                <button
                  className="flex items-center gap-1 cursor-pointer  bg-blue-500 text-white px-3 py-1 rounded-[3px]"
                  onClick={() => {
                    setCustomerUpdateData({ site: "hb" });
                    setCustomerCreateModalOpen(true);
                  }}
                >
                  <FaPlusCircle size={14} /> Add customer
                </button>
              </div>
            </div>
          </div>
          {isPopup && (
            <div className="fixed  top-0 left-0 w-screen h-screen  bg-slate-700 bg-opacity-20 z-50">
              <div
                ref={popupRef}
                className="absolute m-auto inset-0  w-fit  h-fit py-2 px-3   bg-white rounded-lg   flex  items-center justify-center gap-4 flex-wrap"
              >
                <div className={` rounded-sm p-[7px] px-2 cursor-pointer z-50`}>
                  <OrderSiteStatus
                    data={customerData}
                    setData={setCustomerData}
                    query={query}
                    onChanges={onChangeSiteType}
                    align={"left"}
                    setPopup={setPopup}
                  />
                </div>
                <div>
                  <FilterCustomers
                    setQuery={setQuery}
                    query={query}
                    isTestCustomer={isTestCustomer}
                    resetHandler={resetHandler}
                    fetchCustomersQueries={fetchCustomersQueries}
                    setPopup={setPopup}
                  />
                </div>
                <div>
                  <CustomerStatusFilter
                    setQuery={setQuery}
                    query={query}
                    resetHandler={resetHandler}
                    fetchCustomersQueries={fetchCustomersQueries}
                    setPopup={setPopup}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="box-body">
          <div className="table-bordered whitespace-nowrap rounded-sm overflow-auto">
            <table className="ti-custom-table ti-custom-table-head edit-table">
              <thead className="bg-gray-100 dark:bg-black/20">
                <tr className="">
                  <th scope="col" className="dark:text-white/70">
                    <div className="flex leading-[0] justify-center">
                      <input
                        type="checkbox"
                        className="border-gray-500 ti-form-checkbox mt-0.5"
                        onChange={handleSelectAllClick}
                        checked={selectAllChecked}
                        id="hs-default-checkbox"
                      />
                      <label
                        htmlFor="hs-default-checkbox"
                        className="text-sm text-gray-500 dark:text-white/70"
                      ></label>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="dark:text-white/70 cursor-pointer"
                    onClick={() => {
                      if (!sortIconSelect.isName) {
                        handleSort("name.asc");
                      } else {
                        handleSort("name.desc");
                      }
                      sortChangeHandler("isName", !sortIconSelect.isName);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span> Customer Name </span>{" "}
                      {sortIconSelect?.isName ? (
                        <FaCaretDown
                          size={18}
                          className="cursor-pointer"
                          onClick={() => { }}
                        />
                      ) : (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="dark:text-white/70 cursor-pointer"
                    onClick={() => {
                      if (!sortIconSelect.isEmail) {
                        handleSort("email.asc");
                      } else {
                        handleSort("email.desc");
                      }
                      sortChangeHandler("isEmail", !sortIconSelect.isEmail);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span> Email </span>{" "}
                      {sortIconSelect?.isEmail ? (
                        <FaCaretDown size={18} className="cursor-pointer" />
                      ) : (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="dark:text-white/70 cursor-pointer"
                    onClick={() => {
                      if (!sortIconSelect.isMailVerified) {
                        handleSort("mailVerified.asc");
                      } else {
                        handleSort("mailVerified.desc");
                      }
                      sortChangeHandler(
                        "isMailVerified",
                        !sortIconSelect.isMailVerified
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span> Mail Status </span>{" "}
                      {sortIconSelect?.isMailVerified ? (
                        <FaCaretDown size={18} className="cursor-pointer" />
                      ) : (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="dark:text-white/7 cursor-pointer"
                    onClick={() => {
                      if (!sortIconSelect.isStatus) {
                        handleSort("status.asc");
                      } else {
                        handleSort("status.desc");
                      }
                      sortChangeHandler("isStatus", !sortIconSelect.isStatus);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span> Active Status </span>{" "}
                      {sortIconSelect?.isStatus ? (
                        <FaCaretDown size={18} className="cursor-pointer" />
                      ) : (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="dark:text-white/70"
                    onClick={() => {
                      if (!sortIconSelect?.isDate) {
                        handleSort("date.asc");
                      } else {
                        handleSort("date.desc");
                      }
                      sortChangeHandler("isDate", !sortIconSelect.isDate);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span> CreatedAt </span>{" "}
                      {sortIconSelect?.isDate ? (
                        <FaCaretDown size={18} className="cursor-pointer" />
                      ) : (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="!text-end dark:text-white/70">
                    Site
                  </th>
                </tr>
              </thead>
              <tbody>
                {isValidArray(customers?.data) &&
                  customers?.data.map((customer, i) => (
                    <tr className="order-list" key={i}>
                      <td className="">
                        <div className="flex items-center h-5 product-checkbox justify-center">
                          <input
                            id="product-check-1"
                            type="checkbox"
                            className="border-gray-500 ti-form-checkbox"
                            value=""
                            aria-label="..."
                            onChange={() => handleCheckboxClick(customer?._id)}
                            checked={selectedItems.includes(customer?._id)}
                          />
                          <label htmlFor="product-check-1" className="sr-only">
                            Checkbox
                          </label>
                        </div>
                      </td>
                      <td
                        className="font-semibold cursor-pointer pl-2 "
                        onClick={() => {
                          handleSingleCustomer(customer);
                        }}
                      >
                        {customer?.firstName || "---"}{" "}
                        {customer?.lastName || "----"}
                      </td>
                      <td
                        className="pl-2 "
                        onClick={() => {
                          handleSingleCustomer(customer);
                        }}
                      >
                        {customer?.email}
                      </td>
                      <td
                        className="pl-2 "
                        onClick={() => {
                          handleSingleCustomer(customer);
                        }}
                      >
                        {customer?.isEmailVerified ? "Verified" : "Unverified"}
                      </td>
                      <td
                        className="pl-2 cursor-pointer"
                        onClick={() => handleSingleCustomer(customer)}
                      >
                        {customer?.isBlocked ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Blocked
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            {customer?.approved_by_admin_at ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                                <span className="ml-1 text-green-600">(Approved)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Active
                                <span className="ml-1 text-yellow-600">(Approval Required)</span>
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td
                        className="pl-2 "
                        onClick={() => {
                          handleSingleCustomer(customer);
                        }}
                      >
                        <p>
                          {momentTZ
                            .utc(customer.createdAt)
                            .tz("America/New_York")
                            .format("YY.MM.DD")}
                        </p>
                        <p>
                          {momentTZ
                            .utc(customer.createdAt)
                            .tz("America/New_York")
                            .format("h:mma z")}
                        </p>
                      </td>
                      <td
                        className="pl-2  text-end font-medium"
                        onClick={() => {
                          handleSingleCustomer(customer);
                        }}
                      >
                        <button
                          aria-label="anchor"
                          className="w-8 h-8 rounded-full p-0 transition-none focus:outline-none "
                        >
                          {(customer?.origin || "")?.includes(".site")
                            ? "HB_SITE"
                            : (customer?.site ?? "N/A").toUpperCase()}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!isRequestCustomer && customers?.data?.length === 0 && (
              <>
                <main
                  id="content"
                  className="mx-auto block w-full min-h-[300px] mt-6"
                >
                  {/* <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                    <h1 className="block font-bold text-xl my-2">
                      Search No Result
                    </h1>
                    <p>
                      We're sorry. We cannot find any matches for your search
                      term.
                    </p>
                  </div> */}
                  <div className="w-9/12 md-5/12 mx-auto">
                    <EmptyTableSectionTwo />
                  </div>
                </main>
              </>
            )}
          </div>
          <div className="mt-6">
            <Paginate
              setCurrentPage={setCustomerPage}
              totalPages={customers?.paginate?.totalPage || 0}
              currentPage={customerPage}
              setInitPaginate={setInitPaginate}
            />
          </div>
        </div>
      </div>
      <CustomerBlockedModal
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchCustomers={fetchCustomersQueries}
        isOpen={isBlockedModalOpen}
        actionType={actionType}
        setIsOpen={setIsBlockedModalOpen}
      />

      {
        console.log('isActiveModalOpen', isActiveModalOpen)
      }
      <CustomerActiveModal
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchCustomers={fetchCustomersQueries}
        isOpen={isActiveModalOpen}
        setIsOpen={setIsActiveModalOpen}
      />
      <CustomerEmailVerifiedModal
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchCustomers={fetchCustomersQueries}
        isOpen={isEmailVerifiedModalOpen}

        setIsOpen={setIsEmailVerifiedModalOpen}
      />

      <CustomerDetailsModal
        isOpen={customerDetailsModalOpen}
        setIsOpen={setCustomerDetailsModalOpen}
        customerSingleDetails={customerSingleDetails}
        setCustomerSingleDetails={setCustomerSingleDetails}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fetchCustomers={fetchCustomersQueries}
      />
      <CustomerCreateModal
        isOpen={customerCreateModalOpen}
        setIsOpen={setCustomerCreateModalOpen}
        data={customerUpdateData}
        setData={setCustomerUpdateData}
        fetchData={fetchCustomersQueries}
      />
    </div>
  );
};

export default Customer;
