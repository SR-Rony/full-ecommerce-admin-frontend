
"use client";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { orderStatusSingleUpdate, orderTrackNumberRemove, orderTrackNumberUpdate } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";
// const TrackingNumbersUpdateComponent = dynamic(() => import("@/components/Orders/TrackingNumbersUpdateComponent"), { ssr: false });
export default function BulkTrackingNumberUpdate({ isOpen, setIsOpen, setSelectAllChecked, setSelectedItems, fetchPaginateOrders, fetchOrderStats }) {
    const { Order } = useFullStage();
    const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
    const [orderPage, setOrderPage, orderLimit, setOrderLimit] = Order.OrderPaginate;
    const [orders, setOrders] = Order.Orders;
    const [trackNumRequest, setTrackNumRequest] = useState(false);
    const [loaderType, setLoaderType] = useState('');
    const [isReqStatus, setIsReqStatus] = useState(false);

    const [activeTab, setActiveTab] = useState({});
    const closeModal = () => {
        setIsOpen(false);
    };
    const handleInputChange = (index, event) => {

        setActiveTab((prev) => {
            return {
                ...prev,
                index: index,
                number: event.target.value
            };
        });
    };

    const handleUpdateTrackingNumber = async (index, orderId) => {

        if (!(activeTab?.index == index && activeTab?.number)) {
            Swal.fire({
                title: "Error!",
                text: "Please enter a tracking number!",
                icon: "error"
            });
            return;

        }

        if (!orderId) {
            Swal.fire({
                title: "Error!",
                text: "Please select a order",
                icon: "error"
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
                    const res = await orderTrackNumberUpdate({ orderId: orderId, number: activeTab?.number });
                    setTrackNumRequest(false);
                    if (res?.data?.success) {

                        setOrders((prev) => {
                            const data = isValidArray(prev?.data) ? prev?.data.map(item => {
                                if (item.orderId == res?.data?.data?.orderId) {
                                    const tracking = res?.data?.data?.tracking || {};
                                    return {
                                        ...item,
                                        tracking: {
                                            ...tracking,
                                            numbers: tracking?.numbers || []
                                        }
                                    };
                                } else {
                                    return item;
                                }
                            }) : [];
                            return {
                                ...prev,
                                data: data
                            };
                        });

                        setActiveTab((prev) => {
                            return {
                                ...prev,
                                number: "",
                                [orderId]: res?.data?.data?.tracking?.numbers || []
                            };
                        });

                        Swal.fire({
                            title: "Success",
                            text: res?.data?.message,
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: res?.data?.message,
                            icon: "error"
                        });

                    }
                } catch (error) {
                    console.log(error, 'error');
                    setTrackNumRequest(false);
                    Swal.fire({
                        title: "Error!",
                        text: error?.response?.data?.message,
                        icon: "error"
                    });

                }
            }
        });

    };

    const handleRemoveTrackingNumber = async (orderId, number) => {
        if (!orderId) {
            Swal.fire({
                title: "Error!",
                text: "Please select a order",
                icon: "error"
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
                    const res = await orderTrackNumberRemove({ orderId: orderId, number: number });
                    setTrackNumRequest(false);
                    if (res?.data?.success) {

                        setOrders((prev) => {
                            const data = isValidArray(prev?.data) ? prev?.data.map(item => {
                                if (item.orderId == res?.data?.data?.orderId) {
                                    const tracking = res?.data?.data?.tracking || {};
                                    return {
                                        ...item,
                                        tracking: {
                                            ...tracking,
                                            numbers: tracking?.numbers || []
                                        }
                                    };
                                } else {
                                    return item;
                                }
                            }) : [];
                            return {
                                ...prev,
                                data: data
                            };
                        });
                        setActiveTab((prev) => {
                            return {
                                ...prev,
                                number: "",
                                [orderId]: res?.data?.data?.tracking?.numbers || []
                            };
                        });

                        Swal.fire({
                            title: "Success",
                            text: res?.data?.message,
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "error",
                            text: res?.data?.message,
                            icon: "error"
                        });

                    }
                } catch (error) {
                    setActiveTab((prev) => {
                        return {
                            ...prev,
                            number: "",
                            [orderId]: []
                        };
                    });
                    console.log(error, 'error');
                    setTrackNumRequest(false);
                    Swal.fire({
                        title: "Error!",
                        text: error?.response?.data?.message,
                        icon: "error"
                    });

                }
            }
        });

    };
    const handleUpdateStatus = async (orderId) => {
        if (!orderId) {
            Swal.fire({
                title: "Error!",
                text: "Please select a order!",
                icon: "error"
            });
            return;
        }

        if (!(orderSingleDetails?.updateStatus?.value)) {
            Swal.fire({
                title: "Error!",
                text: "Please select a order status!",
                icon: "error"
            });

            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: ``,
            html: `
      <div><p class="text-center pb-4 text-[14px]">Do you want to mark as <b>"${orderSingleDetails?.updateStatus?.value || orderSingleDetails?.status}</b>"?</p></div>
        <div class="flex items-center justify-center pl-2">
          <input type="checkbox"checked class="focus:ring-0 border" name="mailSendCheckbox" id="mailSendCheckbox" />
          <span class="pl-2 text-[12px]">On update tracking status send mail to customer?</span>
        </div>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            preConfirm: () => {
                const mailSendCheckbox = document.getElementById('mailSendCheckbox');
                const mailSend = mailSendCheckbox.checked ? "yes" : "no";
                return mailSend;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const mailSend = result.value;
                try {
                    setIsReqStatus(true);
                    const res = await orderStatusSingleUpdate({ orderId: orderId, mailSend: mailSend, status: (orderSingleDetails?.updateStatus?.value) });
                    setIsReqStatus(false);
                    if (res.data.success) {

                        const failedOrders = isValidArray(orderSingleDetails?.failedOrders) ? orderSingleDetails?.failedOrders.filter(item => item !== orderId) : [];
                        if (failedOrders?.length === 0) {
                            setIsOpen(false);
                        }
                        setOrderSingleDetails(prev => ({
                            ...prev,
                            status: res?.data?.data?.status,
                            orderIds: [],
                            failedOrders: failedOrders
                        }));
                        setOrderPage(1);
                        setSelectAllChecked(false);
                        setSelectedItems([]);
                        fetchOrderStats();
                        fetchPaginateOrders();

                        Swal.fire({
                            title: "Success",
                            text: res?.data?.message,
                            icon: "success"
                        });

                    }
                } catch (error) {

                    // The order status is already "PARTIALLY_SHIPPED"
                    setIsReqStatus(false);
                    Swal.fire({
                        title: "Error!",
                        text: error?.response?.data?.message,
                        icon: "error"
                    });
                    if (error?.response?.data?.message == `The order status is already "PARTIALLY_SHIPPED"`) {
                        const failedOrders = isValidArray(orderSingleDetails?.failedOrders) ? orderSingleDetails?.failedOrders.filter(item => item !== orderId) : [];
                        if (failedOrders?.length === 0) {
                            setIsOpen(false);
                        }
                        setOrderSingleDetails(prev => ({
                            ...prev,
                            orderIds: [],
                            failedOrders: failedOrders
                        }));
                    }
                    console.log(error);
                }
            }
        });

    };

    useEffect(() => {
        setActiveTab({});
    }, []);
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
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

                    <div className="fixed inset-0 overflow-y-auto ">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-[600px] overflow-auto">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 capitalize"
                                        >
                                            Tracking Number bulk update ({orderSingleDetails?.failedOrders?.length || 0})
                                        </Dialog.Title>

                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>
                                    {
                                        isValidArray(orderSingleDetails?.failedOrders) && orderSingleDetails.failedOrders.map((orderId, i) => (
                                            <div key={i} >
                                                <div className="my-4">
                                                    <div className="box-body p-0 space-y-2">
                                                        <h5 className="text-base font-semibold text-gray-800 dark:text-white">OrderId: #{orderId}, Tracking Added ({activeTab[orderId] ? activeTab[orderId]?.length : 0})</h5>
                                                        <div className="flex gap-4">
                                                            {activeTab?.index === i ? <input className="w-[80%] text-gray-500 dark:text-white/70 text-sm rounded-md" defaultValue={activeTab?.number} onChange={(e) => handleInputChange(i, e)} value={activeTab?.number} placeholder="Type to add tracking">
                                                            </input> : <input className="w-[80%] text-gray-500 dark:text-white/70 text-sm rounded-md" value={""} placeholder="Type to add tracking" onClick={() => {
                                                                setActiveTab((prev) => {
                                                                    return {
                                                                        ...prev,
                                                                        index: i,
                                                                        number:'',
                                                                        orderId: orderId
                                                                    };
                                                                });
                                                            }}>
                                                            </input>}
                                                            {trackNumRequest && activeTab?.index === i ? <button className="w-[90px]  text-center bg-blue-500 text-white px-4 rounded-sm cursor-not-allowed"><Loader bg="transparent" width={"w-4"} height={'h-4'} /></button> :
                                                                <button className="w-[90px] text-center bg-blue-500 text-white px-4 rounded-sm" onClick={() => {

                                                                    handleUpdateTrackingNumber(i, orderId);
                                                                }}>Submit</button>}
                                                        </div>
                                                    </div>

                                                    {!(isValidArray(activeTab[orderId]) && activeTab[orderId]?.length) && <div>
                                                        <p className="pt-2 text-[12px]"> This order doesn't have tracking number, please add tracking number to update status.</p>
                                                    </div>}
                                                    {activeTab?.index === i && <>

                                                        <div className="my-4 w-full text-center">
                                                            {
                                                                isValidArray(activeTab[orderId]) && activeTab[orderId].map((item, i) => (<div key={i} className="flex items-center gap-2 my-3">
                                                                    <p><span className="font-bold text-[#3f434b]">Tracking #{i + 1}:</span> <span className="text-[#8fb4d6]">{item}</span></p>
                                                                    <p className="bg-white border px-2  text-[14px] cursor-pointer" onClick={() => {

                                                                        handleRemoveTrackingNumber(orderId, item);
                                                                    }}>x</p>
                                                                </div>

                                                                ))
                                                            }
                                                        </div>

                                                        {
                                                            isValidArray(activeTab[orderId]) && orderSingleDetails?.updateStatus?.label && <div className="flex justify-center w-full mt-[3px] mb-4">
                                                                {isReqStatus && activeTab?.index == i ? <button className="w-full  bg-blue-500 text-white rounded-md px-4 py-2 cursor-not-allowed"> Update Order Status  ({orderSingleDetails?.updateStatus?.label || ""}) <Loader bg="transparent" /></button> : <button className="w-full  bg-blue-500 text-white rounded-md px-4 py-2" onClick={() => handleUpdateStatus(orderId)}> Update Order Status  ({orderSingleDetails?.updateStatus?.label || ""})</button>}

                                                            </div>
                                                        }

                                                    </>}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
