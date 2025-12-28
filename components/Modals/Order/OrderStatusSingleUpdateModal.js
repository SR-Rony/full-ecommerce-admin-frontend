import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { orderStatusSingleUpdate } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { MdDoneOutline, MdOutlineDonutLarge } from "react-icons/md";

export default function OrderStatusSingleUpdateModal({ isOpen, setIsOpen }) {
  const { Order } = useFullStage();
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const [orderPage, setOrderPage, orderLimit, setOrderLimit] = Order.OrderPaginate;
  const [orders, setOrders] = Order.Orders;
  const [isRequestOrderStatus, setIsRequestOrderStatus] = useState(false);
  const [loaderType, setLoaderType] = useState('');
  const orderStatuses = [ "NEW", "PACKED", "SHIPPED"];
  
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleStatusUpdate = async (checkStatus) => {
    setIsRequestOrderStatus(true);
    setLoaderType(checkStatus);
    await orderStatusSingleUpdate({ orderId: orderSingleDetails?.orderId, status: checkStatus,mailSend:orderSingleDetails?.mailSend||"no" }).then(async(res) => {
       setIsRequestOrderStatus(false);
      setLoaderType('');
      if (res?.data?.success) {
        ToastEmitter('success',res?.data?.message);
        setOrderSingleDetails({...orderSingleDetails,...res?.data?.data});
      } else{
        ToastEmitter('error',res?.data?.message);
      }

    }).catch(err => {
      setIsRequestOrderStatus(false);
      setLoaderType('');
      ToastEmitter('error',err?.response?.data?.message);
    });
  };
  //console.log(orderSingleDetails);
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
                <Dialog.Panel className="w-full max-w-[33rem] transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-[320px]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Order Status Update
                    </Dialog.Title>
                    <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                  </div>
                  <div className="mt-2 pl-4">
                  <input type="checkbox" className="" checked={(orderSingleDetails.mailSend||"no")=="no" ? false:true} onChange={(e) =>{
                    
                    setOrderSingleDetails((prev) =>{
                      return {
                        ...prev,
                        mailSend:e.target.checked?"yes":"no"
                      };
                    });
                  }}/><span className="pl-2">On update tracking status send mail to customer?</span>

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
                        isRequestOrderStatus && loaderType =="NEW"?<button>  <Loader bg="transparent"></Loader></button>:
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
                        isRequestOrderStatus&& loaderType =="PACKED"?<button>  <Loader bg="transparent"></Loader></button>:
                        <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10 cursor-pointer' onClick={async() => {
                          await handleStatusUpdate("PACKED");
                          closeModal();
                        }} />
                      )}

                      {orderSingleDetails?.payment?.isPaymentCompleted === true &&
                        orderSingleDetails?.status === 'SHIPPED' ? (
                        <MdDoneOutline className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                      ) : (
                        isRequestOrderStatus&&loaderType =="PACKED"?<button>  <Loader bg="transparent"></Loader></button>:
                        <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10 cursor-pointer'onClick={async() => {
                          await handleStatusUpdate("SHIPPED");
                          closeModal();
                        }} />
                      )}
                    </div>
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
