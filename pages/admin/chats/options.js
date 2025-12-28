import LiveChatOptionSettingModal from "@/components/Modals/LiveChatOptionSettingModal/LiveChatOptionSettingModal";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { createAppInfoSetting, updateAppInfoSetting } from "@/utils/instance";
import React, { useState } from "react";
import Swal from "sweetalert2";

const commonStyle = {
  label: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
  input: "px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-gray-400",
  textarea: "px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400",
};

const options = () => {
  const [isRequest, setIsRequest] = useState(false);
  const { Settings } = useFullStage();
  const [liveChatOptionSettingModalOpen, setLiveChatOptionSettingModalOpen] =
    useState(false);

  const [appInfoSetting, setAppInfoSetting] = Settings.AppInfoSetting;
  const handleSave = async () => {
    try {
      if (!appInfoSetting?.liveChatInfo?.title)
        return Swal.fire({
          title: "Error!",
          text: "Please enter live chat info!",
          icon: "error",
        });
      setIsRequest(true);
      const res = appInfoSetting?._id
        ? await updateAppInfoSetting(appInfoSetting?._id, {
            liveChatInfo: appInfoSetting?.liveChatInfo,
          })
        : await createAppInfoSetting(appInfoSetting);
      setIsRequest(false);
      if (res?.data) {
        Swal.fire({
          title: "Success",
          text: "Live chat info saved!",
          icon: "success",
        });
      }
    } catch (error) {
      setIsRequest(false);
      Swal.fire({
        title: "Error!",
        text: "Failed to saved! please try to update app info",
        icon: "error",
      });

      //
    }
  };
  return (
    <Contentlayout>
      <div className="my-6 space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Live Chat Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure your live chat interface and messages</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                  <span className="text-white text-lg">💬</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chat Information</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Configure chat display text</p>
                </div>
              </div>
              <button
                onClick={() => setLiveChatOptionSettingModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Chat Options
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            {/* Heading Title */}
            <div>
              <label className={commonStyle.label}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Heading Title
                </span>
              </label>
              <input
                type="text"
                value={appInfoSetting?.liveChatInfo?.title || ""}
                onChange={(e) =>
                  setAppInfoSetting((prev) => {
                    const liveChatInfo = prev?.liveChatInfo || {};
                    return {
                      ...prev,
                      liveChatInfo: {
                        ...liveChatInfo,
                        title: e.target.value,
                      },
                    };
                  })
                }
                className={commonStyle.input}
                placeholder="Ex: Hi there ! 🙌🏼"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className={commonStyle.label}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Subtitle
                </span>
              </label>
              <input
                type="text"
                value={appInfoSetting?.liveChatInfo?.subTitle || ""}
                onChange={(e) =>
                  setAppInfoSetting((prev) => {
                    const liveChatInfo = prev?.liveChatInfo || {};
                    return {
                      ...prev,
                      liveChatInfo: {
                        ...liveChatInfo,
                        subTitle: e.target.value,
                      },
                    };
                  })
                }
                className={commonStyle.input}
                placeholder="Ex: We make it simple to connect with us. Feel free to ask us anything or share your feedback."
              />
            </div>

            {/* Paragraph 1 */}
            <div>
              <label className={commonStyle.label}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Paragraph 1
                </span>
              </label>
              <textarea
                value={appInfoSetting?.liveChatInfo?.p1 || ""}
                onChange={(e) => {
                  setAppInfoSetting((prev) => {
                    const liveChatInfo = prev?.liveChatInfo || {};
                    return {
                      ...prev,
                      liveChatInfo: {
                        ...liveChatInfo,
                        p1: e.target.value,
                      },
                    };
                  });
                }}
                className={commonStyle.textarea}
                placeholder="Ex: We are away at the moment"
                rows={4}
              />
            </div>

            {/* Paragraph 2 */}
            <div>
              <label className={commonStyle.label}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Paragraph 2
                </span>
              </label>
              <textarea
                value={appInfoSetting?.liveChatInfo?.p2 || ""}
                onChange={(e) => {
                  setAppInfoSetting((prev) => {
                    const liveChatInfo = prev?.liveChatInfo || {};
                    return {
                      ...prev,
                      liveChatInfo: {
                        ...liveChatInfo,
                        p2: e.target.value,
                      },
                    };
                  });
                }}
                className={commonStyle.textarea}
                placeholder="Ex: We will be back online at 09:00 AM"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <button
            onClick={handleSave}
            disabled={isRequest}
            className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl ${
              isRequest 
                ? "opacity-60 cursor-not-allowed" 
                : "hover:from-teal-600 hover:to-cyan-700 transform hover:scale-105"
            }`}
          >
            {isRequest ? (
              <>
                <div className="relative w-5 h-5">
                  <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                Saving Changes...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Chat Settings
              </>
            )}
          </button>
        </div>
      </div>

      <LiveChatOptionSettingModal
        isOpen={liveChatOptionSettingModalOpen}
        setIsOpen={setLiveChatOptionSettingModalOpen}
      />
    </Contentlayout>
  );
};

export default options;
