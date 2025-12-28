import FaqEditor from "@/components/MarkEditor/FaqEditor";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { isValidArray } from "@/utils/func";
import { createFaq, getFaqSlugCheck } from "@/utils/instance";

import { Dialog, Transition } from "@headlessui/react";
import _ from 'lodash';
import { Fragment, useCallback, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function FaqCreateModal({ isOpen, setIsOpen, faqs, setFaqs, setUpdateData, setEditorData, editorData }) {
    const [isSlugRequest, setIsSlugRequest] = useState(false);
    const [faqCreateRequest, setCreateFaqRequest] = useState(false);
    const changeHandler = (key, e) => {
        setEditorData({ ...editorData, [key]: e.target.value });
    };

    function handleDebounceFn(inputValue) {
        setIsSlugRequest(true);
        getFaqSlugCheck(inputValue).then((res) => {
            if (res?.data?.success) {

                ToastEmitter('success', res?.data.message);
            } else {
                ToastEmitter('error', res?.data.message);
            }
            setIsSlugRequest(false);
        }).catch(err => {
            setIsSlugRequest(false);
            ToastEmitter('error', err.response?.data?.message);
        });
    }

    const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

    function handleSlugCheck() {
        debounceFn(editorData?.slug);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleCreateFAQ = async () => {
        setCreateFaqRequest(true);
        console.log(editorData);
        await createFaq(editorData).then((res) => {
            setCreateFaqRequest(false);
            if (res?.data?.success) {
                closeModal();
                setEditorData({});
                setFaqs((prev) => {
                    const data = isValidArray(prev.data) ? [res.data.data, ...prev.data] : [res?.data?.data];
                    return {
                        ...prev,
                        data: data
                    };
                });
                ToastEmitter('success', res?.data.message);
            } else {
                ToastEmitter('error', res?.data.message);
            }
            setCreateFaqRequest(false);
        }).catch(err => {
            setCreateFaqRequest(false);
            ToastEmitter('error', err.response?.data?.message);
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
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-y-auto pb-6 rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all rounded-md ">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 capitalize"
                                        >
                                            <h2 className="py-3 my-2 text-xl font-bold">Create</h2>
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>
                                    <div>

                                        <div className="my-4">

                                            <div className="md:flex items-center gap-2">
                                                <div className="w-full md:w-[100%]">
                                                    <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize">  <p className="py-2 font-bold text-lg">Question</p></label>
                                                    <div className="relative">
                                                        <input type="text" name="question" onChange={(e) => changeHandler("question", e)} value={editorData?.question || ""}
                                                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                                            required />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="my-4">
                                            <p className="py-2 font-bold text-lg">Answer</p>
                                            <FaqEditor editorData={editorData} setEditorData={setEditorData} setUpdateData={setUpdateData} />
                                        </div>

                                    </div>
                                    <div className="mt-4 flex justify-end gap-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200  w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        {faqCreateRequest ? <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                                        >
                                            <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                                        </button> : <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[130px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                                            onClick={async () => {
                                                handleCreateFAQ();
                                                // await handleCreateFAQ();

                                            }}
                                        >
                                            Create
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
