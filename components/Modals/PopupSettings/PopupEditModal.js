import CategoriesSelect from "@/components/PopupSettings/CategoriesSelect";
import PopupProductsSelect from "@/components/PopupSettings/PopupProductsSelect";
import PopupSelectInput from "@/components/PopupSettings/PopupSelectInput";
import Switch from "@/components/PopupSettings/Switch";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { genSlug, isValidArray } from "@/utils/func";
import { getPopupsSlugCheck, updatePopup } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import _ from 'lodash';
import { useRouter } from "next/router";
import { Fragment, useCallback, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";
import PopupImageUpload from "../../PopupSettings/PopupImageUpload";

export default function PopupEditModal({ isOpen, setIsOpen, type }) {
const router = useRouter();
  const {Popup} = useFullStage();
  const [singlePopupDetails, setSinglePopupDetails] = Popup.PopupSingleDetails;
  const [isRequestPopup, setIsRequestPopup] = useState(false);
  const [initPaginate, setInitPaginate] = useState(false);
  const [isSlugRequest, setIsSlugRequest] = useState(false);
   const [popups, setPopups] = Popup.Popups;

  const closeModal = () => {
    setIsOpen(false);
  };
  const changeHandler = (key, e) => {
    if (key == 'title') {
      setSinglePopupDetails({
        ...singlePopupDetails,
        [key]: e.target.value,
        slug: genSlug(e.target.value)
      });
    } else {
      setSinglePopupDetails({ ...singlePopupDetails, [key]: e.target.value });
    }

  };
  const changeHandlerBoolean = (key, e) => {
    setSinglePopupDetails({ ...singlePopupDetails, [key]: e.target.checked });

  };
  const handleUpdate = async () => {
    return true;
  };

  const HandleProductSelects = (selectedOptions) => {
    
    if (selectedOptions.length) {
      const productItems = selectedOptions.map(itm => itm?.id);
      setSinglePopupDetails((prev) => {
        return {
          ...prev,
          products: productItems,
          selectedProductsOptions:selectedOptions
        };
      });
     
    }else{
      setSinglePopupDetails((prev) => {
        return {
          ...prev,
          products:[],
          selectedProductsOptions:[]
        };
      });
    }
  };
  const HandleCategoriesSelect = (selectedOptions) => {
    if (selectedOptions.length) {
      const catItems = selectedOptions.map(itm => itm?.id);
      setSinglePopupDetails((prev) => {
        return {
          ...prev,
          categories: catItems,
          selectedCategoriesOptions:selectedOptions
        };
      });
    }else{
      setSinglePopupDetails((prev) => {
        return {
          ...prev,
          categories:[],
          selectedCategoriesOptions:[]
        };
      });
    }
  };
 
  const EndRef = useRef(null);
  const scrollToBottom = () => {
    EndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function handleDebounceFn(inputValue) {
    setIsSlugRequest(true);
    getPopupsSlugCheck(inputValue).then((res) => {
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

  function handleChange() {
    debounceFn(singlePopupDetails?.slug);
  };

  const handleUpdatePopup = async () => {
    setIsRequestPopup(true);
    const products= isValidArray(singlePopupDetails?.products)?singlePopupDetails?.products.map(itm =>itm?._id||itm):[];
    const categories= isValidArray(singlePopupDetails?.categories)?singlePopupDetails?.categories.map(itm =>itm?._id||itm):[];
    const data = {
      ...singlePopupDetails,
      products:products,
      categories:categories
    };
   
    await updatePopup({data,slug:singlePopupDetails?.oldSlug || singlePopupDetails?.slug}).then((res) => {
      if (res?.data?.success) {
     
        handleSingleClick(res?.data?.data);
        if (Array.isArray(popups?.data) && popups?.data.length > 0) {
          setPopups((prev) => {
            const updatedData = prev.data.map(item => {
              if(item?._id == singlePopupDetails?._id){
                return {
                  ...item,
                  ...singlePopupDetails,
                  oldSlug:item?.slug,
                };
              }else{
                return {
                  ...item
                };
              }
            });
       
            return {
              ...prev,
              data: updatedData
            };
          });
        }
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
      setIsRequestPopup(false);
    }).catch(err => {
      setIsRequestPopup(false);
      Swal.fire({
        title: "Error!",
        text:err.response?.data?.message,
        icon: "error"
      });
      
    });
  };

  const optionsGen = (arr) => {
    return isValidArray(arr) && arr.length > 0 ? arr.map(itm => {
      return {
        id: itm?._id,
        label: itm?.title || itm?.name,
        value: itm?.slug
      };
    }) : [];
  };

  const handleSingleClick =(popup) =>{
    popup['oldSlug'] = popup?.oldSlug||popup?.slug;
    popup['selectedProductsOptions'] = optionsGen(popup?.products);
    popup['selectedCategoriesOptions'] = optionsGen(popup?.categories);
    setSinglePopupDetails(popup);
    return popup;
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-y-auto pb-6 rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all rounded-md ">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Popup {type}
                    </Dialog.Title>
                    <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                  </div>

                  <div className="mt-2">
                    {/* title and slug */}
                    <div className="md:flex items-center gap-2">
                      <div className="mt-2 w-full md:w-[50%]">
                        <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize"> Title</label>
                        <div className="relative">
                          <input type="text" name="title" onChange={(e) => changeHandler("title", e)} value={singlePopupDetails?.title || ""}
                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                            required />
                        </div>
                      </div>
                      <div className="mt-2  w-full md:w-[50%] flex gap-2 items-center">
                        <div className=" w-[70%]">
                          <label htmlFor="slug" className="block text-sm mb-2 dark:text-white capitalize"> Slug</label>
                          <div className="relative">
                            <input type="text" name="slug" onChange={(e) => changeHandler("slug", e)} value={singlePopupDetails?.slug || ""}
                              className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required />
                          </div>

                        </div>
                        <div className="w-[30%]">
                          {isSlugRequest ? <button className="block bg-blue-400 text-white rounded-sm text-center w-full h-full py-2 mt-7 cursor-not-allowed"><Loader width="w-5" height="h-5" bg="transparent" /></button> : <button className="block bg-blue-400 text-white rounded-sm text-center w-full h-full py-2 mt-7" onClick={() => handleChange()}>Check</button>}
                        </div>
                      </div>
                    </div>
                 
                    <div className="mt-4">
                      <div className="mt-2 w-full md:w-[100%]">
                        <label htmlFor="Products" className="block text-sm mb-2 dark:text-white capitalize">Select Products</label>
                        <div className="relative">
                          <PopupProductsSelect  onChange={HandleProductSelects} />
                        </div>
                      </div>

                    </div>
                    <div className="mt-4">
                      <div className="mt-2 w-full md:w-[100%]">
                        <label htmlFor="categories" className="block text-sm mb-2 dark:text-white capitalize">Select Categories</label>
                        <div className="relative">
                          <CategoriesSelect  onChange={HandleCategoriesSelect} />
                        </div>
                      </div>

                    </div>

                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">Details</h2>
                      </div>
                      <div className="mt-4">
                        <div className="mt-2">
                          <label htmlFor="description" className="block text-sm mb-2 dark:text-white capitalize">Description</label>
                          <div className="relative">
                            <textarea type="text" name="description" onChange={(e) => changeHandler("details.description", e)} value={singlePopupDetails['details.description'] || singlePopupDetails?.details?.description || ""}
                              className="h-[200px]	py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required />
                          </div>
                        </div>
                      </div>
                   
                    </div>

                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">SEO</h2>
                      </div>
                        {/* keywords */}
                      <div className=" mt-4">
                        <div className="mt-2  w-full md:w-[100%]">
                          <label htmlFor="seo.keywords" className="block text-sm mb-2 dark:text-white capitalize">Keywords</label>
                          <div className="relative">
                              <PopupSelectInput placeholder="Write seo keywords" keys={'seo.keywords'} value={singlePopupDetails['seo.keywords'] || singlePopupDetails?.seo?.keywords || []} singlePopupDetails={singlePopupDetails}/>
                          </div>
                        </div>
                        <div className="mt-4  w-full md:w-[100%]">
                          <label htmlFor="seo.metaDescription" className="block text-sm mb-2 dark:text-white capitalize">Meta Description</label>
                          <div className="relative">
                            <textarea type="text" name="seo.metaDescription" onChange={(e) => changeHandler("seo.metaDescription", e)} value={singlePopupDetails['seo.metaDescription'] || singlePopupDetails?.seo?.metaDescription}
                              className="py-2 px-3 block h-[100px] w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required />
                          </div>
                        </div>

                      </div>
                    </div>
                    {/* images */}
                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">Images</h2>
                      </div>
                      <div className="div my-3">
                        <PopupImageUpload handleFileSave={handleUpdate} singlePopupDetails={singlePopupDetails}  />
                      </div>
                    </div>

                    {/* popup functionality */}
                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">Popup Action</h2>
                      </div>
                    </div>

                    <div>
                      <div className="mt-4">
                        {/* checked, onChange, key */}
                        <div>
                          <Switch keys="isActive" defaultChecked={type == 'create' ? true : singlePopupDetails?.isActive} name={`Popup Active`} onChange={changeHandlerBoolean} checked={singlePopupDetails?.isActive} > </Switch>
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
                    {isRequestPopup ? <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                    >
                      <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                    </button> : <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                      onClick={async () => {
                        await handleUpdatePopup();
                     
                      }}
                    >
                      {type}
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
