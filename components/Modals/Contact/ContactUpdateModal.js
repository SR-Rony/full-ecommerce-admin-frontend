import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { createAppInfoSetting, updateAppInfoSetting } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function ContactUpdateModal({ isOpen, setIsOpen }) {
  const [isRequest, setIsRequest] = useState(false);
  const { Settings } = useFullStage();
  const [appInfoSetting, setAppInfoSetting] = Settings.AppInfoSetting;
  const [updateData, setUpdateData] = useState({});
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleInputChange = (field, value) => {
    console.log(value, "testing");
    setAppInfoSetting((prevData) => ({ ...prevData, [field]: value }));
    setUpdateData((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSave = async () => {
    try {
      setIsRequest(true);
      const res = appInfoSetting?._id
        ? await updateAppInfoSetting(appInfoSetting?._id, {
            contactToAdmin: appInfoSetting?.contactToAdmin,
          })
        : await createAppInfoSetting(appInfoSetting);
      setIsRequest(false);
      if (res?.data) {
        Swal.fire({
          title: "Success",
          text: "Contact Setting saved!",
          icon: "success",
        });
      }
    } catch (error) {
      setIsRequest(false);
      Swal.fire({
        title: "Error!",
        text: "Contact Setting save failed! please try to update app info",
        icon: "error",
      });

      //
    }
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
                <Dialog.Panel className="w-full max-w-4xl  transform rounded-2xl bg-white  p-4  lg:p-8 text-left align-middle shadow-xl transition-all rounded-md lg:px-[40px]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize "
                    >
                      Contact Update
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>

                  <div className=" mx-auto  mt-6 bg-white ">
                    <div className="flex flex-wrap gap-4">
                      <div className="w-full ">
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Contact Email
                          </label>
                          <input
                            type="text"
                            value={appInfoSetting?.contactToAdmin?.email}
                            onChange={(e) =>
                              setAppInfoSetting((prev) => {
                                const contactToAdmin =
                                  prev?.contactToAdmin || {};
                                return {
                                  ...prev,
                                  contactToAdmin: {
                                    ...contactToAdmin,
                                    email: e.target.value,
                                  },
                                };
                              })
                            }
                            className="p-2 border rounded w-full"
                            placeholder="Contact Email"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Description
                          </label>
                          <textarea
                            defaultValue={
                              appInfoSetting?.contactToAdmin?.description
                            }
                            value={
                              appInfoSetting?.contactToAdmin?.description || ""
                            }
                            onChange={(e) => {
                              setAppInfoSetting((prev) => {
                                const contactToAdmin =
                                  prev?.contactToAdmin || {};
                                console.log(contactToAdmin);
                                return {
                                  ...prev,
                                  contactToAdmin: {
                                    ...contactToAdmin,
                                    description: e.target.value,
                                  },
                                };
                              });
                            }}
                            className="p-2 border rounded w-full"
                            placeholder="Description"
                            rows={5}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {isRequest ? (
                      <button className="cursor-not-allowed mt-4 p-2 bg-blue-500 text-white rounded  block w-[20%] mx-auto rounded-md ">
                        <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                      </button>
                    ) : (
                      <button
                        onClick={handleSave}
                        className=" p-2 bg-blue-500 text-white rounded-sm font-semibold cursor-pointer block w-[20%]  rounded-md"
                      >
                        Save
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
