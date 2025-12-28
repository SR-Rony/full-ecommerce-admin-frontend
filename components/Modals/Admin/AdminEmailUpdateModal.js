import Loader from "@/shared/Loader/Loader";
import { otpEmailUpdateReqSendApi, otpEmailVerifyApi } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import _ from 'lodash';
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import OTPInput from "react-otp-input";
import Swal from "sweetalert2";

export default function AdminEmailUpdateModal({
  isOpen,
  setIsOpen,
  profile,
  setProfile,
}) {
  const [isRequest, setIsRequest] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpInput, setOtpInput] = useState(false);
  const closeModal = () => {
    setOtpInput(false);
    setIsOpen(false);
   
  };

  const onChange = (keys, value) => {

    setProfile((prev) => {
      const emailUpdate = prev?.emailUpdate || {};
      return {
        ...prev,
        emailUpdate: {
          ...emailUpdate,
          [keys]: value,
        }
      };
    });
  };

  const handleEmailUpdateRequestSend = async () => {
    try {
      setOtpInput(false);
      setIsRequest(true);
      const res = await otpEmailUpdateReqSendApi({ email: profile?.email || "", ...(profile?.emailUpdate || {}) });
      setIsRequest(false);
      if (res?.data?.success) {
        setOtpInput(true);
        Swal.fire({
          title: "Success",
          text: res?.data?.message,
          icon: "success"
        });
        
      } else {
        setOtpInput(false);
        Swal.fire({
          title: "Error!",
          text: res?.data?.message,
          icon: "error"
        });
      }
    } catch (error) {
      setOtpInput(false);
      setIsRequest(false);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message,
        icon: "error"
      });
    }
  };
  const handleOtpEmailVerifyApi = async (e) => {
    try {
      setIsOtpLoading(true);
      const res = await otpEmailVerifyApi({ code: profile?.emailUpdate?.code || "" });
      setIsOtpLoading(false);

      if (res.data.success) {
        const info = _.omit({
          ...profile,
          ...res?.data?.data
        }, ['updateFullName', 'updateAddressData', 'emailUpdate']);
        window.localStorage.setItem('token',info?.token);
        window.localStorage.setItem('user', JSON.stringify(info));
        setProfile(info);
        Swal.fire({
          title: "Success",
          text: res?.data?.message,
          icon: "success"
        });
        setOtpInput(false);
      } else {
        setIsOtpLoading(false);
        setOtpInput(false);
        Swal.fire({
          title: "Error!",
          text: res?.data?.message,
          icon: "error"
        });
      }
    } catch (error) {
      setIsOtpLoading(false);
      setOtpInput(false);
      // console.log(error);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message,
        icon: "error"
      });
    
      //console.log(error);
    }
  };

  // console.log(profile);
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
                <Dialog.Panel className="w-full max-w-4xl  transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-full">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className=" leading-6 text-gray-900 capitalize text-xl font-bold mb-4"
                    >
                      Email Update
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div>
                      <p className="py-4 pb-2">Current Email</p>
                      <input
                        type="email"

                        className="w-full rounded-sm bg-gray-100"
                        name=""
                        value={profile?.email || ""}
                        placeholder="email"
                        disabled={true}
                        id=""
                      />
                    </div>
                    <div>
                      <p className="py-4 pb-2">Update Email</p>
                      <input
                        type="email"
                        className="w-full rounded-sm"
                        name=""
                        value={profile?.emailUpdate?.updateEmail || ""}
                        onChange={(e) => onChange("updateEmail", e.target.value)}
                        placeholder="Update Email"
                        id=""
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    {isRequest ? (
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
                          handleEmailUpdateRequestSend();

                        }}
                      >
                        send
                      </button>
                    )}
                  </div>
                  {otpInput &&
                    <>
                      <div className="mt-2">
                        <div>
                          <div className="grid gap-y-4">
                            <div className='container mx-auto mt-3'>
                              <h2 className='text-lg font-bold mb-4'>
                                Enter the 6-digit code:
                              </h2>
                              <OTPInput
                                value={profile?.emailUpdate?.code || ""}
                                onChange={(value) => {
                                  onChange("code", value);
                                }}
                                numInputs={6}
                                inputType='tel'
                                renderSeparator={
                                  <span
                                    style={{
                                      fontSize: '8px',
                                      marginLeft: '5px',
                                      marginRight: '5px'
                                    }}
                                  >
                                    {' '}
                                  </span>
                                }
                                renderInput={props => <input {...props} />}
                                inputStyle={{
                                  width: '60px',
                                  marginBottom: '15px',
                                  height: '40px',
                                  borderTop: '1px solid #ddd',
                                  borderLeft: '1px solid #ddd',
                                  borderRight: '1px solid #ddd',
                                  borderBottom: '1px solid #ddd',
                                  backgroundColor: 'transparent',
                                  outline: 'none'
                                }}
                              />
                            </div>
                          </div>

                        </div>

                      </div>
                      <div className="mt-4 flex justify-end gap-4">
                        <button
                          type="button"
                      className="inline-flex w-auto justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"

                          onClick={()=>{}}
                        >
                          Close
                        </button>
                        {isOtpLoading ? <button
                          type="button"
                           className="inline-flex gap-1 justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"
                        >
                          <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                        </button> : <button
                          type="button"
  className="inline-flex w-auto justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"                          onClick={() => handleOtpEmailVerifyApi()}
                        >
                          Otp Verify
                        </button>
                        }

                      </div>
                    </>
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
