
import Loader from "@/shared/Loader/Loader";
import { uploadFileRemove, uploadToCDN } from "@/utils/func";
import { useState } from "react";
import { CiCircleRemove } from "react-icons/ci";

const ProductImageUpload = ({ setProductData, productData, handleFileSave }) => {
  const [imageRemoves, setImageRemoves] = useState([]);
  const [isRequest, setIsRequest] = useState(false);
  const [saveRequest, setSaveRequest] = useState(false);
  const handleFileSubmit = async (event) => {

    if (event?.target?.files?.length) {
      try {
        // Use the utility function to upload the file to Cloudinary
        setIsRequest(true);
        const images = await uploadToCDN(event.target.files);
        setProductData((prev) => {
          return {
            ...prev,
            bgImage: images[0],
          };
        });
        setIsRequest(false);
      } catch (error) {
        console.error('Error:', error.message);
      }
    } else {
      console.error('No file selected');
    }
  };

  const handleRemove = async (removeVal) => {

    setProductData((prev) => {
      return {
        ...prev,
        bgImage: null
      };
    });
    if (removeVal) {
      const data = await uploadFileRemove(removeVal);
      if (data?.success) {
        handleProcess();
      }
    }
  };
  const handleProcess = async () => {
    setSaveRequest(true);
    await handleFileSave();
    setSaveRequest(false);

  };
  return (
    <div>
      <div className="flex items-center justify-center w-full h-full">

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
         productData?.bgImage &&  <div k className='relative w-full mb-8'>
         <img src={productData?.bgImage} className='w-full h-[150px] rounded-md cursor-pointer' alt='' />
         {/* keys,name,defaultChecked, checked, onChange, */}
         <div className='absolute top-1 right-1 bg-red-500 rounded-full cursor-pointer' onClick={() => handleRemove(productData?.bgImage)}>
           <CiCircleRemove size={22} color="white" />

         </div>
       
       </div>
        }
        {
          isRequest && <Loader bg="transparent" />
        }
      </div>
    </div>
  );
};

export default ProductImageUpload;
