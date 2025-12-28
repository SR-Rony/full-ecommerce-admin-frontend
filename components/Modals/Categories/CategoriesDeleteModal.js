import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { deleteCategories } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function CategoriesDeleteModal({
  isOpen,
  categories,
  oldSlug,
  setIsOpen,
  setCategories,
  updateData,
  setUpdateData,
}) {
  const [isRequest, setIsRequest] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };
  const handleDelete = async (id, slug) => {
    setIsRequest(true);
    await deleteCategories(slug)
      .then((res) => {
        setUpdateData({});
        if (res?.data?.success) {
          setIsRequest(false);
          if (isValidArray(categories?.data)) {
            setCategories((prev) => {
              return {
                ...prev,
                data: prev.data.filter((item) => item?._id !== id),
              };
            });
          }
          Swal.fire({
            title: "Success",
            text: res?.data.message,
            icon: "success",
          });
          closeModal();
        } else {
          Swal.fire({
            title: "Error!",
            text: res?.data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {
        setIsRequest(false);
        Swal.fire({
          title: "Error!",
          text: err?.response?.data?.message,
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-[200px]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Delete
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>
                  <div className="mt-2">
                    <h2>Are you sure you want to Delete?</h2>
                  </div>
                  <div className="mt-2">{updateData?.name}</div>
                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 w-[80px focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    {isRequest ? (
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
                          await handleDelete(updateData?._id, oldSlug);
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
