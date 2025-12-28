/* eslint-disable vars-on-top */
import DropdownReview from "@/components/Shared/DropdownReview";
import StatusDropDown from "@/components/Shared/StatusDropDown";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import {
  ProfileAvatarOutput,
  addressConcat,
  downloadTxtAddressFormatter,
  isValidArray,
  numberWithCommas,
} from "@/utils/func";
import {
  RemoveTestOrderOrder,
  getOrderDetails,
  getOrderIdToReviews,
  orderCommentCreate,
  orderInvoiceGen,
  orderStatusSingleUpdate,
  orderTestOrderUpdate,
  orderTrackNumberRemove,
  orderTrackNumberUpdate,
 
} from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import saveAs from "file-saver";
import "jspdf-autotable";
import momentTZ from "moment-timezone";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { Fragment, createRef, useEffect, useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import { IoIosCloseCircle } from "react-icons/io";
import {
  MdClose,
  MdOutlineComment,
  MdOutlineFileDownload,
} from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import StarRatings from "react-star-ratings";

import Switch from "@/components/Shared/Switch";
import Swal from "sweetalert2";
import CustomerDetailsModal from "../Customer/CustomerDetailsModal";
import OrderEditModal from "../OrderEditModal";
import ProductDetails from "../Products/ProductDetails";
export default function OrderDetailsModal({
  isOpen,
  setIsOpen,
  fetchOrders,
  fetchOrderStats,
  setSelectedItems,
  setSelectAllChecked,
  fetchPaginateOrders,
  activeTab,
  setActiveTab,
}) {
  const { Auth, Order, Customer, Product } = useFullStage();
  const router = useRouter();
  const [fileFormat, setFileFormat] = useState("txt");
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const [orderPage, setOrderPage, orderLimit, setOrderLimit] =
    Order.OrderPaginate;
  const [orders, setOrders] = Order.Orders;
  const [orderReq, setOrderReq] = useState(false);
  const [isRefreshCommentReq, setIsRefreshCommentReq] = useState(false);
  // State for active tab
  const [trackNumRequest, setTrackNumRequest] = useState(false);
  const [orderStatusReq, setOrderStatusReq] = useState(false);
  const [orderTestReq, setOrderTestReq] = useState(false);

  const [dropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTestOrderOpen, setIsTestOrderOpen] = useState(false);
  const [isShippingInfo, setIsShippingInfo] = useState(true);
  const [orderEditModalOpen, setOrderEditModalOpen] = useState(false);
  const [editModalCount, setEditModalCount] = useState(1);
  const [editData, setEditData] = useState({});
  const [reviewQuery, setReviewQuery] = useState({});
  const [orderReviews, setOrderReviews] = useState({});
  const [isOrderReview, setIsOrderReview] = useState(false);

  const orderId = orderSingleDetails?.orderId || router?.query?.orderId;
  const closeModal = () => {
    setIsOpen(false);
  };

  //comments state
  const [isRequest, setIsRequest] = useState(false);

  const [authData, setAuthData] = Auth;
  const [sendEmailAsWell, setSendEmailAsWell] = useState(true);

  const [customerDetailsModalOpen, setCustomerDetailsModalOpen] =
    useState(false);
  const [customerActiveTab, setCustomerActiveTab] = useState("Profile");

  const [customerSingleDetails, setCustomerSingleDetails] =
    Customer.CustomerSingleDetails;
  const [productDetailsActiveTab, setProductDetailsActiveTab] =
    useState("productDetails");

  const [productDetailsModalOpen, setProductDetailsModalOpen] = useState(false);
  const [products, setProducts] = Product.Products;
  const [singleProductDetails, setSingleProductDetails] =
    Product.ProductSingleDetails;

  const handleOpenCustomerDetailsModal = (customerId) => {
    setCustomerActiveTab("Profile");
    setCustomerSingleDetails((prev) => {
      return {
        ...prev,
        _id: customerId,
      };
    });
    setCustomerDetailsModalOpen(true);
  };

  const handleOpenProductDetailsModal = (productSlug) => {
    setProductDetailsActiveTab("productDetails");
    setSingleProductDetails((prev) => {
      return {
        ...prev,
        slug: productSlug,
      };
    });
    setProductDetailsModalOpen(true);
  };
  const messagesEndRef = useRef(null);

  const onChangeCommentInput = (value) => {
    setOrderSingleDetails((prev) => {
      const commentInput = prev?.commentInput || {};
      return {
        ...prev,
        commentInput: {
          ...commentInput,
          message: value,
        },
      };
    });
  };

  const onChangeCommentMarkAsEmailSend = (bool) => {
    setSendEmailAsWell(bool);
  };
  const handleCommentAdd = async () => {
    try {
      if (!orderSingleDetails?.commentInput?.message)
        return ToastEmitter("error", "Please write a comment!");
      setIsRequest(true);
      const res = await orderCommentCreate({
        orderId: orderSingleDetails?.orderId || router?.query?.orderId,
        ...(orderSingleDetails?.commentInput || {}),
        sendEmailAsWell: sendEmailAsWell,
      });
      setIsRequest(false);

      if (res?.data?.success) {
        setOrderSingleDetails((prev) => {
          return {
            ...prev,
            commentInput: {},
            ...res?.data?.data,
          };
        });
        scrollToBottom();
      } else {
        Swal.fire({
          title: "Error!",
          text: res?.data?.message,
          icon: "error",
        });
      }
    } catch (error) {
      setIsRequest(false);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message,
        icon: "error",
      });
    }
  };

  const messagesScrollDiv = useRef(null);

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({
    //   // behavior: "block",
    //   block: "end",
    // });
    if (messagesScrollDiv.current) {
      messagesScrollDiv.current.scrollTop = 0;
    }
  };

  //comments end------------------------
  const handleInputChange = (event) => {
    setOrderSingleDetails((prev) => {
      const tracking = prev?.tracking || {};
      return {
        ...prev,
        tracking: {
          ...tracking,
          number: event.target.value,
        },
      };
    });
  };
  const handleUpdateTrackingNumber = async (number) => {
    if (!orderSingleDetails?.tracking?.number) {
      Swal.fire({
        title: "Error!",
        text: "Tracking number is required!",
        icon: "error",
      });
      return;
    }

    if (!orderSingleDetails?.orderId) {
      Swal.fire({
        title: "Error!",
        text: "Please select a order",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You want to add track number?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setTrackNumRequest(true);
          const res = await orderTrackNumberUpdate({
            orderId: orderSingleDetails?.orderId,
            number: number,
          });
          setTrackNumRequest(false);
          if (res?.data?.success) {
            setOrders((prev) => {
              const data = isValidArray(prev?.data)
                ? prev?.data.map((item) => {
                  if (item.orderId == res?.data?.data?.orderId) {
                    const tracking = res?.data?.data?.tracking || {};
                    return {
                      ...item,
                      tracking: {
                        ...tracking,
                        numbers: tracking?.numbers || [],
                      },
                    };
                  } else {
                    return item;
                  }
                })
                : [];
              return {
                ...prev,
                data: data,
              };
            });
            const tracking = orderSingleDetails?.tracking || {};
            setOrderSingleDetails({
              ...orderSingleDetails,
              tracking: {
                ...tracking,
                number: "",
                numbers: res?.data?.data?.tracking?.numbers,
              },
            });

            Swal.fire({
              title: "Success",
              text: res?.data?.message,
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: res?.data?.message,
              icon: "error",
            });
          }
        } catch (error) {
          console.log(error, "error");
          setTrackNumRequest(false);
          Swal.fire({
            title: "Error!",
            text: error?.response?.data?.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleRemoveTrackingNumber = async (number) => {
    if (!orderSingleDetails?.orderId) {
      Swal.fire({
        title: "Error!",
        text: "Please select a order",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You want to remove track number?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setTrackNumRequest(true);
          const res = await orderTrackNumberRemove({
            orderId: orderSingleDetails?.orderId,
            number: number,
          });
          setTrackNumRequest(false);
          if (res?.data?.success) {
            setOrders((prev) => {
              const data = isValidArray(prev?.data)
                ? prev?.data.map((item) => {
                  if (item.orderId == res?.data?.data?.orderId) {
                    const tracking = res?.data?.data?.tracking || {};
                    return {
                      ...item,
                      tracking: {
                        ...tracking,
                        numbers: tracking?.numbers || [],
                      },
                    };
                  } else {
                    return item;
                  }
                })
                : [];
              return {
                ...prev,
                data: data,
              };
            });
            const tracking = res?.data?.data?.tracking || {};
            setOrderSingleDetails({
              ...orderSingleDetails,
              tracking: {
                ...tracking,
                number: "",
                numbers: res?.data?.data?.tracking?.numbers,
              },
            });

            Swal.fire({
              title: "Success",
              text: res?.data?.message,
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "error",
              text: res?.data?.message,
              icon: "error",
            });
          }
        } catch (error) {
          console.log(error, "error");
          setTrackNumRequest(false);
          Swal.fire({
            title: "Error!",
            text: error?.response?.data?.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleUpdateStatus = async () => {
    if (
      !(orderSingleDetails?.updateStatus?.value || orderSingleDetails?.status)
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please select a order status!",
        icon: "error",
      });

      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: ``,
      html: `

      <div><p class="text-center pb-4 text-[14px]">Do you want to mark as <b>"${orderSingleDetails?.updateStatus?.value || orderSingleDetails?.status
        }</b>"?</p> </div>
        <div class="flex items-center justify-center pl-2">
          <input type="checkbox"checked class="focus:ring-0 border" name="mailSendCheckbox" id="mailSendCheckbox" />
          <span class="pl-2 text-[14px]">On update order status send mail to customer?</span>
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
        const requestData = {
          orderId: orderSingleDetails?.orderId,
          mailSend: mailSend,
          status:
            orderSingleDetails?.updateStatus?.value ||
            orderSingleDetails?.status,
        };
        try {
          setOrderStatusReq(true);
          const res = await orderStatusSingleUpdate(requestData);
          setOrderStatusReq(false);

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
              text: res?.data?.message + ` to "${res?.data?.data?.status}"!`,
              icon: "success",
            });
          }
        } catch (error) {
          setOrderStatusReq(false);
          if (error?.response?.data?.data?.paymentNotFinished) {
            Swal.fire({
              title: "Payment is not confirmed yet!",
              text: error?.response?.data?.message,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes",
            }).then(async (result) => {
              if (!result.isConfirmed) {
                return;
              }
              try {
                setOrderStatusReq(true);
                requestData.force = true;
                const res = await orderStatusSingleUpdate(requestData);
                setOrderStatusReq(false);

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
              } catch (e) {
                console.log(e,"now");
                Swal.fire({
                  title: "Error!",
                  text: e?.response?.data?.message,
                  icon: "error",
                });
              }
            });
          } else {
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
  };
  const handleUpdateTestOrder = async ({ orderId, isTestOrder }) => {
    try {
      setOrderTestReq(true);
      const res = await orderTestOrderUpdate({ orderId, isTestOrder });
      setOrderTestReq(false);

      if (res.data.success) {
        setOrderSingleDetails((prev) => ({
          ...prev,
          isTestOrder: res?.data?.data?.isTestOrder,
        }));
        setOrderPage(1);
        setSelectAllChecked(false);
        setSelectedItems([]);
        const isTestPath = router.pathname == '/admin/orders/test-orders';
        fetchOrderStats({ isTestOrder: isTestPath });
        fetchPaginateOrders({ isTestOrder: isTestPath });

        // Swal.fire({
        //   title: "Success",
        //   text: res?.data?.message,
        //   icon: "success",
        // });
      }
    } catch (error) {
      setOrderTestReq(false);

    }
    // Swal.fire({
    //   title: "Are you sure?",
    //   text: `Do you want to mark as ${isTestOrder ? "test order" : "not a test order"}`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes"
    // }).then(async (result) => {
    //   if (result.isConfirmed) {

    //   }
    // });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getStatus = (text) => {
    if (text == "FULLY_SHIPPED") {
      return (
        <p className="px-3 py-2 bg-[#b6ff9d] text-[#21a143] font-[200] text-[14px] text-center  rounded-sm">
          {text}
        </p>
      );
    }
    if (text == "PARTIALLY_SHIPPED") {
      return (
        <p className="px-3 py-2 bg-[#ccf4d7] text-[#5fbf8a] font-[200] text-[14px] text-center  rounded-sm">
          {text}
        </p>
      );
    }
    if (text == "PACKED") {
      return (
        <p className="px-3 py-2 bg-[#fccf99] text-[#cc7a00] font-[200] text-[14px] text-center  rounded-sm">
          {text}
        </p>
      );
    }
    if (text == "PAID") {
      return (
        <p className="px-3 py-2 bg-[#fd9999] text-[#c24f4f] font-[200] text-[14px] text-center   rounded-sm">
          {text}
        </p>
      );
    }
    return (
      <p className="px-3 py-2 bg-[#b6ff9d] text-[#21a143] font-[200] text-[14px] text-center   rounded-sm">
        {text}
      </p>
    );
  };

  const onChangeStatus = (val) => {
    setOrderSingleDetails((prev) => {
      return {
        ...prev,
        updateStatus: val,
      };
    });
  };
  const onChangeTestOrderStatus = (val) => {
    setOrderSingleDetails((prev) => {
      return {
        ...prev,
        updateTestOrder: val,
      };
    });
  };

  isValidArray(orderSingleDetails?.comments) &&
    orderSingleDetails?.comments?.sort((a, b) =>
      new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
    );

  const sortReviewFetch = async (sort) => {
    if ((orderId || orderSingleDetails?.orderId) && activeTab == "reviews") {
      try {
        setIsOrderReview(true);
        const res = await getOrderIdToReviews({
          sort: sort ?? "",
          orderId: orderId || orderSingleDetails?.orderId,
        });
        // console.log(res.data);
        setIsOrderReview(false);
        if (res?.data?.success) {
          setOrderReviews(res?.data);
        }
      } catch (error) {
        setIsOrderReview(false);
        // //console.log(error);
      }
    }
  };

  const handleSortReview = (value) => {
    setReviewQuery({ sort: value ?? "" });
    sortReviewFetch(value);
  };

  const fetchProductReviews = async () => {
    if ((orderId || orderSingleDetails?.orderId) && activeTab == "reviews") {
      try {
        setIsOrderReview(true);
        const res = await getOrderIdToReviews({
          orderId: orderId || orderSingleDetails?.orderId,
        });
        // console.log(res.data);
        setIsOrderReview(false);
        if (res?.data?.success) {
          setOrderReviews(res?.data);
        }
      } catch (error) {
        setIsOrderReview(false);
        // //console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchProductReviews();
  }, [orderId, activeTab]);

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

  const adminAddedProducts = (orderSingleDetails?.editedByAdmins || [])
    .filter((e) => e.status == "added")
    .map((e) => getProductObject(e.product, e.quantity));
  const isProductRemoved = (pId) => {
    return (orderSingleDetails?.editedByAdmins || [])
      .filter((e) => e.status == "removed")
      .map((e) => e.product?._id || e.product)
      .includes(pId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orderDetails":
        return (
          <div className="order-details__content">
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="text-[#3F434A] text-lg">
                Order{" "}
                <span className="text-[#8A9099]">
                  #{orderSingleDetails?.orderId}
                </span>
              </h2>
              <div className="my-4">
                {fileFormat == "txt" ? (
                  <div className="bg-gray-100 px-2 py-2 rounded-md flex flex-wrap items-center gap-1 text-[#3F434A]">
                    <button
                      className="cursor-pointer  flex flex-wrap items-center gap-1"
                      onClick={() => downloadText()}
                    >
                      <MdOutlineFileDownload />
                      <span> Download.txt </span>
                    </button>{" "}
                    <RiArrowDropDownLine
                      size={18}
                      className="cursor-pointer"
                      onClick={() => {
                        setFileFormat("pdf");
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 px-2 py-2 rounded-md flex flex-wrap items-center gap-1 text-[#3F434A]">
                    <button
                      className="cursor-pointer  flex flex-wrap items-center gap-1"
                      onClick={() => downloadPdf()}
                    >
                      <MdOutlineFileDownload />
                      <span> Download.pdf </span>
                    </button>{" "}
                    <RiArrowDropUpLine
                      size={18}
                      className="cursor-pointer"
                      onClick={() => {
                        setFileFormat("txt");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg">Customer</h2>
              <div className="lg:flex flex-wrap my-4  px-2   lg:px-6">
                <div className="w-full lg:w-[33%]">
                  <h4 className="py-1">Name</h4>
                  <hr className="border-0 lg:border-b" />
                  <div
                    className="flex flex-wrap gap-2 items-center py-3 cursor-pointer"
                    onClick={() => {
                      handleOpenCustomerDetailsModal(
                        orderSingleDetails?.customer?._id
                      );
                    }}
                  >
                    <img
                      className="w-[20px] h-[20px] rounded-full border"
                      src={ProfileAvatarOutput(
                        orderSingleDetails?.customer?.avatar
                      )}
                      alt=""
                    />
                    {/* {console.log(orderSingleDetails?.shipping?.address?.receiverName,'orderSingleDetails?.shipping?.address?.receiverName')} */}
                    <span>
                      {orderSingleDetails?.customer?.firstName ||
                        orderSingleDetails?.shipping?.address?.receiverName
                          ?.firstName ||
                        "----"}{" "}
                      {orderSingleDetails?.customer?.lastName ||
                        orderSingleDetails?.shipping?.address?.receiverName
                          ?.lastName ||
                        "----"}
                    </span>
                  </div>
                  <hr />
                </div>
                <div className="w-full lg:w-[33%]">
                  <h4 className="py-1">Email</h4>
                  <hr className="border-0 lg:border-b" />
                  <div className="w-full lg:flex flex-wrap gap-2 items-center py-3">
                    <span>
                      {orderSingleDetails?.customer?.email ||
                        orderSingleDetails?.shipping?.email ||
                        "N/A"}
                    </span>
                  </div>
                  <hr />
                </div>
                <div className="w-full lg:w-[33%]">
                  <h4 className="py-1">Date & time</h4>
                  <hr className="border-0 lg:border-b" />
                  <div className="w-full lg:flex flex-wrap gap-2 items-center py-3">
                    {orderSingleDetails?.payment?.paidAt ? (
                      <span>
                        {" "}
                        {momentTZ
                          .utc(orderSingleDetails.payment.paidAt)
                          .tz("America/New_York")
                          .format("YY.MM.DD [AT] h:mma z")}
                      </span>
                    ) : (
                      <p>N/A</p>
                    )}
                  </div>
                  <hr />
                </div>
              </div>
            </div>

            <div className="py-3 lg:flex lg:gap-10">
              <div className="w-full  lg:w-[33%]">
                <h2 className="text-lg py-2">Payment Details:</h2>
                <p className="text-[#3F434A] py-1 text-[14px]">
                  Total BTC Paid:{" "}
                  <span className="text-[#628aaf]">
                    {orderSingleDetails?.payment?.paidAmount}
                  </span>
                </p>
                <p className="text-[#3F434A] py-1 text-[14px]">
                  Total USD Paid:{" "}
                  <span className="text-[#628aaf]">
                    {" "}
                    $
                    {parseFloat(
                      orderSingleDetails?.payment?.paidAmountUSD || 0
                    ).toFixed(2)}{" "}
                  </span>
                </p>
                <p className="text-[#3F434A] py-1 text-[14px]">
                  Total Order Amount:{" "}
                  <span className="text-[#628aaf]">
                    {" "}
                    $
                    {parseFloat(
                      orderSingleDetails?.orderSummary?.totalAmount || 0
                    ).toFixed(2)}{" "}
                  </span>
                </p>
                { parseFloat(orderSingleDetails?.payment?.usedCreditAmount || 0) ? <p className="text-[#3F434A] py-1 text-[14px]">
                  Used Credit Balance:{" "}
                  <span className="text-[#628aaf]">
                    {" "}${parseFloat(orderSingleDetails?.payment?.usedCreditAmount || 0).toFixed(2)}{" "}
                  </span>
                </p>:<></> }
                <p className="text-[#3F434A] py-1 text-[14px]">
                  Sale Savings:{" "}
                  <span className="text-[#628aaf]">
                    {" "}
                    $
                    {parseFloat(
                      orderSingleDetails?.orderSummary?.totalSaving || 0
                    ).toFixed(2)}{" "}
                  </span>
                </p>
                <p className="text-[#3F434A] py-1 text-[14px]">
                  Coupon Savings:{" "}
                  <span className="text-[#628aaf]">
                    $
                    {parseFloat(
                      orderSingleDetails?.orderSummary?.coupon?.amount || 0
                    ).toFixed(2)}
                  </span>{" "}
                  <span>
                    {orderSingleDetails?.orderSummary?.coupon?.code || ""}
                  </span>{" "}
                </p>
                {/*<p><span className="text-[#3F434A] pt-1 text-[10px] text-[600]">Customer BTC address: <span className="text-[#628aaf] text-[400]"> {""}</span></span></p>*/}
                <p className="mt-[-2px]">
                  {" "}
                  <span className="text-[#3F434A] text-[12px]  text-[600]">
                    BTC address paid to:{" "}
                    <span className="text-[#628aaf] text-[400]">
                      {" "}
                      {orderSingleDetails?.payment?.receiverAddress}
                    </span>
                  </span>
                </p>
              </div>
              <div className="w-full lg:w-[35%]">
                <div>
                  <h2 className="text-lg py-2">Tracking Details:</h2>
                  <div className="box-body p-0 space-y-2 py-2">
                    {/* <h5 className="text-base font-semibold text-gray-800 dark:text-white">Tracking Details:</h5> */}
                    <div className="flex flex-wrap gap-4">
                      <input
                        className="w-[65%] text-gray-500 dark:text-white/70 text-sm rounded-md"
                        defaultValue={orderSingleDetails?.tracking?.number}
                        onChange={handleInputChange}
                        value={orderSingleDetails?.tracking?.number}
                        placeholder="Type to add tracking"
                      ></input>
                      {trackNumRequest ? (
                        <button className="w-[90px]  text-center py-[0.20rem] bg-blue-500 text-white px-4 rounded-sm cursor-not-allowed">
                          <Loader bg="transparent" width={"w-4"} height={"h-4"} />
                        </button>
                      ) : (
                        <button
                          className="w-[90px] text-center bg-blue-500 text-white px-4 py-[0.20rem] rounded-sm"
                          onClick={() => {
                            handleUpdateTrackingNumber(
                              orderSingleDetails?.tracking?.number || ""
                            );
                          }}
                        >
                          Submit
                        </button>
                      )}
                    </div>

                  </div>

                  <div className="mb-4 w-full text-center lg:h-[100px] overflow-auto">
                    {isValidArray(orderSingleDetails?.tracking?.numbers) &&
                      orderSingleDetails?.tracking?.numbers.map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-wrap items-center gap-2 my-3"
                        >
                          <p className="text-[14px]">
                            <span className="font-[500] text-[#3F434A]">
                              Tracking #{i + 1}:
                            </span>{" "}
                            <span className="text-[#8fb4d6]">{item}</span>
                          </p>
                          <p
                            className="bg-white border p-[2px] hover:scale-110  duration-300  w-[20px] h-[20px] flex items-center justify-center  rounded-full  text-[14px] cursor-pointer"
                            onClick={() => {
                              handleRemoveTrackingNumber(item);
                            }}
                          >
                            <MdClose />
                          </p>
                        </div>
                      ))}
                  </div>

                </div>
              </div>
              <div className="w-full lg:w-[40%]">
                <h2 className="text-lg py-2">Status Details:</h2>

                <div className="bg-[#f8f8f8] px-3 py-4 rounded-md">
                  <div className="flex flex-wrap items-center flex-col md:flex-row justify-between  mb-4">
                    <p className="  w-full  md:w-[35%] pr-[2px] text-[14px]">
                      Current Status:
                    </p>
                    <div className="bg-white p-2 w-full  md:w-[65%] rounded-lg ">
                      {getStatus(orderSingleDetails?.status)}
                    </div>
                  </div>
                  <div>
                    <div className="flex  flex-col md:flex-row items-center">
                      <p className=" w-full  md:w-[35%] text-[14px] pr-[2px]">
                        Change Status:
                      </p>
                      <div className=" w-full  md:w-[70%] rounded-lg flex flex-col md:flex-row items-center gap-2">
                        <div className="  w-full  md:w-[50%]">
                          <StatusDropDown
                            className="w-full h-full "
                            selectedOption={
                              orderSingleDetails?.updateStatus?.label ||
                              orderSingleDetails?.status
                            }
                            isOpen={dropdownOpen}
                            setIsOpen={setIsDropdownOpen}
                            onChanges={onChangeStatus}
                          />
                        </div>
                        <div className=" w-full  md:w-[50%]">
                          {orderStatusReq ? (
                            <button className="w-full text-[14px] text-center py-2 bg-blue-500 text-white px-4 rounded-sm cursor-not-allowed">
                              <Loader
                                bg="transparent"
                                width={"w-4 text-[14px]"}
                                height={"h-4"}
                              />
                            </button>
                          ) : (
                            <button
                              className="w-full text-center text-[14px] bg-blue-500 text-white px-4 py-2 rounded-sm"
                              onClick={() => {
                                handleUpdateStatus();
                              }}
                            >
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* <div class="flex flex-wrap items-center pl-2">
                      <input type="checkbox" className="focus:ring-0 w-3 h-3 border focus:outline-none  text-[10px]" name="mailSendCheckbox" id="mailSendCheckbox" onClick={(e) => {
                        const mailSend = e.target.checked ? "yes" : "no";
                        setOrderSingleDetails(prev => ({
                          ...prev,
                          mailSend: mailSend
                        }));
                      }} />
                      <span className="pl-2 text-[10px]">On update tracking status send mail to customer?</span>
                    </div> */}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="border-b"></div>
                  <div className="mt-4 flex items-center gap-1">
                    <p>Is Test Order </p> {orderTestReq ?

                      <div className="">
                        <Loader bg="transparent" />
                      </div>
                      :
                      <div >
                        <button onClick={() => handleUpdateTestOrder({ orderId: orderSingleDetails?.orderId, isTestOrder: !orderSingleDetails?.isTestOrder })}>
                          <Switch checked={orderSingleDetails?.isTestOrder} onChange={() => { }} />
                        </button>
                      </div>}
                  </div>
                  {orderSingleDetails?.isTestOrder && <button className="border px-4 py-2 rounded-md my-2" onClick={() => {
                    handleRemoveTestOrder();
                  }}>
                    Delete Test Order
                  </button>}
                </div>
              </div>

            </div>

            <div className="border px-5 pb-2 pt-1 rounded-[10px]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg py-2">Shipping address:</h2>

                {isShippingInfo ? (
                  <RiArrowDropDownLine
                    size={22}
                    className="cursor-pointer"
                    onClick={() => {
                      setIsShippingInfo(false);
                    }}
                  />
                ) : (
                  <RiArrowDropUpLine
                    size={22}
                    className="cursor-pointer"
                    onClick={() => {
                      setIsShippingInfo(true);
                    }}
                  />
                )}
              </div>

              {isShippingInfo && (
                <div className="w-full lg:flex lg:gap-10">
                  <div className="w-full lg:w-[33%]">
                    <p className="text-[#3F434A] py-1 text-[14px]">
                      First Name:{" "}
                      <span className="text-[#628aaf]">
                        {orderSingleDetails?.shipping?.address?.receiverName
                          ?.firstName || "----"}
                      </span>
                    </p>
                    <p className="text-[#3F434A] py-1 text-[14px]">
                      Last Name:{" "}
                      <span className="text-[#628aaf]">
                        {" "}
                        {orderSingleDetails?.shipping?.address?.receiverName
                          ?.lastName || "----"}
                      </span>
                    </p>
                    <p className="text-[#3F434A] py-1 text-[14px]">
                      Address:{" "}
                      <span className="text-[#628aaf]">
                        {orderSingleDetails?.shipping?.address &&
                          Object.values(
                            orderSingleDetails.shipping.address
                          ).filter(Boolean).length > 1
                          ? addressConcat(orderSingleDetails.shipping.address)
                          : "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="w-full lg:w-[33%]">
                    <p className="text-[#3F434A] py-1 text-[14px]">
                      State/Region:{" "}
                      <span className="text-[#628aaf]">
                        {orderSingleDetails?.shipping?.address?.state || "N/A"}
                      </span>
                    </p>
                    <p className="text-[#3F434A] py-1 text-[14px]">
                      City:{" "}
                      <span className="text-[#628aaf]">
                        {" "}
                        {orderSingleDetails?.shipping?.address?.city || "N/A"}
                      </span>
                    </p>
                    <p className="text-[#3F434A] py-1 text-[14px]">
                      Apt/Unit:{" "}
                      <span className="text-[#628aaf]">
                        {orderSingleDetails?.shipping?.address?.aptUnit ||
                          "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="w-full lg:w-[33%]">
                    <p className="text-[#3F434A] py-1 text-[14px]">
                      Phone:{" "}
                      <span className="text-[#628aaf]">
                        {orderSingleDetails?.shipping?.phoneNum || "N/A"}
                      </span>
                    </p>
                    <p className="text-[#3F434A] py-1 text-[14px]">
                      Email:{" "}
                      <span className="text-[#628aaf]">
                        {" "}
                        {orderSingleDetails?.shipping?.email || "----"}
                      </span>
                    </p>
                    <p className="text-[#3F434A] py-1 text-[14px]">
                      Postcode:{" "}
                      <span className="text-[#628aaf]">
                        {orderSingleDetails?.shipping?.address?.postCode ||
                          "N/A"}
                      </span>
                    </p>

                   
                  </div>
                </div>
              )}

            
            </div>

             {orderSingleDetails?.shipping?.shippingNote&&  <div className="border px-5 pb-2 pt-1 rounded-[10px] mt-3">


               <p className="text-[#3F434A] py-1 text-[14px]">
                      CUSTOMER NOTE:{" "}
                      <span className="text-[#628aaf]">
                        {orderSingleDetails?.shipping?.shippingNote ||
                          "N/A"}
                      </span>
                    </p>
              </div>}
          </div>
        );
      case "orderContents":
        return (
          <div className="order-details__content">
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="text-[#3F434A] text-lg">Products Purchased</h2>
              <div className="my-4">
                {fileFormat == "txt" ? (
                  <div className="bg-gray-100 px-2 py-2 rounded-md flex flex-wrap items-center gap-1 text-[#3F434A]">
                    <button
                      className="cursor-pointer  flex flex-wrap items-center gap-1"
                      onClick={() => downloadText()}
                    >
                      <MdOutlineFileDownload />
                      <span> Download.txt </span>
                    </button>{" "}
                    <RiArrowDropDownLine
                      size={18}
                      className="cursor-pointer"
                      onClick={() => {
                        setFileFormat("pdf");
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 px-2 py-2 rounded-md flex flex-wrap items-center gap-1 text-[#3F434A]">
                    <button
                      className="cursor-pointer  flex flex-wrap items-center gap-1"
                      onClick={() => downloadPdf()}
                    >
                      <MdOutlineFileDownload />
                      <span> Download.pdf </span>
                    </button>{" "}
                    <RiArrowDropUpLine
                      size={18}
                      className="cursor-pointer"
                      onClick={() => {
                        setFileFormat("txt");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="relative overflow-auto h-full">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-white border-b ">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 rounded-tl-lg text-[#333]"
                      >
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-[#333]">
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 rounded-tr-lg text-[#333]"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 rounded-tr-lg text-[#333]"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isValidArray(orderSingleDetails?.products) &&
                      [
                        ...orderSingleDetails.products,
                        ...(orderSingleDetails.freeBuy?.freeBuyProduct?.title
                          ? [
                            {
                              ...orderSingleDetails.freeBuy?.freeBuyProduct,
                              freeBuy: true,
                            },
                          ]
                          : []),
                        ...adminAddedProducts,
                      ].map((item, i) => (
                        <tr
                          className={`bg-white border-b  ${item?.product?.slug ? "cursor-pointer" : ""
                            }`}
                          key={i}
                          onClick={() => {
                            if (item?.product?.slug) {
                              handleOpenProductDetailsModal(
                                item?.product?.slug
                              );
                            }
                          }}
                        >
                          {/* {console.log(item)} */}
                          <th
                            scope="row"
                            className="px-6 py-4 font-[400] text-[14px] text-[#333] whitespace-nowrap"
                          >
                            {/* 
                            {
                              console.log(item, 'item')
                            } */}
                            <div className="flex gap-1">
                              {(item?.bundle?.isBundle || item?.isBundle) ? `${item?.title} (${item?.subTitle || ""})`
                                : item?.title}{" "}
                              {item.freeBuy ? (
                                <img
                                  width={30}
                                  height={30}
                                  alt="Free"
                                  src="/free.svg"
                                  className="-mt-1"
                                />
                              ) : (
                                ""
                              )}

                              {item.adminAdded ? (
                                <span className="text-primary font-semibold">
                                  ADMIN ADDED
                                </span>
                              ) : isProductRemoved(
                                item.product?._id || item.product
                              ) ? (
                                <span className="text-red-500 font-semibold">
                                  ADMIN REMOVED
                                </span>
                              ) : (
                                <></>
                              )}
                            </div>
                            {item?.cycle?.isCycle && isValidArray(item?.cycle?.cycleIncludes) && (
                              <p className='text-sm'>
                                Cycle Includes:{' '}
                                {item?.cycle?.cycleIncludes.map((cycleItem, i, arr) => (
                                  <p className='font-normal' key={i}>
                                    x{item?.quantity * cycleItem?.quantity} {cycleItem?.title} ${(item?.quantity * cycleItem?.quantity) * parseFloat(cycleItem?.price?.sale)}

                                  </p>
                                ))}
                              </p>
                            )}
                          </th>
                          {
                            // line-through
                            item?.freeBuy ? <td className="px-6 py-4 font-[400] text-[14px] text-[#333] line-through">
                              ${parseFloat(item?.price?.sale || 0).toFixed(2)}
                            </td> :
                              <td className="px-6 py-4 font-[400] text-[14px] text-[#333]">
                                ${parseFloat(item?.price?.sale || 0).toFixed(2)}
                              </td>}
                          <td className="px-12 py-4 font-[400] text-[14px] text-[#333] ">
                            {item?.quantity}
                          </td>
                          {item?.freeBuy ? <td className="px-6 py-4 font-[400] text-[14px] text-[#333] line-through">
                            $
                            {parseFloat(
                              item?.price?.sale * item?.quantity
                            ).toFixed(2)}
                          </td> : <td className="px-6 py-4 font-[400] text-[14px] text-[#333]">
                            $
                            {parseFloat(
                              item?.price?.sale * item?.quantity
                            ).toFixed(2)}
                          </td>}
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold text-[#333]">
                      <th scope="row" className="px-6 py-1 text-base">
                        {/* Total */}
                      </th>
                      <td className="px-6 py-3">
                        $
                        {parseFloat(
                          isValidArray(orderSingleDetails.products)
                            ? orderSingleDetails.products.reduce(
                              (acc, curr) => acc + Number(curr?.price?.sale),
                              0
                            )
                            : 0
                        ).toFixed(2)}
                      </td>
                      <td className="px-12 py-3">
                        {isValidArray(orderSingleDetails.products)
                          ? orderSingleDetails.products.reduce(
                            (acc, curr) => acc + Number(curr?.quantity),
                            0
                          )
                          : 0}
                      </td>
                      <td className="px-6 py-3">
                        $
                        {parseFloat(
                          isValidArray(orderSingleDetails.products)
                            ? orderSingleDetails.products.reduce(
                              (acc, curr) =>
                                acc +
                                Number(curr?.price?.sale) *
                                Number(curr?.quantity),
                              0
                            )
                            : 0
                        ).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="font-semibold text-[#333]">
                      <th scope="row" className="px-6 py-1 text-base">
                        {/* Total */}
                      </th>
                      <td className="px-6 py-1"></td>
                      <td className="px-12 py-1  whitespace-nowrap">
                        Savings Amount
                      </td>
                      <td className="px-6 py-1">
                        -$
                        {parseFloat(
                          orderSingleDetails?.orderSummary?.totalSaving || 0
                        ).toFixed(2)}
                      </td>
                    </tr>
                    {orderSingleDetails?.orderSummary?.coupon?.code && (
                      <tr className="font-semibold text-[#333]">
                        <th scope="row" className="px-6 py-1 text-base">
                          {/* Total */}
                        </th>
                        <td className="px-6 py-1"></td>
                        <td className="px-12 py-1   whitespace-nowrap">
                          Coupons Amount (
                          {orderSingleDetails?.orderSummary?.coupon?.code || ""}
                          )
                        </td>
                        <td className="px-6 py-1">
                          -$
                          {parseFloat(
                            orderSingleDetails?.orderSummary?.coupon?.amount ||
                            0
                          ).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr className="font-semibold text-[#333]">
                      <th scope="row" className="px-6 py-1 text-base">
                        {/* Total */}
                      </th>
                      <td className="px-6 py-1"></td>
                      <td className="px-12 py-1   whitespace-nowrap">
                        Total Paid Amount
                      </td>
                      {

                        <td className="px-6 py-1">
                          $
                          {parseFloat(
                            orderSingleDetails?.payment?.paidAmountUSD || 0
                          ).toFixed(2)}
                        </td>}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        );
      case "comments":
        return (
          <div className="md:flex w-full justify-between ">
            <div className="w-full lg:w-[69%] order-2	lg:order-1">
              <div className="w-full my-4 mx-auto">
                <div className="w-full h-[60vh]">
                  <div
                    className="clearfix h-full flex flex-col-reverse overflow-auto"
                    ref={messagesScrollDiv}
                  >
                    <>
                      {isValidArray(orderSingleDetails?.comments) ? (
                        orderSingleDetails?.comments.map((item, i) => (
                          <div
                            key={i}
                            className={` ${item?.createdByCustomer
                              ? " self-start"
                              : "self-end"
                              } w-[49%] mx-2 my-0 p-2 clearfix`}
                          >
                            <div className="">
                              <img
                                className="w-[32px] h-[32px] rounded-[100%] border"
                                src={ProfileAvatarOutput(
                                  item?.createdByAdmin?.avatar ||
                                  item?.createdByCustomer?.avatar
                                )}
                                alt="e"
                              />
                              <div className="w-full max-w-[320px]">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {item?.createdByAdmin ? (
                                      item?.createdByAdmin?._id ==
                                        authData?._id ? (
                                        "You"
                                      ) : (
                                        <>
                                          {item?.createdByAdmin?.firstName ||
                                            ""}{" "}
                                          {item?.createdByAdmin?.lastName || ""}
                                        </>
                                      )
                                    ) : (
                                      <>
                                        {item?.createdByCustomer?.firstName ||
                                          ""}{" "}
                                        {item?.createdByCustomer?.lastName ||
                                          ""}
                                      </>
                                    )}{" "}
                                  </span>

                                  <span
                                    className="text-sm font-normal text-gray-500"
                                    title={moment(item.createdAt).format(
                                      "YYYY-MM-DD"
                                    )}
                                  >
                                    {moment(item.createdAt).fromNow() ==
                                      "a few seconds ago"
                                      ? "just now"
                                      : moment(item.createdAt).fromNow()}
                                  </span>
                                </div>
                                <div
                                  className={`scrollbar-thumb-gray-500 scrollbar-track-gray-200 px-2 overflow-auto ${item?.createdByCustomer?._id
                                    ? "!bg-gray-100 !text-gray-900 !rounded-e-xl !rounded-es-xl"
                                    : "!bg-gray-600 !text-white !rounded-e-xl !rounded-es-xl"
                                    } flex flex-col leading-1.5 p-1 !rounded-e-xl !rounded-es-xl w-full`}
                                  style={{ borderRadius: "0px 7px 7px 7px" }}
                                >
                                  <p className="text-sm font-normal  whitespace-normal break-words">
                                    {item?.message || ""}
                                  </p>
                                  <div ref={messagesEndRef}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="h-[200px] lg-h[400px]  flex items-center justify-center">
                          {" "}
                          No Comment Founds
                        </p>
                      )}
                    </>
                  </div>
                </div>
              </div>

              <div
                className="h-auto relative w-full flex justify-between "
                style={{ bottom: 0 }}
              >
                <textarea
                  className="flex-grow focus:outline-none w-full m-3 py-3 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
                  rows={1}
                  placeholder="Message..."
                  onChange={(e) => onChangeCommentInput(e.target.value)}
                  maxLength={250}
                  value={orderSingleDetails?.commentInput?.message || ""}
                  style={{ outline: "none" }}
                  defaultValue={""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (e.target.value) {
                        handleCommentAdd(e.target.value);
                      }
                    }
                  }}
                />

                <div className="absolute right-[18px] top-[18px] bg-black text-white rounded-full">
                  {/* commentAddRequest */}
                  {isRequest ? (
                    <button
                      type="button"
                      className="flex items-center p-[6px] justify-center"
                    >
                      <Loader
                        bg="transparent"
                        width={"w-5 text-white"}
                        height={"h-5"}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center mt-[-2px] p-[6px] justify-center"
                      onClick={async () => {
                        await handleCommentAdd();
                      }}
                    >
                      <FaArrowRightLong size={28} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[30%] py-5  border-l pl-6 order-1	lg:order-2">
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  className="outline-none focus:outline-none"
                  name=""
                  id=""
                  checked={sendEmailAsWell}
                  onChange={(e) =>
                    onChangeCommentMarkAsEmailSend(e.target.checked)
                  }
                />{" "}
                <span>Send email as well</span>
              </div>

              <div>
                <MdOutlineComment
                  className="mb-2 mt-5 mx-auto text-center block"
                  size={60}
                />
                <p className="px-4">
                  All comments between admins and customer.
                </p>
              </div>
              <div
                className="flex items-center gap-2 mb-2 mt-5 pl-[1px] cursor-pointer"
                onClick={() => {
                  handleOrderCommentRefresh(
                    orderId || orderSingleDetails?.orderId
                  );
                }}
              >
                {isRefreshCommentReq ? (
                  <Loader width={"w-[19px]"} />
                ) : (
                  <FiRefreshCw className="text-center block" size={20} />
                )}
                <p>Refresh</p>
              </div>
            </div>
          </div>
        );

      case "reviews":
        return (
          <div className="max-w-[1390px] w-11/12 mx-auto flex flex-col md:flex-row gap-4">
            <div className="w-full lg:w-[40%]">
              <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center w-[70%]">
                  <StarRatings
                    rating={orderReviews?.data?.avgRatingReviews}
                    starRatedColor="#57e32c"
                    isAggregateRating={false}
                    starDimension="15px"
                    starSpacing="4px"
                    numberOfStars={5}
                    name="rating"
                  />
                  <p className="ms-1 text-sm font-medium text-gray-500">
                    {orderReviews?.data?.avgRatingReviews}
                  </p>
                  <p className="ms-1 text-sm font-medium text-gray-500">
                    out of
                  </p>
                  <p className="ms-1 text-sm font-medium text-gray-500">5</p>
                </div>

                <div className="w-[25%]">
                  {/* handleSortReview */}
                  <div className="max-w-sm mx-auto">
                    <DropdownReview
                      onChanges={handleSortReview}
                      options={["latest", "oldest"]}
                      selectedOption={reviewQuery?.sort || "latest"}
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">
                ({numberWithCommas(orderReviews?.data?.totalReviewsCount)})
                global ratings
              </p>
              {isValidArray(orderReviews?.data?.stars) &&
                orderReviews?.data?.stars.map((rating, index) => (
                  <div key={index} className="flex items-center mt-4 mx-auto">
                    <p className="text-sm font-medium text-blue-600">
                      {rating.star} star
                    </p>
                    <div className="w-[60%] h-5 mx-4 bg-gray-200 rounded">
                      <div
                        className="h-5 bg-[#57e32c] rounded"
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {rating.percentage}%
                    </span>
                  </div>
                ))}
            </div>

            <div className="w-full lg:w-[60%]  p-3 lg:px-6 border rounded-md">
              <div className="w-full  overflow-auto h-full lg:h-[450px]">
                {isOrderReview && (
                  <div className="flex items-center justify-center">
                    <Loader bg="transparent" />{" "}
                  </div>
                )}

                {!isOrderReview && (
                  <>
                    {isValidArray(orderReviews?.data?.reviews) ? (
                      orderReviews.data.reviews.map((review, index) => (
                        <article
                          key={index}
                          className={`h-auto py-3 ${index < orderReviews.data.reviews.length - 1
                            ? "border-b"
                            : ""
                            }`}
                        >
                          <div className="flex items-center my-4">
                            <img
                              className="w-10 h-10 me-4 rounded-full"
                              src={ProfileAvatarOutput(
                                review?.customer?.avatar
                              )}
                              alt=""
                            />
                            <div className="font-medium">
                              <p>
                                {review?.customer?.firstName || "---"}{" "}
                                {review?.customer?.lastName || "---"}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {" "}
                                <time
                                  dateTime={moment(
                                    review?.orderReview?.createdAt,
                                    "MMMM D, YYYY"
                                  ).format("YYYY-MM-DD HH:mm")}
                                >
                                  {moment(
                                    review?.orderReview?.createdAt
                                  ).format("MMMM D, YYYY")}
                                </time>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center mb-1 space-x-1">
                            <StarRatings
                              rating={review?.orderReview?.ratingStar}
                              starRatedColor="#57e32c"
                              isAggregateRating={false}
                              starDimension="15px"
                              starSpacing="4px"
                              numberOfStars={5}
                              name="rating"
                            />
                          </div>

                          <p className="mb-2 text-gray-500">
                            {review?.orderReview?.reviewMessage || ""}
                          </p>
                        </article>
                      ))
                    ) : (
                      <div className="flex items-center justify-center">
                        <p> No Reviews</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 
                      <div className='flex items-center pt-10'>
                          {(orderReviews?.data?.paginate?.totalCount || 0) !== 0 && <Paginate setCurrentPage={setCurrentPage} setInitPaginate={setInitPaginate} totalPages={orderReviews?.data?.paginate?.totalPages || 0} currentPage={currentPage} />}
                      </div> */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const pdfRef = createRef();

  const concatenateSubAddress = (address) => {
    // console.log(address,'formattedAddress');
    if (address && typeof address === "object") {
      const formattedAddress = [
        address?.aptUnit ? `${address.aptUnit}` : "",
        address?.aptUnit && address?.city ? ", " : "",
        address?.city || "",
        address?.city && address?.state ? ", " : "",
        address?.state || "",
        address?.state && address?.zipCode ? " " : "",
        address?.zipCode || "",
      ]
        .filter(Boolean)
        .join("");

      return formattedAddress;
    } else {
      return "";
    }
  };
  const downloadText = () => {
    if (!orderSingleDetails?._id) {
      return;
    }
    if (!orderSingleDetails?._id) {
      Swal.fire?.({
        title: "Please select an order!",
        text: "",
        icon: "error",
      });
      return false;
    }
    let textData = "";
    [orderSingleDetails].forEach((order, i) => {

      const modifyTitle = (p)=> {
        let product = p;
        if(p?.product?._id) {
          product = p.product;
        }
        if(!product?.title) {
          return "";
        }
        console.log("product",product,'type',product.topMenuCategory);
        if(product.title.toUpperCase().includes("HEALING BLEND 20MG")) {
          return "NEOBIO HEALING BLEND 20MG";
        } else if(product.title.toUpperCase().includes("LIPO-C")) {
          return "NEOBIO LIPO-C";
        } else if(product.topMenuCategory == "neobio") {
          console.log("neo product",product,'type',product.topMenuCategory);
          return "NEO "+product.title.toUpperCase();
        } else {
          return product.title.toUpperCase();
        }
      };

      let totalQuantity = 0;
      let products = [];

      [...(order.products || []), ...adminAddedProducts]
        .filter((e) => !isProductRemoved(e.product?._id || e.product))
        ?.forEach((product) => {
          totalQuantity += product?.quantity || 0;
          if(product?.product) {
            products.push(product);
          }
          
        });

      textData += `******************************\n`;
      console.log("products============", products);

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

      // products.forEach((product, i) => {
      //   // console.log("product object", product);
      //   //const productId = p.bundleProducts[0]?._id?.toString() || p._id?.toString();

      //   if (isValidArray(product?.bundleProducts)) {
      //     product?.bundleProducts.forEach((bundleProduct, i) => {
      //       if(alreadyAddedProducts[bundleProduct._id?.toString()]) {
      //         return;
      //       }
      //       alreadyAddedProducts[bundleProduct._id?.toString()] = 1;

      //       console.log("Bundle Product ----- ",bundleProduct, " freebie ==> ",order?.freeBuy?.freeBuyProduct?.product?.toString());
      //       groups[product.product.productType].push(`x${getCombinedQuantity(bundleProduct._id.toString())} ${product.title}\n`.toUpperCase());
      //     });
      //   } else if (product?.product?.cycle?.isCycle) {
      //     // console.log("ProductDetails", product.product?.details);
      //     product.product?.details.includes.forEach((p) => {
      //       console.log('---------------------> p', p);
      //       if(alreadyAddedProducts[p.product._id?.toString()]) {
      //         return;
      //       }
      //       alreadyAddedProducts[p.product._id?.toString()] = 1;

      //       console.log('---------------------> p', p);
      //       if (p.product) {
      //         groups[p.product.productType].push(`x${getCombinedQuantity(p.product._id.toString())} ${p.product.title.toUpperCase()}\n`);
      //       }
      //     });
      //   } else {
      //     if(alreadyAddedProducts[product.product._id?.toString()]) {
      //       return;
      //     }
      //     alreadyAddedProducts[product.product._id?.toString()] = 1;

      //     groups[product.product.productType].push(`x${getCombinedQuantity(product.product._id.toString())} ${product?.title || ""}\n`.toUpperCase());
      //   }
      // });

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

            const productType = product.product?.productType || 'other';
            if (!groups[productType]) {
              groups[productType] = [];
            }
            groups[productType].push(`x${getCombinedQuantity(bundleProduct._id.toString())} ${ modifyTitle(product)}\n`.toUpperCase());
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
              const productType = p.product.productType || 'other';
              if (!groups[productType]) {
                groups[productType] = [];
              }
              groups[productType].push(`x${getCombinedQuantity(p.product._id.toString())} ${modifyTitle(p.product)}\n`);
            }
          });
        } else {
          if (alreadyAddedProducts[product.product._id?.toString()]) {
            return;
          }
          alreadyAddedProducts[product.product._id?.toString()] = 1;

          const productType = product.product?.productType || 'other';
          if (!groups[productType]) {
            groups[productType] = [];
          }
          groups[productType].push(`x${getCombinedQuantity(product.product._id.toString())} ${modifyTitle(product)}\n`.toUpperCase());
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

      textData += "\n";

      textData += `ORDER #${order?.orderId}\n\n`;
      const name = `${order?.shipping?.address?.receiverName?.firstName || ""} ${order?.shipping?.address?.receiverName?.lastName || ""
        }`.toUpperCase();
      if (name.trim()) {
        textData += `${name}\n`.toUpperCase();
      }
      // textData += `${addressConcat(order?.shipping?.address)}\n`;
      textData += `${downloadTxtAddressFormatter(order?.shipping?.address)}`;
      if(order?.shipping?.shippingNote){
        textData+= `NOTE: ${order?.shipping?.shippingNote}\n`
      }
 
      textData += `******************************\n\n`; // Double line space and separator
    });

    const blob = new Blob([textData], { type: "text/plain" });
    saveAs(blob, "Download.txt");
  };

  const downloadPdf = async (orderData) => {
    try {
      const res = await orderInvoiceGen({
        orderId: orderSingleDetails?.orderId,
      });

      const blob = new Blob([res.data], { type: "application/pdf" });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice-generated-${moment(new Date()).format(
        "YYYY-MM-DD"
      )}.pdf`; // Set the desired file name
      document.body.appendChild(link);
      link.click();

      // Clean up resources
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed to download please try again!",
        text: "",
        icon: "error",
      });
    }
  };

  const fetchOrderDetails = async () => {
    try {
      if (orderId) {
        setOrderReq(true);
        const res = await getOrderDetails(orderId);
        setOrderReq(false);
        if (res?.data?.success) {
          setOrderSingleDetails(res.data.data);
        }
      }
    } catch (error) {
      setOrderReq(false);
      console.log(error);
    }
  };
  const handleOrderCommentRefresh = async (val) => {
    try {
      if (val || orderId) {
        setIsRefreshCommentReq(true);
        const res = await getOrderDetails(val || orderId);
        setIsRefreshCommentReq(false);
        if (res?.data?.success) {
          setOrderSingleDetails(res.data.data);
          setIsOpen(true);
        }
      }
    } catch (error) {
      setIsRefreshCommentReq(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, activeTab]);

  const handleRemoveTestOrder = async () => {

    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete test order`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await RemoveTestOrderOrder(orderId);
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
            setIsOpen(false);
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
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => { setIsOpen(true); }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto " ref={pdfRef}>
            <div className="flex flex-wrap min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full lg:w-[80%] h-[90vh] transform overflow-auto rounded-2xl bg-white  p-3  lg:p-8 text-left align-middle shadow-xl transition-all rounded-md px-[20px] lg:px-[40px]">
                  <div className="flex flex-wrap item-center justify-end">
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>
                  <div className="order-details">
                    <div className="order-details__header flex flex-wrap justify-between items-center mb-4 border-b">
                      <ul className="flex flex-wrap gap-2 gap-x-4 md:gap-x-8">
                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md  border-transparent ${activeTab === "orderDetails"
                            ? "!border-b-2 !border-blue-600 !text-blue-600"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                          onClick={() => handleTabClick("orderDetails")}
                        >
                          ORDER DETAILS
                        </li>
                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md border-transparent ${activeTab === "orderContents"
                            ? "!border-b-2 !border-blue-600 !text-blue-600"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                          onClick={() => handleTabClick("orderContents")}
                        >
                          ORDER CONTENTS
                        </li>
                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md border-transparent ${activeTab === "comments"
                            ? "!border-b-2 !border-blue-600 !text-blue-600"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                          onClick={() => handleTabClick("comments")}
                        >
                          COMMENTS
                        </li>
                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md border-transparent ${activeTab === "reviews"
                            ? "!border-b-2 !border-blue-600 !text-blue-600"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                          onClick={() => handleTabClick("reviews")}
                        >
                          REVIEWS
                        </li>
                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md border-transparent ${activeTab === "EDIT_ORDER"
                            ? "!border-b-2 !border-blue-600 !text-blue-600"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                          onClick={() => {
                            handleTabClick("EDIT_ORDER");
                            setEditData(orderSingleDetails);
                            setEditModalCount((e) => e + 1);
                            setOrderEditModalOpen(true);
                          }}
                        >
                          EDIT ORDER
                        </li>
                      </ul>
                    </div>
                    <div className="mt-3   lg:mt-20">
                      {orderReq && <Loader bg="transparent" />}
                    </div>
                    {!orderReq && renderContent()}
                    <CustomerDetailsModal
                      isOpen={customerDetailsModalOpen}
                      setIsOpen={setCustomerDetailsModalOpen}
                      setActiveTab={setCustomerActiveTab}
                      activeTab={customerActiveTab}
                    />
                    <ProductDetails
                      isOpen={productDetailsModalOpen}
                      setIsOpen={setProductDetailsModalOpen}
                      setActiveTab={setProductDetailsActiveTab}
                      activeTab={productDetailsActiveTab}
                    />
                    <OrderEditModal
                      isOpen={orderEditModalOpen}
                      setIsOpen={setOrderEditModalOpen}
                      data={editData}
                      key={editModalCount}
                      setData={setEditData}
                      fetchOrders={() => {
                        if (fetchOrders) {
                          fetchOrders();
                        }
                        closeModal();
                      }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
