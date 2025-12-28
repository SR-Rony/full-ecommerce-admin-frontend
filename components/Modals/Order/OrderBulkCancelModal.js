import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitterHTML } from "@/utils/Toast";
import { isValidArray } from "@/utils/func";
import { orderStatusUpdate } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function OrderBulkCancelModal({ isOpen, setSelectAllChecked, setSelectedItems,fetchOrders, setIsOpen, type }) {
  const { Order } = useFullStage();
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const [orderPage, setOrderPage, orderLimit, setOrderLimit] = Order.OrderPaginate;
  const [orders, setOrders] = Order.Orders;
  const [isRequestOrder, setIsRequestOrder] = useState(false);
  const [loaderType, setLoaderType] = useState('');
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleCancelledOrder = async (checkStatus = "CANCELED") => {
    setIsRequestOrder(true);
    setLoaderType(checkStatus);
    await orderStatusUpdate({ orderIds: orderSingleDetails?.orderIds, status: checkStatus }).then(async(res) => {
      ToastEmitterHTML('success-html', <div>
      <p>Bulk update operation success ({res?.data?.data?.updateOrders?.length} ) </p>
      <p>Bulk update operation failed  ({res?.data?.data?.failedUpdateOrders?.length} ) </p>
    </div>);
      if (res?.data?.success) {
        setLoaderType('');
        setIsRequestOrder(false);
        
        const updateOrder = isValidArray(orders?.data) ? orders?.data.map(item => {
          if (isValidArray(res?.data?.data?.updateOrders) && res?.data?.data?.updateOrders.find(itm => itm == item?.orderId)) {
            return {
              ...item,
              status: checkStatus
            };
          } else {
            return item;
          }
        }) : orders?.data;
        setSelectAllChecked(false);
        setSelectedItems([]);
        setOrderSingleDetails((prev) =>{
          return {
            ...prev,
            status:checkStatus
          };
        });
      await  fetchOrders();

      }
      setIsRequestOrder(false);
    }).catch(err => {
      setSelectAllChecked(false);
      setSelectedItems([]);
      setIsRequestOrder(false);
      setLoaderType('');
      ToastEmitterHTML('error', <div>
        <p>Bulk update operation success ({err?.response?.data?.data?.updateOrders?.length} ) </p>
        <p>Bulk update operation failed ({err?.response?.data?.data?.failedUpdateOrders?.length} ) </p>
      </div>);

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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-[200px]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Orders Cancelled
                    </Dialog.Title>
                    <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                  </div>
                  <div className="mt-2">
                    <h2>Are you sure you want to Cancelled Orders?</h2>
                  </div>
                  <div className="mt-2">
                    {isValidArray(orderSingleDetails?.orderIds) && orderSingleDetails.orderIds.map((item, i) => {
                      <span key={i}>
                        {item}{i < orderSingleDetails?.orderIds?.length - 1 ? ", " : ""}
                      </span>;
                    })}
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 w-[80px focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    {isRequestOrder ? <button
                      type="button"
                       className="inline-flex gap-1 justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                    >
                      <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                    </button> : <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                      onClick={async () => {
                        await handleCancelledOrder('CANCELLED');
                        closeModal();
                      }}
                    >
                      Cancelled
                    </button>}
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
