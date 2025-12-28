/* eslint-disable react/no-unescaped-entities */
import ProductsSelectInput from "@/components/Coupons/ProductsSelectInput";
import Switch from "@/components/Shared/Switch";
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { createCoupon } from "@/utils/instance";

import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function CouponsCreateModal({ isOpen, setIsOpen, onInputChange, coupons, setCoupons, setUpdateData, updateData }) {
    const [couponsCreateRequest, setCreateCouponsRequest] = useState(false);
    const changeHandler = (keys, e) => {
        setUpdateData({ ...updateData, [keys]: e?.target?.value });
    };

    const onChangeValue = (key, value) => {

        setUpdateData({ ...updateData || {}, [key]: value });

    };
    const onChangeAllBundleValue = (value) => {

        setUpdateData({
            ...updateData || {},
            excludeAllBundleProducts: value,
            excludeAll3PackTriplePlayBundleProducts: value,
            excludeAll10PackMegaBundleProducts: value,
        });

    };
    const onChangeAllCycleValue = (value) => {

        setUpdateData({
            ...updateData || {},
            excludeAllCycleProducts: value,
        });

    };
    const onChangeBundle3CountValue = (value) => {

        setUpdateData({
            ...updateData || {},
            excludeAllBundleProducts: value === true && updateData?.excludeAll10PackMegaBundleProducts === true,
            excludeAll3PackTriplePlayBundleProducts: value,
        });

    };
    const onChangeBundle10CountValue = (value) => {

        setUpdateData({
            ...updateData || {},
            excludeAllBundleProducts: value === true && updateData?.excludeAll3PackTriplePlayBundleProducts === true,
            excludeAll10PackMegaBundleProducts: value,
        });

    };

    const selectProductOptions = (keys, value) => {
        setUpdateData({ ...updateData, [keys]: value });

    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleSave = async () => {

        if(!updateData?.code){
           return Swal.fire({
                title: "Error!",
                text: `Please write a code!`,
                icon: "error"
            });
        }
        if(!updateData?.value){
           return Swal.fire({
                title: "Error!",
                text: `Please write a Amount Percentage!`,
                icon: "error"
            });
        }
        if (updateData && !updateData.hasOwnProperty('enableAllProducts')) {
            updateData['enableAllProducts'] = true;

        }
        const excludeProducts = isValidArray(updateData?.selectedExcludeProductOptions) ? updateData?.selectedExcludeProductOptions.map(item => item?.value) : [];

        const products = (isValidArray(updateData?.selectedOptions) ? updateData?.selectedOptions.map(item => item?.value) : []);

        if (updateData?.enableAllProducts === false) {
            updateData.excludeProducts = [];
            updateData.products = products;
        }
        if (updateData?.enableAllProducts === true) {
            updateData.products = [];
            updateData.excludeProducts = excludeProducts;
        }

        if (updateData?.enableAllProducts == false && !isValidArray(products)) {
            if (!products?.length) return Swal.fire({
                title: "Error!",
                text: `Please Select a enable products!`,
                icon: "error"
            });

        }

        delete updateData._id;
        setCreateCouponsRequest(true);
        await createCoupon({ ...updateData }).then((res) => {
            setCreateCouponsRequest(false);
            if (res?.data?.success) {
                setUpdateData({});
                setCoupons((prev) => {
                    const data = isValidArray(prev.data) ? [res.data.data, ...prev.data] : [res?.data?.data];
                    return {
                        ...prev,
                        data: data
                    };
                });
                Swal.fire({
                    title: "Success!",
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

        }).catch(err => {
            setCreateCouponsRequest(false);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message,
                icon: "error"
            });
        });
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => closeModal()}>
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
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-y-auto  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all rounded-md pb-10">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className=" font-medium leading-6 text-gray-900 capitalize"
                                        >
                                            <h2 className="py-3 my-2 text-xl font-bold">Coupons Create</h2>
                                        </Dialog.Title>
                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>
                                    <div>

                                        <div className="my-4">

                                            <div className="md:flex items-center gap-2">
                                                <div className="w-full md:w-[50%]">
                                                    <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize">  <p className="py-2 font-bold ">Code</p></label>
                                                    <div className="relative">
                                                        <input type="text" name="code" onChange={(e) => changeHandler("code", e)} value={updateData?.code || ""}
                                                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                                            required />
                                                    </div>
                                                </div>
                                                <div className="w-full md:w-[50%] flex gap-2 items-center">

                                                    <div className=" w-[100%]">
                                                        <label htmlFor="amount" className="block text-sm mb-2 dark:text-white capitalize">   <p className="py-2 font-bold ">Amount Percentage</p></label>
                                                        <div className="relative">
                                                            <input type="number" min={0} name="amount" onChange={(e) => changeHandler("value", e)} value={updateData?.value || ""}
                                                                className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                                                required />
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className=" w-[100%]">
                                                <label htmlFor="quantity" className="block text-sm mb-2 dark:text-white capitalize">   <p className="py-2 font-bold ">Quantity <br /> <small>(Leave empty for unlimited)</small></p></label>
                                                <div className="relative ">
                                                    <input type="number" min={0} name="quantity" onChange={(e) => changeHandler("quantity", e)} value={updateData?.quantity || ""}
                                                        className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                                        required />
                                                </div>

                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="w-full ">
                                                <p className="py-2 font-bold ">Expiry Date <br />
                                                    <small>
                                                        (Leave empty if forever)
                                                    </small>
                                                </p>
                                                <div className="flex items-center gap-2 justify-between">
                                                    <input type="date" name="expiry" onChange={(e) => changeHandler("expiry", e)} value={updateData?.expiry ? moment(updateData?.expiry).format('YYYY-MM-DD') : ""}
                                                        className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="">

                                            <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">

                                                <div className="w-full md:w-[100%]">

                                                    <div className="flex items-center gap-2 justify-between">
                                                        <Switch spanClassList="font-bold" checked={updateData && updateData?.enableAllProducts} defaultChecked={true} onChange={onChangeValue} keys={"enableAllProducts"} name={"Enable All Products"} />

                                                    </div>
                                                </div>

                                            </div>
                                            {updateData?.enableAllProducts == false && <div className="">
                                                <small className="py-2 font-bold mb-1">Select Products to Enable Coupon</small>
                                                <ProductsSelectInput keys="selectedOptions" searchOptions={(updateData?.searchOptions || []).filter((e)=>e.label.endsWith(updateData?.site?.toUpperCase()))} selectedOptions={updateData?.selectedOptions || []} onChange={selectProductOptions} onInputChange={onInputChange} />
                                            </div>}
                                            {updateData?.enableAllProducts === true && <div className="">
                                                <small className="py-2 mb-1 font-bold ">Select Exclude Products (optional)</small>
                                                <ProductsSelectInput keys="selectedExcludeProductOptions" searchOptions={(updateData?.searchOptions || []).filter((e)=>e.label.endsWith(updateData?.site?.toUpperCase()))} selectedOptions={updateData?.selectedExcludeProductOptions || []} onChange={selectProductOptions} onInputChange={onInputChange} />
                                            </div>}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                    <p className="font-bold text-gray-400 pb-1">
                                    Note:Automatically remove or add all bundle and cycle products matching from the "Select Exclude Products" list.
                                        </p>
                                        <>
                                            <div className="flex items-center mb-1">
                                                <input
                                                    id="default-checkbox"
                                                    type="checkbox"

                                                    checked={updateData?.excludeAllCycleProducts}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 "
                                                    onChange={(e) => {
                                                        onChangeAllCycleValue(e.target.checked);
                                                    }}
                                                />
                                                <label
                                                    htmlFor="default-checkbox"
                                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Exclude all cycle products
                                                </label>
                                            </div>
                                            <div className="flex items-center mb-1">
                                                <input

                                                    type="checkbox"
                                                    checked={updateData?.excludeAllBundleProducts}

                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 "
                                                    onChange={(e) => onChangeAllBundleValue(e.target.checked)}

                                                />
                                                <label
                                                    htmlFor="checked-checkbox"
                                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Exclude all bundle products
                                                </label>
                                            </div>
                                            <div className="flex items-center mb-1">
                                                <input

                                                    type="checkbox"

                                                    checked={updateData?.excludeAll3PackTriplePlayBundleProducts}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 "
                                                    onChange={(e) => {
                                                        onChangeBundle3CountValue(e.target.checked);
                                                    }}
                                                />
                                                <label
                                                    htmlFor="checked-checkbox"
                                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Exclude all 3 pack Triple play bundle products
                                                </label>
                                            </div>
                                            <div className="flex items-center mb-1">
                                                <input

                                                    type="checkbox"

                                                    checked={updateData?.excludeAll10PackMegaBundleProducts}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 "
                                                    onChange={(e) => {
                                                        onChangeBundle10CountValue(e.target.checked);
                                                    }}
                                                />
                                                <label
                                                    htmlFor="checked-checkbox"
                                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Exclude all 10 pack Mega bundle products
                                                </label>
                                            </div>
                                        </>

                                    </div>

                                    <div>
                                        <div>
                                            <div className="mt-6">
                                                <h2 className="text-[16px] capitalize font-bold">Site</h2>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex ml-3">
                                                <div className="flex items-center me-4">
                                                    <input id="hammer-radio" checked={updateData?.site == 'hb'} type="radio" value="hb" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onChange={(e) => {
                                                        changeHandler("site", e);
                                                    }} />
                                                    <label htmlFor="hammer-radio" className="ms-2 text-sm font-medium text-gray-900">Hammer & Bell</label>
                                                </div>

                                                <div className="flex items-center me-4">
                                                    <input checked={updateData?.site == 'auctropin'} id="auctropin-radio" type="radio" value="auctropin" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onChange={(e) => {
                                                        changeHandler("site", e);
                                                    }} />
                                                    <label htmlFor="auctropin-radio" className="ms-2 text-sm font-medium text-gray-900">Auctropin</label>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="mt-8 flex flex-wrap ml-[3px] gap-4 items-center justify-between">

                                        <div className="w-full md:w-[100%]">

                                            <div className="flex items-center gap-2 justify-between">
                                                <Switch spanClassList="font-bold" checked={updateData && updateData?.isActive} defaultChecked={true} onChange={onChangeValue} keys={"isActive"} name={"isActive"} />

                                            </div>
                                        </div>

                                    </div>
                                    <div className="mt-10 flex justify-end gap-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200  w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        {couponsCreateRequest ? <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                                        >
                                            <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                                        </button> : <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[130px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                                            onClick={async () => {
                                                await handleSave();

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
