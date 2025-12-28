import Switch from "@/components/Shared/Switch";
import CountrySelector from "@/shared/Country/CountrySelector";
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { updateShippingSetting } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function EditShippingSettingModal({ isOpen, setIsOpen, shippingUpdateData, setShippingUpdateData, shippingSettings, setShippingSettings }) {
    const [isRequest, setIsRequest] = useState(false);
    const closeModal = () => {
        setIsOpen(false);
    };
    const handleInputChange = (field, value) => {
        setShippingUpdateData((prevData) => ({ ...prevData, [field]: value }));
    };
    const handleShippingSetting = async () => {
        try {
            setIsRequest(true);
            
            const res = await updateShippingSetting(shippingUpdateData?._id, shippingUpdateData);
            setIsRequest(false);
      
            if (res?.data?.success) {
                const modifiedData = isValidArray(shippingSettings?.data) && shippingSettings.data?.map(item => {
                    if (item?._id == shippingUpdateData?._id) {
                        return {
                            ...item,
                            ...shippingUpdateData
                        };
                    } else {
                        return item;
                    }

                });
                setShippingSettings({ ...shippingSettings, data: modifiedData });
               
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
            setIsRequest(false);
            Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error"
              });
          
        }
    };
 const countrySelectOnChange = (value)=>{
        setShippingUpdateData((prevData) => ({ ...prevData, ['country']: value}));
};

const countryDefaultOption ={
    label:"United States",
    value:"US"
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
                                <Dialog.Panel className="w-full max-w-4xl  transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-[750px]">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 capitalize"
                                        >
                                            Update Shipping Option
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>
                                    <div className="mt-2">

                                        <div className="w-full ">

                                            <div className="mb-4">
                                                <label className="block text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={shippingUpdateData?.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className="p-2 border rounded w-full"
                                                    placeholder="Name"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700">Cost</label>
                                                <input
                                                    value={shippingUpdateData?.cost}
                                                    type="number"
                                                    onChange={(e) => handleInputChange('cost', e.target.value)}
                                                    className="p-2 border rounded w-full"
                                                    placeholder="Cost"
                                                ></input>
                                            </div>
                                            <div className="mt-6 flex flex-wrap justify-between gap-4">
                                                <div className="w-[40%]">
                                                    <label className="block text-gray-700 py-2">Active </label>
                                                    <Switch name={"On"} keys={"isActive"} defaultChecked={shippingUpdateData?.isActive} checked={shippingUpdateData?.isActive} onChange={handleInputChange} />
                                                </div>
                                                <div className="w-[50%]">
                                                    <p className="py-2">Select Shipping Country </p>
                                                    <CountrySelector onChange={countrySelectOnChange} selectedOptions={shippingUpdateData?.shippingCountry ||countryDefaultOption}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full mt-6">
                                            <div className="mb-4">
                                                <h2 className="text-lg font-bold">Note</h2>
                                                <label className="block text-gray-700">arrivalNote</label>
                                                <input
                                                    type="text"
                                                    value={shippingUpdateData?.arrivalNote}
                                                    onChange={(e) =>
                                                        handleInputChange('arrivalNote', e.target.value)
                                                    }
                                                    className="p-2 border rounded w-full"
                                                    placeholder="Arrival Note"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700">Note For Customer</label>
                                                <textarea
                                                    type="text"
                                                    value={shippingUpdateData?.noteForCustomer}
                                                    onChange={(e) =>
                                                        handleInputChange('noteForCustomer', e.target.value)
                                                    }
                                                    className="p-2 border rounded w-full"
                                                    placeholder="Note For Customer"
                                                />
                                            </div>

                                        </div>
                                        <div className="w-full ">
                                            <div className={`mb-4 ${shippingUpdateData['freeShipping.allow']==false&&'pb-12'}`}>
                                                <h2 className="text-lg font-bold py-4">Free Shipping</h2>
                                                <Switch name={shippingUpdateData['freeShipping.allow']?'Enabled':'Disabled'} keys={"freeShipping.allow"} defaultChecked={shippingUpdateData?.freeShipping?.allow} checked={shippingUpdateData['freeShipping.allow']} onChange={ handleInputChange} />
                                       
                                            </div>
                                            {shippingUpdateData['freeShipping.allow']&&<div className="mb-4 pl-3">
                                                <label className="block text-gray-700">Amount</label>
                                                <input
                                                    value={shippingUpdateData['freeShipping.amount']||shippingUpdateData?.freeShipping?.amount}
                                                    type="number"
                                                    onChange={(e) => handleInputChange('freeShipping.amount', e.target.value)}
                                                    className="p-2 border rounded w-full"
                                                    placeholder="Amount"
                                                ></input>
                                            </div>}
                                        </div>

                                    </div>
                                    <div className="mt-6 flex justify-end gap-4">
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
                                                await handleShippingSetting();
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
