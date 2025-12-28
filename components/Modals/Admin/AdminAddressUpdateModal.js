import Loader from "@/shared/Loader/Loader";
import { AdminProfileUpdate } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import _ from 'lodash';
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function AdminAddressUpdateModal({ isOpen, setIsOpen, profile, setProfile }) {
    const [isRequest, setIsRequest] = useState(false);
    const closeModal = () => {
        setIsOpen(false);
    };
    const handleAddressUpdate = async () => {
    
        try {
            setIsRequest(true);
            const res = await AdminProfileUpdate(profile?.updateAddressData||{});
            setIsRequest(false);
            if (res?.data?.success) {
                const info =_.omit({
                    ...profile,
                    ...res?.data?.data 
                },['updateFullName','updateAddressData']);  
                window.localStorage.setItem('user',JSON.stringify(info));
                setProfile(info);
                Swal.fire({
                    title: "Success",
                    text: res?.data?.message,
                    icon: "success"
                  });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: res?.data?.message,
                    icon: "error"
                  });
            }
        } catch (error) {
            //console.log(error);
            setIsRequest(false);
            Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error"
              });
        }
    };
    const onChange = (keys, value) => {
        setProfile((prev) => {
            const address = prev?.updateAddressData?.address || {};
            const updateAddressData = prev?.updateAddressData|| {};
            return {
                ...prev,
             updateAddressData:{
                ...updateAddressData,
                address: {
                    ...address,
                    [keys]: value
                }
             }
            };
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-full">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 capitalize"
                                        >
                                          Profile Address Update
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>

                                    <div className="mt-2">
                                        <div>
                                            <p className="py-2">Street Name</p>
                                            <input type="text" className="w-full rounded-sm" name="" defaultValue={profile?.address?.streetName || ""} onChange={(e) => onChange('streetName', e.target.value)} placeholder="Street Name" id="" />
                                        </div>
                                        <div>
                                            <p className="py-2">Street Number</p>
                                            <input type="text" className="w-full rounded-sm" name="" defaultValue={profile?.address?.streetNumber || ""} onChange={(e) => onChange('streetNumber', e.target.value)} placeholder="Street Number" id="" />
                                        </div>
                                        <div>
                                            <p className="py-2"> APT OR UNIT NUMBER (Optional)</p>
                                            <input type="text" className="w-full rounded-sm" name="" defaultValue={profile?.address?.aptUnit || ""} onChange={(e) => onChange('aptUnit', e.target.value)} placeholder=" APT OR UNIT NUMBER (Optional)" id="" />
                                        </div>
                                        <div>
                                            <p className="py-2">City</p>
                                            <input type="text" className="w-full rounded-sm" name="" defaultValue={profile?.address?.city || ""} onChange={(e) => onChange('city', e.target.value)} placeholder="City" id="" />
                                        </div>
                                        <div>
                                            <p className="py-2">State</p>
                                            <input type="text" className="w-full rounded-sm" name="" defaultValue={profile?.address?.state || ""} onChange={(e) => onChange('state', e.target.value)} placeholder="State" id="" />
                                        </div>
                                        <div>
                                            <p className="py-2">ZipCode</p>
                                            <input type="text" className="w-full rounded-sm" name="" defaultValue={profile?.address?.zipCode || ""} onChange={(e) => onChange('zipCode', e.target.value)} placeholder="Zip Code" id="" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end gap-4">
                                        <button
                                            type="button"
                                        className="inline-flex w-auto justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"

                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                        {isRequest ? <button
                                            type="button"
                                             className="inline-flex gap-1 justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                                        >
                                            <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                                        </button> : <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                                            onClick={async () => {
                                                await handleAddressUpdate();
                                                closeModal();
                                            }}
                                        >
                                            Update
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
