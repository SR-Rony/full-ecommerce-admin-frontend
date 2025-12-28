import Loader from "@/shared/Loader/Loader";
import { addressConcat } from "@/utils/func";
import { AdminProfileUserUpdate, getAddressSearchApi } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import _ from 'lodash';
import { Fragment, useCallback, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function AdminAddressUpdateModal({ isOpen, setIsOpen, profile, setProfile }) {
    const [isRequest, setIsRequest] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [sub, setSub] = useState(true);
    const [searchAddressArr, setSearchAddressArr] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({});

    const formatAddressObject = (addr)=> {
        return {
            city: addr.city || "",
            aptUnit: addr.aptUnit || "",
            state: addr.state || "",
            zipCode: addr.zipCode || "",
            streetName: addr.streetName || "",
            streetNumber: addr.streetNumber || ""
        };
    };

    const closeModal = () => {
        setSelectedAddress({});
        setSearchValue("");
        setIsOpen(false);
    };
    const handleAddressUpdate = async () => {
        try {
            setIsRequest(true);
            const res = await AdminProfileUserUpdate({ address:selectedAddress, adminId: profile?._id });
            setIsRequest(false);
            if (res?.data?.success) {
                setProfile({ ...profile,address: selectedAddress, ...res?.data?.data});
                Swal.fire({
                    title: "Success",
                    text: res?.data?.message,
                    icon: "success"
                  });
                  closeModal();
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
    const onChange = (key, value) => {
        setSelectedAddress((prev) => {
            return formatAddressObject({
              ...prev,
              [key]: value,
            });
        });
    };

    const fetchAddressApi = async (value) => {
        try {
            const res = await getAddressSearchApi(value);
            if (Array.isArray(res?.data?.results) && res.data.results.length) {
                const mappedData = res.data.results.map((entity) => {
                    const {
                        freeformAddress,
                        address: {
                            countrySubdivision,
                            countrySubdivisionName,
                            municipalitySubdivision,
                            countrySecondarySubdivision,
                            postalCode,
                            zipCode,
                            countryCode,
                            municipality,
                            streetNumber,
                            streetName,
                        },
                    } = entity;

                    const city = municipality || municipalitySubdivision || null;
                    const state =
                        countrySubdivision ||
                        countrySubdivisionName ||
                        countrySecondarySubdivision ||
                        null;
                    const zip = postalCode || zipCode || null;
                    const country = {
                        label: countryCode || null,
                        value: countryCode || null,
                    };

                    return _.omitBy({
                        str: freeformAddress,
                        streetNumber,
                        streetName,
                        aptUnit: entity.aptUnit || null,
                        city,
                        country,
                        state,
                        zipCode: zip,
                    }, _.isNil);
                });

                setSearchAddressArr(mappedData);
            }

        } catch (error) {
            setSearchAddressArr([]);
            // console.log(error)
            // ToastEmitter('error', error.response?.data?.message)
        }
    };
    const handleAddressSearch = async (value) => {
        await fetchAddressApi(value);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceFn = useCallback(_.debounce(handleAddressSearch, 1000), []);

    function handleChange(event) {
        setSearchValue(event.target.value);
        debounceFn(event.target.value);
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={()=>{}}>
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
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-full">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="px-10 font-bold text-2xl py-6 leading-6 text-gray-900 capitalize"
                                        >
                                            Admin Address Update
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>
                                    <div className="">
                                        <div className="text-black bg-white rounded-md px-10 py-3  space-y-2">
                                            <div className="capitalize  space-x-2">
                                                current address:{" "}
                                                <span className="font-semibold text-lg">
                                                    {addressConcat(profile?.addressInfoUpdate)}
                                                </span>{" "}
                                            </div>
                                            <div className="capitalize  space-x-2">
                                                Apartment or Unit:{" "}
                                                <span className="font-semibold text-lg">
                                                    {profile?.addressInfoUpdate?.aptUnit || ""}
                                                </span>{" "}
                                            </div>
                                            <div className="capitalize  space-x-2">
                                                Current Name:{" "}
                                                <span className="font-semibold text-lg">
                                                    {profile.firstName||""}{" "}
                                                    {profile.lastName ||""}
                                                </span>{" "}
                                            </div>
                                        </div>

                                        <div className="text-black bg-white rounded-md px-10 py-3  mt-3 space-y-2">
                                            {sub ? (
                                                <div>
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <div className="md:w-7/12">
                                                            <label htmlFor="" className="font-semibold">
                                                                Address
                                                            </label>
                                                            <p className="text-sm">
                                                                If your address is not shown in the dropdown or you need
                                                                to modify it, just type it manually.
                                                            </p>
                                                            <div className="relative ">
                                                                <input
                                                                    type="text"
                                                                    value={searchValue || ""}
                                                                    className="text-sm w-full p-2 rounded-md my-2 border bg-[#F2F2F2]"
                                                                    placeholder="Type address"
                                                                    onChange={handleChange}
                                                                />
                                                                {Array.isArray(searchAddressArr) &&
                                                                    searchAddressArr?.length > 0 && (
                                                                        <div className="absolute py-2 px-4 bg-white w-full rounded-md border border-gray-400">
                                                                            {searchAddressArr.map((address, i) => (
                                                                                <p
                                                                                    key={i}
                                                                                    className="cursor-pointer py-2 border-b"
                                                                                    onClick={() => {
                                                                                        setSelectedAddress(formatAddressObject(address));
                                                                                        setSearchValue(addressConcat(address));
                                                                                        setSearchAddressArr([]);
                                                                                    }}
                                                                                >
                                                                                    {" "}
                                                                                    {addressConcat(address)}{" "}
                                                                                </p>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                            <p className="text-xs">
                                                                Cant find address?{" "}
                                                                <button
                                                                    onClick={() => setSub(false)}
                                                                    className="font-semibold"
                                                                >
                                                                    {" "}
                                                                    Click here to type it manually
                                                                </button>
                                                            </p>{" "}
                                                        </div>

                                                        <div className="md:w-5/12">
                                                            <label htmlFor="" className="font-semibold">
                                                                APT OR UNIT NUMBER (Optional)
                                                            </label>
                                                            <input
                                                                type="text"
                                                                defaultValue={profile?.address?.aptUnit||""}
                                                                value={selectedAddress?.aptUnit || ""}
                                                                onChange={(e) => onChange("aptUnit", e.target.value)}
                                                                className="text-sm w-full p-2 rounded-md my-2  md:mt-12 border bg-[#F2F2F2]"
                                                                placeholder="Type Apt or Unit Here"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="py-5 mt-4">
                                                        <div className="text-sm flex justify-end gap-3 pt-4 ">
                                                            <button className="bg-white  py-2 font-semibold  rounded-md w-[100px] shadow-md  hover:scale-105 duration-300 cursor-pointer" onClick={() => closeModal()}>close</button>
                                                            {isRequest ? (
                                                                <button
                                                                    className="bg-black  text-white py-2 font-semibold  rounded-md w-[100px] shadow-md  hover:scale-105 duration-300 cursor-not-allowed"

                                                                >
                                                                    <Loader bg="transparent" />
                                                                </button>

                                                            ) : (
                                                                <button
                                                                    className="bg-black  text-white py-2 font-semibold  rounded-md w-[100px] shadow-md  hover:scale-105 duration-300 cursor-pointer"
                                                                    onClick={async () => {
                                                                        setSub(true);
                                                                        await handleAddressUpdate();
                                                                        
                                                                    }}
                                                                >
                                                                    Save
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="grid md:grid-cols-2 gap-3 py-3">
                                                       <div className=" py-2">
                                                        <p className="py-1 font-bold">City</p>
                                                    <input
                                                            type="text"
                                                            placeholder="City"
                                                            defaultValue={profile?.address?.city||""}
                                                            value={selectedAddress?.city||""}
                                            
                                                            className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                                            name=""
                                                            id=""
                                                            onChange={(e) => onChange("city", e.target.value)}
                                                        />
                                                       </div>
                                                       <div className="py-2">
                                                       <p className="py-1 font-bold">State</p>
                                                       <input
                                                            type="text"
                                                            placeholder="State"
                                                            defaultValue={profile?.address?.state||""}
                                                            value={selectedAddress?.state||""}
                                                            className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                                            name=""
                                                            id=""
                                                            onChange={(e) => onChange("state", e.target.value)}
                                                        />
                                                       </div>
                                                      
                                                   <div className="py-2">
                                                    <p className="py-1 font-bold">ZipCode</p>
                                                    <input
                                                            type="text"
                                                            placeholder="Zip"
                                                            defaultValue={profile?.address?.zipCode||""}
                                                            value={selectedAddress?.zipCode||""}
                                                            className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                                            name=""
                                                            id=""
                                                            onChange={(e) => onChange("zipCode", e.target.value)}
                                                        />
                                                   </div>
                                                     <div className="py-2">
                                                        <p className="py-1 font-bold"> Street Number</p>
                                                        <input
                                                            type="text"
                                                            placeholder="Street Number"
                                                            defaultValue={profile?.address?.streetNumber||""}
                                                            value={selectedAddress?.streetNumber||""}
                                                            className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                                            name=""
                                                            id=""
                                                            onChange={(e) => onChange("streetNumber", e.target.value)}
                                                        />
                                                     </div>
                                                      <div className="py-2">
                                                        <p className="py-1 font-bold">Street Name</p>
                                                        <input
                                                            type="text"
                                                            placeholder="Street Name"
                                                            defaultValue={profile?.address?.streetName || ""}
                                                            value={selectedAddress?.streetName||""}
                                                            className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                                            name=""
                                                            id=""
                                                            onChange={(e) => onChange("streetName", e.target.value)}
                                                        />
                                                      </div>
                                                     <div className="py-2">
                                                        <p className="py-1 font-bold"> APT OR UNIT NUMBER (Optional)</p>
                                                        <input
                                                            type="text"
                                                            placeholder="Type Apt or Unit Here"
                                                            defaultValue={profile?.address?.aptUnit || ""}
                                                            value={selectedAddress?.aptUnit||""}
                                                            className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                                            name=""
                                                            id=""
                                                            onChange={(e) => onChange("aptUnit", e.target.value)}
                                                        />
                                                     </div>
                                                    </div>
                                                    <div className="text-sm flex justify-end gap-3 pt-4 ">
                                                        <div className="text-sm flex justify-end gap-3 pt-4 ">
                                                            <button className="bg-white  py-2 font-semibold  rounded-md w-[100px] shadow-md  hover:scale-105 duration-300 cursor-pointer" onClick={() =>   setSub(true)}>close</button>
                                                            {isRequest ? (
                                                                <button
                                                                    className="bg-black  text-white py-2 font-semibold  rounded-md w-[100px] shadow-md  hover:scale-105 duration-300 cursor-not-allowed"

                                                                >
                                                                    <Loader bg="transparent" />
                                                                </button>

                                                            ) : (
                                                                <button
                                                                    className="bg-black  text-white py-2 font-semibold  rounded-md w-[100px] shadow-md  hover:scale-105 duration-300 cursor-pointer"
                                                                    onClick={async () => {
                                                                        await handleAddressUpdate();
                                                                        setSub(true);
                                                                        closeModal();
                                                                    }}
                                                                >
                                                                    Save
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
