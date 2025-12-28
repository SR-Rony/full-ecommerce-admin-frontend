import FaqEditor from "@/components/MarkEditor/FaqEditor";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { genSlug, isValidArray } from "@/utils/func";
import { getFaqSlugCheck, updateFaq } from "@/utils/instance";

import { Dialog, Transition } from "@headlessui/react";
import _ from 'lodash';
import { Fragment, useCallback, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function FaqEditModal({ isOpen, setIsOpen,faqs,setFaqs, setEditorData,setUpdateData,updateData, editorData }) {
    const [isSlugRequest, setIsSlugRequest] = useState(false);
    const [faqEditRequest, setEditFaqRequest] = useState(false);
    const changeHandler = (key, e) => {
        if (key == 'question') {
            setUpdateData({
                ...updateData,
                [key]: e.target.value,
                slug: genSlug(e.target.value)
            });
        
        } else {
            setUpdateData({ ...updateData, [key]: e.target.value });
        }

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
        debounceFn(updateData?.slug);
    };

  const closeModal = () =>{
    setIsOpen(false);
  };

  const handleEditFAQ = async() =>{
    setEditFaqRequest(true);
   await updateFaq(editorData?._id,updateData).then((res) => {
    setEditFaqRequest(false);
        if (res?.data?.success) {
            setUpdateData((prev) => {
                return {
                    ...prev,
                    ...res?.data?.data
                };
            });
            setEditorData((prev) => {
                return {
                    ...prev,
                    ...res?.data?.data
                };
            });
            setFaqs((prev) =>{
                const data = isValidArray(prev.data)? prev.data.map(item => {
                    if(item?._id == res?.data?.data?._id){
                        return {
                            ...item,
                            ...res.data?.data,
                        };
                    }else{
                        return item;
                    }
                }) :[res?.data?.data];
                return {
                    ...prev,
                    data:data
                };
            });
            ToastEmitter('success', res?.data.message);
        } else {
            ToastEmitter('error', res?.data.message);
        }
        setEditFaqRequest(false);
    }).catch(err => {
        setEditFaqRequest(false);
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
                                                                 <h2 className="py-3 my-2 text-xl font-bold">Edit</h2>
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>
                                    <div>
             
                                        <div className="my-4">

                                            <div className="md:flex items-center gap-2">
                                                <div className="w-full md:w-[100%]">
                                                    <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize">  <p className="py-2 font-bold text-lg">Question</p></label>
                                                    <div className="relative">
                                                        <input type="text" name="question"  onChange={(e) => changeHandler("question", e)} value={updateData?.question || ""}
                                                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                                            required />
                                                    </div>
                                                </div>
                                             
                                            </div>
                                        </div>
                                        <div className="my-4">
                                            <p className="py-2 font-bold text-lg">Answer</p>
                                            <FaqEditor editorData={editorData} setEditorData={setEditorData} setUpdateData={setUpdateData}/>
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
                                        {faqEditRequest ? <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                                        >
                                            <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                                        </button> : <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[130px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                                            onClick={async () => {
                                                await handleEditFAQ();
                                         
                                            }}
                                        >
                                        Edit
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
