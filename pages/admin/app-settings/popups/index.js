/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import ColorPicker from "@/components/ColorPicker/colorPicker";
import PopupImageUpload from "@/components/PopupSettings/PopupImageUpload";
import Switch from "@/components/PopupSettings/Switch";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { getPopupDetails, popupDetailsUpdate } from "@/utils/instance";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const Popup = () => {
  const { Popup } = useFullStage();
  const [singlePopupDetails, setSinglePopupDetails] = Popup.PopupSingleDetails;
  const [isRequestPopup, setIsRequestPopup] = useState(false);
  const fetchPopup = async () => {
    try {
      setIsRequestPopup(true);
      const res = await getPopupDetails();
      setSinglePopupDetails(res?.data?.data);
      setIsRequestPopup(false);
    } catch (error) {
      //console.log(error);
      setIsRequestPopup(false);
      //
    }
  };

  useEffect(() => {
    fetchPopup();
  }, []);
  const changeHandler = (key, e) => {
    setSinglePopupDetails({ ...singlePopupDetails, [key]: e.target.value });
  };
  const changeHandlerBoolean = (key, e) => {
    setSinglePopupDetails({ ...singlePopupDetails, [key]: e.target.checked });
  };
  const changeHandlerButtonBoolean = (keys, e) => {
    setSinglePopupDetails({
      ...singlePopupDetails,
      button: {
        ...(singlePopupDetails?.button || {}),
        [keys]: e.target.checked,
      },
    });
  };
  const changeHandlerButtonText = (keys, e) => {
    setSinglePopupDetails({
      ...singlePopupDetails,
      button: {
        ...(singlePopupDetails?.button || {}),
        [keys]: e.target.value,
      },
    });
  };
  const changeHandlerButtonColor = (keys, e) => {
    setSinglePopupDetails({
      ...singlePopupDetails,
      button: {
        ...(singlePopupDetails?.button || {}),
        [keys]: e.hex,
      },
    });
  };
  const handleUpdate = async () => {
    return true;
  };

  const EndRef = useRef(null);
  const scrollToBottom = () => {
    EndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpdatePopup = async () => {
    setIsRequestPopup(true);
    await popupDetailsUpdate(singlePopupDetails)
      .then((res) => {
        console.log(res.data, "error");
        if (res?.data?.success) {
          setSinglePopupDetails(res?.data?.data);
          Swal.fire({
            title: "Success",
            text: res?.data?.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: res?.data?.message,
            icon: "error",
          });
        }
        setIsRequestPopup(false);
      })
      .catch((err) => {
        console.log(err, "error");
        setIsRequestPopup(false);
        Swal.fire({
          title: "Error!",
          text: err?.response?.data?.message,
          icon: "error",
        });
      });
  };

  const handleChange = (keys, e) => {
    setSinglePopupDetails({ ...singlePopupDetails, [keys]: e.hex });
  };

  // console.log(singlePopupDetails);
  return (
    <Contentlayout>
      <div className="w-full my-4">
        <>
          <div className="w-full transform pb-6 rounded-2xl bg-white  p-3 lg:p-6 text-left align-middle shadow-xl transition-all rounded-md ">
            <div className="flex item-center justify-between">
              <p
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 capitalize"
              >
                Popup Details
              </p>
            </div>

            <div className="mt-2 lg:border rounded-md py-4 lg:px-4 ">
              {/* title and slug */}
              <div>
                <Switch
                  keys="isHideTitleDescription"
                  defaultChecked={singlePopupDetails?.isHideTitleDescription}
                  name={`Hide Title And Description`}
                  onChange={changeHandlerBoolean}
                  checked={singlePopupDetails?.isHideTitleDescription}
                >
                  {" "}
                </Switch>
              </div>
              {singlePopupDetails?.isHideTitleDescription == false && (
                <>
                  <div className="">
                    <div className="flex items-center gap-4">
                      <div className="mt-4 w-full md:w-[50%]">
                        <label
                          htmlFor="title"
                          className="block text-sm mb-2 dark:text-white capitalize"
                        >
                          {" "}
                          Title (Maximum 70 character)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="title"
                            onChange={(e) => changeHandler("title", e)}
                            value={singlePopupDetails?.title || ""}
                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4 w-full md:w-[50%]">
                        <label
                          htmlFor="title"
                          className="block text-sm mb-2 dark:text-white capitalize"
                        >
                          Title Text Color Pick
                        </label>
                        <div className="relative">
                          <ColorPicker
                            color={singlePopupDetails?.titleTextColor || ""}
                            keys="titleTextColor"
                            handleChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="mt-4 w-full md:w-[50%]">
                        <label
                          htmlFor="title"
                          className="block text-sm mb-2 dark:text-white capitalize"
                        >
                          {" "}
                          Description (Maximum 150 character)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="description"
                            onChange={(e) => changeHandler("description", e)}
                            value={singlePopupDetails?.description || ""}
                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4 w-full md:w-[50%]">
                        <label
                          htmlFor="title"
                          className="block text-sm mb-2 dark:text-white capitalize"
                        >
                          Description Text Color Pick
                        </label>
                        <div className="relative">
                          <ColorPicker
                            color={
                              singlePopupDetails?.descriptionTextColor || ""
                            }
                            keys="descriptionTextColor"
                            handleChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="mt-4 w-full md:w-[100%]">
                        <label
                          htmlFor="title"
                          className="block text-sm mb-2 dark:text-white capitalize"
                        >
                          Background Title Description Color Pick
                        </label>
                        <div className="relative">
                          <ColorPicker
                            color={
                              singlePopupDetails?.backgroundColorOfTitleDescriptionButton ||
                              ""
                            }
                            keys="backgroundColorOfTitleDescriptionButton"
                            handleChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="border py-4 px-4 mt-6">
                      <label
                        htmlFor="button"
                        className="block text-sm mb-2 dark:text-white capitalize font-bold"
                      >
                        Button Design
                      </label>
                      <div className="mt-4">
                        {/* checked, onChange, key */}
                        <div>
                          <Switch
                            keys="checked"
                            defaultChecked={singlePopupDetails?.button?.checked}
                            name={`Button Active`}
                            onChange={changeHandlerButtonBoolean}
                            checked={singlePopupDetails?.button?.checked}
                          >
                            {" "}
                          </Switch>
                        </div>

                        {singlePopupDetails?.button?.checked && (
                          <>
                            <div className="flex items-center gap-4">
                              <div className="mt-4 w-full md:w-[50%]">
                                <div className="w-full">
                                  <label
                                    htmlFor="text"
                                    className="block text-sm mb-2 dark:text-white capitalize"
                                  >
                                    Button Text
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      name="text"
                                      onChange={(e) =>
                                        changeHandlerButtonText("text", e)
                                      }
                                      value={
                                        singlePopupDetails?.button?.text || ""
                                      }
                                      className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="mt-4 w-full">
                                  <label
                                    htmlFor="text"
                                    className="block text-sm mb-2 dark:text-white capitalize"
                                  >
                                    Button Redirect Url
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      name="text"
                                      onChange={(e) =>
                                        changeHandlerButtonText(
                                          "redirectUrl",
                                          e
                                        )
                                      }
                                      value={
                                        singlePopupDetails?.button
                                          ?.redirectUrl || ""
                                      }
                                      className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 w-full md:w-[25%]">
                                <label
                                  htmlFor="text"
                                  className="block text-sm mb-2 dark:text-white capitalize"
                                >
                                  Button Text Color
                                </label>
                                <div className="relative">
                                  <ColorPicker
                                    color={
                                      singlePopupDetails?.button?.textColor ||
                                      ""
                                    }
                                    keys="textColor"
                                    handleChange={changeHandlerButtonColor}
                                  />
                                </div>
                              </div>
                              <div className="mt-4 w-full md:w-[25%]">
                                <label
                                  htmlFor="text"
                                  className="block text-sm mb-2 dark:text-white capitalize"
                                >
                                  Button Background Color
                                </label>
                                <div className="relative">
                                  <ColorPicker
                                    color={
                                      singlePopupDetails?.button
                                        ?.backgroundColor || ""
                                    }
                                    keys="backgroundColor"
                                    handleChange={changeHandlerButtonColor}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* images */}
              <div>
                <div className="mt-6">
                  <h2 className="text-[16px] capitalize font-bold">Image</h2>
                </div>
                <div className="div my-3">
                  <PopupImageUpload
                    handleFileSave={handleUpdate}
                    singlePopupDetails={singlePopupDetails}
                  />
                </div>
              </div>

              <div>
                <div className="mt-6">
                  <h2 className="text-[16px] capitalize font-bold">
                    Popup Action
                  </h2>
                </div>
              </div>

              <div>
                <div className="mt-4">
                  {/* checked, onChange, key */}
                  <div>
                    <Switch
                      keys="isActive"
                      defaultChecked={singlePopupDetails?.isActive}
                      name={`Is Active`}
                      onChange={changeHandlerBoolean}
                      checked={singlePopupDetails?.isActive}
                    >
                      {" "}
                    </Switch>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-4">
              {isRequestPopup ? (
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
                    await handleUpdatePopup();
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </>
      </div>
    </Contentlayout>
  );
};

export default Popup;
