
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { createShippingCountriesApi, getShippingCountriesApi, updateShippingCountriesApi } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";
import SelectCountryList from "./SelectCountryList";
import ShippingCountrySwitch from "./ShippingCountrySwitch";

export default function CreateShippingCountriesModal({ isOpen, setIsOpen, shippingUpdateData, setShippingUpdateData, shippingSettings, setShippingSettings }) {
    const [isRequest, setIsRequest] = useState(false);
    const [shippingCountries, setShippingCountries] = useState([]);
    const [createShippingCountriesData, setCreateShippingCountriesData] = useState({});
    const [updateShippingCountryData, setUpdateShippingCountryData] = useState({});
    const [isCreateShippingCountryOn, setIsCreateShippingCountryOn] = useState(false);
    const closeModal = () => {
        setIsOpen(false);
    };

    const handleCreateShippingCountries = async () => {
        try {
            setIsRequest(true);
            const res = await createShippingCountriesApi({ country: createShippingCountriesData });
            setIsRequest(false);
            if (res?.data?.success) {
                const modifiedData = isValidArray(shippingCountries) ? [res?.data?.data, ...shippingCountries] : [res?.data?.data];
                setShippingCountries(modifiedData);
                Swal.fire({
                    title: "Success",
                    text:res?.data?.message,
                    icon: "success"
                  });
                isCreateShippingCountryOn(false);
            } else {
                Swal.fire({
                    title: "Error!",
                    text:res?.data?.message,
                    icon: "error"
                  });
            }
        } catch (error) {
            //console.log(error);
            setIsRequest(false);
            Swal.fire({
                title: "Error!",
                text:error.response?.data?.message,
                icon: "error"
              });
        }
    };

    const HandlerUpdateShipping = async (keys, obj) => {
        // console.log(obj,'updatedData');
        try {
            const res = await updateShippingCountriesApi(obj.value, { isActive: obj.checked });
            const modifiedData = isValidArray(shippingCountries)? shippingCountries.map(item => {
                if (item._id === obj.value) {
                    return {
                        ...item,
                        isActive: obj.checked
                    };
                } else {
                    return item;
                }
            }) : [];
              setShippingCountries(modifiedData);
              if(res?.data?.success){
                Swal.fire({
                    title: "Success",
                    text:res?.data?.message,
                    icon: "success"
                  });
              }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text:error?.response?.data?.message,
                icon: "error"
              });
            // console.log(error);
        }
       
    };

    const fetchCountries = async () => {
        try {
            const res = await getShippingCountriesApi({});
            setShippingCountries(res.data.data);
        } catch (error) {
            // console.log(error);
        }
    };
    useEffect(() => {
        fetchCountries();
    }, []);

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
                                            Shipping Countries
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>
                                    <div className="h-[300px] overflow-auto">
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 text-center px-4 border-b">Name</th>
                                                    <th className="py-2 text-center  px-4 border-b">Active</th>

                                                </tr>
                                                {
                                                    isValidArray(shippingCountries) && shippingCountries.map((item, i) => (
                                                        <tr key={i} className="">
                                                            <td className="text-center py-2 cursor-pointer" >{item?.country?.label}</td>

                                                            <td className="text-center py-2">
                                                                <div className={`flex justify-center text-center ${item?.isActive == false && ''}`}>
                                                                    <ShippingCountrySwitch id={item?._id} keys={"isActive"} defaultChecked={item?.isActive} checked={updateShippingCountryData?.isActive} classList="flex items-center" onChange={HandlerUpdateShipping} spanClassList="text-sm font-medium text-gray-900 capitalize" />

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </thead>
                                        </table>
                                    </div>
                                    <div className={`${isCreateShippingCountryOn ? 'p-4 border pt-[20px]' : 'pt-[20px]'}`}>
                                        <div className="">
                                            <button className="block ms-auto bg-blue-500 text-white px-4 py-2 rounded-md  justify-end" onClick={() => setIsCreateShippingCountryOn(!isCreateShippingCountryOn)}>Add new country</button>
                                        </div>
                                        {isCreateShippingCountryOn && <div className="mt-8">
                                            <p className="py-2 font-bold">Select Shipping Countries</p>
                                            <SelectCountryList selectedOptions={createShippingCountriesData?.country} setCreateShippingCountriesData={setCreateShippingCountriesData} />
                                            <div className="pt-[40px]">
                                                {isRequest ? <button className="block ms-auto bg-blue-500 text-white px-4 py-2 rounded-md  justify-end" ><Loader bg="transparent" /> </button> : <button className="block ms-auto bg-blue-500 text-white px-4 py-2 rounded-md  justify-end" onClick={() => {
                                                    handleCreateShippingCountries();
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
        </>
    );
}
