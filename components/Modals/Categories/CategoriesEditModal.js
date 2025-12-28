import CommonImageUpload from "@/components/CommonImageUpload/CommonImageUpload";
import CommonMobileImageUpload from "@/components/CommonMobileImageUpload/CommonMobileImageUpload";

import Switch from "@/components/Shared/Switch";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { genSlug, isValidArray } from "@/utils/func";
import { getCategoriesSlugCheck, updateCategory } from "@/utils/instance";

import { Dialog, Transition } from "@headlessui/react";
import _ from "lodash";
import { Fragment, useCallback, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function CategoriesEditModal({
  isOpen,
  oldSlug,
  setIsOpen,
  categories,
  setCategories,
  setUpdateData,
  updateData,
}) {
  const [isSlugRequest, setIsSlugRequest] = useState(false);
  const [categoriesUpdateRequest, setUpdateCategoriesRequest] = useState(false);
  const changeHandler = (key, e) => {
    if (key == "name") {
      setUpdateData({
        ...(updateData || {}),
        [key]: e?.target?.value,
        slug: genSlug(e?.target?.value),
      });
    } else {
      setUpdateData({ ...(updateData || {}), [key]: e?.target?.value });
    }
  };

  const onChangeValue = (key, value) => {
    setUpdateData({ ...(updateData || {}), [key]: value });
  };

  function handleDebounceFn(inputValue) {
    setIsSlugRequest(true);
    getCategoriesSlugCheck(inputValue)
      .then((res) => {
        if (res?.data?.success) {
          ToastEmitter("success", res?.data.message);
        } else {
          ToastEmitter("error", res?.data.message);
        }
        setIsSlugRequest(false);
      })
      .catch((err) => {
        setIsSlugRequest(false);
        ToastEmitter("error", err.response?.data?.message);
      });
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function handleSlugCheck() {
    handleDebounceFn(updateData?.slug);
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleUpdateCategory = async () => {
    setUpdateCategoriesRequest(true);
    await updateCategory(oldSlug, updateData)
      .then((res) => {
        setUpdateCategoriesRequest(false);
        if (res?.data?.success) {
          setUpdateData({});
          setCategories((prev) => {
            const data = isValidArray(prev.data)
              ? prev.data.map((item) => {
                  if (item?._id == res?.data?.data?._id) {
                    return {
                      ...item,
                      ...(res.data?.data || {}),
                    };
                  } else {
                    return item;
                  }
                })
              : [res?.data?.data];
            return {
              ...prev,
              data: data,
            };
          });
          Swal.fire({
            title: "Success",
            text: res?.data.message,
            icon: "success",
          });
          closeModal();
        } else {
          Swal.fire({
            title: "Error!",
            text: res?.data?.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {
        setUpdateCategoriesRequest(false);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message,
          icon: "error",
        });
      });
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
                      <h2 className="py-3 my-2 text-xl font-bold">
                        Categories Edit
                      </h2>
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>
                  <div>
                    <div className="my-4">
                      <div className="md:flex items-center gap-2">
                        <div className="w-full md:w-[50%]">
                          <label
                            htmlFor="title"
                            className="block text-sm mb-2 dark:text-white capitalize"
                          >
                            {" "}
                            <p className="py-2 font-bold text-lg">Name</p>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              onChange={(e) => changeHandler("name", e)}
                              value={updateData?.name || ""}
                              className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-[50%] flex gap-2 items-center">
                          <div className=" w-[75%]">
                            <label
                              htmlFor="slug"
                              className="block text-sm mb-2 dark:text-white capitalize"
                            >
                              {" "}
                              <p className="py-2 font-bold text-lg">Slug</p>
                            </label>
                            <div className="relative ">
                              <input
                                type="text"
                                name="slug"
                                onChange={(e) => changeHandler("slug", e)}
                                value={updateData?.slug || ""}
                                className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                required
                              />
                            </div>
                          </div>
                          <div className=" w-[25%]">
                            <label
                              htmlFor="slug"
                              className="block text-sm mb-2 dark:text-white capitalize"
                            >
                              {" "}
                              <p className="py-2 font-bold text-lg opacity-0">
                                .
                              </p>
                            </label>
                            <div className="relative ">
                              {isSlugRequest ? (
                                <button className=" hover:bg-blue-500 ms-auto bg-blue-400 text-white rounded-md  py-2 px-3 block w-full border-gray-200  text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70 cursor-not-allowed">
                                  <Loader
                                    width="w-5"
                                    height="h-5"
                                    bg="transparent"
                                  />
                                </button>
                              ) : (
                                <button
                                  className=" hover:bg-blue-500 ms-auto bg-blue-400 text-white rounded-md  py-2 px-3 block w-full border-gray-200  text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                  onClick={() => handleSlugCheck()}
                                >
                                  Check
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="my-4">
                      <p className="py-2 font-bold text-lg">Description</p>
                      <textarea
                        name="description"
                        onChange={(e) => changeHandler("description", e)}
                        value={updateData?.description || ""}
                        className="py-2 px-3 block w-full border-gray-200 h-[200px] rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                        required
                      />
                    </div>
                    <div className="my-4 ">
                      <p className="py-2 font-bold text-lg">
                        Home Page Display
                      </p>
                      <div className="flex items-start gap-2 justify-between flex-wrap">
                        <Switch
                          checked={updateData && updateData["homePage.display"]}
                          defaultChecked={updateData?.homePage?.display}
                          onChange={onChangeValue}
                          keys={"homePage.display"}
                          name={"Display in home"}
                        />
                        {updateData && updateData["homePage.display"] && (
                          <div>
                            Order Num{" "}
                            <input
                              min={0}
                              value={updateData && updateData["homePage.order"]}
                              type="number"
                              onChange={(e) =>
                                changeHandler("homePage.order", e)
                              }
                            />
                          </div>
                        )}
                      </div>
                      {updateData && updateData["homePage.display"] && (
                        <div>
                          <div className="my-1 relative" />
                          <CommonImageUpload
                            key={updateData["imageUrl"]}
                            onImageChanged={(e) => {
                              updateData["imageUrl"] = e;
                            }}
                            defaultImage={updateData["imageUrl"]}
                          />
                        </div>
                      )}
                    </div>

                    {updateData && updateData["homePage.display"] && (
                      <div>
                        <div>
                          <p>Mobile Image</p>
                          {
                            <div>
                              <div className="my-1 relative" />
                              <CommonMobileImageUpload
                                keys={"mobileImage"}
                                setData={setUpdateData}
                                src={updateData["mobileImage"] || ""}
                              />
                            </div>
                          }
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200  w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    {categoriesUpdateRequest ? (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"
                      >
                        <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[130px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                        onClick={async () => {
                          await handleUpdateCategory();
                        }}
                      >
                        Update
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
