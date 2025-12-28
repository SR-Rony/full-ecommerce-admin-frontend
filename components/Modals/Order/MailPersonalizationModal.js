/* eslint-disable vars-on-top */
import { MailPersonalize } from "@/classes/order.class";
import { useFullStage } from "@/hooks/useFullStage";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function MailPersonalizationModal({ isOpen, setIsOpen, setOrderMailSendOpen }) {
    const { Order } = useFullStage();
    const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
    const [orderPage, setOrderPage, orderLimit, setOrderLimit] = Order.OrderPaginate;
    const [orders, setOrders] = Order.Orders;
    const [isRequestOrder, setIsRequestOrder] = useState(false);
    const [loaderType, setLoaderType] = useState('');
    const closeModal = () => {
        setOrderMailSendOpen(true);
        setIsOpen(false);
    };

    const handleMailPersonalization = async (dynamicName) => {
        setOrderSingleDetails((prev) => {
            const customMailData = prev?.customMailData || {};
            var prevMessage = orderSingleDetails?.customMailData?.message || "";
            return {
                ...prev,
                customMailData: {
                    ...customMailData,
                    message: prevMessage + " " + dynamicName
                }
            };
        });
        setIsOpen(false);
    };

    const mailPersonalizeData = new MailPersonalize().getData();

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
                                            Mail Personalization
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>

                                    <div className="mt-2 flex gap-3 flex-wrap">
                                        {mailPersonalizeData &&
                                            Object.keys(mailPersonalizeData).map((personalizeKey) =>
                                                mailPersonalizeData[personalizeKey] &&
                                                Object.keys(mailPersonalizeData[personalizeKey]).map((varKey, i) => (
                                                    mailPersonalizeData[personalizeKey][varKey]?.varName&& <button
                                                        key={`${personalizeKey}-${varKey}-${i}`}
                                                        className="px-2 py-1 bg-gray-400 text-white rounded-md"
                                                        onClick={() => handleMailPersonalization(mailPersonalizeData[personalizeKey][varKey].varName)}
                                                    >
                                                        {console.log(mailPersonalizeData[personalizeKey][varKey].varName)}
                                                        {mailPersonalizeData[personalizeKey][varKey].varName}
                                                    </button>
                                                ))
                                            )}
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
