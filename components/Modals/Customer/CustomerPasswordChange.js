import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {IoIosCloseCircle} from "react-icons/io";
import {FaKey} from "react-icons/fa";
import { changeCustomerPasswordApi } from "@/utils/instance";
import toast from "react-hot-toast";
import Loader from "@/shared/Loader/Loader";

export default function CustomerPasswordChange({customerId,isOpen,onClose}) {
  const [data,setData] = useState({
    password: "",
    confirm_password: "",
    sendMail: true,
  });
  const [isLoading,setIsLoading] = useState(false);

  const onSubmit = async ()=> {
    // call api.
    try {
        if(data.password.length<8) {
            return toast.error("Password must have at least 8 characters.");
        }
        if(data.password!=data.confirm_password) {
            return toast.error("Confirm password doesn't match with password.");
        }
        setIsLoading(true);
        await changeCustomerPasswordApi(customerId,data);
        toast.success("Successfully changed.");
        setIsLoading(false);
        onClose();
    } catch(err) {
        setIsLoading(false);
        toast.error(err?.response?.data?.message || err?.response?.message || err?.message || "Failed to update password");
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                <Dialog.Panel className="w-full max-w-[400px] h-auto transform overflow-auto rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[20px] lg:px-[40px]">
                  <div className="flex flex-wrap item-center justify-end">
                    <button>
                      <IoIosCloseCircle size={18} onClick={onClose} />
                    </button>
                  </div>
                  <div className="mt-0 flex flex-col gap-2">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><FaKey/> Change Login Password.</h3>
                    <label>New Password</label>
                    <input type="password" className="" value={data.password} onChange={(e)=>{
                        setData((d)=>({...d,password: e.target.value}));
                    }}  placeholder="Enter New Password."/>
                    <label>Confirm Password</label>
                    <input type="password" className="" value={data.confirm_password} onChange={(e)=>{
                        setData((d)=>({...d,confirm_password: e.target.value}));
                    }} placeholder="Confirm New Password."/>
                    <div> <input type="checkbox" checked={data.sendMail} onChange={(e)=>{
                        setData((d)=>({...d,sendMail: e.target.checked}));
                    }}></input> Send email to customer?</div>
                    <button disabled={isLoading} onClick={(e)=>{
                        onSubmit();
                    }} className="bg-primary rounded-sm p-2 text-white ms-auto"> {isLoading? <Loader bg="transparent"/> : "Change"}</button>
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
