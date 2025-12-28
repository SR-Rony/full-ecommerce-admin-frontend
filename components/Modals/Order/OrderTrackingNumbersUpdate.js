
"use client";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { orderStatusSingleUpdate, orderTrackNumberRemove, orderTrackNumberUpdate } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";
// const TrackingNumbersUpdateComponent = dynamic(() => import("@/components/Orders/TrackingNumbersUpdateComponent"), { ssr: false });
export default function OrderTrackingNumbersUpdate({ isOpen, setIsOpen, setSelectAllChecked, setSelectedItems, fetchPaginateOrders, fetchOrderStats }) {
  const { Order } = useFullStage();
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const [orderPage, setOrderPage, orderLimit, setOrderLimit] = Order.OrderPaginate;
  const [orders, setOrders] = Order.Orders;
  const [trackNumRequest, setTrackNumRequest] = useState(false);
  const [loaderType, setLoaderType] = useState('');
  const [isReqStatus, setIsReqStatus] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleInputChange = (event) => {

    setOrderSingleDetails((prev) => {
      const tracking = prev?.tracking || {};
      return {
        ...prev,
        tracking: {
          ...tracking,
          number: event.target.value
        }
      };
    });
  };

  const handleUpdateTrackingNumber = async (number) => {

    if (!orderSingleDetails?.tracking?.number) {
      Swal.fire({
        title: "Error!",
        text: "Tracking number is required!",
        icon: "error"
      });
      return;

    }

    if (!isValidArray(orderSingleDetails?.orderIds)) {
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
          const res = await orderTrackNumberUpdate({ orderId: orderSingleDetails?.orderIds[0], number: orderSingleDetails?.tracking?.number });
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
            const tracking = orderSingleDetails?.tracking || {};
            setOrderSingleDetails({
              ...orderSingleDetails, tracking: {
                ...tracking,
                number: "",
                numbers: res?.data?.data?.tracking?.numbers
              }
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

  const handleRemoveTrackingNumber = async (number) => {
    if (!isValidArray(orderSingleDetails?.orderIds)) {
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
          const res = await orderTrackNumberRemove({ orderId: orderSingleDetails?.orderIds[0], number: number });
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
            const tracking = res?.data?.data?.tracking || {};
            setOrderSingleDetails({
              ...orderSingleDetails, tracking: {
                ...tracking,
                number: "",
                numbers: res?.data?.data?.tracking?.numbers
              }
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
  const handleUpdateStatus = async () => {
    if (!isValidArray(orderSingleDetails?.orderIds)) {
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
          const res = await orderStatusSingleUpdate({ orderId: orderSingleDetails?.orderIds[0], mailSend: mailSend, status: (orderSingleDetails?.updateStatus?.value) });
          setIsReqStatus(false);
          if (res.data.success) {
            setOrderSingleDetails(prev => ({
              ...prev,
              status: res?.data?.data?.status,
              orderIds: []
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
            setIsOpen(false);
          }
        } catch (error) {
          setIsReqStatus(false);
          Swal.fire({
            title: "Error!",
            text: error?.response?.data?.message,
            icon: "error"
          });
          console.log(error);
        }
      }
    });

  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-full overflow-auto">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Tracking Details:
                    </Dialog.Title>

                    <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                  </div>
                  <div className="my-4">
                    <div className="box-body p-0 space-y-2">
                      {/* <h5 className="text-base font-semibold text-gray-800 dark:text-white">Tracking Details:</h5> */}
                      <div className="flex gap-4">
                        <input className="w-[60%] text-gray-500 dark:text-white/70 text-sm rounded-md" defaultValue={orderSingleDetails?.tracking?.number} onChange={handleInputChange} value={orderSingleDetails?.tracking?.number} placeholder="Type to add tracking">
                        </input>
                        {trackNumRequest ? <button className="w-[90px]  text-center bg-blue-500 text-white px-4 rounded-sm cursor-not-allowed"><Loader bg="transparent" width={"w-4"} height={'h-4'} /></button> :
                          <button className="w-[90px] text-center bg-blue-500 text-white px-4 rounded-sm" onClick={() => {
                            handleUpdateTrackingNumber(orderSingleDetails?.tracking?.number);
                          }}>Submit</button>}
                      </div>
                    </div>
                    <div>
                      <p className="pt-2 text-[12px]">This order doesn't have tracking number, please add tracking number to update status.</p>
                    </div>
                    <div className="my-4 w-full text-center">
                      {
                        isValidArray(orderSingleDetails?.tracking?.numbers) && orderSingleDetails?.tracking?.numbers.map((item, i) => (<div key={i} className="flex items-center gap-2 my-3">
                          <p><span className="font-bold text-[#3f434b]">Tracking #{i + 1}:</span> <span className="text-[#8fb4d6]">{item}</span></p>
                          <p className="bg-white border px-2  text-[14px] cursor-pointer" onClick={() => {

                            handleRemoveTrackingNumber(item);
                          }}>x</p>
                        </div>

                        ))
                      }
                    </div>

                    {
                      isValidArray(orderSingleDetails?.tracking?.numbers) && <div className="flex justify-center w-full mt-[60px]">
                        {isReqStatus ? <button className="w-full  bg-blue-500 text-white rounded-md px-4 py-2 cursor-not-allowed"> Update Order Status  ({orderSingleDetails?.updateStatus?.label || ""}) <Loader bg="transparent" /></button> : <button className="w-full  bg-blue-500 text-white rounded-md px-4 py-2" onClick={() => handleUpdateStatus()}> Update Order Status  ({orderSingleDetails?.updateStatus?.label || ""})</button>}

                      </div>
                    }
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
