import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import {
  createContactCategories,
  getContactCategories,
  updateContactCategories,
} from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { stubTrue } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { IoIosCloseCircle, IoMdSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import Swal from "sweetalert2";
import DeleteContactCategoriesModal from "./DeleteContactCategoriesModal";

export default function CreateContactCategoriesModal({ isOpen, setIsOpen }) {
  const [isRequest, setIsRequest] = useState(false);
  const [contactCategories, setContactCategories] = useState([]);
  const [contactCategoryUpdateData, setContactCategoryUpdateData] = useState(
    {}
  );

  const [isUpdateRequest, setIsUpdateRequest] = useState(false);
  const [isCreateRequest, setIsCreateRequest] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState({});
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleContactCategories = async () => {
    try {
      setIsRequest(true);
      const res = await createContactCategories(contactCategoryUpdateData);
      setIsRequest(false);
      if (res?.data?.success) {
        setContactCategoryUpdateData({});
        const modifiedData = isValidArray(contactCategories)
          ? [res?.data?.data, ...contactCategories]
          : [res?.data?.data];
        setContactCategories(modifiedData);
        Swal.fire({
          title: "Success",
          text: res?.data?.message,
          icon: "success",
        });
        setIsCreateRequest(false);
      } else {
        Swal.fire({
          title: "Error!",
          text: res?.data?.message,
          icon: "error",
        });
      }
    } catch (error) {
      //console.log(error);
      setIsRequest(false);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message,
        icon: "error",
      });
    }
  };

  const handleContactCategoriesUpdate = async () => {
    // console.log(obj,'updatedData');
    try {
      setIsUpdateRequest(true);

      const res = await updateContactCategories(actionMode?._id, {
        name: actionMode?.name,
      });
      if (res?.data?.success) {
        setActionMode({});
        const modifiedData = isValidArray(contactCategories)
          ? contactCategories.map((item) => {
              if (item?._id === actionMode?._id) {
                return {
                  ...item,
                  ...res?.data?.data,
                };
              } else {
                return item;
              }
            })
          : [];
        setContactCategories(modifiedData);
        Swal.fire({
          title: "Success",
          text: res?.data?.message,
          icon: "success",
        });
      }
      setIsUpdateRequest(false);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message,
        icon: "error",
      });
      setIsUpdateRequest(false);

      // console.log(error);
    }
  };

  const fetchContactCategories = async () => {
    try {
      const res = await getContactCategories({});
      setContactCategories(res.data.data);
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    fetchContactCategories();
  }, []);

  // console.log(contactCategoryUpdateData, 'contact categories');

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
                <Dialog.Panel className="w-full max-w-4xl  transform rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md  px-[15px]   lg:px-[40px]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Contact Categories
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>
                  <div className="h-[300px] overflow-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 text-center px-4 border-b">
                            Name
                          </th>
                          <th className="py-2 text-center  px-4 border-b">
                            Action
                          </th>
                        </tr>
                        {isValidArray(contactCategories) &&
                          contactCategories.map((item, i) => (
                            <tr key={i} className="">
                              {actionMode?.action == "edit" &&
                              i == actionMode?.index &&
                              actionMode?._id &&
                              item?._id ? (
                                <input
                                  type="text"
                                  className="w-full mt-2"
                                  name=""
                                  value={actionMode?.name}
                                  id=""
                                  onChange={(e) => {
                                    setActionMode({
                                      ...actionMode,
                                      name: e.target.value,
                                    });
                                  }}
                                />
                              ) : (
                                <td className="text-center py-2 cursor-pointer">
                                  {item?.name}
                                </td>
                              )}

                              <td className="text-center py-2">
                                <div
                                  className={`flex justify-center text-center`}
                                >
                                  {actionMode?.action == "edit" &&
                                  i == actionMode?.index &&
                                  actionMode?._id &&
                                  item?._id ? (
                                    <div className="flex gap-2">
                                      <button
                                        className="bg-red-500 text-white shadow-md rounded-md px-2 py-1"
                                        onClick={() => {
                                          setActionMode({
                                            index: i,
                                            ...item,
                                            action: "un_edit",
                                            active: !actionMode?.active,
                                          });
                                        }}
                                      >
                                        {" "}
                                        <IoClose />
                                      </button>

                                      {isUpdateRequest ? (
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-not-allowed">
                                          {" "}
                                          <Loader bg="transparent" />
                                        </button>
                                      ) : (
                                        <button
                                          className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                          onClick={() => {
                                            handleContactCategoriesUpdate();
                                          }}
                                        >
                                          {" "}
                                          <IoMdSend />
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 justify-end pt-3">
                                      <button
                                        className="flex items-center gap-1 cursor-pointer"
                                        onClick={() =>
                                          setActionMode({
                                            index: i,
                                            ...item,
                                            action: "edit",
                                            active: !actionMode?.active,
                                          })
                                        }
                                      >
                                        <RiEditLine size={18} />
                                      </button>
                                      |
                                      <button
                                        className="flex items-center gap-1 cursor-pointer"
                                        onClick={() => {
                                          setActionMode({
                                            index: i,
                                            ...item,
                                            action: "delete",
                                          });
                                          setDeleteModalOpen(stubTrue);
                                        }}
                                      >
                                        <MdOutlineDeleteOutline size={18} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </thead>
                    </table>
                  </div>
                  <div
                    className={`${
                      isCreateRequest ? "p-4 border pt-[20px]" : "pt-[20px]"
                    }`}
                  >
                    <div className="">
                      <button
                        className="block ms-auto bg-blue-500 text-white px-4 py-2 rounded-md  justify-end"
                        onClick={() => setIsCreateRequest(!isCreateRequest)}
                      >
                        Add New Category
                      </button>
                    </div>

                    {isCreateRequest && (
                      <div className="mt-8">
                        <p className="py-2 font-bold">Category Name</p>
                        <input
                          type="text"
                          value={contactCategoryUpdateData?.name || ""}
                          className="w-full"
                          onChange={(e) => {
                            setContactCategoryUpdateData({
                              ...contactCategoryUpdateData,
                              name: e.target.value,
                            });
                          }}
                        />
                        <div className="pt-[40px]">
                          {isRequest ? (
                            <button className="block ms-auto bg-blue-500 text-white px-4 py-2 rounded-md  justify-end">
                              <Loader bg="transparent" />{" "}
                            </button>
                          ) : (
                            <button
                              className="block ms-auto bg-blue-500 text-white px-4 py-2 rounded-md  justify-end"
                              onClick={() => {
                                handleContactCategories();
                              }}
                            >
                              Create
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <DeleteContactCategoriesModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        contactCategories={contactCategories}
        setContactCategories={setContactCategories}
        actionMode={actionMode}
        setActionMode={setActionMode}
        setCreateModal={setIsOpen}
      />
    </>
  );
}
