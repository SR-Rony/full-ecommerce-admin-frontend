import { useFullStage } from "@/hooks/useFullStage";
import { uploadToCDNsingleFile } from "@/utils/func";
import { useState } from "react";

const PopupImageUpload = ({ handleFileSave }) => {
  const { Popup } = useFullStage();
  const [singlePopupDetails, setSinglePopupDetails] = Popup.PopupSingleDetails;
  const [isRequest, setIsRequest] = useState(false);
  const [saveRequest, setSaveRequest] = useState(false);
  const handleFileSubmit = async (event) => {

    if (event?.target?.files?.length) {
      try {
        // Use the utility function to upload the file to Cloudinary
        setIsRequest(true);
        const imageUrl = await uploadToCDNsingleFile(event.target.files[0]);
        if (imageUrl) {
          setSinglePopupDetails((prev) => {
            const image = { ...prev?.image || {}, imgUrl: imageUrl };
            return {
              ...prev,
              image: image
            };
          });
        }
        setIsRequest(false);
      } catch (error) {
        setIsRequest(false);
        console.error('Error:', error.message);
      }
    } else {
      setIsRequest(false);
      console.error('No file selected');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full">

        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to select upload</span> </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (Recommended: 1280x750px)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileSubmit} />
        </label>
      </div>

      {singlePopupDetails?.image?.imgUrl && <img src={singlePopupDetails?.image?.imgUrl} className='w-full h-[450px]  cursor-pointer mb-4' alt='' />}

      <div className="mt-4">
        <h2 className="text-[16px] py-2 capitalize font-bold">Image Redirect Url</h2>
        <input type="text" name="" className="py-2 px-4 w-full" id=""value={singlePopupDetails?.image?.redirectUrl} onChange={(e) => setSinglePopupDetails((prev) => {
          return {
            ...prev,
            image: {
              ...prev?.image,
              redirectUrl: e.target.value
            }
          };
        })} />
      </div>
    </div>
  );
};

export default PopupImageUpload;
