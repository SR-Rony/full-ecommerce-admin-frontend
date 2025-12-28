import Switch from "@/components/Admins/Switch";
import DropdownRoles from "@/components/Shared/DropdownRoles";
import MultiSelectDropdown from "@/components/Shared/MultiSelectDropdown";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { AdminProfileUserUpdate } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { capitalize, uniqBy } from "lodash";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function EditAdminModal({
  setSelectAllChecked,
  isOpen,
  fetchAdmins,
  setSelectedItems,
  setIsOpen,
  type,
  updateData,
  setUpdateData
}) {
  const { Admin } = useFullStage();
  const [adminSingleDetails, setAdminSingleDetails] = Admin.AdminSingleDetails;
  const [customerPage, setAdminPage, orderLimit, setAdminLimit] =
    Admin.AdminPaginate;
  const [admins, setAdmins] = Admin.Admins;
  const [isRequestAdmin, setIsRequestAdmin] = useState(false);
  // const [updateData, setUpdateData] = useState({
  //   isBlocked: false,
  //   isEmailVerified: true,
  //   isSuperAdmin: true,
  //   isActive: true,
  //   selectedRole: { name: "Vendor", value: "vendor" },
  //   role: "vendor",
  //   vendorSites: [],
  // });
  const [loaderType, setLoaderType] = useState("");
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleUpdateAdmin = async () => {
    if(!updateData?.firstName){
      Swal.fire({
        title: "Error!",
        text: "Please select First Name",
        icon: "error",
      });
      return;
    }
    if(updateData?.vendorSites?.length === 0){
      Swal.fire({
        title: "Error!",
        text: "Please select vendor sites",
        icon: "error",
      });
      return;
    }
   
    setIsRequestAdmin(true);
    await AdminProfileUserUpdate({...updateData,adminId:updateData?._id})
      .then(async (res) => {
        setIsRequestAdmin(false);
        if (res?.data?.success) {
          setUpdateData({});
          setLoaderType("");
          fetchAdmins();
          Swal.fire({
            title: "Success",
            text: res?.data?.message,
            icon: "success",
          });
          closeModal();
        } else {
          setIsRequestAdmin(false);
          Swal.fire({
            title: "Error!",
            text: res?.data?.message,
            icon: "error",
          });
        }
        setIsRequestAdmin(false);
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: err?.response?.data?.message,
          icon: "error",
        });

        setIsRequestAdmin(false);
      });
  };

  const onChangeAddress = (keys, value) => {
    setUpdateData((prev) => {
      return {
        ...prev,
        address: {
          [keys]: value,
        },
      };
    });
  };
  const onChangeInput = (keys, value) => {
    setUpdateData((prev) => {
      return {
        ...prev,
        [keys]: value,
      };
    });
  };
  const onChangeBoolean = (keys, e) => {
    setUpdateData((prev) => {
      return {
        ...prev,
        [keys]: e.target.checked,
      };
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
                <Dialog.Panel className="w-full max-w-4xl  transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md  px-4  md:px-[40px] h-full">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Admin Update
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>

                  <div className="mt-2">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      <div className="w-full md:w-[50%]">
                        <p className="py-2">First Name</p>
                        <input
                          type="text"
                          className="w-full rounded-sm"
                          name=""
                          defaultValue={updateData?.firstName || ""}
                          onChange={(e) =>
                            onChangeInput("firstName", e.target.value)
                          }
                          placeholder="First Name"
                          id=""
                        />
                      </div>
                      <div className=" w-full  md:w-[50%]">
                        <p className="py-2">Last Name</p>
                        <input
                          type="text"
                          className="w-full rounded-sm"
                          name=""
                          defaultValue={updateData?.lastName || ""}
                          onChange={(e) =>
                            onChangeInput("lastName", e.target.value)
                          }
                          placeholder="Last Name (Optional)"
                          id=""
                        />
                      </div>
                    </div>
                    <div>
                      <p className="py-2">Email</p>
                      <input
                        type="text"
                        className="w-full rounded-sm"
                        name=""
                        defaultValue={updateData?.email || ""}
                        disabled={true}
                        placeholder="Email"
                        id=""
                      />
                    </div>
           
                    <div className="flex items-center gap-2 my-4 mb-6">
                      <div className="w-[50%]">
                        <p className="pb-1">Roles</p>
                        <DropdownRoles selectedOption={updateData?.selectedRole} onChanges={(e)=>{
                          setUpdateData((prev) => {
                            return {
                              ...prev,
                              selectedRole: e,
                              role:e?.value
                            };
                          });
                        }} options={[
                          { name: "Vendor", value: "vendor" },
                          { name: "Super Admin", value: "superAdmin" },
                        ]}/>
                      </div>
                   
                      <div className="w-[50%]">
                        <p className="pb-1">Vendor Sites</p>
                        <MultiSelectDropdown   unique={true}
                        multi={true} value={updateData?.selectedVendorSites} options={[
                          { name: capitalize("Hammer and bell"), value: "hb" },
                          { name: "Auctropin", value: "auctropin" },
                        ]}

                        selectedValues={updateData?.selectedVendorSites}
                        onSelect={ (e)=>{
                          const uniqueE = uniqBy(e, 'name');
                          setUpdateData((prev) => {
                            return {
                              ...prev,
                                    selectedVendorSites: uniqueE,
                                    vendorSites: isValidArray(uniqueE) ?uniqueE.map(item => item?.value):[],
                            };
                          });
                        } }
                        onRemove={(e)=>{
                          const uniqueE = uniqBy(e, 'name');
                          setUpdateData((prev) => {
                            return {
                              ...prev,
                              selectedVendorSites: uniqueE,
                              vendorSites: isValidArray(uniqueE)? uniqueE.map(item => item?.value):[],
                            };
                          });
                        }}
                        displayValue="name"
                        />
                  
                      </div>
                   
                    </div>
                    <div className="flex my-2 gap-2">
                        <p>Blocked</p>
                        <Switch
                          onChange={onChangeBoolean}
                          keys="isBlocked"
                          checked={updateData?.isBlocked ?? false}
                        />
                      </div>
                    <div className="flex my-2 gap-2">
                      <p>Email Verified</p>
                      <Switch
                        onChange={onChangeBoolean}
                        keys="isEmailVerified"
                        checked={updateData?.isEmailVerified ?? true}
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex  flex-col md:flex-row  items-center gap-2 my-4">
                      <div className="  w-full md:w-[50%]">
                        <p className="py-2">Street Name</p>
                        <input
                          type="text"
                          className="w-full rounded-sm"
                          name=""
                          defaultValue={updateData?.address?.streetName || ""}
                          onChange={(e) =>
                            onChangeAddress("streetName", e.target.value)
                          }
                          placeholder="Street Name"
                          id=""
                        />
                      </div>
                      <div className=" w-full  md:w-[50%]">
                        <p className="py-2">Street Number</p>
                        <input
                          type="text"
                          className="w-full rounded-sm"
                          name=""
                          defaultValue={updateData?.address?.streetNumber || ""}
                          onChange={(e) =>
                            onChangeAddress("streetNumber", e.target.value)
                          }
                          placeholder="Street Number"
                          id=""
                        />
                      </div>
                    </div>
                    <div className="flex  flex-col md:flex-row   items-center gap-2 my-4">
                      <div className=" w-full md:w-[50%]">
                        <p className="py-2"> APT OR UNIT NUMBER (Optional)</p>
                        <input
                          type="text"
                          className="w-full rounded-sm"
                          name=""
                          defaultValue={updateData?.address?.aptUnit || ""}
                          onChange={(e) =>
                            onChangeAddress("aptUnit", e.target.value)
                          }
                          placeholder=" APT OR UNIT NUMBER (Optional)"
                          id=""
                        />
                      </div>
                      <div className=" w-full  md:w-[50%]">
                        <p className="py-2">City</p>
                        <input
                          type="text"
                          className="w-full rounded-sm"
                          name=""
                          defaultValue={updateData?.address?.city || ""}
                          onChange={(e) =>
                            onChangeAddress("city", e.target.value)
                          }
                          placeholder="City"
                          id=""
                        />
                      </div>
                    </div>
                    <div className="my-4 flex   flex-col md:flex-row items-center gap-4">
                      <div className=" w-full  md:w-[50%]">
                        <p className="py-2">State</p>
                        <input
                          type="text"
                          className="w-full rounded-sm"
                          name=""
                          defaultValue={updateData?.address?.state || ""}
                          onChange={(e) =>
                            onChangeAddress("state", e.target.value)
                          }
                          placeholder="State"
                          id=""
                        />
                      </div>
                      <div className="w-full md:w-[50%]">
                        <p className="py-2">ZipCode</p>
                        <input
                          type="text"
                          className="w-full rounded-sm"
                          name=""
                          defaultValue={updateData?.address?.zipCode || ""}
                          onChange={(e) =>
                            onChangeAddress("zipCode", e.target.value)
                          }
                          placeholder="Zip Code"
                          id=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8  flex justify-end gap-4 ">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 w-[80px focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    {isRequestAdmin ? (
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
                          await handleUpdateAdmin();
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
