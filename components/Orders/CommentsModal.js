import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { ProfileAvatarOutput, isValidArray } from "@/utils/func";
import { orderCommentCreate } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function CommentsModal({ isOpen, setIsOpen, orderSingleDetails, setOrderSingleDetails }) {
    const [isRequest, setIsRequest] = useState(false);
    const {Auth} = useFullStage();
    const [authData,setAuthData] = Auth;
    const [sendEmailAsWell, setSendEmailAsWell] = useState(true);
    const messagesEndRef = useRef(null);
    const messagesScrollDiv = useRef(null);
    const router = useRouter();
    const closeModal = () => {
        setIsOpen(false);
    };
    const onChangeCommentInput = (value) => {
        setOrderSingleDetails((prev) => {
            const commentInput = prev?.commentInput || {};
            return {
                ...prev,
                commentInput: {
                    ...commentInput,
                    message: value
                }
            };
        });
    };

    const onChangeCommentMarkAsEmailSend = (bool) => {
        setSendEmailAsWell(bool);
    };
    const handleCommentAdd = async () => {

        try {
            if (!orderSingleDetails?.commentInput?.message) return ToastEmitter('error', 'Please write a comment!');
            setIsRequest(true);
            const res = await orderCommentCreate({
                orderId: orderSingleDetails?.orderId || router?.query?.slug,
                ...(orderSingleDetails?.commentInput || {}),
                sendEmailAsWell: sendEmailAsWell
            });
            setIsRequest(false);

            if (res?.data?.success) {

                setOrderSingleDetails((prev) => {
                    return {
                        ...prev,
                        commentInput: {},
                        ...res?.data?.data
                    };
                });
                scrollToBottom();
            } else {
                ToastEmitter('error', res?.data?.message);
            }
        } catch (error) {
            setIsRequest(false);

            ToastEmitter('error', error?.response?.data?.message);
        }
    };

    const scrollToBottom = () => {
        // messagesEndRef.current?.scrollIntoView({
        //     // behavior: "block",
        //     block: "end",
        // });
        if(messagesScrollDiv.current) {
            messagesScrollDiv.current.scrollTop = 0;
        }
    };

    orderSingleDetails?.comments?.sort((a,b)=>new Date(a.createdAt)<new Date(b.createdAt)?1:-1);

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
                                <Dialog.Panel className="w-full h-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] ">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 capitalize"
                                        >
                                            Comments
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>

                                    <div className="my-4">
                                        <div
                                            className="flex justify-end "
                                        >

                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" className="outline-none focus:outline-none" name="" id="" checked={sendEmailAsWell} onChange={(e) => onChangeCommentMarkAsEmailSend(e.target.checked)} /> <span>Send email as well</span>
                                            </div>
                                        </div>
                                        <div className="mb-16 w-full h-[280px] ">

                                            <div className="clearfix flex flex-col-reverse h-[280px] overflow-auto" ref={messagesScrollDiv}>
                                                <>
                                                    {isValidArray(orderSingleDetails?.comments) && orderSingleDetails?.comments.map((item, i) => (

                                                        <div key={i} className={` ${item?.createdByCustomer ? " self-start" : "self-end"} w-3/4 mx-2 my-2 p-2 clearfix`}
                                                        >

                                                            <div className="flex items-start gap-2.5">
                                                                <img className="w-[32px] h-[32px] rounded-[100%] border" src={ProfileAvatarOutput(item?.createdByAdmin?.avatar || item?.createdByCustomer?.avatar)} alt="e" />
                                                                <div className="flex flex-col gap-1 w-full max-w-[320px]">
                                                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                                        <span className="text-sm font-semibold text-gray-900">{item?.createdByAdmin? item?.createdByAdmin?._id==authData?._id ?"You": <>
                                                                            {item?.createdByAdmin?.firstName || ""} {" "}  {item?.createdByAdmin?.lastName || ""}

                                                                        </> : <>
                                                                            {item?.createdByCustomer?.firstName || ""} {" "}  {item?.createdByCustomer?.lastName || ""}

                                                                        </>}  </span>
                                                                     
                                                                        <span className="text-sm font-normal text-gray-500" title={moment(item.createdAt).format("YYYY-MM-DD")}>{moment(item.createdAt).fromNow()=='a few seconds ago'? "just now":moment(item.createdAt).fromNow()}</span>
                                                                    </div>
                                                                    <div className={`${item?.createdByCustomer?._id ? "!bg-gray-100 !text-gray-900 !rounded-e-xl !rounded-es-xl" : "!bg-blue-500 !text-white !rounded-e-xl !rounded-es-xl"} flex flex-col leading-1.5 p-4 !rounded-e-xl !rounded-es-xl w-full`}style={{borderRadius:'0px 0px 0px 7px'}}>
                                                                        <p className="text-sm font-normal ">{item?.message || ""}</p>
                                                                        <div ref={messagesEndRef}></div>
                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    ))}

                                                </>

                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="h-full  w-full flex justify-between "
                                        style={{ bottom: 0 }}
                                    >
                                        <textarea
                                            className="flex-grow m-3 py-2 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
                                            rows={1}

                                            placeholder="Comments..."
                                            onChange={(e) => onChangeCommentInput(e.target.value)} maxLength={250} value={orderSingleDetails?.commentInput?.message || ""}
                                            style={{ outline: "none" }}
                                            defaultValue={""}
                                        />

                                        <div className="">

                                            {isRequest ? <button
                                                type="button"
                                                className="inline-flex gap-1 justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-black  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                                            >
                                                <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                                            </button> : <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-whit w-[80px] focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 capitalize"
                                                onClick={async () => {
                                                    await handleCommentAdd();

                                                }}
                                            >
                                                <svg
                                                    className="svg-inline--fa text-green-400 fa-paper-plane fa-w-16 w-12 h-12 py-2 mr-2"
                                                    aria-hidden="true"
                                                    focusable="false"
                                                    data-prefix="fas"
                                                    data-icon="paper-plane"
                                                    role="img"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                                                    />
                                                </svg>
                                            </button>}
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
