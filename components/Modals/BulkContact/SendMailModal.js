import MessageInputBulkContact from "@/components/Shared/MessageInputBulkContact";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { customEmailBulkSend } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function SendMailModal({
  isOpen,
  setIsOpen,
  editorData,
  setEditorData,
}) {
  const [isRequest, setIsRequest] = useState(false);

  const { Order } = useFullStage();
  const [orders, setOrders] = Order.Orders;
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const closeModal = () => {
    setIsOpen(false);
  };
  const HandlerMailSend = async () => {
    if (!editorData?.subject) {
      return Swal.fire({
        title: "Error!",
        text: "Please write a subject!",
        icon: "error",
      });
    }
    if (!editorData?.message) {
      return Swal.fire({
        title: "Error!",
        text: "Please write a message!",
        icon: "error",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: `you want to send selected customers mail?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const emails = isValidArray(orders?.data)
            ? orders?.data
                .filter((itm) =>
                  orderSingleDetails?.orderIds.includes(itm?.orderId)
                )
                .map((item) => item?.shipping?.email)
            : [];
          if (!emails?.length) {
            return Swal.fire({
              title: "Error!",
              text: "Please re-select order!",
              icon: "error",
            });
          }
          setTimeout(() => {
            setIsOpen(false);
          }, 2000);
          Swal.fire({
            title: "Success",
            timer: 2000,
            text: "Emails have been sent to the queue.",
            icon: "success",
          });

          const res = await customEmailBulkSend({
            emails: emails,
            message: editorData?.message,
            subject: editorData?.subject,
          });
          // if (res?.data?.success) {
          //   Swal.fire({
          //     title: "Success",
          //     timer: 3000,
          //     text: `Sending  email queue is done!. success(${res?.data?.successSent}) and failed(${res?.data?.failedSent||0})`,
          //     icon: "success"
          //   });

          // } else {
          //   Swal.fire({
          //     title: "Success",
          //     text:  `Sending  email queue is done!. success(${res?.data?.successSent}) and failed(${res?.data?.failedSent||0})`,
          //     timer: 4000,
          //     icon: "success"
          //   });
          // }
        } catch (error) {
          setIsOpen(false);
          Swal.fire({
            title: "Error!",
            timer: 1000,
            text: error?.response?.data?.message || "",
            icon: "error",
          });
        }
      }
    });
  };

  const onChangeMessage = (value) => {
    setEditorData((prev) => {
      return {
        ...prev,
        message: value,
      };
    });
  };
  const onChangeInput = (keys, value) => {
    setEditorData((prev) => {
      return {
        ...prev,
        [keys]: value,
      };
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white  p-4  lg:p-8 text-left align-middle shadow-xl transition-all rounded-md  px-[16px]   lg:px-[40px] h-full">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Send email to selected customers.
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>

                  <div className="mt-5">
                    <div className="mb-4">
                      <div className="flex items-center gap-1">
                        <label
                          htmlFor="subject"
                          className="block text-sm font-semibold text-gray-600"
                        >
                          Subject:
                        </label>
                      </div>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        className="mt-1 p-2 block w-full rounded border border-gray-300"
                        checked={editorData?.checked}
                        onChange={(e) =>
                          onChangeInput("subject", e.target.value)
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center gap-1">
                        <label
                          htmlFor="message"
                          className="block text-sm font-semibold text-gray-600"
                        >
                          Message:
                        </label>
                      </div>
                      <MessageInputBulkContact
                        value={editorData?.message}
                        onChange={onChangeMessage}
                      />
                    </div>
                  </div>

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
                          await HandlerMailSend();
                        }}
                      >
                        Send
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
