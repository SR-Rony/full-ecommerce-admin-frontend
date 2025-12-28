import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitterHTML } from "@/utils/Toast";
import { isValidArray } from "@/utils/func";
import { orderStatusUpdate } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { MdDoneOutline, MdOutlineDonutLarge } from "react-icons/md";

export default function OrderBulkStatusUpdateModal({ isOpen,setSelectAllChecked, setSelectedItems, fetchOrders, setIsOpen }) {
  const { Order } = useFullStage();
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const [orderPage, setOrderPage, orderLimit, setOrderLimit] = Order.OrderPaginate;
  const [orders, setOrders] = Order.Orders;
  const [isRequestOrder, setIsRequestOrder] = useState(false);
  const [loaderType, setLoaderType] = useState('');
  const orderStatuses = ["NEW", "PACKED", "SHIPPED"];
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleStatusUpdate = async (checkStatus) => {
    setIsRequestOrder(true);
    setLoaderType(checkStatus);
    await orderStatusUpdate({ orderIds: orderSingleDetails?.orderIds, status: checkStatus }).then(async (res) => {
      ToastEmitterHTML('success-html', <div>
        <p>Bulk update operation success  ({res?.data?.data?.updateOrders?.length}) </p>
        <p>Bulk update operation failed  ({res?.data?.data?.failedUpdateOrders?.length}) </p>
      </div>);
      if (res?.data?.success) {
        setLoaderType('');
        setIsRequestOrder(false);
        const updateOrder = isValidArray(orders?.data) ? orders?.data.map(item => {
          if (isValidArray(res?.data?.data?.updateOrders) && res?.data?.data?.updateOrders.some(itm => itm == item?.orderId)) {
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
        setOrderSingleDetails((prev) => {
          return {
            ...prev,
            status: checkStatus
          };
        });
        await fetchOrders();

      }
      setIsRequestOrder(false);
    }).catch(err => {
      setSelectAllChecked(false);
      setSelectedItems([]);
      setIsRequestOrder(false);
      setLoaderType('');
      ToastEmitterHTML('error', <div>
        <p>Bulk update operation success ({err?.response?.data?.data?.updateOrders?.length}) </p>
        <p>Bulk update operation failed  ({err?.response?.data?.data?.failedUpdateOrders?.length}) </p>
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
                <Dialog.Panel className="w-full max-w-[33rem] transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-[220px]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Order Status Update
                    </Dialog.Title>
                    <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                  </div>
                  <div className='bg-white p-5 mt-4 rounded-md'>
                    <div className='flex justify-between text-lime-500 font-bold  mt-2  md:mt-2 text-xs md:text-xl capitalize'>
                      <p className="pl-4">New </p>
                      <p className="pl-4">Packed</p>
                      <p>Shipped</p>
                    </div>
                    <div className='relative  flex justify-between   mx-5 my-2   rounded-lg '>
                      <div className='absolute top-3 left-0 w-full h-2 bg-lime-400 z-0'></div>
                      {orderSingleDetails?.payment?.isPaymentCompleted === true ? (
                        <MdDoneOutline className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10 '/>
                      ) : (
                        isRequestOrder && loaderType =="NEW"?<button>  <Loader bg="transparent"></Loader></button>:
                        <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10 cursor-pointer' onClick={async() => {
                          await handleStatusUpdate("NEW");
                          closeModal();
                        }} />
                      )}

                      {(orderSingleDetails?.payment?.isPaymentCompleted === true &&
                        orderSingleDetails?.status == 'PACKED') ||
                        (orderSingleDetails?.payment?.isPaymentCompleted === true &&
                          orderSingleDetails?.status == 'SHIPPED') ? (
                        <MdDoneOutline className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10 ' />
                      ) : (
                        isRequestOrder&& loaderType =="PACKED"?<button>  <Loader bg="transparent"></Loader></button>:
                        <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10 cursor-pointer' onClick={async() => {
                          await handleStatusUpdate("PACKED");
                          closeModal();
                        }} />
                      )}

                      {orderSingleDetails?.payment?.isPaymentCompleted === true &&
                        orderSingleDetails?.status === 'SHIPPED' ? (
                        <MdDoneOutline className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                      ) : (
                        isRequestOrder&&loaderType =="PACKED"?<button>  <Loader bg="transparent"></Loader></button>:
                        <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10 cursor-pointer'onClick={async() => {
                          await handleStatusUpdate("SHIPPED");
                          closeModal();
                        }} />
                      )}
                    </div>
                  </div>
                  {/* <div className="mt-4 flex gap-4">
                    {

                      orderStatuses.map((status, i) => (
                        <div key={i}>
                          {
                            <button
                              type="button"
                              className={`flex justify-center gap-2 text-xs rounded-md border border-transparent  px-4 py-2  font-medium focus:outline-none capitalize ${status =='PACKED' &&"bg-[#ff8a00] hover:bg-[#ffa200] text-white" } ${status =='SHIPPED' &&"bg-[#52ff00] hover:bg-[#52ff00] text-black" }  ${status =='Paid' &&"bg-[red] hover:bg-[#ff0000f8] text-white" }`}
                              onClick={async () => {
                                await handleStatusUpdate(status);
                                closeModal();
                              }}
                            >
                             <input type="checkbox" name="" checked={orderSingleDetails?.status == "SHIPPED"}id="" /> {status}  {loaderType == status && isRequestOrder && <Loader bg="transparent" width={'w-4'} height={'h-4'} />}
                            </button>}
                        </div>
                      ))
                    }
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
