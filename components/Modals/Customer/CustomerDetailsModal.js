/* eslint-disable vars-on-top */
import { Dialog, Transition } from "@headlessui/react";
import "jspdf-autotable";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { IoIosCloseCircle } from "react-icons/io";
//others import

import Order from "@/components/Orders/Order";
import Switch from "@/components/Shared/Switch";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { CDNupload, ProfileAvatarOutput } from "@/utils/func";
import {
  customerProfileUpdate,
  customersActivated,
  customersBlocked,
  customersEmailVerified,
  customerTestCustomerUpdate,
  getCustomerProfile,
  getOrderCounts,
} from "@/utils/instance";
import moment from "moment";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaKey } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import CustomerFullNameUpdateModal from "./CustomerFullNameUpdateModal";
import CustomerPasswordChange from "./CustomerPasswordChange";
import CustomerShippingInfoUpdateModal from "./CustomerShippingInfoUpdateModal";
import Swal from "sweetalert2";
const Select = dynamic(() => import("react-select"), { ssr: false });
export default function CustomerDetailsModal({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  fetchCustomers,
}) {
  const router = useRouter();
  const closeModal = () => {
    setIsOpen(false);
  };

  const ProfileHomeData = [
    { value: "Only Me", label: "Only Me" },
    { value: "Public", label: "Public" },
    { value: "Private", label: "Private" },
    { value: "Friends Only", label: "Friends Only" },
    { value: "Friends Of Friends", label: "Friends Of Friends" },
  ];

  const [imageUploadReq, setImageUploadReq] = useState(false);
  const [selected, setSelected] = useState([
    "Laravel",
    "Angular",
    "Html",
    "VueJs",
    "React",
    "Codeignator",
    "Javascript",
    "Bootstarp",
    "Php",
  ]); // react-tag-input-component

  //URl image
  const [UrlImage, setUrlImage] = useState(
    "../../../../assets/img/png-images/2.png"
  );
  //Disabling input feild

  const { Auth, Customer } = useFullStage();
  const [authData, setAuthData] = Auth;
  const [customerSingleDetails, setCustomerSingleDetails] =
    Customer.CustomerSingleDetails;
  const [customerOrderCounts, setCustomerOrderCounts] =
    Customer.CustomerOrderCounts;
  const [UrlDisabled, setUrlDisabled] = useState(true);
  const [profile, setProfile] = useState({});
  const [fileDisabled, setfileDisabled] = useState(false);
  const [customerTestReq,setCustomerTestReq] =useState(false);
  const [customerFullNameUpdateModalOpen, setCustomerFullNameUpdateModalOpen] =
    useState(false);
  const [
    customerShippingInfoUpdateModalOpen,
    setCustomerShippingInfoUpdateModalOpen,
  ] = useState(false);

  const [isCustomerReq, setIsCustomerReq] = useState(false);
  const [customerBlockedReq, setCustomerBlockedReq] = useState(false);

  const [customerEmailVerifiedReq, setCustomerEmailVerifiedReq] =
    useState(false);
  //Default image
  const [Image, setImage] = useState("../../../../assets/img/png-images/2.png");

  const [isPasswordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [passwordChangeCount, setPasswordChangeCount] = useState(1);

  const [isApprovedReq, setIsApprovedReq] = useState(false);

  let location = useRouter();
  const handleBlocked = async (key, val) => {
    try {
      if (!(router?.query?.customerId || customerSingleDetails?._id))
        return ToastEmitter("invalid customer!");
      if (router?.query?.customerId || customerSingleDetails?._id) {
        setCustomerBlockedReq(true);
        const res = await customersBlocked({
          customerId: router?.query?.customerId || customerSingleDetails?._id,
          [key]: val,
        });
        setCustomerBlockedReq(false);
        if (res.data.success) {
          if (fetchCustomers) {
            fetchCustomers();
          }
          setProfile((prev) => {
            return {
              ...prev,
              [key]: val,
            };
          });
        }
      }
    } catch (error) {
      setCustomerBlockedReq(false);
      //console.log(error);
    }
  };
  const handleActive = async (key, val) => {
    try {
      if (!(router?.query?.customerId || customerSingleDetails?._id))
        return ToastEmitter("invalid customer!");
      if (router?.query?.customerId || customerSingleDetails?._id) {
        setCustomerBlockedReq(true);
        const res = await customersActivated({
          customerId: router?.query?.customerId || customerSingleDetails?._id,
          [key]: val,
        });
        setCustomerBlockedReq(false);
        if (res.data.success) {
          if (fetchCustomers) {
            fetchCustomers();
          }
          setProfile((prev) => {
            return {
              ...prev,
              [key]: val,
            };
          });
        }
      }
    } catch (error) {
      setCustomerBlockedReq(false);
      //console.log(error);
    }
  };
  const handleEmailVerified = async (key, val) => {
    try {
      if (!(router?.query?.customerId || customerSingleDetails?._id))
        return ToastEmitter("invalid customer!");
      if (router?.query?.customerId || customerSingleDetails?._id) {
        setCustomerEmailVerifiedReq(true);
        const res = await customersEmailVerified({
          customerId: router?.query?.customerId || customerSingleDetails?._id,
          [key]: val,
        });
        setCustomerEmailVerifiedReq(false);
        if (res.data.success) {
          if (fetchCustomers) {
            fetchCustomers();
          }
          setProfile((prev) => {
            return {
              ...prev,
              isEmailVerified: res?.data?.data?.isEmailVerified,
            };
          });
        }
      }
    } catch (error) {
      setCustomerEmailVerifiedReq(false);
      //console.log(error);
    }
  };
  const handleFileUpload = async (event) => {
    try {
      setImageUploadReq(true);
      const avatar = await CDNupload(event.target.files);
      if (avatar) {
        setImageUploadReq(true);
        const res = await customerProfileUpdate({
          avatar,
          customerId: profile?._id,
        });
        setProfile({
          ...res?.data?.data,
          nameUpdateData: {
            firstName: res?.data?.data.firstName || "",
            lastName: res?.data?.data.lastName || "",
          },
        });
        setImageUploadReq(false);
      }
      setImageUploadReq(false);
    } catch (error) {
      setImageUploadReq(false);
      ToastEmitter("error", error?.response?.data?.message);
    }
    // customerProfileUpdate
  };

  const [ClassName, setClassName] = useState("");

  const fetchCustomerProfile = async (val) => {
    try {
      if (val || customerSingleDetails?._id) {
        setIsCustomerReq(true);
        const res = await getCustomerProfile(val || customerSingleDetails?._id);
        setIsCustomerReq(false);
        setProfile({
          ...res?.data?.data,
          nameUpdateData: {
            firstName: res?.data?.data.firstName || "",
            lastName: res?.data?.data.lastName || "",
          },
          shippingInfoUpdateData: res?.data?.data?.shippingInfo || {},
        });
      }
    } catch (error) {
      setIsCustomerReq(false);
      //console.log(error);
    }
  };
  const fetchCustomerOrderCounts = async (val) => {
    try {
      if (val || customerSingleDetails?._id) {
        const res = await getOrderCounts({customerId:val || customerSingleDetails?._id});
        setCustomerOrderCounts(res?.data?.data);
      }
    } catch (error) {
      //console.log(error);
    }
  };
  useMemo(() => {
    fetchCustomerProfile(
      customerSingleDetails?._id||   router?.query?.customerId 
    );
    fetchCustomerOrderCounts(
      customerSingleDetails?._id|| router?.query?.customerId
    );
  }, [customerSingleDetails?._id, router?.query?.customerId]);
  const defaultOptions = [
    {
      label: "All",
      value: "PAID,PACKED,PARTIALLY_SHIPPED,FULLY_SHIPPED",
    },
    {
      label: "Paid",
      value: "PAID",
    },
    {
      label: "Packed",
      value: "PACKED",
    },
    {
      label: "Partially Shipped",
      value: "PARTIALLY_SHIPPED",
    },
    {
      label: "Fully Shipped",
      value: "FULLY_SHIPPED",
    },
  ];

  const handleUpdateTestCustomer = async (customerId,  isTestCustomer) => {
    try {
      setCustomerTestReq(true);
      const res = await customerTestCustomerUpdate({ customerId, isTestCustomer: isTestCustomer });
      setCustomerTestReq(false);

      if (res.data.success) {
        setCustomerSingleDetails((prev) => ({
          ...prev,
          isTestCustomer: res?.data?.data?.isTestCustomer,
        }));
        setProfile((prev) => ({
          ...prev,
          isTestCustomer: res?.data?.data?.isTestCustomer,
        }));
  
        const isTestPath = router.pathname == '/admin/customers/test-customers';
  
        fetchCustomers({ isTestCustomer: isTestPath });
      }
    } catch (error) {
      setCustomerTestReq(false);

    }

  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="order-details__content mt-[12px]   lg:mt-16">
            <div className="flex relative before:bg-black/50 before:absolute before:w-full before:h-full"></div>
            <div className="inset-x-0 text-center space-y-3 ">
              <div className="w-[100px] h-full">
                <div className="relative cursor-pointer">
                  {imageUploadReq ? (
                    <div className="">
                      <img
                        src={ProfileAvatarOutput(profile?.avatar)}
                        className="w-24 h-24 rounded-full ring-4 ring-white/10"
                        id="profile-img"
                        alt="profile-img"
                      />
                      <div className="absolute top-[30px] left-0 right-0">
                        <Loader bg="transparent" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={ProfileAvatarOutput(profile?.avatar)}
                      className="w-24 h-24 rounded-full ring-4 ring-white/10 "
                      id="profile-img"
                      alt="profile-img"
                    />
                  )}

                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (authData.isSuperAdmin) {
                        handleFileUpload(e);
                      }
                    }}
                    id="profile-change"
                  ></input>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap   mt-6 gap-4 justify-between">
              <div className="w-full lg:w-[48%] lg:border-r">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <h5
                    className="text-lg font-semibold mb-4 flex items-center justify-start cursor-pointer gap-2 text-gray-800 border-b pb-2"
                    onClick={() => {
                      if (authData.isSuperAdmin) {
                        setProfile((prev) => {
                          return {
                            ...prev,
                            nameUpdateData: {
                              firstName: prev?.firstName || "",
                              lastName: prev?.lastName || "",
                            },
                          };
                        });
                        setCustomerFullNameUpdateModalOpen(true);
                      }
                    }}
                  >
                    <span className="cursor-pointer">Basic Info</span>
                    {(authData?.isSuperAdmin||authData?.role =="superAdmin")&& (
                      <MdOutlineDriveFileRenameOutline className="text-blue-600" />
                    )}{" "}
                  </h5>
                  <div className="overflow-auto">
                    <table className="ti-custom-table border-0 whitespace-nowrap w-full">
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            First name
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile.firstName}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Last Name
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.lastName}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Email
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.email}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Phone
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.phone?.number || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Site
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.site || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Origin
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.origin || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Forum Username
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.forum?.username || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Forum User Since
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.forum?.userSince || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Forum Link
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.forum?.link || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            How Heard About
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.howHeardAbout || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Industry Experience
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.industryExperienceYears || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Created At
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.createdAt ? moment(profile?.createdAt).format("lll") : "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Last Order Paid At
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.lastOrderPaidAt ? moment(profile?.lastOrderPaidAt).format("lll") : "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Approved By Admin At
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.approved_by_admin_at ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                {moment(profile?.approved_by_admin_at).format("lll")}
                                {(authData?.isSuperAdmin||authData?.role =="superAdmin")&& (
                                  <button
                                    className="ml-2 px-2 py-1 bg-gray-400 text-white rounded text-xs cursor-not-allowed"
                                    disabled
                                  >
                                    Approved
                                  </button>
                                )}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                N/A
                                {(authData?.isSuperAdmin||authData?.role =="superAdmin")&& (
                                  <button
                                    className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                                    disabled={isApprovedReq}
                                    onClick={async () => {
                                      const result = await Swal.fire({
                                        title: 'Are you sure?',
                                        text: 'Do you want to approve this customer?',
                                        icon: 'question',
                                        showCancelButton: true,
                                        confirmButtonText: 'Yes, approve',
                                        cancelButtonText: 'Cancel',
                                      });
                                      if (result.isConfirmed) {
                                        setIsApprovedReq(true);
                                        try {
                                          const res = await customersActivated({
                                            customerId: profile?._id,
                                          });
                                          setIsApprovedReq(false);
                                          if (res?.data?.success) {
                                            Swal.fire({
                                              title: 'Success',
                                              text: res?.data?.message || 'Customer approved!',
                                              icon: 'success',
                                            });
                                            fetchCustomerProfile(profile?._id);
                                            if (fetchCustomers) fetchCustomers();
                                          } else {
                                            Swal.fire({
                                              title: 'Error',
                                              text: res?.data?.message || 'Failed to approve customer.',
                                              icon: 'error',
                                            });
                                          }
                                        } catch (error) {
                                          setIsApprovedReq(false);
                                          Swal.fire({
                                            title: 'Error',
                                            text: error?.response?.data?.message || error?.message || 'Failed to approve customer.',
                                            icon: 'error',
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    {isApprovedReq ? <Loader width="w-4" height="h-4" bg="transparent" /> : 'Approve Now'}
                                  </button>
                                )}
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-[48%]">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <h5
                    className="text-lg font-semibold mb-4 flex items-center justify-start cursor-pointer gap-2 text-gray-800 border-b pb-2"
                    onClick={() => {
                      if (authData.isSuperAdmin) {
                        setProfile((prev) => {
                          return {
                            ...prev,
                            shippingInfoUpdateData: {
                              ...prev?.shippingInfo,
                            },
                          };
                        });
                        setCustomerShippingInfoUpdateModalOpen(true);
                      }
                    }}
                  >
                    <span>Shipping Info</span>{" "}
                    {(authData?.isSuperAdmin||authData?.role =="superAdmin")&& (
                      <MdOutlineDriveFileRenameOutline className="text-blue-600" />
                    )}{" "}
                  </h5>
                  <div className="overflow-auto">
                    <table className="w-full border-0 whitespace-nowrap">
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Street Name
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.shippingInfo?.streetName || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Street Number
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.shippingInfo?.streetNumber || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            APT OR UNIT NUMBER
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.shippingInfo?.aptUnit || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            City
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.shippingInfo?.city || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            State
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.shippingInfo?.state || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Zipcode
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.shippingInfo?.zipCode || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Country
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.shippingInfo?.country?.label || "N/A"}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="!p-2 font-medium !text-gray-600">
                            Receiver Name
                          </td>
                          <td className="!p-2 text-gray-400">:</td>
                          <td className="!p-2 !text-gray-700">
                            {profile?.shippingInfo?.receiverName?.firstName
                              ? `${profile?.shippingInfo?.receiverName?.firstName} ${profile?.shippingInfo?.receiverName?.lastName}`
                              : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                setPasswordChangeCount((c) => c + 1);
                setPasswordChangeOpen(true);
              }}
              className="bg-blue-600 p-2 mt-5 rounded-sm text-white flex items-center gap-2"
            >
              <FaKey /> Change Password
            </button>
            <div className="mt-8 flex items-center gap-1">
              <span>isBlocked</span>:
              <>
                {customerBlockedReq ? (
                  <Loader width={"w-6"} height={"h-6"} bg="transparent" />
                ) : (
                  <Switch
                    keys="isBlocked"
                    name=""
                    checked={profile.isBlocked}
                    onChange={(key, val) => {
                      if (val) {
                        handleBlocked(key, val);
                      } else {
                        handleBlocked(key, val);
                      }
                    }}
                  />
                )}
              </>
            </div>
         
            <div className="mt-8 flex items-center gap-1">
              <span>isEmailVerified</span>:
              <>
                {customerEmailVerifiedReq ? (
                  <Loader width={"w-6"} height={"h-6"} bg="transparent" />
                ) : (
                  <Switch
                    keys="isEmailVerified"
                    name=""
                    checked={profile.isEmailVerified}
                    onChange={(key, val) => {
                      handleEmailVerified(key, val);
                    }}
                  />
                )}
              </>
            </div>
            <div className="mt-8 flex items-center gap-1">
              <span>isTestCustomer</span>:
              <>
                {customerTestReq ? (
                  <Loader width={"w-6"} height={"h-6"} bg="transparent" />
                ) : (
                  <Switch
                    keys="isTestCustomer"
                    name=""
                    checked={profile.isTestCustomer}
                    onChange={(key, val) => {
                      handleUpdateTestCustomer(customerSingleDetails?._id||router?.query?.customerId,val);
                    }}
                  />
                )}
              </>
            </div>
          </div>
        );
      case "Activities":
        return (
          <div className="order-details__content  mt-[12px]  lg:mt-16">
            <h5 className="box-title mb-3 flex items-center justify-start cursor-pointer gap-2">
              <span> Activities</span>{" "}
            </h5>
            <div className="overflow-auto">
              <table className="ti-custom-table border-0 whitespace-nowrap">
                <tbody>
                  <tr className="">
                    <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">
                      Last Login At
                    </td>
                    <td className="!p-2">:</td>
                    <td className="!p-2 !text-gray-500 dark:!text-white/70">
                      {profile?.activity?.lastLoginAt
                        ? moment(profile?.activity?.lastLoginAt).format("lll")
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="!border-0">
                    <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">
                      Last Activity At
                    </td>
                    <td className="!p-2">:</td>
                    <td className="!p-2 !text-gray-500 dark:!text-white/70">
                      {profile?.activity?.lastActivityAt
                        ? moment(profile?.activity?.lastActivityAt).format(
                            "lll"
                          )
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="!border-0">
                    <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">
                      Last Account Updated At:
                    </td>
                    <td className="!p-2">:</td>
                    <td className="!p-2 !text-gray-500 dark:!text-white/70">
                      {profile?.updatedAt
                        ? moment(profile?.updatedAt).format("lll")
                        : "N/A"}{" "}
                    </td>
                  </tr>
                  <tr className="!border-0">
                    <td className="!p-2 font-medium !text-gray-500 dark:!text-white/70">
                      Last Account Updated By:
                    </td>
                    <td className="!p-2">:</td>
                    <td
                      className="!p-2 !text-gray-500 dark:!text-white/70 flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        if (profile?.activity?.lastAccountUpdatedByAdmin?._id) {
                          router.push(
                            `/admin/${
                              profile?.activity?.lastAccountUpdatedByAdmin
                                ?._id || ""
                            }`
                          );
                        }
                      }}
                    >
                      {profile?.activity?.lastAccountUpdatedBy == "self" ? (
                        "Self"
                      ) : (
                        <>
                          <img
                            src={ProfileAvatarOutput(
                              profile?.activity?.lastAccountUpdatedBy == "self"
                                ? profile?.avatar
                                : profile?.activity?.lastAccountUpdatedByAdmin
                                    ?.avatar
                            )}
                            className="w-8 h-8 rounded-full ring-4 ring-white/10"
                            id="profile-img"
                            alt="profile-img"
                          />
                          {profile?.activity?.lastAccountUpdatedByAdmin
                            ?.firstName || "Admin"}{" "}
                          {profile?.activity?.lastAccountUpdatedByAdmin
                            ?.lastName || ""}
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Orders":
        return (
          <div className="order-details__content">
            <Order
              customerId={location?.query?.customerId || profile?._id}
              trackingStatus="PAID,PACKED,PARTIALLY_SHIPPED,FULLY_SHIPPED"
              defaultOptions={defaultOptions}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={()=>{setIsOpen(true)}}>
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
            <div className="flex flex-wrap min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full lg:w-[90%] h-screen transform overflow-auto rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[20px] lg:px-[40px]">
                  <div className="flex flex-wrap item-center justify-end">
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>
                  <div className="order-details">
                    <div className="order-details__header flex flex-wrap justify-between items-center mb-4 border-b">
                      <ul className="flex flex-wrap gap-4   lg:gap-10">
                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md  border-transparent ${
                            activeTab === "Profile"
                              ? "!border-b-2 !border-blue-600 !text-blue-600"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                          onClick={() => handleTabClick("Profile")}
                        >
                          PROFILE
                        </li>
                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md border-transparent ${
                            activeTab === "Activities"
                              ? "!border-b-2 !border-blue-600 !text-blue-600"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                          onClick={() => handleTabClick("Activities")}
                        >
                          ACTIVITIES
                        </li>
                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md border-transparent ${
                            activeTab === "Orders"
                              ? "!border-b-2 !border-blue-600 !text-blue-600"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                          onClick={() => handleTabClick("Orders")}
                        >
                          ORDERS
                        </li>
                      </ul>
                    </div>
                    <div className="mt-20">
                      {isCustomerReq && <Loader bg="transparent" />}
                    </div>
                    {!isCustomerReq && renderContent()}

                    <CustomerFullNameUpdateModal
                      isOpen={customerFullNameUpdateModalOpen}
                      setIsOpen={setCustomerFullNameUpdateModalOpen}
                      profile={profile}
                      setProfile={setProfile}
                    />
                    <CustomerShippingInfoUpdateModal
                      isOpen={customerShippingInfoUpdateModalOpen}
                      setIsOpen={setCustomerShippingInfoUpdateModalOpen}
                      profile={profile}
                      setProfile={setProfile}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>

          <CustomerPasswordChange
            key={passwordChangeCount}
            customerId={customerSingleDetails?._id|| router.query?.customerId}
            isOpen={isPasswordChangeOpen}
            onClose={() => {
              setPasswordChangeOpen(false);
            }}
          />
        </Dialog>
      </Transition>

    </>
  );
}
