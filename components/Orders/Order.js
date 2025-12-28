import { useFullStage } from "@/hooks/useFullStage";
import Paginate from "@/shared/Paginate/Paginate";
import { downloadTxtAddressFormatter, isValidArray } from "@/utils/func";
import {
  BulkRemoveTestOrder,
  EntireRemoveAllTestOrder,
  getOrderCounts,
  getOrders,
  orderStatusSingleUpdate,
  orderStatusUpdate,
} from "@/utils/instance";
import jsPDF from "jspdf";
import "jspdf-autotable";
import _ from "lodash";
import momentTZ from "moment-timezone";
import { useRouter } from "next/router";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdDeleteOutline, MdEmail, MdOutlineFileDownload } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import Swal from "sweetalert2";

import TableSkeleton from "@/shared/skeleton/TableSkeleton";
import moment from "moment/moment";
import EmptyTableSection from "../EmptyDataSection/EmptyTableSection";
import SendMailModal from "../Modals/BulkContact/SendMailModal";
import BulkTrackingNumberUpdate from "../Modals/Order/BulkTrackingNumberUpdate";
import OrderDetailsModal from "../Modals/Order/OrderDetailsModal";
import OrderTrackingNumbersUpdate from "../Modals/Order/OrderTrackingNumbersUpdate";
import OrderEditModal from "../Modals/OrderEditModal";
import ChangeStatus from "../Shared/ChangeStatus";
import Dropdown from "../Shared/Dropdown";
import OrderSiteStatus from "../Shared/OrderSiteStatus";
import OrderSortOptions from "../Shared/OrderSortOptions";
import FilterOrders from "./FilterOrders";
import OrderFilterSelect, { searchOptions } from "./OrderFilterSelect";
import SearchOrders from "./SearchOrders";
import BulkTrackingNumberUpdateVersion2 from "../Modals/Order/BulkTrackingNumberUpdateVersion2";
pdfMake.vfs = pdfFonts?.pdfMake?.vfs;
export const optionStatusFilter = [
  {
    label: "All",
    value: "CANCELLED,PAID,PACKED,PARTIALLY_SHIPPED,FULLY_SHIPPED",
  },

  {
    label: "Paid",
    value: "PAID",
  },
  {
    label: "Packed",
    value: "PACKED",
  },
  {
    label: "Partially Shipped",
    value: "PARTIALLY_SHIPPED",
  },
  {
    label: "Fully Shipped",
    value: "FULLY_SHIPPED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
];
const oneStatusOptions = [
  {
    label: "Paid",
    value: "PAID",
  },
  {
    label: "Packed",
    value: "PACKED",
  },
  {
    label: "Partially Shipped",
    value: "PARTIALLY_SHIPPED",
  },
  {
    label: "Fully Shipped",
    value: "FULLY_SHIPPED",
  },
];
const multipleStatusOptions = [
  {
    label: "Paid",
    value: "PAID",
  },
  {
    label: "Packed",
    value: "PACKED",
  },
  {
    label: "Partially Shipped",
    value: "PARTIALLY_SHIPPED",
  },
  {
    label: "Fully Shipped",
    value: "FULLY_SHIPPED",
  },
];
const Order = (params = {}) => {
  const {
    q,
    defaultOptions,
    customerId,
    orderIds,
    minPrice,
    maxPrice,
    trackingNumbers,
    trackingStatus,
    startDate,
    endDate,
    sort,
    isPendingOrder = false,
    isTestOrder = false,
  } = params;
  const [allData, setAllData] = useState([]);
  const { Order } = useFullStage();
  const [activeTab, setActiveTab] = useState("orderDetails");
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const [orderPage, setOrderPage, orderLimit, setOrderLimit] =
    Order.OrderPaginate;
  const [orders, setOrders] = Order.Orders;
  const [initPaginate, setInitPaginate] = useState(false);
  const [isRequestOrder, setIsRequestOrder] = useState(false);
  const [query, setQuery] = useState({
    site: { label: "All Sites", value: "" },
    sort: "updatedAt.desc",
    sortOption: {
      label: "Updated At (DESC)",
      value: "updatedAt.desc",
    },
  });
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusUpdateModalOpen, setStatusUpdateModalOpen] = useState(false);
  const [orderMailResendOpen, setOrderMailResendOpen] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [orderStats, setOrderStats] = useState([]);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [trackingNumberModalOpen, setTrackingNumberModalOpen] = useState(false);
  const [editorData, setEditorData] = useState({});
  const [orderEditModalOpen, setOrderEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [showBulkTrackingModalVersion2, setShowBulkTrackingModalVersion2] = useState(false);
  const [showBulkCount, setShowBulkCount] = useState(1);
  const [sortIconSelect, setSortIconSelect] = useState({
    isOrderNo: true,
    isEmail: true,
    isDate: true,
    isTotalUsd: true,
    isStatus: true,
  });
  const router = useRouter();
  const [fileFormat, setFileFormat] = useState("txt");
  // Create a state variable to track selected items
  const [valueMessage, setValueMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const [downLoadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [bulkMailSendModalOpen, setBulkMailSendModalOpen] = useState(false);
  const [bulkTrackingNumberModalOpen, setBulkTrackingNumberModalOpen] =
    useState(false);

  const [activeRange, setActiveRange] = useState("");
  useEffect(() => {
    if (params && Object.keys(params).length) {
      setQuery({ ...params, ...query });
    }
  }, [params, customerId]);

  // Function to handle the "Select All" checkbox click event
  const handleSelectAllClick = (order) => {
    setSelectAllChecked(!selectAllChecked);
    // Update the state of individual checkboxes in the tbody
    if (selectAllChecked) {
      setOrderSingleDetails((prev) => {
        return {
          ...prev,
          orderIds: [],
          statusUpdateOptions: multipleStatusOptions,
        };
      });
      setSelectedItems([]);
    } else {
      const allIds = isValidArray(orders?.data)
        ? orders?.data.map((item) => item.orderId)
        : [];

      setSelectedItems(allIds);
      setOrderSingleDetails((prev) => {
        return {
          ...prev,
          orderIds: allIds,
          statusUpdateOptions:
            allIds.length == 1
              ? isValidArray(orders?.data)
                ? getStatusOptions(orders?.data[0]?.status)
                : multipleStatusOptions
              : allIds.length == 0
                ? []
                : multipleStatusOptions,
        };
      });
    }
  };

  // Function to handle individual checkbox clicks
  const handleCheckboxClick = (order) => {
    const id = order.orderId;
    if (selectedItems.includes(id)) {
      const lists = selectedItems.filter((item) => item !== id);

      setSelectedItems(lists);
      setOrderSingleDetails((prev) => {
        return {
          ...prev,
          orderIds: lists,
          statusUpdateOptions:
            lists.length == 1
              ? getStatusOptions(order?.status)
              : lists.length == 0
                ? []
                : multipleStatusOptions,
        };
      });
    } else {
      const allIds = [...selectedItems, id];
      setSelectedItems(allIds);
      setOrderSingleDetails((prev) => {
        return {
          ...prev,
          orderIds: allIds,
          statusUpdateOptions:
            allIds.length == 1
              ? getStatusOptions(order?.status)
              : multipleStatusOptions.length == 0
                ? []
                : multipleStatusOptions,
        };
      });
    }

    // Check if all individual checkboxes are selected and update the "Select All" checkbox accordingly
    const allSelected = selectedItems.length === allData.length;

    setSelectAllChecked(allSelected);
  };

  const fetchOrders = async (val = {}) => {
    try {
      setIsRequestOrder(true);
      const queryFilter = {
        q: q ?? "",
        customerId: customerId ?? "",
        orderIds: orderIds ?? "",
        minPrice: minPrice ?? "",
        maxPrice: maxPrice ?? "",
        trackingNumbers: trackingNumbers ?? "",
        trackingStatus: trackingStatus ?? "",
        isTestOrder: isTestOrder ?? "",
        startDate: startDate ?? "",
        endDate: endDate ?? "",
        sort: sort ?? "updatedAt.desc",
        page: 1,
        limit: orderLimit,
        ...val,

      };
      const res = await getOrders(queryFilter);
      setIsRequestOrder(false);
      const orderIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?.orderId)
        : [];
      setAllData(orderIdsArr);
      setOrders(res?.data);
    } catch (error) {
      setIsRequestOrder(false);
      /* empty */
    }
  };

  const defaultOptionSet = () => {
    setQuery((prev) => {
      return {
        ...prev,
        selectedSearchInput: searchOptions[0],
        trackingStatus: defaultOptions || [
          {
            label: "Paid",
            value: "PAID",
          },
          {
            label: "Packed",
            value: "PACKED",
          },
          {
            label: "Partially Shipped",
            value: "PARTIALLY_SHIPPED",
          },
          {
            label: "Fully Shipped",
            value: "FULLY_SHIPPED",
          },
        ],
      };
    });
  };

  useEffect(() => {
    fetchOrders();
    defaultOptionSet();
  }, [router?.query?.slug]);

  const fetchOrdersQueries = async (val) => {
    const queries = {
      ...query,
      ...val,
      customerId: customerId || query?.customerId || "",

    };
    setQuery(queries);

    try {
      setIsRequestOrder(true);

      const res = await getOrders(queries);
      setIsRequestOrder(false);
      const orderIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?.orderId)
        : [];
      setAllData(orderIdsArr);
      setOrders(res?.data);
    } catch (error) {
      setIsRequestOrder(false);
      return false;
      /* empty */
    }
  };
  const fetchFilterDateRangeOrdersQueries = async (val) => {
    const queries = {
      ...query,
      ...val,
      customerId: customerId || query?.customerId || "",

    };
    setQuery(queries);
    try {
      setIsRequestOrder(true);

      const res = await getOrders(queries);
      setIsRequestOrder(false);
      const orderIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?.orderId)
        : [];
      setAllData(orderIdsArr);
      setOrders(res?.data);
    } catch (error) {
      setIsRequestOrder(false);
      return false;
      /* empty */
    }
  };

  const fetchPaginateOrders = async (param) => {
    try {
      setIsRequestOrder(true);
      const queryFilter = {
        ...query,
        page: orderPage || 1,
        limit: orderLimit,
        ...param,

      };
      const res = await getOrders(queryFilter);

      setIsRequestOrder(false);
      const orderIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?.orderId)
        : [];
      setAllData(orderIdsArr);
      setOrders(res?.data);
    } catch (error) {
      setIsRequestOrder(false);
      /* empty */
    }
  };

  useMemo(() => {
    if (initPaginate) {
      fetchPaginateOrders();
    }
  }, [orderPage, orderLimit]);

  function handleDebounceFn(val) {
    fetchOrdersQueries(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function handleChange(value) {
    const val = { ...query, q: value };
    setQuery(val);
    debounceFn(val);
  }
  const resetHandler = async () => {
    setActiveRange("");
    setQuery((prev) => {
      return {
        ...{},
        selectedSearchInput: searchOptions[0],
        trackingStatus: defaultOptions,
        site: { label: "All Sites", value: "" },
        sort: "updatedAt.desc",
        sortOption: {
          label: "Updated At (DESC)",
          value: "updatedAt.desc",
        },
      };
    });

    await fetchOrders({ sort: 'updatedAt.desc' });
    return true;
  };
  // console.log( router.query.slug, 'query');

  const sortChangeHandler = (keys, sort) => {
    setSortIconSelect((prev) => {
      return {
        ...prev,
        [keys]: sort,
      };
    });
  };

  const getStatus = (text) => {
    if (text == "FULLY_SHIPPED") {
      return (
        <p className="px-2 bg-[#b6ff9d] text-[#21a143] font-[200] text-[12px] text-center py-1 rounded-sm">
          {text}
        </p>
      );
    }
    if (text == "PARTIALLY_SHIPPED") {
      return (
        <p className="px-2 bg-[#ccf4d7] text-[#5fbf8a] font-[200] text-[12px] text-center py-1 rounded-sm">
          {text}
        </p>
      );
    }
    if (text == "PACKED") {
      return (
        <p className="px-2 bg-[#fccf99] text-[#cc7a00] font-[200] text-[12px] text-center py-1 rounded-sm">
          {text}
        </p>
      );
    }
    if (text == "PAID") {
      return (
        <p className="px-2 bg-[#fd9999] text-[#c24f4f] font-[200] text-[12px] text-center py-1 rounded-sm">
          {text}
        </p>
      );
    }
    return (
      <p className="px-2 bg-[#b6ff9d] text-[#21a143] font-[200] text-[12px] text-center py-1 rounded-sm">
        {text}
      </p>
    );
  };

  const handleSingleClick = (order = {}) => {
    setActiveTab("orderDetails");
    setOrderSingleDetails((prev) => {
      return {
        ...prev,
        ...order,
      };
    });
    setOrderDetailsModal(true);
    // router.push(`/admin/orders/all?orderId=${order?.orderId}`);
  };
  const filterHandlerClick = async (status) => {
    setOrderPage(1);
    setOrderSingleDetails((prev) => ({
      ...prev,
      orderIds: [],
    }));
    setSelectAllChecked(false);
    setSelectedItems([]);

    const findValue = optionStatusFilter.find(
      (item) => item.value == status || item.label == status
    );
    const filterQuery = {
      ...query,
      ["trackingStatus"]: findValue?.value,
      selectedLabelStatus: findValue,
    };

    setIsRequestOrder(true);

    if (query && query?.startDate) {
      if (!query?.endDate) {
        query["endDate"] = new Date();
      }
    }
    await fetchOrdersQueries(filterQuery);
    setIsRequestOrder(false);
  };

  const handlerOrderPageLimitChange = async (value) => {
    setOrderLimit(value);
    try {
      await fetchPaginateOrders({ sort: query?.sort, limit: value, page: orderPage });
    } catch (error) {
      console.log(error);
    }
  };

  const orderPageLimitOptions = [
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 300, 500,
  ];

  const findStats = (status) => {
    const findState =
      isValidArray(orderStats) &&
      orderStats.find((item) => item.status == status);
    return isTestOrder === true ? orders?.paginate?.totalCount || 0 : findState?.count || 0;
  };

  const handleSort = async (sort) => {
    try {
      // Update query and request state
      setQuery((prev) => ({
        ...prev,
        sort: sort.value,
        sortOption: sort,
      }));
      setIsRequestOrder(true);

      // Prepare query filter
      const queryFilter = { ...query, sort: sort.value, page: 1, limit: orderLimit };

      // Fetch orders
      const res = await getOrders(queryFilter);

      // Handle response
      const ordersData = res?.data?.data || [];
      const orderIdsArr = ordersData.map((order) => order?.orderId);
      setAllData(orderIdsArr);
      setOrders(res?.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      // Ensure loading state is reset
      setIsRequestOrder(false);
    }
  };

  const getStatusOptions = (value) => {
    const filteredOptions = oneStatusOptions.filter((item) => item.value !== value);

    // Update status options in order details
    setOrderSingleDetails((prev) => ({
      ...prev,
      statusUpdateOptions: filteredOptions,
    }));

    return filteredOptions;
  };

  const fetchOrderStats = async (val = {}) => {
    try {
      const res = await getOrderCounts({ customerId: customerId ?? "", isTestOrder: isTestOrder, ...val });
      if (res.data.success) {
        console.log(res.data.data);
        setOrderStats(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchOrderStats();
  }, [customerId]);
  const onChangeStatusUpdate = (value) => {
    setOrderSingleDetails((prev) => {
      return {
        ...prev,
        selectedStatusUpdateOption: value,
      };
    });
    setOrderData((prev) => {
      return {
        ...prev,
        menuOpen: false,
      };
    });
    const orderFind = isValidArray(orderSingleDetails?.orderIds)
      ? isValidArray(orders?.data)
        ? orders?.data.find((item) => {
          if (item.orderId == orderSingleDetails?.orderIds[0]) {
            return item;
          } else {
            return false;
          }
        })
        : null
      : null;

    const statusChecker = ["PARTIALLY_SHIPPED", "FULLY_SHIPPED"];
    if (
      orderSingleDetails?.orderIds?.length == 1 &&
      statusChecker.includes(value.value) &&
      !orderFind?.tracking?.numbers?.length
    ) {
      setOrderSingleDetails((prev) => {
        return {
          ...prev,
          updateStatus: value,
          tracking: {
            numbers: [],
            number: "",
          },
        };
      });
      setTrackingNumberModalOpen(true);

      return;
    }

    if (statusChecker.includes(value?.value)) {
      Swal.fire({
        title: "Are you sure?",
        text: ``,
        html: `
        <div>
        
        <p class="text-center pb-4 text-[14px]">Do you want to mark as <b>"${value.label}</b>"?</p> 

        <p class="text-center pb-4 text-[14px] font-bold">Note: If any order don’t have TrackingNumber then update status operation will be skip for those particular orders.</p> 
        
        
        </div>
          <div class="flex items-center  justify-center pl-2">
            <input type="checkbox"checked class="focus:ring-0 border" name="mailSendCheckbox" id="mailSendCheckbox" />
            <span class="pl-2 text-[12px]">On update order status send mail to customer?</span>
          </div>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        preConfirm: () => {
          const mailSendCheckbox = document.getElementById("mailSendCheckbox");
          const mailSend = mailSendCheckbox.checked ? "yes" : "no";
          return mailSend;
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const mailSend = result.value;
          if (orderSingleDetails?.orderIds?.length === 1) {
            try {
              const res = await orderStatusSingleUpdate({
                orderId: orderSingleDetails?.orderIds[0],
                mailSend: mailSend,
                status: value?.value,
              });
              if (res.data.success) {
                setOrderSingleDetails((prev) => ({
                  ...prev,
                  status: res?.data?.data?.status,
                  orderIds: [],
                }));
                setOrderPage(1);
                setSelectAllChecked(false);
                setSelectedItems([]);
                fetchOrderStats();
                fetchPaginateOrders();
                Swal.fire({
                  title: "Success",
                  text:
                    res?.data?.message + ` to "${res?.data?.data?.status}"!`,
                  icon: "success",
                });
              }
            } catch (error) {
              Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error",
              });
              console.log(error);
            }
          } else {
            try {
              const res = await orderStatusUpdate({
                orderIds: orderSingleDetails?.orderIds,
                mailSend: mailSend,
                status: value?.value,
              });

              if (res.data.success) {
                setOrderSingleDetails((prev) => ({
                  ...prev,
                  orderIds: [],
                  updateStatus: value,
                  failedOrders: res?.data?.data?.failedUpdateOrders || [],
                }));
                setOrderPage(1);
                setSelectAllChecked(false);
                setSelectedItems([]);
                fetchOrderStats();
                fetchPaginateOrders();
                function handleBulkUpdate() {
                  console.log("click");

                  setBulkTrackingNumberModalOpen(true);
                  Swal.close();
                }
                Swal.fire({
                  title: `Operation Result`,
                  html: `
                      <div class="max-w-md mx-auto">
                      <div class="py-1">
                     <p> Mark as "${value?.value || ""}"</P>
                      </div>
                        <div class="flex flex-wrap justify-between mt-2">
                          <div class="w-1/2 pr-2">
                            <h3 class="text-md font-bold mb-2">Success (${res?.data?.data?.updateOrders.length
                    })</h3>
                            <div class="bg-gray-100 rounded-lg overflow-auto max-h-48">
                              <ul class="list-disc list-inside">
                                ${res?.data?.data?.updateOrders
                      .map(
                        (order, i) =>
                          `<li class="mb-1 truncate whitespace-nowrap px-2" key=${i}>${order}</li>`
                      )
                      .join("")}
                              </ul>
                            </div>
                          </div>
                          <div class="w-1/2 pl-2">
                            <h3 class="text-md font-bold mb-2">Failed (${res?.data?.data?.failedUpdateOrders.length
                    })</h3>
                            <div class="bg-gray-100 rounded-lg overflow-auto max-h-48">
                              <ul class="list-disc list-inside">
                                ${res?.data?.data?.failedUpdateOrders
                      .map(
                        (failedOrder, i) =>
                          `<li class="mb-1 truncate whitespace-nowrap px-2" key=${i}>${failedOrder}</li>`
                      )
                      .join("")}
                              </ul>
                            </div>
                          </div>
                        </div>

                        ${isValidArray(res?.data?.data?.failedUpdateOrders)
                      ? `<p class="text-center m-3 mb-2 text-sm">Do you want to update tracking numbers for failed orders?</p>
                        <button id="trackingBulkButton" class="text-center px-4 py-2 bg-blue-500 text-white rounded-md text-sm"> Click to bulk update tracking number </button>`
                      : ``
                    }
                      </div>
                    `,
                  icon: "success",
                  showCancelButton: false,
                  showConfirmButton: false,
                  showCloseButton: true,

                  customClass: {
                    container: "p-6 rounded-md shadow-lg bg-white",
                    closeButton: "text-gray-500 hover:text-gray-700",
                    title: "text-lg font-bold mb-4",
                    content: "text-center",
                    htmlContainer: "text-center",
                  },
                  didOpen: () => {
                    const trackingBulkButton =
                      document.getElementById("trackingBulkButton");
                    if (trackingBulkButton) {
                      trackingBulkButton.addEventListener(
                        "click",
                        handleBulkUpdate
                      );
                    }
                  },
                });
              }
            } catch (error) {
              Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error",
              });

              console.log(error);
            }
          }
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: ``,
        html: `
        <div><p class="text-center pb-4 text-[14px]">Do you want to mark as <b>"${value.label}</b>"?</p>   </div>
          <div class="flex items-center  justify-center pl-2">
            <input type="checkbox"checked class="focus:ring-0 border" name="mailSendCheckbox" id="mailSendCheckbox" />
            <span class="pl-2 text-[12px]">On update order status send mail to customer?</span>
          </div>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        preConfirm: () => {
          const mailSendCheckbox = document.getElementById("mailSendCheckbox");
          const mailSend = mailSendCheckbox.checked ? "yes" : "no";
          return mailSend;
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const mailSend = result.value;
          if (orderSingleDetails?.orderIds?.length === 1) {
            try {
              const res = await orderStatusSingleUpdate({
                orderId: orderSingleDetails?.orderIds[0],
                mailSend: mailSend,
                status: value?.value,
              });
              if (res.data.success) {
                setOrderSingleDetails((prev) => ({
                  ...prev,
                  status: res?.data?.data?.status,
                  orderIds: [],
                }));
                setOrderPage(1);
                setSelectAllChecked(false);
                setSelectedItems([]);
                fetchOrderStats();
                fetchPaginateOrders();
                Swal.fire({
                  title: "Success",
                  text:
                    res?.data?.message + ` to "${res?.data?.data?.status}"!`,
                  icon: "success",
                });
              }
            } catch (error) {
              Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error",
              });
              console.log(error);
            }
          } else {
            try {
              const res = await orderStatusUpdate({
                orderIds: orderSingleDetails?.orderIds,
                mailSend: mailSend,
                status: value?.value,
              });
              if (res.data.success) {
                setOrderSingleDetails((prev) => ({
                  ...prev,
                  orderIds: [],
                }));
                setOrderPage(1);
                setSelectAllChecked(false);
                setSelectedItems([]);
                fetchOrderStats();
                fetchPaginateOrders();

                Swal.fire({
                  title: `Operation Result`,
                  html: `
                    <div class="max-w-md mx-auto">
                    <div class="py-1">
                   <p> Mark as "${value?.value || ""}"</P>
                    </div>
                      <div class="flex flex-wrap justify-between mt-2">
                        <div class="w-1/2 pr-2">
                          <h3 class="text-md font-bold mb-2">Success (${res?.data?.data?.updateOrders.length
                    })</h3>
                          <div class="bg-gray-100 rounded-lg overflow-auto max-h-48">
                            <ul class="list-disc list-inside">
                              ${res?.data?.data?.updateOrders
                      .map(
                        (order, i) =>
                          `<li class="mb-1 truncate whitespace-nowrap px-2" key=${i}>${order}</li>`
                      )
                      .join("")}
                            </ul>
                          </div>
                        </div>
                        <div class="w-1/2 pl-2">
                          <h3 class="text-md font-bold mb-2">Failed (${res?.data?.data?.failedUpdateOrders.length
                    })</h3>
                          <div class="bg-gray-100 rounded-lg overflow-auto max-h-48">
                            <ul class="list-disc list-inside">
                              ${res?.data?.data?.failedUpdateOrders
                      .map(
                        (failedOrder, i) =>
                          `<li class="mb-1 truncate whitespace-nowrap px-2" key=${i}>${failedOrder}</li>`
                      )
                      .join("")}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  `,
                  icon: "success",
                  showCancelButton: false,
                  showConfirmButton: false,
                  showCloseButton: true,
                  customClass: {
                    container: "p-6 rounded-md shadow-lg bg-white",
                    closeButton: "text-gray-500 hover:text-gray-700",
                    title: "text-lg font-bold mb-4",
                    content: "text-center",
                    htmlContainer: "text-center",
                  },
                });
              }
            } catch (error) {
              Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error",
              });

              console.log(error);
            }
          }
        }
      });
    }
  };

  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      await fetchOrdersQueries({ site });
    } catch (error) {
      console.log(error, "error in hammer bell site filter");
    }
  };

  //download pdf
  const downloadPdf = () => {
    const selectedOrders = orderSingleDetails?.orderIds || [];
    const downloadJsonData = isValidArray(orders?.data)
      ? orders?.data.filter((item) => selectedOrders.includes(item?.orderId))
      : [];
    if (!isValidArray(downloadJsonData)) {
      Swal.fire({
        title: "Error!",
        text: "Please select a order!",
        icon: "error",
      });
      return false;
    }

    const doc = new jsPDF({
      orientation: "landscape", // Set landscape orientation for wider width
      unit: "px", // Set unit to pixels
      format: [1191, 794], // Set custom width (1400px) and height (792px)
    });

    doc.setFontSize(12);
    doc.text("ORDER LIST", 10, 10);

    let startY = 20;
    const margin = 10;

    const columns = [
      "ID",
      "ORDER NO",
      "EMAIL",
      "DATE AND TIME",
      "TOTAL USD",
      "TRACKING",
      "STATUS",
    ];
    const rows = downloadJsonData.map((order, i) => [
      `${i + 1}`,
      `#${order.orderId}`,
      order?.shipping?.email || "N/A",
      order?.payment?.paidAt
        ? momentTZ
          .utc(order.payment.paidAt)
          .tz("America/New_York")
          .format("YY.MM.DD h:mma z")
        : "N/A",
      `$${parseFloat(order?.orderSummary?.totalAmount || 0).toFixed(2)}`,
      order.tracking.numbers.toString(),
      order.status,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: startY + margin,
      margin: {
        top: startY + margin,
        left: margin,
        right: margin,
        bottom: margin,
      },
      columnStyles: {
        "DATE AND TIME": { columnWidth: "auto" }, // Set auto width for DATE AND TIME column
        "TOTAL USD": { columnWidth: "auto" }, // Set auto width for TOTAL USD column
      },
    });

    doc.save("Download.pdf");
  };

  const downloadText = () => {
    const selectedOrders = orderSingleDetails?.orderIds || [];
    const downloadJsonData = isValidArray(orders?.data)
      ? orders?.data.filter((item) => selectedOrders.includes(item?.orderId))
      : [];
    if (!isValidArray(downloadJsonData)) {
      Swal.fire?.({
        title: "Error!",
        text: "Please select an order!",
        icon: "error",
      });
      return false;
    }
    let textData = "";

    const getProductObject = (product, quantity) => {
      return {
        product: product,
        title: product.title,
        quantity: quantity,
        price: product.price,
        totalAmount: parseFloat(product.price.sale) * quantity,
        bundleProducts: product.bundle?.products,
        isBundle: product.bundle?.isLimited,
        subTitle: product.subTitle,
        bundleSize: product.bundle?.size,
        images: product.images,
        productData: product,
        adminAdded: true,
      };
    };
    downloadJsonData.forEach((order, i) => {
      const modifyTitle = (p) => {
        let product = p;
        if (p?.product?._id) {
          product = p.product;
        }
        if (!product?.title) {
          return "";
        }
        if (product.title.toUpperCase().includes("HEALING BLEND 20MG")) {
          return "NEOBIO HEALING BLEND 20MG";
        } else if (product.title.toUpperCase().includes("LIPO-C")) {
          return "NEOBIO LIPO-C";
        } else if (product.topMenuCategory == "neobio") {
          return "NEO " + product.title.toUpperCase();
        } else {
          return product.title.toUpperCase();
        }
      };
      const adminAddedProducts = (order?.editedByAdmins || [])
        .filter((e) => e.status == "added")
        .map((e) => getProductObject(e.product, e.quantity));
      const isProductRemoved = (pId) => {
        return (order?.editedByAdmins || [])
          .filter((e) => e.status == "removed")
          .map((e) => e.product?._id || e.product)
          .includes(pId);
      };

      let totalQuantity = 0;
      let products = [];

      [...(order.products || []), ...adminAddedProducts]
        .filter((e) => !isProductRemoved(e.product?._id || e.product))
        ?.forEach((product) => {
          totalQuantity += product?.quantity || 0;
          if (product?.product) {
            products.push(product);
          }
        });
      textData += `******************************\n`;
      //textData += `x${totalQuantity}, `;

      let isFreebieInCartAlready = false;
      let alreadyAddedProducts = {};

      let freeBuyProductId = (order?.freeBuy?.freeBuyProduct?.product?._id || order?.freeBuy?.freeBuyProduct?.product)?.toString();
      if (freeBuyProductId) {
        const bProducts = order?.freeBuy?.freeBuyProduct?.bundle?.bundleProducts || [];
        if (bProducts.length) {
          freeBuyProductId = bProducts[0]?._id || bProducts[0];
        }
      }

      /// combine all quantity for provided product id including cycle + bundle + freebie.
      const getCombinedQuantity = (pId) => {
        let q = 0;
        const productId = pId;//(p.bundleProducts||[])[0]?._id?.toString() || p.product?.toString() || p._id?.toString();
        products.forEach((e) => {
          if (isValidArray(e?.bundleProducts)) {
            e?.bundleProducts.forEach((bundleProduct, i) => {
              if (productId == bundleProduct._id.toString()) {
                q += (parseInt(e?.bundleSize || 1) * e?.quantity);
              }
            });
          } else if (e?.product?.cycle?.isCycle) {
            e.product?.details.includes.forEach((c) => {
              console.log('---------------------> p', c);
              if (c.product?._id?.toString() == productId) {
                if (c.product) {
                  q += parseInt(c.quantity) * e.quantity;
                } else {
                  let quantity = c.quantity.split(" ")[0];
                  q += parseInt(quantity.replaceAll("x", "")) * e.quantity;
                }
              }
            });
          } else {
            if (e.product._id.toString() == productId) {
              q += e?.quantity;
            }
          }
        });

        if (productId == freeBuyProductId) {
          q += 1 * (order?.freeBuy?.freeBuyProduct?.bundle?.bundleSize || 1);
        }

        return q;
      };

      console.log("Products===>", products, "Order Object=> ", order);


      const groups = {
        orals: [],
        injectables: [],
      };

      products.forEach((product, i) => {
        // console.log("product object", product);
        //const productId = p.bundleProducts[0]?._id?.toString() || p._id?.toString();

        if (isValidArray(product?.bundleProducts)) {
          product?.bundleProducts.forEach((bundleProduct, i) => {
            if (alreadyAddedProducts[bundleProduct._id?.toString()]) {
              return;
            }
            alreadyAddedProducts[bundleProduct._id?.toString()] = 1;

            console.log("Bundle Product ----- ", bundleProduct, " freebie ==> ", order?.freeBuy?.freeBuyProduct?.product?.toString());
       
              if (!groups[product?.product?.productType]) {
                groups[product?.product?.productType] = []; // initialize array
              }

              groups[product.product.productType].push(`x${getCombinedQuantity(bundleProduct._id.toString())} ${modifyTitle(product)}\n`.toUpperCase());
            

          });
        } else if (product?.product?.cycle?.isCycle) {
          // console.log("ProductDetails", product.product?.details);
          product.product?.details.includes.forEach((p) => {
            console.log('---------------------> p', p);
            if (alreadyAddedProducts[p.product._id?.toString()]) {
              return;
            }
            alreadyAddedProducts[p.product._id?.toString()] = 1;

            console.log('---------------------> p', p);
            if (p.product) {

              if (!groups[p.product.productType]) {
                groups[p.product.productType] = []; // initialize array
              }
              groups[p.product.productType].push(`x${getCombinedQuantity(p.product._id.toString())} ${modifyTitle(p.product)}\n`);
            }
          });
        } else {
          if (alreadyAddedProducts[product.product._id?.toString()]) {
            return;
          }
          alreadyAddedProducts[product.product._id?.toString()] = 1;

          if( !groups[product.product.productType]){
            groups[product.product.productType]= []; // initialize array
          }
          groups[product.product.productType].push(`x${getCombinedQuantity(product.product._id.toString())} ${modifyTitle(product)}\n`.toUpperCase());
        }
      });

      if (order?.freeBuy?.isFreeBuy === true) {
        if (!alreadyAddedProducts[freeBuyProductId]) {
          groups[order?.freeBuy?.freeBuyProduct?.product?.productType].push(`x${(order?.freeBuy?.freeBuyProduct?.quantity || 1) * (order?.freeBuy?.freeBuyProduct?.bundle?.bundleSize || 1)} ${modifyTitle(order?.freeBuy?.freeBuyProduct)} ${order?.freeBuy?.freeBuyProduct?.bundle?.isBundle ? "" : ""}\n`.toUpperCase());
        }
      }

      if (groups.injectables.length) {
        groups.injectables.forEach((e) => {
          textData += e;
        });
        if (groups.orals.length) {
          textData += "\n";
        }
      }
      if (groups.orals.length) {
        groups.orals.forEach((e) => {
          textData += e;
        });
      }

      textData += `ORDER #${order?.orderId}\n\n`;
      const name = `${order?.shipping?.address?.receiverName?.firstName || ""} ${order?.shipping?.address?.receiverName?.lastName || ""}`.toUpperCase();
      if (name.trim()) {
        textData += `${name}\n`.toUpperCase();
      }
      //textData += `${order?.customer?.firstName} ${order?.customer?.lastName}\n`.toUpperCase();
      // textData += `${addressConcat(order?.shipping?.address)}\n`;
      textData += `${downloadTxtAddressFormatter(order?.shipping?.address)}`;
      if (order?.shipping?.shippingNote) {
        textData += `NOTE: ${order?.shipping?.shippingNote}\n`
      }
      textData += `******************************\n\n`; // Double line space and separator
    });

    const blob = new Blob([textData], { type: "text/plain" });
    saveAs(blob, "Download.txt");
  };

  const downloadEmailsText = () => {
    const selectedOrders = orderSingleDetails?.orderIds || [];
    const downloadJsonData = isValidArray(orders?.data)
      ? orders?.data.filter((item) => selectedOrders.includes(item?.orderId))
      : [];
    if (!isValidArray(downloadJsonData)) {
      Swal.fire?.({
        title: "Error!",
        text: "Please select an order!",
        icon: "error",
      });
      return false;
    }
    let textData = "";
    downloadJsonData.forEach((order, i) => {
      textData += `${order?.shipping?.email || ""}`;
      if (i !== downloadJsonData.length - 1) {
        // Add comma if it's not the last element
        textData += ",";
      }
      textData += "\n";
    });
    const blob = new Blob([textData], { type: "text/plain" });
    saveAs(blob, "Download.txt");
  };
  const toggleDropdownDownload = () => {
    setDownloadDropdownOpen(!downLoadDropdownOpen);
  };

  const handleOptionSelectDownload = (option) => {
    if (option == "Download.txt") {
      downloadText();
    }
    if (option == "Download.pdf") {
      downloadPdf();
    }
    if (option == "Download Email.txt") {
      downloadEmailsText();
    }
    if (option == "Send Email") {
      setBulkMailSendModalOpen(true);
      setEditorData({});
    }
    setDownloadDropdownOpen(false);
  };

  const downloadOptions = [
    "Download.txt",
    "Download Email.txt",
    "Download.pdf",
  ];

  useMemo(() => {
    if (router?.query?.orderId && !orderSingleDetails?._id) {
      if (router?.query?.comment === "true") {
        setActiveTab("comments");
      }
      setOrderDetailsModal(true);
    }
  }, [router?.query?.orderId]);

  const handleFilterRange = async (option) => {
    setActiveRange(option);
    let startDate = "";
    let endDate = "";

    switch (option) {
      case "Today":
        startDate = momentTZ.tz("America/New_York").startOf("day").format("YYYY-MM-DD");
        endDate = momentTZ.tz("America/New_York").endOf("day").format("YYYY-MM-DD");
        break;
      case "Last24hrs":
        startDate = moment()
          .subtract(24, "hours")
          .startOf("day")
          .format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
        break;
      case "Last7Days":
        startDate = moment()
          .subtract(7, "days")
          .startOf("day")
          .format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
        break;
      default:
        startDate = moment()
          .subtract(6, "days")
          .startOf("day")
          .format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
    }

    await fetchOrdersQueries({ startDate, endDate, sort: "createdAt.desc", sortOption: { label: "Created At (DESC)", value: "createdAt.desc" } });
  };

  console.log(query, "source query");

  const handleBulkRemoveTestOrder = async () => {

    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete selected test order`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await BulkRemoveTestOrder(orderSingleDetails?.orderIds);
          if (res.data.success) {
            setOrderPage(1);
            setSelectAllChecked(false);
            setSelectedItems([]);
            const isTestPath = router.pathname == '/admin/orders/test-orders';
            fetchOrderStats({ isTestOrder: isTestPath });
            fetchPaginateOrders({ isTestOrder: isTestPath });
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
  const handleEntireAllRemoveTestOrder = async () => {

    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete entire all test orders`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await EntireRemoveAllTestOrder();
          if (res.data.success) {
            setOrderPage(1);
            setSelectAllChecked(false);
            setSelectedItems([]);
            const isTestPath = router.pathname == '/admin/orders/test-orders';
            fetchOrderStats({ isTestOrder: isTestPath });
            fetchPaginateOrders({ isTestOrder: isTestPath });
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              📦 Orders Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage all your orders</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                setShowBulkCount((c) => c + 1);
                setShowBulkTrackingModalVersion2(true);
              }}
            >
              <span className="text-lg">📋</span>
              <span>Bulk Tracking Update</span>
            </button>
          </div>
          {/* Action Buttons */}
          <div className="w-full flex items-center gap-3 flex-wrap">
            {!isValidArray(orderSingleDetails?.orderIds) ? (
              <>
                <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 rounded-lg cursor-not-allowed opacity-50">
                  <MdEmail size={18} />
                  <span className="font-medium">Send Email</span>
                </button>
                <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 rounded-lg cursor-not-allowed opacity-50">
                  <MdOutlineFileDownload size={18} />
                  <span className="font-medium">Download.txt</span>
                  <RiArrowDropDownLine size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleOptionSelectDownload("Send Email");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md"
                >
                  <MdEmail size={18} />
                  <span>Send Email</span>
                </button>
                <div className="relative inline-block">
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md">
                    <span onClick={downloadText} className="flex items-center gap-1">
                      <MdOutlineFileDownload size={18} />
                      <span>Download.txt</span>
                    </span>
                    <RiArrowDropDownLine
                      size={20}
                      onClick={toggleDropdownDownload}
                      className="cursor-pointer"
                    />
                  </button>
                  {downLoadDropdownOpen &&
                    isValidArray(orderSingleDetails?.orderIds) && (
                      <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[130px] overflow-auto">
                        {downloadOptions.map((option, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionSelectDownload(option)}
                            className="block text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full transition-colors border-b border-gray-100 dark:border-gray-700 last:border-none"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Tabs - Large Screen */}
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
          {router.pathname == "/admin/orders/pending" ? (
            <button
              onClick={() => filterHandlerClick("PENDING")}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl"
            >
              <span>Pending</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                {findStats("PENDING")}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {/* All Orders */}
              <button
                onClick={() => filterHandlerClick("All")}
                className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
                  (!query?.selectedLabelStatus?.label || query?.selectedLabelStatus?.label == "All")
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <span>All Orders</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  (!query?.selectedLabelStatus?.label || query?.selectedLabelStatus?.label == "All")
                    ? "bg-white/20 backdrop-blur-sm text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}>
                  {findStats("ALL")}
                </span>
              </button>

              {isTestOrder !== true && (
                <>
                  {/* Paid */}
                  <button
                    onClick={() => filterHandlerClick("PAID")}
                    className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      query?.selectedLabelStatus?.value == "PAID"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>Paid</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      query?.selectedLabelStatus?.value == "PAID"
                        ? "bg-white/20 backdrop-blur-sm text-white"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {findStats("PAID")}
                    </span>
                  </button>

                  {/* Packed */}
                  <button
                    onClick={() => filterHandlerClick("PACKED")}
                    className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      query?.selectedLabelStatus?.value == "PACKED"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>Packed</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      query?.selectedLabelStatus?.value == "PACKED"
                        ? "bg-white/20 backdrop-blur-sm text-white"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {findStats("PACKED")}
                    </span>
                  </button>

                  {/* Partially Shipped */}
                  <button
                    onClick={() => filterHandlerClick("PARTIALLY_SHIPPED")}
                    className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      query?.selectedLabelStatus?.value == "PARTIALLY_SHIPPED"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>Partially Shipped</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      query?.selectedLabelStatus?.value == "PARTIALLY_SHIPPED"
                        ? "bg-white/20 backdrop-blur-sm text-white"
                        : "bg-emerald-100 text-emerald-600"
                    }`}>
                      {findStats("PARTIALLY_SHIPPED")}
                    </span>
                  </button>

                  {/* Fully Shipped */}
                  <button
                    onClick={() => filterHandlerClick("FULLY_SHIPPED")}
                    className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      query?.selectedLabelStatus?.value == "FULLY_SHIPPED"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>Fully Shipped</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      query?.selectedLabelStatus?.value == "FULLY_SHIPPED"
                        ? "bg-white/20 backdrop-blur-sm text-white"
                        : "bg-green-100 text-green-600"
                    }`}>
                      {findStats("FULLY_SHIPPED")}
                    </span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Tabs - Small Screen */}
      <div className="lg:hidden">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
          {router.pathname == "/admin/orders/pending" ? (
            <button
              onClick={() => filterHandlerClick("PENDING")}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl"
            >
              <span>Pending</span>
              <span className="ml-auto px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                {findStats("PENDING")}
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {/* All Orders */}
              <button
                onClick={() => filterHandlerClick("All")}
                className={`flex flex-col items-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                  (!query?.selectedLabelStatus?.label || query?.selectedLabelStatus?.label == "All")
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="text-sm">All Orders</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  (!query?.selectedLabelStatus?.label || query?.selectedLabelStatus?.label == "All")
                    ? "bg-white/20 backdrop-blur-sm text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}>
                  {findStats("ALL")}
                </span>
              </button>

              {isTestOrder !== true && (
                <>
                  {/* Paid */}
                  <button
                    onClick={() => filterHandlerClick("PAID")}
                    className={`flex flex-col items-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      query?.selectedLabelStatus?.value == "PAID"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-sm">Paid</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      query?.selectedLabelStatus?.value == "PAID"
                        ? "bg-white/20 backdrop-blur-sm text-white"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {findStats("PAID")}
                    </span>
                  </button>

                  {/* Packed */}
                  <button
                    onClick={() => filterHandlerClick("PACKED")}
                    className={`flex flex-col items-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      query?.selectedLabelStatus?.value == "PACKED"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-sm">Packed</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      query?.selectedLabelStatus?.value == "PACKED"
                        ? "bg-white/20 backdrop-blur-sm text-white"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {findStats("PACKED")}
                    </span>
                  </button>

                  {/* Partially Shipped */}
                  <button
                    onClick={() => filterHandlerClick("PARTIALLY_SHIPPED")}
                    className={`flex flex-col items-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      query?.selectedLabelStatus?.value == "PARTIALLY_SHIPPED"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-sm">Partially Shipped</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      query?.selectedLabelStatus?.value == "PARTIALLY_SHIPPED"
                        ? "bg-white/20 backdrop-blur-sm text-white"
                        : "bg-emerald-100 text-emerald-600"
                    }`}>
                      {findStats("PARTIALLY_SHIPPED")}
                    </span>
                  </button>

                  {/* Fully Shipped */}
                  <button
                    onClick={() => filterHandlerClick("FULLY_SHIPPED")}
                    className={`flex flex-col items-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      query?.selectedLabelStatus?.value == "FULLY_SHIPPED"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-sm">Fully Shipped</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      query?.selectedLabelStatus?.value == "FULLY_SHIPPED"
                        ? "bg-white/20 backdrop-blur-sm text-white"
                        : "bg-green-100 text-green-600"
                    }`}>
                      {findStats("FULLY_SHIPPED")}
                    </span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="box">
        {/* <|==================| Large Screen |================|> */}

        <div className="hidden lg:block">
          <div className="flex  flex-wrap px-4 py-4 ">
            <div className="flex  items-center gap-4 w-[90%] relative flex-wrap xxl:flex-nowrap">
              <div className="">
                <OrderFilterSelect
                  value={query?.selectedSearchInput}
                  setQuery={setQuery}
                />
              </div>

              <SearchOrders onChangeHandler={handleChange} query={query} value={query?.selectedSearchInput} />

              <div className=" cursor-pointer">

                <FilterOrders
                  setQuery={setQuery}
                  query={query}
                  resetHandler={resetHandler}
                  fetchOrdersQueries={fetchFilterDateRangeOrdersQueries}
                  setActiveRange={setActiveRange}
                />
              </div>

              <div
                className={`border rounded-sm p-[7px] px-2 cursor-pointer ${activeRange == "Today" && "bg-blue-500 text-white"
                  }`}
                onClick={() => {
                  handleFilterRange("Today");
                }}
              >
                <p> Today</p>
              </div>
              <div
                className={`border rounded-sm p-[7px]  text-center px-2 cursor-pointer ${activeRange == "Last24hrs" && "bg-blue-500 text-white"
                  }`}
                onClick={() => {
                  handleFilterRange("Last24hrs");
                }}
              >
                <p> Last 24hrs</p>
              </div>
              <div
                className={`border rounded-sm p-[7px]  text-center px-2 cursor-pointer ${activeRange == "Last7Days" && "bg-blue-500 text-white"
                  }`}
                onClick={() => {
                  handleFilterRange("Last7Days");
                }}
              >
                <p> Last 7 days</p>
              </div>
              <div
                className={`border rounded-sm p-[7px]  text-center px-2 cursor-pointer
                  }`}
                onClick={() => {
                  resetHandler();
                }}
              >
                <p> Reset Filter</p>
              </div>
              <div className={` rounded-sm p-[7px] px-2    cursor-pointer `}>
                <OrderSiteStatus
                  data={orderData}
                  setData={setOrderData}
                  align={"left"}
                  query={query}
                  onChanges={onChangeSiteType}
                />

              </div>
              <div className={` rounded-sm p-[7px] px-2    cursor-pointer `}>
                <OrderSortOptions
                  data={orderData}
                  setData={setOrderData}
                  align={"left"}
                  query={query}

                  onChanges={handleSort}
                />

              </div>

              {isTestOrder === true && <>
                <div className="flex justify-end items-center gap-4">
                  <button className="border flex items-center gap-1 px-2 py-2 rounded-md" onClick={() => {
                    handleEntireAllRemoveTestOrder();
                  }}>
                    <MdDeleteOutline size={20} /> Delete All Test Order
                  </button>
                  {isValidArray(orderSingleDetails?.orderIds) && <button className="border  flex items-center gap-1 px-2 py-2 rounded-md" onClick={() => {
                    handleBulkRemoveTestOrder();
                  }}>
                    <MdDeleteOutline size={20} />  Bulk Delete Test Order
                  </button>}

                </div>

              </>}

            </div>
            <div className="flex items-center gap-x-4 justify-end">
              <div className="">
                {router.pathname != "/admin/orders/pending" && (
                  <ChangeStatus
                    setOrderData={setOrderData}
                    orderSingleDetails={orderSingleDetails}
                    query={query}
                    selectedOption={
                      orderSingleDetails?.selectedStatusUpdateOption
                    }
                    setOrderSingleDetails={setOrderSingleDetails}
                    options={orderSingleDetails?.statusUpdateOptions}
                    onChanges={onChangeStatusUpdate}
                    orderData={orderData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <|==================| Small Screen |================|> */}

        <div className="block lg:hidden p-2 space-y-2">
          <div className=" ">
            <OrderFilterSelect
              value={query?.selectedSearchInput}
              setQuery={setQuery}
              smallDivice={true}
            />
          </div>
          <SearchOrders onChangeHandler={handleChange} query={query} />

          <div className="flex flex-wrap items-center justify-between">
            <FilterOrders
              setQuery={setQuery}
              query={query}
              resetHandler={resetHandler}
              fetchOrdersQueries={fetchOrdersQueries}
              setActiveRange={setActiveRange}
            />

          </div>
          <div className="flex flex-wrap items-center gap-x-4">
            <div
              className={`border rounded-sm p-[7px] px-2 cursor-pointer ${activeRange == "Today" && "bg-blue-500 text-white"
                }`}
              onClick={() => {
                handleFilterRange("Today");
              }}
            >
              <p> Today</p>
            </div>
            <div
              className={`border rounded-sm p-[7px]  text-center px-2 cursor-pointer ${activeRange == "Last24hrs" && "bg-blue-500 text-white"
                }`}
              onClick={() => {
                handleFilterRange("Last24hrs");
              }}
            >
              <p> Last 24hrs</p>
            </div>
            <div
              className={`border rounded-sm p-[7px]  text-center px-2 cursor-pointer ${activeRange == "Last7Days" && "bg-blue-500 text-white"
                }`}
              onClick={() => {
                handleFilterRange("Last7Days");
              }}
            >
              <p> Last 7 days</p>
            </div>
            <div
              className={`border rounded-sm p-[7px]  text-center px-2 cursor-pointer
                }`}
              onClick={() => {
                resetHandler();
              }}
            >
              <p> Reset Filter</p>
            </div>
            <div className={` rounded-sm p-[7px] px-2    cursor-pointer `}>
              <OrderSiteStatus
                data={orderData}
                setData={setOrderData}
                align={"left"}
                query={query}
                onChanges={onChangeSiteType}
              />

            </div>
            <div className={` rounded-sm p-[7px] px-2    cursor-pointer `}>
              <OrderSortOptions
                data={orderData}
                setData={setOrderData}
                align={"left"}
                query={query}

                onChanges={handleSort}
              />

            </div>
            {isTestOrder === true && <>
              <div className="flex justify-end items-center gap-4">
                <button className="border flex items-center gap-1 px-2 py-2 rounded-md" onClick={() => {
                  handleEntireAllRemoveTestOrder();
                }}>
                  <MdDeleteOutline size={20} /> Delete All Test Order
                </button>
                {isValidArray(orderSingleDetails?.orderIds) && <button className="border  flex items-center gap-1 px-2 py-2 rounded-md" onClick={() => {
                  handleBulkRemoveTestOrder();
                }}>
                  <MdDeleteOutline size={20} />  Bulk Delete Test Order
                </button>}

              </div>

            </>}
            <div className="flex items-center gap-x-4 justify-end">
              <div className="">
                {router.pathname != "/admin/orders/pending" && (
                  <ChangeStatus
                    setOrderData={setOrderData}
                    orderSingleDetails={orderSingleDetails}
                    query={query}
                    selectedOption={
                      orderSingleDetails?.selectedStatusUpdateOption
                    }
                    setOrderSingleDetails={setOrderSingleDetails}
                    options={orderSingleDetails?.statusUpdateOptions}
                    onChanges={onChangeStatusUpdate}
                    orderData={orderData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="box-body">
          <div className="table-bordered whitespace-nowrap rounded-sm overflow-auto">
            <table className="ti-custom-table ti-custom-table-head edit-table">
              <thead className="bg-gray-100 dark:bg-black/20">

                <tr>
                  {/* Checkbox for selecting all rows */}
                  <th scope="col" className="dark:text-white/70">
                    <div className="flex justify-center">
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

                  {/* Order Number Column */}
                  <th
                    scope="col"
                    className="dark:text-white/70 cursor-pointer"
                    onClick={() =>
                      handleSort({
                        label: query?.sort === "orderId.asc" ? "Order ID (DESC)" : "Order ID (ASC)",
                        value: query?.sort === "orderId.asc" ? "orderId.desc" : "orderId.asc",
                      })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span>ORDER NO.</span>
                      {query?.sort === "orderId.asc" ? (
                        <FaCaretDown size={18} className="cursor-pointer" />
                      ) : query?.sort === "orderId.desc" ? (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      ) : (
                        <FaCaretDown size={18} className="cursor-pointer text-gray-400" />
                      )}
                    </div>
                  </th>

                  {/* Email Column */}
                  <th
                    scope="col"
                    className="dark:text-white/70 cursor-pointer"
                    onClick={() =>
                      handleSort({
                        label: query?.sort === "email.asc" ? "Email (DESC)" : "Email (ASC)",
                        value: query?.sort === "email.asc" ? "email.desc" : "email.asc",
                      })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span>Email</span>
                      {query?.sort === "email.asc" ? (
                        <FaCaretDown size={18} className="cursor-pointer" />
                      ) : query?.sort === "email.desc" ? (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      ) : (
                        <FaCaretDown size={18} className="cursor-pointer text-gray-400" />
                      )}
                    </div>
                  </th>

                  {/* Date Column */}
                  <th
                    scope="col"
                    className="dark:text-white/70 cursor-pointer"
                    onClick={() => {
                      const isAscending =
                        query?.sort === "createdAt.asc" || query?.sort === "updatedAt.asc";

                      handleSort({
                        label: isAscending
                          ? query?.sort === "createdAt.asc"
                            ? "Created At (DESC)"
                            : "Updated At (DESC)"
                          : query?.sort === "createdAt.desc"
                            ? "Created At (ASC)"
                            : "Updated At (ASC)",
                        value: isAscending
                          ? query?.sort === "createdAt.asc"
                            ? "createdAt.desc"
                            : "updatedAt.desc"
                          : query?.sort === "createdAt.desc"
                            ? "createdAt.asc"
                            : "updatedAt.asc",
                      });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>DATE</span>
                      {query?.sort === "createdAt.asc" || query?.sort === "updatedAt.asc" ? (
                        <FaCaretDown size={18} className="cursor-pointer" />
                      ) : query?.sort === "createdAt.desc" || query?.sort === "updatedAt.desc" ? (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      ) : (
                        <FaCaretDown size={18} className="cursor-pointer text-gray-400" />
                      )}
                    </div>
                  </th>

                  {/* Amount (USD) Column */}
                  <th
                    scope="col"
                    className="dark:text-white/70 cursor-pointer"
                    onClick={() =>
                      handleSort({
                        label: query?.sort === "amount.asc" ? "Amount (DESC)" : "Amount (ASC)",
                        value: query?.sort === "amount.asc" ? "amount.desc" : "amount.asc",
                      })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span>USD</span>
                      {query?.sort === "amount.asc" ? (
                        <FaCaretDown size={18} className="cursor-pointer" />
                      ) : query?.sort === "amount.desc" ? (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      ) : (
                        <FaCaretDown size={18} className="cursor-pointer text-gray-400" />
                      )}
                    </div>
                  </th>

                  {/* Tracking Column */}
                  <th scope="col" className="dark:text-white/70">
                    <div className="flex items-center gap-2">
                      <span>TRACKING</span>
                    </div>
                  </th>

                  {/* Status Column */}
                  <th
                    scope="col"
                    className="dark:text-white/70 cursor-pointer"
                    onClick={() =>
                      handleSort({
                        label: query?.sort === "status.asc" ? "Status (DESC)" : "Status (ASC)",
                        value: query?.sort === "status.asc" ? "status.desc" : "status.asc",
                      })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span>STATUS</span>
                      {query?.sort === "status.asc" ? (
                        <FaCaretDown size={18} className="cursor-pointer" />
                      ) : query?.sort === "status.desc" ? (
                        <FaCaretUp size={18} className="cursor-pointer" />
                      ) : (
                        <FaCaretDown size={18} className="cursor-pointer text-gray-400" />
                      )}
                    </div>
                  </th>

                  {/* Payment Status Column */}
                  <th scope="col" className="dark:text-white/70">
                    <div className="flex items-center gap-2">
                      <span>
                        Payment STATUS
                        <br />
                        <small className="!normal-case text-center">(NowPayments)</small>
                      </span>
                    </div>
                  </th>

                  {/* Site Column */}
                  <th scope="col" className="dark:text-white/70">
                    <div className="flex items-center gap-2">
                      <span>Site</span>
                    </div>
                  </th>

                  {/* Action Column */}
                  <th scope="col" className="dark:text-white/70">
                    <div className="flex items-center gap-2">
                      <span>Action</span>
                    </div>
                  </th>
                </tr>

              </thead>
              <tbody>
                {!isRequestOrder &&
                  isValidArray(orders?.data) &&
                  orders?.data.map((order, i) => (
                    <tr className="order-list" key={i}>
                      <td className="">
                        <div className="flex items-center h-5 product-checkbox justify-center">
                          <input
                            id="product-check-1"
                            type="checkbox"
                            className="border-gray-500 ti-form-checkbox"
                            value=""
                            aria-label="..."
                            onChange={() => handleCheckboxClick(order)}
                            checked={selectedItems.includes(order.orderId)}
                          />
                          <label htmlFor="product-check-1" className="sr-only">
                            Checkbox
                          </label>
                        </div>
                      </td>

                      <td
                        className="font-semibold cursor-pointer"
                        onClick={() => {
                          handleSingleClick(order);
                        }}
                      >
                        #{order.orderId}
                      </td>
                      <td
                        className="cursor-pointer"
                        onClick={() => {
                          handleSingleClick(order);
                        }}
                      >
                        {order?.shipping?.email}
                      </td>
                      {/* <td>${parseFloat(order.payment?.paidAmount||0).toFixed(2)}</td> */}
                      <td
                        className="cursor-pointer"
                        onClick={() => {
                          handleSingleClick(order);
                        }}
                      >
                        {/* {order?.payment?.paidAt && isPendingOrder === false ? (
                          <>
                            <p>
                              {momentTZ
                                .utc(order.payment.paidAt)
                                .tz("America/New_York")
                                .format("YY.MM.DD")}
                            </p>
                            <p>
                              {momentTZ
                                .utc(order.payment.paidAt)
                                .tz("America/New_York")
                                .format("h:mma z")}
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              {momentTZ
                                .utc(order.createdAt)
                                .tz("America/New_York")
                                .format("YY.MM.DD")}
                            </p>
                            <p>
                              {momentTZ
                                .utc(order.createdAt)
                                .tz("America/New_York")
                                .format("h:mma z")}
                            </p>
                          </>
                        )} */}

                        {
                          <div>
                            <p>Created At:</p>
                            <p>
                              {momentTZ
                                .utc(order.createdAt)
                                .tz("America/New_York")
                                .format("YY.MM.DD")}   {momentTZ
                                  .utc(order.createdAt)
                                  .tz("America/New_York")
                                  .format("h:mma z")}
                            </p>
                            <p className="pt-1">Updated At:</p>
                            <p>
                              {momentTZ
                                .utc(order.updatedAt)
                                .tz("America/New_York")
                                .format("YY.MM.DD")}   {momentTZ
                                  .utc(order.updatedAt)
                                  .tz("America/New_York")
                                  .format("h:mma z")}
                            </p>

                          </div>
                        }
                      </td>
                      <td
                        className="cursor-pointer"
                        onClick={() => {
                          handleSingleClick(order);
                        }}
                      >
                        $
                        {order?.orderSummary?.totalAmount
                          ? order?.orderSummary?.totalAmount
                          : "0.00"}
                      </td>
                      <td
                        className="cursor-pointer"
                        onClick={() => {
                          handleSingleClick(order);
                        }}
                      >
                        {isValidArray(order?.tracking?.numbers)
                          ? order?.tracking?.numbers.map((track, i) => (
                            <p key={i}>{track}</p>
                          ))
                          : "N/A"}
                      </td>
                      <td
                        className="cursor-pointer"
                        onClick={() => {
                          handleSingleClick(order);
                        }}
                      >
                        {getStatus(order.status)}
                      </td>
                      <td
                        className="cursor-pointer uppercase"
                        onClick={() => {
                          handleSingleClick(order);
                        }}
                      >
                        {(parseFloat(order.payment.usedCreditAmount) || 0).toFixed(2) == parseFloat(order.orderSummary?.totalAmount).toFixed(2) ? "N/A" : order.payment.status}
                      </td>
                      <td
                        className="cursor-pointer uppercase"
                        onClick={() => {
                          handleSingleClick(order);
                        }}
                      >
                        {(order?.origin || "")?.includes(".site")
                          ? "HB_SITE"
                          : order?.site ?? "N/A"}
                      </td>
                      <td className="cursor-pointer uppercase">
                        <button
                          className="bg-blue-500 text-white rounded-md px-3 py-1 "
                          onClick={() => {
                            setEditData(JSON.parse(JSON.stringify(order)));
                            setOrderEditModalOpen(true);
                          }}
                        >
                          {" "}
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {isRequestOrder && (
              //   <div className="w-full flex justify-center items-center min-h-[300px]">
              //   <Loader bg="transparent" />
              //  </div>
              <TableSkeleton />
            )}
            {!isRequestOrder && orders?.data?.length === 0 && (
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
                  <div className="w-8/12 md:w-4/12 mx-auto">
                    <EmptyTableSection />
                  </div>
                </main>
              </>
            )}
          </div>
          {!isRequestOrder && (
            <div className="mt-6 flex items-center justify-between  flex-wrap">
              <div className="flex items-center gap-2">
                <Dropdown
                  onChanges={handlerOrderPageLimitChange}
                  options={orderPageLimitOptions}
                  selectedOption={orderLimit}
                  totalCount={orders?.paginate?.totalPage || 0}
                  page={orderPage}
                />
                <div>
                  <div>
                    <p className="text-[#999ea6]">
                      Showing {orderPage} - {orders?.paginate?.totalPage} of{" "}
                      {orders?.paginate?.totalCount || 0}
                    </p>
                  </div>
                </div>
              </div>
              <Paginate
                setCurrentPage={setOrderPage}
                totalPages={orders?.paginate?.totalPage || 0}
                currentPage={orderPage}
                setInitPaginate={setInitPaginate}
              />
            </div>
          )}
        </div>
      </div>

      <OrderTrackingNumbersUpdate
        isOpen={trackingNumberModalOpen}
        setIsOpen={setTrackingNumberModalOpen}
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchPaginateOrders={fetchPaginateOrders}
        fetchOrderStats={fetchOrderStats}
      />

      <OrderDetailsModal
        setIsOpen={setOrderDetailsModal}
        isOpen={orderDetailsModal}
        fetchOrderStats={fetchOrderStats}
        fetchOrders={fetchOrders}
        fetchPaginateOrders={fetchPaginateOrders}
        setSelectedItems={setSelectedItems}
        setSelectAllChecked={setSelectAllChecked}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <SendMailModal
        setIsOpen={setBulkMailSendModalOpen}
        isOpen={bulkMailSendModalOpen}
        setEditorData={setEditorData}
        editorData={editorData}
      />
      <BulkTrackingNumberUpdate
        isOpen={bulkTrackingNumberModalOpen}
        setIsOpen={setBulkTrackingNumberModalOpen}
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchPaginateOrders={fetchPaginateOrders}
        fetchOrderStats={fetchOrderStats}
      />
      <BulkTrackingNumberUpdateVersion2
        key={showBulkCount}
        isOpen={showBulkTrackingModalVersion2}
        setIsOpen={setShowBulkTrackingModalVersion2}
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchPaginateOrders={fetchPaginateOrders}
        fetchOrderStats={fetchOrderStats}
      />

      <OrderEditModal
        isOpen={orderEditModalOpen}
        setIsOpen={setOrderEditModalOpen}
        data={editData}
        setData={setEditData}
        fetchOrders={fetchOrders}
      />
    </div>
  );
};

export default Order;
