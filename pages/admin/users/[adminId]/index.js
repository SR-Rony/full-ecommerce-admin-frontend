import AdminAddressUpdateModal from "@/components/Modals/Admins/AdminAddressUpdateModal";
import AdminFullNameUpdateModal from "@/components/Modals/Admins/AdminFullNameUpdateModal";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import Seo from "@/shared/layout-components/seo/seo";
import { ToastEmitter } from "@/utils/Toast";
import { CDNupload, ProfileAvatarOutput } from "@/utils/func";
import { AdminProfileUserUpdate, getAdminUserProfile } from "@/utils/instance";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
const Select = dynamic(() => import("react-select"), { ssr: false });

const Profile = () => {

  const ProfileHomeData = [
    { value: "Only Me", label: "Only Me" },
    { value: "Public", label: "Public" },
    { value: "Private", label: "Private" },
    { value: "Friends Only", label: "Friends Only" },
    { value: "Friends Of Friends", label: "Friends Of Friends" }
  ];

  const [imageUploadReq, setImageUploadReq] = useState(false);
  const [selected, setSelected] = useState(["Laravel", "Angular", "Html", "VueJs", "React", "Codeignator", "Javascript", "Bootstarp", "Php"]);  // react-tag-input-component

  //URl image
  const [UrlImage, setUrlImage] = useState("../../../../assets/img/png-images/2.png");
  //Disabling input feild

  const { Auth, Admin } = useFullStage();
  const [authData, setAuthData] = Auth;

  const [UrlDisabled, setUrlDisabled] = useState(true);
  const [profile, setProfile] = useState({});
  const [fileDisabled, setfileDisabled] = useState(false);
  const [adminFullNameUpdateModalOpen, setAdminFullNameUpdateModalOpen] = useState(false);
  const [adminAddressUpdateModalOpen, setAdminAddressUpdateModalOpen] = useState(false);

  //Default image
  const [Image, setImage] = useState("../../../../assets/img/png-images/2.png");

  let location = useRouter();

  const handleFileUpload = async (event) => {
    try {
      setImageUploadReq(true);
      const avatar = await CDNupload(event.target.files);
      console.log(avatar);
      if (avatar) {
        setImageUploadReq(true);
        const res = await AdminProfileUserUpdate({ avatar, adminId: profile?._id });
        console.log(res.data,'updated');
        setProfile({
          ...res?.data?.data,
          nameUpdateData: {
            firstName: res?.data?.data.firstName || "",
            lastName: res?.data?.data.lastName || "",
          },
          addressInfoUpdate:res?.data?.data?.address
        });
        setImageUploadReq(false);
      }
      setImageUploadReq(false);
    } catch (error) {
      console.log(error);
      setImageUploadReq(false);
      ToastEmitter('error', error?.response?.data?.message);
    }
  };

  const [ClassName, setClassName] = useState("");

  const fetchAdminProfile = async () => {
    try {
      if (location.query.adminId) {
        const res = await getAdminUserProfile(location.query.adminId);
        setProfile({
          ...res?.data?.data,
          nameUpdateData: {
            firstName: res?.data?.data.firstName || "",
            lastName: res?.data?.data.lastName || "",
          },
          addressInfoUpdate: res?.data?.data?.address || {}
        });
      }

    } catch (error) {
      //console.log(error);
    }
  };
  // const fetchAdminOrderCounts = async () => {
  //   try {
  //     if (location.query.adminId) {
  //       const res = await getOrderCounts({customerId:location.query.adminId});
  //       setAdminOrderCounts(res?.data?.data);
  //     }

  //   } catch (error) {
  //     //console.log(error);
  //   }
  // };
  useEffect(() => {
    fetchAdminProfile();
    // fetchAdminOrderCounts();
  }, []);

    console.log(
    authData
      );
  return (
    <Contentlayout>
      <div className="relative">
        <Seo title={"home"} />
        <HelmetProvider>
          <Helmet>
            <body class={ClassName}></body>
          </Helmet>
          <div className="flex relative before:bg-black/50 before:absolute before:w-full before:h-full">
            <img src={Image} alt="" className="h-[500px] w-full rounded-sm" id="profile-img2" />
          </div>
          <div className="absolute top-28 inset-x-0 text-center space-y-3">
            <div className="flex justify-center w-full">
              <div className="relative cursor-pointer">
                {imageUploadReq ? <div className="relative">
                  <img src={ProfileAvatarOutput(profile?.avatar)} className="w-24 h-24 rounded-full ring-4 ring-white/10 mx-auto" id="profile-img" alt="profile-img" /><div className="absolute top-[26px] left-0 right-0 mx-auto">
                    <Loader bg="transparent" />
                  </div>
                </div> : <img src={ProfileAvatarOutput(profile?.avatar)} className="w-24 h-24 rounded-full ring-4 ring-white/10 mx-auto" id="profile-img" alt="profile-img" />}

                <span
                  className="absolute bottom-0 ltr:right-0 rtl:left-0 block p-1 rounded-full ring-2 ring-white/10 text-white bg-white/10 dark:bg-bgdark leading-none cursor-pointer">
                  <i id="hs-small-modal1" className="ri ri-pencil-line cursor-pointer"></i>
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                    if (authData.isSuperAdmin) {
                      handleFileUpload(e);
                    }
                  }

                  } id="profile-change"></input>
                </span>
              </div>

            </div>
            <div className="text-white">
              <h2 className="text-base font-semibold">{profile?.firstName || ""} {profile.lastName || ""}</h2>
              <p className="text-xs text-white/50">{profile?.email || ""}</p>
            </div>

          </div>

          <div className="main-content -mt-28">

            <div className="">

              <div className="box w-full">
                <div className="box-header">
                  <nav className="sm:flex sm:space-x-2 space-y-2 sm:space-y-0 rtl:space-x-reverse block" aria-label="Tabs" role="tablist">
                    <button type="button"
                      className="hs-tab-active:bg-primary hs-tab-active:border-primary hs-tab-active:text-white dark:hs-tab-active:bg-primary dark:hs-tab-active:border-primary dark:hs-tab-active:text-white py-2 px-3 inline-flex items-center w-full justify-center gap-2 text-sm font-medium text-center border text-gray-500 rounded-sm hover:text-gray-700 dark:bg-black/20 dark:border-white/10 dark:text-white/70 dark:hover:text-gray-300 active"
                      id="profile-item-1" data-hs-tab="#profile-1" aria-controls="profile-1" role="tab">
                      Profile
                    </button>
                    {/* <button type="button"
                      className="hs-tab-active:bg-primary hs-tab-active:border-primary hs-tab-active:text-white dark:hs-tab-active:bg-primary dark:hs-tab-active:border-primary dark:hs-tab-active:text-white py-2 px-3 inline-flex items-center w-full justify-center gap-2 text-sm font-medium text-center border text-gray-500 rounded-sm hover:text-gray-700 dark:bg-black/20 dark:border-white/10 dark:text-white/70 dark:hover:text-gray-300"
                      id="profile-item-2" data-hs-tab="#profile-2" aria-controls="profile-2" role="tab">
                      Activities
                    </button>
                    <button type="button"
                      className="hs-tab-active:bg-primary hs-tab-active:border-primary hs-tab-active:text-white dark:hs-tab-active:bg-primary dark:hs-tab-active:border-primary dark:hs-tab-active:text-white py-2 px-3 inline-flex items-center w-full justify-center gap-2 text-sm font-medium text-center border text-gray-500 rounded-sm hover:text-gray-700 dark:bg-black/20 dark:border-white/10 dark:text-white/70 dark:hover:text-gray-300"
                      id="profile-item-3" data-hs-tab="#profile-3" aria-controls="profile-3" role="tab">
                      Orders
                    </button> */}

                  </nav>
                </div>
                <div className="box-body">
                  <div id="profile-1" className=" " role="tabpanel" aria-labelledby="profile-item-1">
                    <div>
                      <h5 className="box-title mb-3 flex items-center justify-start cursor-pointer gap-2" onClick={() => {
                        if (authData.isSuperAdmin) {
                          setProfile((prev) => {
                            return {
                              ...prev,
                              nameUpdateData:{
                                firstName:prev?.firstName||"",
                                lastName:prev?.lastName||"",
                              },
                            };
                          });
                          setAdminFullNameUpdateModalOpen(true);
                        }
                      }}><span className="cursor-pointer"> Basic Info</span>{  (authData?.isSuperAdmin||authData?.role =="superAdmin")&&  <MdOutlineDriveFileRenameOutline />} </h5>
                      <div className="overflow-auto">
                        <table className="ti-custom-table border-0 whitespace-nowrap">
                          <tbody>
                            <tr className="">
                              <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">First name</td>
                              <td className="!p-2">:</td>
                              <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile.firstName}</td>
                            </tr>
                            <tr className="!border-0">
                              <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">Last Name</td>
                              <td className="!p-2">:</td>
                              <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.lastName}</td>
                            </tr>
                            <tr className="!border-0">
                              <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70 cursor-not-allowed">Email</td>
                              <td className="!p-2">:</td>
                              <td className="!p-2 !text-gray-500 dark:!text-white/70 cursor-not-allowed">{profile?.email}</td>
                            </tr>

                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                   <h5 className="box-title mb-3 mt-6 flex items-center justify-start cursor-pointer gap-2" onClick={() => {
                        if (authData.isSuperAdmin) {
                          setProfile((prev) => {
                            return {
                              ...prev,
                              addressInfoUpdate: {
                                ...prev?.address,
                              },
                            };
                          });
                          setAdminAddressUpdateModalOpen(true);
                        }
                      }}><span> Address Info</span>  {(authData?.isSuperAdmin||authData?.role =="superAdmin")&&  <MdOutlineDriveFileRenameOutline />} </h5>
                      <div className="overflow-auto">
                        <table className="w-full border-0 whitespace-nowrap">
                          <tbody>
                            <tr className="">
                              <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70"> Street Name</td>
                              <td className="!p-2">:</td>
                              <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.address?.streetName}</td>
                            </tr>
                            <tr className="">
                              <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70"> Street Number</td>
                              <td className="!p-2">:</td>
                              <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.address?.streetNumber}</td>
                            </tr>

                            <tr className="!border-0">
                              <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70"> APT OR UNIT NUMBER</td>
                              <td className="!p-2">:</td>
                              <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.address?.aptUnit}</td>
                            </tr>
                            <tr className="!border-0">
                              <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">City</td>
                              <td className="!p-2">:</td>
                              <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.address?.city}</td>
                            </tr>
                            <tr className="!border-0">
                              <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">State</td>
                              <td className="!p-2">:</td>
                              <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.address?.state}</td>
                            </tr>
                            <tr className="!border-0">
                              <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">Zipcode</td>
                              <td className="!p-2">:</td>
                              <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.address?.zipCode}</td>
                            </tr>

                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                  {/* <div id="profile-2" className="hidden" role="tabpanel" aria-labelledby="profile-item-2">
                    <h5 className="box-title mb-3 flex items-center justify-start cursor-pointer gap-2"><span> Activities</span>  </h5>
                    <div className="overflow-auto">
                      <table className="ti-custom-table border-0 whitespace-nowrap">
                        <tbody>
                          <tr className="">
                            <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">Last Login At</td>
                            <td className="!p-2">:</td>
                            <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.activity?.lastLoginAt ? moment(profile?.activity?.lastLoginAt).format('lll') : 'N/A'}</td>
                          </tr>
                          <tr className="!border-0">
                            <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">Last Activity At</td>
                            <td className="!p-2">:</td>
                            <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.activity?.lastActivityAt ? moment(profile?.activity?.lastActivityAt).format('lll') : 'N/A'}</td>
                          </tr>
                          <tr className="!border-0">
                            <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">Last Account Updated At:</td>
                            <td className="!p-2">:</td>
                            <td className="!p-2 !text-gray-500 dark:!text-white/70">{profile?.updatedAt ? moment(profile?.updatedAt).format('lll') : 'N/A'} </td>
                          </tr>
                          <tr className="!border-0">
                            <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">Last Account Updated By:</td>
                            <td className="!p-2">:</td>
                            <td className="!p-2 !text-gray-500 dark:!text-white/70 flex items-center gap-2 cursor-pointer" onClick={() => {
                              if (profile?.activity?.lastAccountUpdatedByAdmin?._id) {
                                router.push(`/admin/${profile?.activity?.lastAccountUpdatedByAdmin?._id || ""}`);
                              }
                            }}>
                              {profile?.activity?.lastAccountUpdatedBy == 'self' ? "Self" : <>
                                <img src={ProfileAvatarOutput(profile?.activity?.lastAccountUpdatedBy == 'self' ? profile?.avatar : profile?.activity?.lastAccountUpdatedByAdmin?.avatar)} className="w-8 h-8 rounded-full ring-4 ring-white/10" id="profile-img" alt="profile-img" />
                                {profile?.activity?.lastAccountUpdatedByAdmin?.firstName || "Admin"} {profile?.activity?.lastAccountUpdatedByAdmin?.lastName || ""}
                              </>}

                            </td>
                          </tr>

                        </tbody>
                      </table>
                    </div>
                  </div> */}

                  {/* <div id="profile-3" className="hidden text-center" role="tabpanel" aria-labelledby="profile-item-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4 bg-white p-4">
                      {isValidArray(customerOrderCounts) && customerOrderCounts.map((status) => (
                        <div key={status.title} className="bg-gray-200 p-4 rounded-md">
                          <h2 className="text-sm font-bold">{status.title}</h2>
                          <p className="text-md">{`Total ${status.title}: ${status.count}`}</p>
             
                        </div>
                      ))}
                    </div>
                    <Order adminId={location?.query?.adminId || profile?._id} trackingStatus="" defaultOptions={defaultOptions} />

                  </div> */}

                </div>

              </div>

            </div>
          </div>
        </HelmetProvider>
        <AdminFullNameUpdateModal isOpen={adminFullNameUpdateModalOpen} setIsOpen={setAdminFullNameUpdateModalOpen} profile={profile} setProfile={setProfile} />
        <AdminAddressUpdateModal isOpen={adminAddressUpdateModalOpen} setIsOpen={setAdminAddressUpdateModalOpen} profile={profile} setProfile={setProfile} />
      </div>
    </Contentlayout>
  );
};

export default Profile;
