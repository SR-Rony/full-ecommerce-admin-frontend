import Switch from '@/components/Products/Switch';
import Loader from '@/shared/Loader/Loader';
import { uploadFileRemove, uploadToCDN } from '@/utils/func';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { CiCircleRemove } from "react-icons/ci";
import { IoIosCloseCircle } from 'react-icons/io';

export default function ProductFeaturedPhotoUpdateModal({ isOpen, setProductData, productData,type, setIsOpen,handleFileSave }) {
  const closeModal = () => {
    setIsOpen(false);
  };
  const [isRequest, setIsRequest] = useState(false);
  const [saveRequest, setSaveRequest] = useState(false);
  const handleFileSubmit = async (event) => {
    if (event?.target?.files?.length) {
      try {
        // Use the utility function to upload the file to Cloudinary
        setIsRequest(true);
        const images = await uploadToCDN(event.target.files, setProductData);
        setIsRequest(false);
      } catch (error) {
        console.error('Error:', error.message);
      }
    } else {
      console.error('No file selected');
    }
  };
  const handleImageFeatured = (match, e) => {
    if (Array.isArray(productData?.images) && productData?.images?.length) {
      setProductData((prev) => {
        return {
          ...prev,
          images: prev?.images.map((item) =>{
              if(item?.imgUrl ==match){
                return {
                  ...item,
                  isFeatured:e.target.checked
                };
              }else{
                return {
                  ...item,
                  isFeatured:e.target.checked==true?false:item.isFeatured
                };
              }
          })
        };
      });
    }
  };

  const handleRemove = async(removeVal) =>{
    if (Array.isArray(productData?.images) && productData?.images?.length) {
      setProductData((prev) => {
        return {
          ...prev,
          images:prev.images.filter(itm =>itm?.imgUrl !==removeVal)
        };
      });
    }
    if(removeVal){
      const data = await uploadFileRemove(removeVal);
      if (data?.success) {
        handleProcess();
      }
    }
  };
  const handleProcess =async () =>{
 
    setSaveRequest(true);
  await handleFileSave();
    setSaveRequest(false);
    closeModal();
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
            <div className="fixed inset-0 bg-black/25 " />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto z-[2=] ">
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all rounded-md">
               
                  <div className="flex item-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Change Product Images
                  </Dialog.Title>
                  <button><IoIosCloseCircle size={18} onClick={() =>closeModal()}/></button>
                 </div>
                  <div className="mt-2">

                    <div className="flex items-center justify-center w-full">

                      <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                          </svg>
                          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to select upload</span> </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (Recommanded: 640x640px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileSubmit} />
                      </label>
                    </div>
                    <div className='grid grid-cols-3 gap-4 my-4 justify-items-center'>
                      {
                        Array.isArray(productData?.images) && productData?.images?.length > 0 && productData?.images.map((img, i) => (

                          <div key={i} className='relative w-full mb-8'>
                            <img src={img?.imgUrl} className='w-full h-[150px] rounded-md cursor-pointer' alt='' />
                            {/* keys,name,defaultChecked, checked, onChange, */}
                           <div className='absolute top-1 right-1 bg-red-500 rounded-full cursor-pointer'onClick={() => handleRemove(img?.imgUrl)}>
                          <CiCircleRemove size={22} color="white" />

                           </div>
                           <Switch name="Featured" keys={img?.imgUrl} defaultChecked={img?.isFeatured} checked={img?.isFeatured} onChange={ handleImageFeatured} />
                          </div>
                        ))
                      }
                      {
                        isRequest && <Loader bg="transparent" />
                      }
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  { saveRequest?   <button
                      type="button"
                      className="inline-flex cursor-not-allowed justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                    
                    >
                      <Loader bg="transparent"/>
                    </button>: <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                      onClick={handleProcess}
                    >
                     { type=="Done"?"Done":"Photo Update"}
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
