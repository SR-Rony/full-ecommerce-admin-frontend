import ColorPicker from '@/components/ColorPicker/colorPicker';
import AppInfoEditor from '@/components/MarkEditor/AppInfoEditor';
import { useFullStage } from '@/hooks/useFullStage';
import Loader from '@/shared/Loader/Loader';
import Contentlayout from '@/shared/layout-components/layout/content-layout';
import { CDNupload } from '@/utils/func';
import { createAppInfoSetting, updateAppInfoSetting } from '@/utils/instance';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const commonStyle = {
  section_title: "text-lg font-bold text-gray-900 dark:text-white",
  label: "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",
  input: "px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
  textarea: "px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none",
  choose_file_button:
    "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg",
  card: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
  cardHeader: "px-6 py-4 border-b border-gray-200 dark:border-gray-600",
  cardBody: "p-6 space-y-5",
};

const AppInfo = () => {
  const { Settings, isLoading, error } = useFullStage();
  const [appInfoSetting, setAppInfoSetting] = useState(null);
  const [isRequest, setIsRequest] = useState(false);
  const [isLogoRequest, setIsLogoRequest] = useState(false);
  const [isBannerImageUploadRequestDesktopLogo,setIsBannerApp1ImageUploadRequestDesktopLogo] = useState(false)
   const [isBannerImageUploadRequestMobileLogo,setIsBannerApp1ImageUploadRequestMobileLogo] = useState(false)
  const [isBannerImageUploadRequest, setIsBannerImageUploadRequest] = useState(false);
  const [isBannerApp1ImageUploadRequest, setIsBannerApp1ImageUploadRequest] = useState(false);
  const [isBannerApp1CTAImageUploadRequest, setIsBannerApp1CTAImageUploadRequest] = useState(false);
  const [isBannerApp2ImageUploadRequest, setIsBannerApp2ImageUploadRequest] = useState(false);
  const [isBannerApp2CTAImageUploadRequest, setIsBannerApp2CTAImageUploadRequest] = useState(false);
  const [isBannerApp3ImageUploadRequest, setIsBannerApp3ImageUploadRequest] = useState(false);
  const [isBannerApp3CTAImageUploadRequest, setIsBannerApp3CTAImageUploadRequest] = useState(false);
  // State declaration would typically be at the top of the component
  const [isRegistrationAllowed, setIsRegistrationAllowed] = useState(false);
  const [isRegistrationAdminApprovalRequired, setIsRegistrationAdminApprovalRequired] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize registration fields
  const [registrationFields, setRegistrationFields] = useState([
    { key: "username", isActive: true, isRequired: false },
    { key: "userSince", isActive: true, isRequired: false },
    { key: "link", isActive: true, isRequired: false },
    { key: "howHeardAbout", isActive: true, isRequired: false },
    { key: "industryExperienceYears", isActive: true, isRequired: false }
  ]);

  // Initialize data
  useEffect(() => {
    if (Settings?.AppInfoSetting) {
      const setting = Settings.AppInfoSetting[0] || {};
      setAppInfoSetting(setting);

      // Update registration fields with saved values
      if (setting.registration) {
        setRegistrationFields(prev =>
          prev.map(field => ({
            ...field,
            isActive: setting.registration[field.key]?.isActive !== false,
            isRequired: setting.registration[field.key]?.isRequired || false
          }))
        );
        setIsRegistrationAllowed(setting?.registration?.isRegistrationAllowed || false);
        setIsRegistrationAdminApprovalRequired(setting?.registration?.isRegistrationAdminApprovalRequired || false);
      }
    }
  }, [Settings]);

  // Handler functions
  const handleInputChange = (field, value) => {
    // Handle nested objects (e.g., freebieInfo.title)
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setAppInfoSetting(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value
        }
      }));
    } else {
      setAppInfoSetting(prev => ({ ...prev, [field]: value }));
    }
  };

  const topBannerInputChange = (field, value) => {
    setAppInfoSetting(prev => ({
      ...prev,
      topBanner: { ...(prev.topBanner || {}), [field]: value }
    }));
  };

  const headerBannerInputChange = (field, value) => {
    setAppInfoSetting(prev => ({
      ...prev,
      headerBanner: { ...(prev.headerBanner || {}), [field]: value }
    }));
  };

  const headerBannerAppInputChange = (appNum, field, value) => {
    setAppInfoSetting(prev => ({
      ...prev,
      headerBanner: {
        ...(prev.headerBanner || {}),
        [`app${appNum}`]: {
          ...(prev.headerBanner?.[`app${appNum}`] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleImageUpload = async (e, setLoading, fieldPath) => {
    try {
      setLoading(true);
      const uploadImage = await CDNupload(e.target.files);

      const pathParts = fieldPath.split('.');
      setAppInfoSetting(prev => {
        const newState = { ...prev };
        let current = newState;

        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          current[part] = current[part] || {};
          current = current[part];
        }

        current[pathParts[pathParts.length - 1]] = uploadImage;
        return newState;
      });
    } catch (error) {
      Swal.fire({
        title: "Upload Failed",
        text: error.message || "Failed to upload image",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationFieldChange = (fieldKey, field, value) => {
    setRegistrationFields(prev =>
      prev.map(fieldItem =>
        fieldItem.key === fieldKey
          ? { ...fieldItem, [field]: value }
          : fieldItem
      )
    );
  };

  const handleColorChange = (key, color) => {
    setAppInfoSetting(prev => ({
      ...prev,
      warningTexts: {
        ...(prev.warningTexts || {}),
        [key]: color.hex,
      },
    }));
  };

  const handleLiveChatInfoChange = (field, value) => {
    setAppInfoSetting(prev => ({
      ...prev,
      liveChatInfo: {
        ...(prev.liveChatInfo || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setIsRequest(true);

      // Prepare registration object
      const registration = {};
      registrationFields.forEach(({ key, isActive, isRequired }) => {
        registration[key] = {
          isActive: isActive !== false,
          isRequired: isRequired || false
        };
      });
      registration.isRegistrationAllowed = isRegistrationAllowed || false;
      registration.isRegistrationAdminApprovalRequired = isRegistrationAdminApprovalRequired || false;

      const payload = {
        ...appInfoSetting,
        registration
      };

      const res = appInfoSetting?._id
        ? await updateAppInfoSetting(appInfoSetting._id, payload)
        : await createAppInfoSetting(payload);

      if (res?.data?.success) {
        setAppInfoSetting(res.data.data);
        Swal.fire({
          title: "Success",
          text: res.data.message,
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to save settings",
        icon: "error",
      });
    } finally {
      setIsRequest(false);
    }
  };

  // Render image upload section
  const renderImageUpload = (label, imageUrl, loading, onChange, id, defaultImage) => (
    <div className="space-y-3">
      <label className={commonStyle.label}>{label}</label>
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-700">
            <Loader bg="transparent" />
          </div>
        ) : (
          <div className="relative group">
            <img
              src={imageUrl || defaultImage}
              alt={label}
              className="w-24 h-24 border-2 border-gray-200 dark:border-gray-600 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all"></div>
          </div>
        )}
        <label className="inline-block" htmlFor={id}>
          <input
            type="file"
            id={id}
            accept="image/*"
            onChange={onChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById(id).click()}
            className={commonStyle.choose_file_button}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose Image
          </button>
        </label>
      </div>
    </div>
  );

  // Render app section
  const renderAppSection = (appNum) => {
    const appData = appInfoSetting?.headerBanner?.[`app${appNum}`] || {};
    const defaultImage = "https://via.placeholder.com/100";
    const appColors = [
      { gradient: 'from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-750', icon: 'from-purple-500 to-pink-500' },
      { gradient: 'from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-750', icon: 'from-blue-500 to-cyan-500' },
      { gradient: 'from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-750', icon: 'from-orange-500 to-amber-500' }
    ];
    const color = appColors[appNum - 1];

    return (
      <div className={commonStyle.card}>
        <div className={`${commonStyle.cardHeader} bg-gradient-to-r ${color.gradient}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-r ${color.icon} rounded-xl shadow-lg`}>
              <span className="text-white text-lg">📱</span>
            </div>
            <div>
              <h2 className={commonStyle.section_title}>App {appNum}</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Configure app banner settings</p>
            </div>
          </div>
        </div>
        <div className={commonStyle.cardBody}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={commonStyle.label}>Text</label>
              <input
                type="text"
                value={appData.text || ""}
                onChange={(e) => headerBannerAppInputChange(appNum, "text", e.target.value)}
                className={commonStyle.input}
                placeholder="Enter app text"
              />
            </div>
            <div>
              <label className={commonStyle.label}>Redirect URL</label>
              <input
                type="text"
                value={appData.redirectUrl || ""}
                onChange={(e) => headerBannerAppInputChange(appNum, "redirectUrl", e.target.value)}
                className={commonStyle.input}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              {renderImageUpload(
                "App Image",
                appData.image,
                isBannerImageUploadRequest,
                (e) => handleImageUpload(e, setIsBannerImageUploadRequest, `headerBanner.app${appNum}.image`),
                `app${appNum}_image`,
                defaultImage
              )}
            </div>
            <div>
              {renderImageUpload(
                "CTA Button Image",
                appData.ctaImage,
                isBannerApp1CTAImageUploadRequest,
                (e) => handleImageUpload(e, setIsBannerApp1CTAImageUploadRequest, `headerBanner.app${appNum}.ctaImage`),
                `app${appNum}_cta`,
                defaultImage
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading || !appInfoSetting) {
    return (
      <Contentlayout>
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 border-r-purple-500"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-b-cyan-500 border-l-pink-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-pulse">⚙️</span>
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading app settings...</p>
        </div>
      </Contentlayout>
    );
  }

  if (error) {
    return (
      <Contentlayout>
        <div className={commonStyle.card}>
          <div className="p-8 text-center">
            <div className="mb-4">
              <span className="text-6xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Settings</h3>
            <p className="text-red-500 dark:text-red-400 mb-4">
              {error.message || "Unknown error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </Contentlayout>
    );
  }

  return (
    <Contentlayout>
      <div className="space-y-6 my-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">App Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure your application settings and preferences</p>
        </div>

        {/* App Info Section */}
        <div className={commonStyle.card}>
          <div className={`${commonStyle.cardHeader} bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-750`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <span className="text-white text-lg">⚙️</span>
              </div>
              <div>
                <h2 className={commonStyle.section_title}>Basic Information</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">General app configuration</p>
              </div>
            </div>
          </div>
          <div className={commonStyle.cardBody}>
            {renderImageUpload(
              "Site Logo",
              appInfoSetting?.siteLogo,
              isLogoRequest,
              (e) => handleImageUpload(e, setIsLogoRequest, "siteLogo"),
              "site_logo",
              "https://i.ibb.co/wLm1D8Q/logo.webp"
            )}

            <div>
              <label className={commonStyle.label}>Site Name</label>
              <input
                type="text"
                value={appInfoSetting?.siteName || ""}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                className={commonStyle.input}
                placeholder="Enter site name"
              />
            </div>

            <div>
              <label className={commonStyle.label}>Site Tagline</label>
              <input
                type="text"
                value={appInfoSetting?.siteTagline || ""}
                onChange={(e) => handleInputChange("siteTagline", e.target.value)}
                className={commonStyle.input}
                placeholder="Enter site tagline"
              />
            </div>

            <div>
              <label className={commonStyle.label}>Footer Tagline</label>
              <input
                type="text"
                value={appInfoSetting?.footerTagLine || ""}
                onChange={(e) => handleInputChange("footerTagLine", e.target.value)}
                className={commonStyle.input}
                placeholder="Enter footer tagline"
              />
            </div>
          </div>
        </div>

        {/* Contact Admin Section */}
        <div className={commonStyle.card}>
          <div className={`${commonStyle.cardHeader} bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-750`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <span className="text-white text-lg">📧</span>
              </div>
              <div>
                <h2 className={commonStyle.section_title}>Contact Information</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Admin contact details</p>
              </div>
            </div>
          </div>
          <div className={commonStyle.cardBody}>
            <div>
              <label className={commonStyle.label}>Email</label>
              <input
                type="email"
                value={appInfoSetting?.contactToAdmin?.email || ""}
                onChange={(e) =>
                  setAppInfoSetting(prev => ({
                    ...prev,
                    contactToAdmin: {
                      ...(prev.contactToAdmin || {}),
                      email: e.target.value
                    }
                  }))
                }
                className={commonStyle.input}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className={commonStyle.label}>Description</label>
              <textarea
                value={appInfoSetting?.contactToAdmin?.description || ""}
                onChange={(e) =>
                  setAppInfoSetting(prev => ({
                    ...prev,
                    contactToAdmin: {
                      ...(prev.contactToAdmin || {}),
                      description: e.target.value
                    }
                  }))
                }
                className={commonStyle.textarea}
                rows={3}
                placeholder="Enter contact description"
              />
            </div>
          </div>
        </div>

        {/* Top Banner Section */}
        <div className={commonStyle.card}>
          <div className={`${commonStyle.cardHeader} bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-750`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                <span className="text-white text-lg">🎨</span>
              </div>
              <div>
                <h2 className={commonStyle.section_title}>Top Banner</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Homepage banner content</p>
              </div>
            </div>
          </div>
          <div className={commonStyle.cardBody}>
            <div>
              <label className={commonStyle.label}>Heading Text</label>
              <input
                type="text"
                value={appInfoSetting?.topBanner?.headingText || ""}
                onChange={(e) => topBannerInputChange("headingText", e.target.value)}
                className={commonStyle.input}
                placeholder="Enter heading text"
              />
            </div>
            <div>
              <label className={commonStyle.label}>Heading Text 2</label>
              <input
                type="text"
                value={appInfoSetting?.topBanner?.headingText2 || ""}
                onChange={(e) => topBannerInputChange("headingText2", e.target.value)}
                className={commonStyle.input}
                placeholder="Enter second heading text"
              />
            </div>
            {renderImageUpload(
              "Top Banner Desktop Image",
              appInfoSetting?.topBanner?.bannerTopImageDesktop,
              isBannerImageUploadRequestDesktopLogo,
              (e) => handleImageUpload(e, setIsBannerApp1ImageUploadRequestDesktopLogo, "topBanner.bannerTopImageDesktop"),
              "topBanner.bannerTopImageDesktop",
              "https://i.ibb.co/wLm1D8Q/logo.webp"
            )}
          </div>
        </div>

        {/* Header Banner */}
        <div className={commonStyle.card}>
          <div className={`${commonStyle.cardHeader} bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-700 dark:to-gray-750`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                <span className="text-white text-lg">🖼️</span>
              </div>
              <div>
                <h2 className={commonStyle.section_title}>Header Banner</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Main header configuration</p>
              </div>
            </div>
          </div>
          <div className={commonStyle.cardBody}>
            <div>
              <label className={commonStyle.label}>Title</label>
              <input
                type="text"
                value={appInfoSetting?.headerBanner?.title || ""}
                onChange={(e) => headerBannerInputChange("title", e.target.value)}
                className={commonStyle.input}
                placeholder="Enter banner title"
              />
            </div>

            {renderImageUpload(
              "Icon Image",
              appInfoSetting?.headerBanner?.iconImage,
              isBannerImageUploadRequest,
              (e) => handleImageUpload(e, setIsBannerImageUploadRequest, "headerBanner.iconImage"),
              "icon_image",
              "https://via.placeholder.com/100"
            )}
          </div>
        </div>

        {/* App Sections */}
        {[1, 2, 3].map(appNum => renderAppSection(appNum))}

        {/* Warning Texts */}
        <div className={commonStyle.card}>
          <div className={`${commonStyle.cardHeader} bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-750`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
                <span className="text-white text-lg">⚠️</span>
              </div>
              <div>
                <h2 className={commonStyle.section_title}>Warning Messages</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Configure warning texts</p>
              </div>
            </div>
          </div>
          <div className={commonStyle.cardBody}>
            {[
              { key: "checkoutPage", label: "Checkout Page" },
              { key: "finalCheckout", label: "Final Checkout" },
              { key: "checkoutPaymentDetailsPopup", label: "Checkout Payment Details Popup" },
              { key: "customerPanel", label: "Customer Panel" },
              { key: "cartPageWarningText", label: "Cart Page Warning Text" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className={commonStyle.label}>{label}</label>
                <AppInfoEditor
                  setAppInfoSetting={setAppInfoSetting}
                  keys={key}
                  value={appInfoSetting?.warningTexts?.[key] || ""}
                />
              </div>
            ))}

            <div>
              <label className={commonStyle.label}>Cart Page Warning Color</label>
              <ColorPicker
                color={appInfoSetting?.warningTexts?.cartPageWarningColor || "#ffffff"}
                keys="cartPageWarningColor"
                handleChange={handleColorChange}
              />
            </div>
          </div>
        </div>

        {/* Live Chat Info */}
        <div className={commonStyle.card}>
          <div className={`${commonStyle.cardHeader} bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-750`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <span className="text-white text-lg">💬</span>
              </div>
              <div>
                <h2 className={commonStyle.section_title}>Live Chat Settings</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Configure chat interface</p>
              </div>
            </div>
          </div>
          <div className={commonStyle.cardBody}>
            {[
              { key: "title", label: "Title", placeholder: "Live Chat Title" },
              { key: "subTitle", label: "Sub Title", placeholder: "Live Chat Sub Title" },
              { key: "p1", label: "Paragraph 1", placeholder: "Paragraph 1" },
              { key: "p2", label: "Paragraph 2", placeholder: "Paragraph 2" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className={commonStyle.label}>{label}</label>
                <input
                  type="text"
                  value={appInfoSetting?.liveChatInfo?.[key] || ""}
                  onChange={(e) => handleLiveChatInfoChange(key, e.target.value)}
                  className={commonStyle.input}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Registration Fields */}
        <div className={commonStyle.card}>
          <div className={`${commonStyle.cardHeader} bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-750`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <span className="text-white text-lg">👤</span>
              </div>
              <div>
                <h2 className={commonStyle.section_title}>Registration Settings</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Configure user registration</p>
              </div>
            </div>
          </div>
          <div className={commonStyle.cardBody}>
            {/* Enable Registration Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <label className="font-semibold text-gray-900 dark:text-white">Enable Registration</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow new users to register</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appInfoSetting?.registration?.isRegistrationAllowed}
                  onChange={async (e) => {
                    try {
                      setIsSaving(true);
                      const updatedValue = e.target.checked;
                      const payload = {
                        ...appInfoSetting,
                        registration: {
                          ...(appInfoSetting.registration || {}),
                          isRegistrationAllowed: updatedValue
                        }
                      };

                      const res = await updateAppInfoSetting(appInfoSetting._id, payload);
                      setIsSaving(false);
                      if (res?.data?.success) {
                        Swal.fire({
                          title: "Success!",
                          text: "Registration settings updated successfully",
                          icon: "success"
                        });
                        setAppInfoSetting(res.data.data);
                        setIsRegistrationAllowed(updatedValue);
                      }
                    } catch (error) {
                      setIsSaving(false);
                      Swal.fire({
                        title: "Error!",
                        text: error.response?.data?.message || "Failed to update settings",
                        icon: "error"
                      });
                      setIsRegistrationAllowed(!e.target.checked);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Admin Approval Toggle */}
            {appInfoSetting?.registration?.isRegistrationAllowed && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div>
                  <label className="font-semibold text-gray-900 dark:text-white">Admin Approval Required</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Require admin approval for new accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appInfoSetting?.registration?.isRegistrationAdminApprovalRequired}
                    onChange={async (e) => {
                      try {
                        const updatedValue = e.target.checked;
                        const payload = {
                          ...appInfoSetting,
                          registration: {
                            ...(appInfoSetting.registration || {}),
                            isRegistrationAdminApprovalRequired: updatedValue
                          }
                        };
                        setIsSaving(true);
                        const res = await updateAppInfoSetting(appInfoSetting._id, payload);
                        setIsSaving(false);
                        if (res?.data?.success) {
                          Swal.fire({
                            title: "Success!",
                            text: "Registration settings updated successfully",
                            icon: "success"
                          });
                          setAppInfoSetting(res.data.data);
                          setIsRegistrationAdminApprovalRequired(updatedValue);
                        }
                      } catch (error) {
                        setIsRegistrationAdminApprovalRequired(!e.target.checked);
                        setIsSaving(false);
                        Swal.fire({
                          title: "Error!",
                          text: error.response?.data?.message || "Failed to update settings",
                          icon: "error"
                        });
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            )}

            {/* Registration Fields */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Registration Fields</h3>
              <div className="space-y-3">
                {registrationFields.map((field) => (
                  <div key={field.key} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{field.key}</h4>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 bg-white dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-550 transition-colors">
                          <input
                            type="checkbox"
                            id={`active-${field.key}`}
                            checked={field.isActive !== false}
                            onChange={() => handleRegistrationFieldChange(field.key, "isActive", !field.isActive)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 bg-white dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-550 transition-colors">
                          <input
                            type="checkbox"
                            id={`required-${field.key}`}
                            checked={field.isRequired}
                            onChange={() => handleRegistrationFieldChange(field.key, "isRequired", !field.isRequired)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Required</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <button
            onClick={handleSave}
            disabled={isRequest || isSaving}
            className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl ${
              (isRequest || isSaving) 
                ? "opacity-60 cursor-not-allowed" 
                : "hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105"
            }`}
          >
            {(isRequest || isSaving) ? (
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
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </Contentlayout>
  );
};

export default AppInfo;
