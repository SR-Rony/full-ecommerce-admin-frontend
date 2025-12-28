import Switch from "@/components/LabTestedProduct/Switch";

import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import {
  createLabTestedProduct,
  getProducts
} from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import _ from "lodash";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";
import ProductImageUpload from "../../LabTestedProduct/ProductImageUpload";
import SelectProducts from "./SelectProducts";
import ProductsSelectInput from "@/components/Coupons/ProductsSelectInput";

export default function ProductCreateModal({ isOpen,defaultProducts,setDefaultProducts, setIsOpen, type, productData, setProductData, setProducts }) {

const [isRequestProduct, setIsRequestProduct] = useState(false);
const [options,setOptions] = useState([]);
 
  const closeModal = () => {
    setProductData({ isActive: true });
    setDefaultProducts([]);
    setIsOpen(false);
  };

  const changeHandlerBoolean = (key, e) => {

    setProductData({ ...productData, [key]: e.target.checked });

  };

  const handleUpdate = async () => {
    return true;
  };

  const HandleProductsSelect = (selectedOptions) => {
    if (selectedOptions.length) {
      const pdItem = selectedOptions.map((itm) => (itm?.id || itm?._id));
      setProductData((prev) => {
        return {
          ...prev,
          products: pdItem,
        };
      });
      setDefaultProducts(selectedOptions);
    } else {
      setDefaultProducts([]);
      setProductData((prev) => {
        return {
          ...prev,
          products: [],
        };
      });
    }
  };

  const EndRef = useRef(null);
  const scrollToBottom = () => {
    EndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCreateProduct = async () => {
    if(!productData?.title){
      return    Swal.fire({
        title: "Error!",
        text: 'Title is required!',
        icon: "error"
      });
    }
    if(!productData?.advertisedAt){
      return   Swal.fire({
        title: "Error!",
        text: 'Advertised At is required!',
        icon: "error"
      });
    }
    if(!productData?.testedAt){
      return    Swal.fire({
        title: "Error!",
        text: 'Tested At is required!',
        icon: "error"
      });
    }
    if(!productData?.reportLink){
   return   Swal.fire({
        title: "Error!",
        text: 'Image is required!',
        icon: "error"
      });
    }
    let data = {
      ...productData
    };

    setIsRequestProduct(true);

    try {
      const res = await createLabTestedProduct(data);

      setIsRequestProduct(false);
      if (res?.data?.success) {

        setProductData({});
        setDefaultProducts([]);
        delete productData.products;
        setProducts((prev) => {
          const data = isValidArray(prev.data)
            ? [{ ...res.data.data }, ...prev.data]
            : [{ ...res.data.data }];
          return {
            ...prev,
            data: data,
          };
        });

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
      console.log(error);
      setIsRequestProduct(false);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message,
        icon: "error"
      });

    }
  };

  const changeHandler = (keys, e) => {
    if(keys =='site'){
      setProductData((prev) => {
        return {
          ...prev,
          [keys]: e.target.value
        };
      });
      fetchProducts({site:{value:e.target.value}});
    }else{
      setProductData((prev) => {
        return {
          ...prev,
          [keys]: e.target.value
        };
      });
    }

  };

  const fetchProducts = async (val = {}) => {
    try {

        const res = await getProducts({ site: { value: productData?.site }, ...val });
        console.log('res data',res.data);
        if (Array.isArray(res?.data?.data) && res.data?.data.length > 0) {
          const pdItem = res.data?.data?.filter((e)=>!e.bundle?.isLimited).map(itm => {
            return {
              id: itm?._id,
              label: itm?.title,
              value: itm?._id
            };
          });
          setOptions(pdItem);
        
      }
    } catch (error) { 
      console.log("ERROR",error);
     }

  };

  useEffect(()=>{
    fetchProducts();
  },[]);
  function handleDebounceFn(val) {
    fetchProducts(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 500), []);

  function handleInputChange(value) {
    const val = { q: value,site:{value:productData?.site} };
    debounceFn(val);
  };
  // console.log(productData,'productData');
  console.log("options",options)
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
                      Lab Tested Product Create
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>
                  <div>
                    <div>
                      <div>
                        <div className="mt-6">
                          <h2 className="text-[16px] capitalize font-bold">Site</h2>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex ml-3">
                          <div className="flex items-center me-4">
                            <input id="hammer-radio" checked={productData?.site == 'hb'} type="radio" value="hb" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onChange={(e) => {
                              changeHandler("site", e);
                            }} />
                            <label htmlFor="hammer-radio" className="ms-2 text-sm font-medium text-gray-900">Hammer & Bell</label>
                          </div>

                          <div className="flex items-center me-4">
                            <input checked={productData?.site == 'auctropin'} id="auctropin-radio" type="radio" value="auctropin" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onChange={(e) => {
                              changeHandler("site", e);
                            }} />
                            <label htmlFor="auctropin-radio" className="ms-2 text-sm font-medium text-gray-900">Auctropin</label>
                          </div>
                        </div>

                      </div>
                      <div className="mt-4">
                          <div className="mt-2 w-full md:w-[100%]">
                            <label htmlFor="Products" className="block text-sm mb-2 dark:text-white capitalize">Select Products</label>
                            <div className="relative">
                              <ProductsSelectInput
                                keys="selectedFreeBuyProductOptions"
                                searchOptions={options || []}
                                isSingleProduct={true}
                                selectedOptions={[defaultProducts].filter(
                                  (e) => e
                                )[0]}
                                onChange={(keys, e) => {
                                  HandleProductsSelect([e]);
                                }}
                                onInputChange={handleInputChange}
                              />
                              {/* <SelectProducts
                                options={options}
                                defaultOptions={defaultProducts}
                                onChange={HandleProductsSelect}
                                handleInputChange={handleInputChange}
                              /> */}
                            </div>
                          </div>

                        </div>

                    </div>

                  </div>

                  <div className="mt-4">

                    <div className="">
                      <div className="mt-2 w-full ">
                        <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize"> Title*</label>
                        <div className="relative">
                          <input type="text" name="title" onChange={(e) => changeHandler("title", e)} value={productData?.title || ""}
                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                            required />
                        </div>
                      </div>

                      <div className="">
                        <div className="mt-2 w-full ">
                          <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize"> Advertised At*</label>
                          <div className="relative">
                            <input type="text" name="advertisedAt" onChange={(e) => changeHandler("advertisedAt", e)} value={productData?.advertisedAt || ""}
                              className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required />
                          </div>
                        </div>
                        <div className="mt-2 w-full ">
                          <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize"> Tested At*</label>
                          <div className="relative">
                            <input type="text" name="testedAt" onChange={(e) => changeHandler("testedAt", e)} value={productData?.testedAt || ""}
                              className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required />
                          </div>
                        </div>

                        {/* <div className="mt-2 w-full ">
                          <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize"> Report Link*</label>
                          <div className="relative">
                            <input type="text" name="reportLink" onChange={(e) => changeHandler("reportLink", e)} value={productData?.reportLink || ""}
                              className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required />
                          </div>
                        </div> */}
                        <div className="mt-2 w-full ">
                          <div>
                            <div className="mt-6">
                              <h2 className="text-[16px] capitalize font-bold">
                                Background Image
                              </h2>
                            </div>
                            <div className="div my-3">
                              <ProductImageUpload
                                handleFileSave={handleUpdate}
                                productData={{bgImage: productData?.reportLink}}
                                setProductData={(func)=>{
                                  const res = func({});
                                  setProductData((e)=>({...e,reportLink: res.bgImage}));
                                }}
                              />
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* product functionality */}

                    <div>
                      <div>
                        <div className="mt-6">
                          <h2 className="text-[16px] capitalize font-bold">Product Action</h2>
                        </div>
                      </div>
                      {/* product functionality */}
                      <div className="mt-4">
                        <div>
                          <Switch keys="isActive" defaultChecked={productData?.isActive} name={`Active`} onChange={changeHandlerBoolean} checked={productData?.isActive} > </Switch>
                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    {isRequestProduct ? (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"
                      >
                        <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                        onClick={async () => {
                          await handleCreateProduct();
                        }}
                      >
                        {type}
                      </button>
                    )}
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
