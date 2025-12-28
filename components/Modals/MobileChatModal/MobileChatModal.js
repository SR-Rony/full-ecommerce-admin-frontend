
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ProfileAvatarOutput, downloadFile, downloadZip, isValidArray, viewFileSrc } from "@/utils/func";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { CgAttachment } from "react-icons/cg";
import { FaFilePdf } from "react-icons/fa";
import { IoArrowBack, IoCloseCircle, IoDocumentText } from "react-icons/io5";
import { TbFileZip } from "react-icons/tb";
import CustomerDetailsModal from "../Customer/CustomerDetailsModal";

export default function MobileChatModal({ isOpen, setIsOpen, isFileUploadReq, selectedContact, conversation, messageReq, isSendReq, handleCreateMessageSubmit, handleMediaUpload, formData, handleChange, handleChangeForm, onBackClick }) {
    const { Auth, LiveChat, Customer} = useFullStage();

    const [customerDetailsModalOpen,setCustomerDetailsModalOpen] =useState(false);
    const [customerActiveTab,setCustomerActiveTab] =useState('Profile');
  
    const [customerSingleDetails, setCustomerSingleDetails] = Customer.CustomerSingleDetails;
    const handleOpenProductDetailsModal = (customerId) => {
  
      setCustomerActiveTab('Profile');
      setCustomerSingleDetails((prev)=>{
        return {
          ...prev,
          _id:customerId
        };
      });
      setCustomerDetailsModalOpen(true);
    };
    const messagesEndRef = useRef(null);
    const bottomScroll = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        bottomScroll();
    }, [conversation?.data]);
    const closeModal = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        console.log('MobileChatModal - isOpen:', isOpen, 'selectedContact:', selectedContact);
    }, [isOpen, selectedContact]);
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => { }}>
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

                    <div className="fixed inset-0 overflow-y-auto h-full">
                        <div className="flex w-full h-full items-center justify-center p-0 text-center md:p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full h-full md:max-w-md md:h-[90vh] transform md:rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all overflow-hidden">

                                    <div className="bg-white h-full flex flex-col">

                                        <div className="flex-shrink-0">
                                            {/* Chat Header */}

                                            <header className="bg-white px-4 py-3 text-gray-700 flex items-center gap-3 border-b border-gray-200">
                                                {/* Back Button */}
                                                <button
                                                    className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                    onClick={onBackClick}
                                                    title="Back to chat list"
                                                >
                                                    <IoArrowBack size={20} />
                                                </button>
                                                
                                                {selectedContact?.customer?._id ? 
                                                    <h1 className="text-xl font-semibold cursor-pointer" onClick={() => {
                                                        handleOpenProductDetailsModal(selectedContact.customer?._id);
                                                    }}>
                                                        {selectedContact?.firstName || ""} {" "} {selectedContact?.lastName || ""}
                                                    </h1> :
                                                    <h1 className="text-xl font-semibold">
                                                        {selectedContact?.firstName || ""} {" "} {selectedContact?.lastName || ""}
                                                    </h1>
                                                }
                                            </header>
                                            <div className="px-4 pb-2">
                                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                    <p>{selectedContact?.email || ""}</p>
                                                    <span>|</span>
                                                    <p>Registered: {selectedContact?.customer?._id ? "Yes" : "No"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 relative overflow-hidden">

                                            {isValidArray(conversation?.data) ? <>

                                                <div className="relative">
                                                    {/* component */}
                                                    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-full overflow-hidden">
                                                        <div
                                                            id="popup_messages_chat"
                                                            className="flex flex-col space-y-4 p-3 overflow-x-hidden overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-h-full scrollbar-w-3 scrolling-touch"
                                                        >
                                                            {isValidArray(conversation?.data) ? (
                                                                conversation.data.map((msg, i) =>
                                                                    !msg?.admin?._id ? (
                                                                        <div className="chat-message" key={i}>
                                                                            <div className="flex items-end">
                                                                                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">

                                                                                    <div className="flex flex-col gap-1">
                                                                                        <div className="flex flex-col w-full max-w-[326px]  border-gray-200 bg-transparent rounded-e-xl rounded-es-xl">
                                                                                            {isValidArray(msg.media) && (
                                                                                                <>
                                                                                                    <div className="flex flex-wrap justify-end gap-2">
                                                                                                        {msg.media.map((media, i) => (
                                                                                                            <div
                                                                                                                className="group relative"
                                                                                                                key={i}
                                                                                                                title={moment(msg?.updatedAt).format('llll')}
                                                                                                            >
                                                                                                                <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                                                                                    <button
                                                                                                                        data-tooltip-target="download-image-1"
                                                                                                                        className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none text-white focus:ring-gray-50"
                                                                                                                        onClick={() => downloadFile(viewFileSrc(media?.url), media?.name)}
                                                                                                                    >
                                                                                                                        <svg
                                                                                                                            className="w-4 h-4 text-white"
                                                                                                                            aria-hidden="true"
                                                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                                                            fill="none"
                                                                                                                            viewBox="0 0 16 18"
                                                                                                                        >
                                                                                                                            <path
                                                                                                                                stroke="currentColor"
                                                                                                                                strokeLinecap="round"
                                                                                                                                strokeLinejoin="round"
                                                                                                                                strokeWidth={2}
                                                                                                                                d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                                                                                            />
                                                                                                                        </svg>
                                                                                                                    </button>

                                                                                                                </div>
                                                                                                                {media.resource_type ==
                                                                                                                    "image" && (
                                                                                                                        <img

                                                                                                                            src={viewFileSrc(media?.url)}
                                                                                                                            className="rounded-lg"
                                                                                                                            alt=""
                                                                                                                        />
                                                                                                                    )}
                                                                                                                {media.resource_type ==
                                                                                                                    "video" && (
                                                                                                                        <video
                                                                                                                            src={viewFileSrc(media?.url)}
                                                                                                                            className="rounded-lg"
                                                                                                                            alt=""
                                                                                                                        />
                                                                                                                    )}
                                                                                                                {media.resource_type ==
                                                                                                                    "audio" && (
                                                                                                                        <audio
                                                                                                                            src={viewFileSrc(media?.url)}
                                                                                                                            className="rounded-lg"
                                                                                                                            alt=""
                                                                                                                        />
                                                                                                                    )}

                                                                                                                {media.resource_type == 'pdf' && <div className="p-3">
                                                                                                                    <span> {media?.name}</span>
                                                                                                                    <FaFilePdf />

                                                                                                                </div>}

                                                                                                                {media.resource_type == 'doc' && <div className="p-3">
                                                                                                                    <span> {media?.name}</span>  <IoDocumentText />

                                                                                                                </div>}

                                                                                                                {media.resource_type == 'text' && <div className="p-3">
                                                                                                                    <span> {media?.name}</span>
                                                                                                                    <IoDocumentText />
                                                                                                                </div>}

                                                                                                                {media.resource_type == 'other' && <div className="p-3">
                                                                                                                    <span> {media?.name}</span>
                                                                                                                    <TbFileZip />

                                                                                                                </div>}
                                                                                                                {isFileUploadReq && (
                                                                                                                    <Loader bg="transparent" />
                                                                                                                )}

                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                    {
                                                                                                        msg?.media?.length >= 2 &&
                                                                                                        <div className="flex justify-between items-center">
                                                                                                            <button className="text-xs font-normal inline-flex items-center hover:underline" onClick={() => downloadZip(msg?.media)}>
                                                                                                                <svg
                                                                                                                    className="w-[10px] h-[10px] me-1.5"
                                                                                                                    aria-hidden="true"
                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                    fill="none"
                                                                                                                    viewBox="0 0 16 18"
                                                                                                                >
                                                                                                                    <path
                                                                                                                        stroke="currentColor"
                                                                                                                        strokeLinecap="round"
                                                                                                                        strokeLinejoin="round"
                                                                                                                        strokeWidth={2}
                                                                                                                        d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                                                                                    />
                                                                                                                </svg>
                                                                                                                Save all
                                                                                                            </button>
                                                                                                        </div>}
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    {msg?.message && (
                                                                                        <div>
                                                                                            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600" title={moment(msg?.updatedAt).format('llll')}>
                                                                                                {msg?.message}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                {msg?.message &&
                                                                                    !isValidArray(msg?.media) && (
                                                                                        <img
                                                                                            src={ProfileAvatarOutput(
                                                                                                msg?.admin?.avatar
                                                                                            )}

                                                                                            alt="My profile"
                                                                                            className="w-6 h-6 rounded-full order-1 border"
                                                                                            title={`${msg?.admin?.firstName || "---"
                                                                                                } ${msg?.admin?.lastName || "---"}`}
                                                                                        />
                                                                                    )}

                                                                                {!msg?.message &&
                                                                                    isValidArray(msg?.media) && (
                                                                                        <img
                                                                                            src={ProfileAvatarOutput(
                                                                                                msg?.admin?.avatar
                                                                                            )}
                                                                                            alt="My profile"
                                                                                            className="w-6 h-6 rounded-full order-1 border"
                                                                                            title={`${msg?.admin?.firstName || "---"
                                                                                                } ${msg?.admin?.lastName || "---"}`}
                                                                                        />
                                                                                    )}

                                                                                {msg?.message && isValidArray(msg?.media) && (
                                                                                    <img
                                                                                        src={ProfileAvatarOutput(
                                                                                            msg?.admin?.avatar
                                                                                        )}
                                                                                        alt="My profile"
                                                                                        className="w-6 h-6 rounded-full order-1 border"
                                                                                        title={`${msg?.admin?.firstName || "---"
                                                                                            } ${msg?.admin?.lastName || "---"}`}
                                                                                    />
                                                                                )}

                                                                            </div>

                                                                        </div>
                                                                    ) : (
                                                                        <div className="chat-message" key={i}>
                                                                            <div className="flex items-end justify-end">
                                                                                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                                                                                    <div className="flex flex-col gap-1">
                                                                                        <div className="flex flex-col w-full max-w-[326px]  border-gray-200 bg-transparent rounded-e-xl rounded-es-xl">
                                                                                            {isValidArray(msg.media) && (
                                                                                                <>
                                                                                                    <div className="flex flex-wrap justify-end gap-2">
                                                                                                        {msg.media.map((media, i) => (
                                                                                                            <div
                                                                                                                className="group relative"
                                                                                                                key={i}
                                                                                                                title={moment(msg?.updatedAt).format('llll')}
                                                                                                            >
                                                                                                                <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                                                                                    <button
                                                                                                                        data-tooltip-target="download-image-1"
                                                                                                                        className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none text-white focus:ring-gray-50"
                                                                                                                        onClick={() => downloadFile(viewFileSrc(media?.url), media?.name)}
                                                                                                                    >
                                                                                                                        <svg
                                                                                                                            className="w-4 h-4 text-white"
                                                                                                                            aria-hidden="true"
                                                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                                                            fill="none"
                                                                                                                            viewBox="0 0 16 18"
                                                                                                                        >
                                                                                                                            <path
                                                                                                                                stroke="currentColor"
                                                                                                                                strokeLinecap="round"
                                                                                                                                strokeLinejoin="round"
                                                                                                                                strokeWidth={2}
                                                                                                                                d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                                                                                            />
                                                                                                                        </svg>
                                                                                                                    </button>

                                                                                                                </div>
                                                                                                                {media.resource_type ==
                                                                                                                    "image" && (
                                                                                                                        <img

                                                                                                                            src={viewFileSrc(media?.url)}
                                                                                                                            className="rounded-lg"
                                                                                                                            alt=""
                                                                                                                        />
                                                                                                                    )}
                                                                                                                {media.resource_type ==
                                                                                                                    "video" && (
                                                                                                                        <video
                                                                                                                            src={viewFileSrc(media?.url)}
                                                                                                                            className="rounded-lg"
                                                                                                                            alt=""
                                                                                                                        />
                                                                                                                    )}
                                                                                                                {media.resource_type ==
                                                                                                                    "audio" && (
                                                                                                                        <audio
                                                                                                                            src={viewFileSrc(media?.url)}
                                                                                                                            className="rounded-lg"
                                                                                                                            alt=""
                                                                                                                        />
                                                                                                                    )}

                                                                                                                {media.resource_type == 'pdf' && <div className="p-3">
                                                                                                                    <span> {media?.name}</span>
                                                                                                                    <FaFilePdf />

                                                                                                                </div>}

                                                                                                                {media.resource_type == 'doc' && <div className="p-3">
                                                                                                                    <span> {media?.name}</span>  <IoDocumentText />

                                                                                                                </div>}

                                                                                                                {media.resource_type == 'text' && <div className="p-3">
                                                                                                                    <span> {media?.name}</span>
                                                                                                                    <IoDocumentText />
                                                                                                                </div>}

                                                                                                                {media.resource_type == 'other' && <div className="p-3">
                                                                                                                    <span> {media?.name}</span>
                                                                                                                    <TbFileZip />

                                                                                                                </div>}
                                                                                                                {isFileUploadReq && (
                                                                                                                    <Loader bg="transparent" />
                                                                                                                )}

                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                    {msg?.media?.length >= 2 && <div className="flex justify-between items-center">
                                                                                                        <button className="text-xs font-normal inline-flex items-center hover:underline" onClick={() => downloadZip(msg?.media)}>
                                                                                                            <svg
                                                                                                                className="w-[10px] h-[10px] me-1.5"
                                                                                                                aria-hidden="true"
                                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                                fill="none"
                                                                                                                viewBox="0 0 16 18"
                                                                                                            >
                                                                                                                <path
                                                                                                                    stroke="currentColor"
                                                                                                                    strokeLinecap="round"
                                                                                                                    strokeLinejoin="round"
                                                                                                                    strokeWidth={2}
                                                                                                                    d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                                                                                />
                                                                                                            </svg>
                                                                                                            Save all
                                                                                                        </button>
                                                                                                    </div>}
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>

                                                                                    {msg?.message && (
                                                                                        <div>
                                                                                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-black text-white " title={moment(msg?.updatedAt).format('llll')}>
                                                                                                {msg?.message}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                {msg?.message &&
                                                                                    !isValidArray(msg?.media) && (
                                                                                        <img
                                                                                            src={ProfileAvatarOutput(
                                                                                                msg?.customer?.avatar
                                                                                            )}

                                                                                            alt="My profile"
                                                                                            className="w-6 h-6 rounded-full order-2 border"
                                                                                            title={`${msg?.customer?.firstName || "---"
                                                                                                } ${msg?.customer?.lastName || "---"}`}
                                                                                        />
                                                                                    )}

                                                                                {!msg?.message &&
                                                                                    isValidArray(msg?.media) && (
                                                                                        <img
                                                                                            src={ProfileAvatarOutput(
                                                                                                msg?.customer?.avatar
                                                                                            )}
                                                                                            alt="My profile"
                                                                                            className="w-6 h-6 rounded-full order-2 border"
                                                                                            title={`${msg?.customer?.firstName || "---"
                                                                                                } ${msg?.customer?.lastName || "---"}`}
                                                                                        />
                                                                                    )}

                                                                                {msg?.message && isValidArray(msg?.media) && (
                                                                                    <img
                                                                                        src={ProfileAvatarOutput(
                                                                                            msg?.customer?.avatar
                                                                                        )}
                                                                                        alt="My profile"
                                                                                        className="w-6 h-6 rounded-full order-2 border"
                                                                                        title={`${msg?.customer?.firstName || "---"
                                                                                            } ${msg?.customer?.lastName || "---"}`}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )
                                                            ) : (
                                                                <>{isFileUploadReq && <Loader bg="transparent" />}</>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <style
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                "\n.scrollbar-w-2::-webkit-scrollbar {\n  width: 0.25rem;\n  height: 0.25rem;\n}\n\n.scrollbar-track-blue-lighter::-webkit-scrollbar-track {\n  --bg-opacity: 1;\n  background-color: #f7fafc;\n  background-color: rgba(247, 250, 252, var(--bg-opacity));\n}\n\n.scrollbar-thumb-blue::-webkit-scrollbar-thumb {\n  --bg-opacity: 1;\n  background-color: #edf2f7;\n  background-color: rgba(237, 242, 247, var(--bg-opacity));\n}\n\n.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {\n  border-radius: 0.25rem;\n}\n",
                                                        }}
                                                    />
                                                </div>

                                            </> : <>

                                            </>}

                                            {
                                                messageReq && <dv className="absolute top-[30%] mx-auto left-0 right-0">
                                                    <Loader bg="transparent" />
                                                </dv>
                                            }

                                            <div className="chat-message" ref={messagesEndRef} />
                                        </div>
                                        
                                        {/* Chat Input - Fixed at bottom */}
                                        <div className="flex-shrink-0 border-t border-gray-200">
                                            <footer className="bg-white px-4 py-3 w-full">

                                                <div className="relative flex gap-2 justify-between items-center">
                                                    <div className="relative w-full">
                                                        <div className="absolute left-2 top-[18px]">
                                                            <label>
                                                                <CgAttachment className="cursor-pointer" />

                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    multiple
                                                                    onChange={(e) => {

                                                                        handleMediaUpload(e);
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="message"
                                                            value={formData?.message || ""}
                                                            onChange={handleChangeForm}
                                                            onKeyDown={async (e) => {
                                                                if (e.key === 'Enter') {
                                                                    await handleCreateMessageSubmit();
                                                                }
                                                            }}
                                                            placeholder="Write your message!"
                                                            className="text-xs pl-8 block w-full focus:outline-none focus:placeholder-gray-400 text-gray-500 placeholder-gray-400 bg-gray-200 rounded-md p-4 px-4"
                                                        />
                                                    </div>
                                                    <div className="relative right-0 items-center inset-y-0 flex">
                                                        {isSendReq ? (
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-black hover:bg-gray-700 focus:outline-none cursor-not-allowed"
                                                            >

                                                                <Loader bg="transparent" className="w-5 h-5 ml-2" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-black hover:bg-gray-700 focus:outline-none"
                                                                onClick={() => {
                                                                    handleCreateMessageSubmit();
                                                                }}
                                                            >

                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    className="h-6 w-6 ml-2 transform rotate-90"
                                                                >
                                                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                            </footer>
                                        </div>
                                        <CustomerDetailsModal isOpen={customerDetailsModalOpen} setIsOpen={setCustomerDetailsModalOpen} setActiveTab={setCustomerActiveTab} activeTab={customerActiveTab}/>
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