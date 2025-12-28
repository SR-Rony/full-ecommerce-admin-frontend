import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { isValidArray } from "@/utils/func";
import { deleteShippingSetting } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function DeleteShippingSettingModal({
  isOpen,
  setIsOpen,
  shippingUpdateData,
  setShippingUpdateData,
  shippingSettings,
  setShippingSettings,
}) {
  const [isRequest, setIsRequest] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleShippingSetting = async () => {
    try {
      setIsRequest(true);
      const res = await deleteShippingSetting(shippingUpdateData?._id);
      setIsRequest(false);

      if (res?.data?.success) {
        const filterData =
          isValidArray(shippingSettings?.data) &&
          shippingSettings.data?.filter(
            (item) => item?._id !== shippingUpdateData?._id
          );
        setShippingSettings({ ...shippingSettings, data: filterData });
        ToastEmitter("success", res?.data?.message);
        closeModal();
      } else {
        ToastEmitter("error", res?.data?.message);
      }
    } catch (error) {
      setIsRequest(false);

      ToastEmitter("error", error?.response?.data?.message);
    }
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-[200px]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Delete Shipping Option
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-red-600 mb-4">
                      Are you sure you want to delete this shipping option?
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 w-[80px focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    {isRequest ? (
                      <button
                        type="button"
                         className="inline-flex gap-1 justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"
                      >
                        <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                        onClick={async () => {
                          await handleShippingSetting();
                        }}
                      >
                        Delete
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
