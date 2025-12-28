import PopupImageUpload from "@/components/PopupSettings/PopupImageUpload";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { createPopup } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";

export default function PopupCreateModal({ isOpen, setIsOpen, type }) {
  const { Popup } = useFullStage();
  const [singlePopupDetails, setSinglePopupDetails] = Popup.PopupSingleDetails;

  const [isRequestPopup, setIsRequestPopup] = useState(false);
  const [initPaginate, setInitPaginate] = useState(false);
  const [isSlugRequest, setIsSlugRequest] = useState(false);
  const [popups, setPopups] = Popup.Popups;

  const closeModal = () => {
    setIsOpen(false);
  };
  const changeHandler = (key, e) => {
      setSinglePopupDetails({ ...singlePopupDetails, [key]: e.target.value });
  };
  const changeHandlerBoolean = (key, e) => {
    setSinglePopupDetails({ ...singlePopupDetails, [key]: e.target.checked });

  };
  const handleUpdate = async () => {
    return true;
  };

  const EndRef = useRef(null);
  const scrollToBottom = () => {
    EndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCreatePopup = async () => {
    setIsRequestPopup(true);

    await createPopup(singlePopupDetails).then((res) => {
      if (res?.data?.success) {
        setSinglePopupDetails({ isActive: true });
        setPopups((prev) => {
          return {
            ...prev,
            data: [res?.data?.data, ...prev?.data]
          };
        });
        closeModal();
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
      setIsRequestPopup(false);
    }).catch(err => {
      setIsRequestPopup(false);
      Swal.fire({
        title: "Error!",
        text: err?.response?.data?.message,
        icon: "error"
      });
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
                   
                    </div>

                    {/* images */}
                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">Images</h2>
                      </div>
                      <div className="div my-3">
                        <PopupImageUpload handleFileSave={handleUpdate} singlePopupDetails={singlePopupDetails} setSinglePopupDetails={setSinglePopupDetails} />
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
                        await handleCreatePopup();
                       
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
