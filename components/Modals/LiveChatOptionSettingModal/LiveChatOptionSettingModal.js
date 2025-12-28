
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { createLiveChatOptions, getLiveChatOptions, updateLiveChatOptions } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { stubTrue } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { IoIosCloseCircle, IoMdSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import Swal from "sweetalert2";
import LiveChatOptionDeleteModal from "./LiveChatOptionDeleteModal";

export default function LiveChatOptionSettingModal({ isOpen, setIsOpen }) {
    const [isRequest, setIsRequest] = useState(false);
    const [liveChatOptionSetting, setLiveChatOptionSetting] = useState([]);
    const [liveChatOptionUpdateData, setLiveChatOptionUpdateData] = useState({});

    const [isUpdateRequest, setIsUpdateRequest] = useState(false);
    const [isCreateRequest, setIsCreateRequest] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [actionMode, setActionMode] = useState({});
    const closeModal = () => {
        setIsOpen(false);
    };

    const handleLiveChatOptionSetting = async () => {
        try {

            setIsRequest(true);
            const res = await createLiveChatOptions(liveChatOptionUpdateData);
            setIsRequest(false);
            if (res?.data?.success) {
                setLiveChatOptionUpdateData({});
                const modifiedData = isValidArray(liveChatOptionSetting) ? [res?.data?.data, ...liveChatOptionSetting].sort((a, b) => b.orderNum - a.orderNum) : [res?.data?.data];
                setLiveChatOptionSetting(modifiedData);
                Swal.fire({
                    title: "Success",
                    text: res?.data?.message,
                    icon: "success"
                });
                setIsCreateRequest(false);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: res?.data?.message,
                    icon: "error"
                });

            }

        } catch (error) {
            console.log(error);
            setIsRequest(false);
            Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error"
            });
        }
    };

    const handleLiveChatOptionSettingUpdate = async () => {
        // console.log(obj,'updatedData');
        try {
            setIsUpdateRequest(true);

            const res = await updateLiveChatOptions(actionMode?._id, { name: actionMode?.name, orderNum: actionMode?.orderNum });
            if (res?.data?.success) {
                setActionMode({});
                const modifiedData = isValidArray(liveChatOptionSetting) ? liveChatOptionSetting.map(item => {
                    if (item?._id === actionMode?._id) {
                        return {
                            ...item,
                            ...res?.data?.data
                        };
                    } else {
                        return item;
                    }
                }).sort((a, b) => b.orderNum - a.orderNum) : [];
                setLiveChatOptionSetting(modifiedData);
                Swal.fire({
                    title: "Success",
                    text: res?.data?.message,
                    icon: "success"
                });
            }
            setIsUpdateRequest(false);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error"
            });
            setIsUpdateRequest(false);

            // console.log(error);
        }

    };

    const fetchLiveChatOptionSetting = async () => {
        try {
            const res = await getLiveChatOptions({});
            setLiveChatOptionSetting(res.data.data);
        } catch (error) {
            // console.log(error);
        }
    };
    useEffect(() => {
        fetchLiveChatOptionSetting();
    }, []);

    // console.log(liveChatOptionUpdateData, 'contact categories');

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

                    <div className="fixed inset-0 overflow-y-auto ">
                        <div className="flex  items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl  transform rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px]">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 capitalize"
                                        >
                                           Live Chat Options
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>
                                    <div className="h-[300px] overflow-auto">
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 text-center px-4 border-b">Name</th>
                                                    <th className="py-2 text-center px-4 border-b">Order Number</th>
                                                    <th className="py-2 text-center  px-4 border-b">Action</th>
                                                </tr>
                                                {
                                                    isValidArray(liveChatOptionSetting) && liveChatOptionSetting.map((item, i) => (
                                                        <tr key={i} className="">
                                                            {actionMode?.action == 'edit' && i == actionMode?.index && actionMode?._id && item?._id ? <td>

                                                                <input type="text" className="w-full mt-2 text-center" name="" value={actionMode?.name} id="" onChange={(e) => {
                                                                    setActionMode({ ...actionMode, name: e.target.value });
                                                                }} />

                                                            </td> : <td className="text-center py-2 cursor-pointer capitalize" >{item?.name}</td>}

                                                            {actionMode?.action == 'edit' && i == actionMode?.index && actionMode?._id && item?._id ? <td className="flex justify-center">

                                                                <input type="number" className="w-[150px] pl-6 text-center mt-2" name="" value={actionMode?.orderNum} id="" onChange={(e) => {
                                                                    setActionMode({ ...actionMode, orderNum: e.target.value });
                                                                }} />

                                                            </td> : <td className="text-center py-2 cursor-pointer" >{item?.orderNum}</td>}

                                                            <td className="text-center py-2">
                                                                <div className={`flex justify-center text-center`}>
                                                                    {actionMode?.action == 'edit' && i == actionMode?.index && actionMode?._id && item?._id ? <div className="flex gap-2">
                                                                        <button className="bg-red-500 text-white shadow-md rounded-md px-2 py-1" onClick={() => {
                                                                            setActionMode({ index: i, ...item, action: 'un_edit', active: !actionMode?.active });
                                                                        }}> <IoClose />
                                                                        </button>

                                                                        {isUpdateRequest ? <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-not-allowed"

                                                                        > <Loader bg="transparent" /></button> : <button className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                                                            onClick={() => {
                                                                                handleLiveChatOptionSettingUpdate();
                                                                            }}
                                                                        > <IoMdSend />
                                                                        </button>}
                                                                    </div> : <div className="flex items-center gap-2 justify-end pt-3">
                                                                        <button
                                                                            className="flex items-center gap-1 cursor-pointer"
                                                                            onClick={() => setActionMode({ index: i, ...item, action: 'edit', active: !actionMode?.active })}
                                                                        >
                                                                            <RiEditLine size={18} />
                                                                        </button>
                                                                        |
                                                                        <button
                                                                            className="flex items-center gap-1 cursor-pointer"
                                                                            onClick={() => {
                                                                                setActionMode({ index: i, ...item, action: 'delete' });
                                                                                setDeleteModalOpen(stubTrue);
                                                                            }}
                                                                        >
                                                                            <MdOutlineDeleteOutline size={18} />
                                                                        </button>
                                                                    </div>

                                                                    }
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </thead>
                                        </table>
                                    </div>
                                    <div className={`${isCreateRequest ? 'p-4 border pt-[20px]' : 'pt-[20px]'}`}>
                                        <div className="">
                                            <button className="block ms-auto bg-blue-500 text-white px-4 py-2 rounded-md  justify-end" onClick={() => setIsCreateRequest(!isCreateRequest)}>Add New Option</button>
                                        </div>

                                        {isCreateRequest && <div className="mt-8 ">
                                            <div className="flex justify-between gap-3 flex-wrap">
                                                <div className="w-[80%]">
                                                    <p className="py-2 font-bold">Name</p>
                                                    <input type="text" value={liveChatOptionUpdateData?.name || ""} className="w-full" onChange={(e) => {

                                                        setLiveChatOptionUpdateData({ ...liveChatOptionUpdateData, name: e.target.value });
                                                    }} />
                                                </div>
                                                <div className="w-[17%]">
                                                    <p className="py-2 font-bold">Order Number</p>
                                                    <input type="number" value={liveChatOptionUpdateData?.orderNum || ""} className="w-full" onChange={(e) => {

                                                        setLiveChatOptionUpdateData({ ...liveChatOptionUpdateData, orderNum: e.target.value });
                                                    }} />
                                                </div>
                                            </div>

                                            <div className="pt-[40px]">
                                                {isRequest ? <button className="block ms-auto bg-blue-500 text-white px-4 py-2 rounded-md  justify-end" ><Loader bg="transparent" /> </button> : <button className="block ms-auto bg-blue-500 text-white px-4 py-2 rounded-md  justify-end" onClick={() => {
                                                    handleLiveChatOptionSetting();
                                                }}>Create</button>}
                                            </div>
                                        </div>}
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>

                </Dialog>
            </Transition>

            <LiveChatOptionDeleteModal isOpen={deleteModalOpen} setIsOpen={setDeleteModalOpen} liveChatOptionSetting={liveChatOptionSetting} setLiveChatOptionSetting={setLiveChatOptionSetting} actionMode={actionMode} setActionMode={setActionMode} setCreateModal={setIsOpen} />
        </>
    );
}
