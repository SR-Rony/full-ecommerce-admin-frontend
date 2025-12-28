/* eslint-disable vars-on-top */
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { orderCustomMailSend } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function OrderMailSendModal({ isOpen, mailPersonalizationModalOpen, setMailPersonalizationModalOpen, setIsOpen, refHtml }) {
  const { Order } = useFullStage();
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const [orderPage, setOrderPage, orderLimit, setOrderLimit] = Order.OrderPaginate;
  const [orders, setOrders] = Order.Orders;
  const [isRequestOrder, setIsRequestOrder] = useState(false);

  const [loaderType, setLoaderType] = useState('');
  const closeModal = () => {
    setIsOpen(false);

  };
  
  const HandlerOrderCustomMailSend = async () => {
    if (!orderSingleDetails?.customMailData?.subject) {
      ToastEmitter('error', 'Subject is required field!');
      return 0;
    }
    if (!orderSingleDetails?.customMailData?.message) {
      ToastEmitter('error', 'Message is required field!');
      return 0;
    }
    try {
      setIsRequestOrder(true);

      const res = await orderCustomMailSend({ ...orderSingleDetails?.customMailData,  orderId: orderSingleDetails?.orderId, email: orderSingleDetails?.shipping?.email });
      ToastEmitter('success', res?.data?.message);
      setIsRequestOrder(false);
    } catch (error) {

      //console.log(error);
      setOrderSingleDetails((prev) => {
        return {
          ...prev,
          customMailData: {}
        };
      });
      setIsRequestOrder(false);
      ToastEmitter('error', error?.response?.data?.message);
    }
  };

  const onChange = (keys, value) => {

    setOrderSingleDetails((prev) => {
      const customMailData = prev?.customMailData || {};

      return {
        ...prev,
        customMailData: {
          ...customMailData,
          [keys]: value
        }
      };
    });
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => { }}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-auto rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-[500px]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Order  Mail Send
                    </Dialog.Title>
                    <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                  </div>

                  <div className="mt-2">
                    <input type="checkbox" name="" id="" checked={orderSingleDetails?.customMailData?.appendMailAdded == 'yes' ? true : false} onChange={(e) => {
                      if (e.target.checked) {
                        onChange('appendMailAdded', "yes");
                      } else {
                        onChange('appendMailAdded', "no");
                      }
                    }} /><span className="pl-1">Mail send attached invoice  </span>
                  </div>
                  <div className="mt-2">
                    <p className="py-2">Email</p>
                    <input type="email" disabled={true} value={orderSingleDetails?.shipping?.email || ""} className="w-full" name="" id="" />
                  </div>
                  <div className="mt-2">
                    <p className="py-2">Subject</p>
                    <input type="text" onChange={(e) => onChange('subject', e.target.value)} value={orderSingleDetails?.customMailData?.subject || ""} className="w-full" name="" id="" />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between py-2">
                      <p className="py-2  ">MESSAGE</p> <p className="cursor-pointer bg-blue-400 text-white px-4 py-2 rounded-md" onClick={() => setMailPersonalizationModalOpen(true)}>Mail Personalization</p>
                    </div>
                    <textarea name="" onChange={(e) => onChange('message', e.target.value)} value={orderSingleDetails?.customMailData?.message || ""} id="" className="w-full" cols="30" rows="3"></textarea>
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
                        await HandlerOrderCustomMailSend();
                        closeModal();
                      }}
                    >
                      Send
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
