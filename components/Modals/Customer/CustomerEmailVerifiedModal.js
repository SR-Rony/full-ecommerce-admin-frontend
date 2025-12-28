import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitterHTML } from "@/utils/Toast";
import { customersBulkEmailVerified } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function CustomerEmailVerifiedModal({setSelectAllChecked, isOpen,fetchCustomers,setSelectedItems, setIsOpen, type }) {
  const { Customer } = useFullStage();
  const [customerSingleDetails, setCustomerSingleDetails] = Customer.CustomerSingleDetails;
  const [customerPage, setCustomerPage, orderLimit, setCustomerLimit] = Customer.CustomerPaginate;
  const [customers, setCustomers] = Customer.Customers;
  const [isRequestCustomer, setIsRequestCustomer] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };
  const handleActivatedCustomer = async () => {
    setIsRequestCustomer(true);
    await customersBulkEmailVerified({ customerIds: customerSingleDetails?.customerIds }).then(async(res) => {
      ToastEmitterHTML('success-html', <div>
      <p>Bulk email verified operation success ({res?.data?.data?.updateCustomers?.length||0} ) </p>
      <p>Bulk already verified skip operation ({res?.data?.data?.alreadyVerifiedCustomers?.length||0} ) </p>
    </div>);
      if (res?.data?.success) {
        setIsRequestCustomer(false);
        // const updateCustomers = isValidArray(customers?.data) ? customers?.data.map(item => {
        //   if (isValidArray(res?.data?.data?.updateCustomers) && res?.data?.data?.updateCustomers.find(itm => itm == item?._id)) {
        //     return {
        //       ...item,
        //       isEmailVerified: true
        //     };
        //   } else {
        //     return item;
        //   }
        // }) : customers?.data;
        setCustomerSingleDetails({});
        setSelectedItems([]);
        setSelectAllChecked(false);
        // setCustomers(updateCustomers);
      await  fetchCustomers();

      }
      setIsRequestCustomer(false);
    }).catch(err => {
      setSelectAllChecked(false);
      setSelectedItems([]);
      setIsRequestCustomer(false);
      ToastEmitterHTML('error', <div>
        <p>Bulk activated operation success ({err?.response?.data?.data?.updateCustomers?.length} ) </p>
        <p>Bulk activated operation failed  ({err?.response?.data?.data?.failedUpdateCustomers?.length} ) </p>
      </div>);

    });

  };

  //console.log(customerSingleDetails);
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-[200px]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                     Mark the customer email as verified 
                    </Dialog.Title>
                    <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                  </div>
                  <div className="mt-2">
                    <h2>Are you sure you want to verify the email of the selected customers?</h2>
                  </div>
                  <div className="mt-4">
                    {/* {isValidArray(customerSingleDetails?.customerIds) && customerSingleDetails.customerIds.map((item, i) =>  (<span key={i}>
                        {item}{i < customerSingleDetails?.customerIds?.length - 1 ? ", " : ""}
                      </span>)
                    )} */}
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 w-[80px focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    {isRequestCustomer ? <button
                      type="button"
                       className="inline-flex gap-1 justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                    >
                      <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                    </button> : <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                      onClick={async () => {
                        await handleActivatedCustomer(false);
                        closeModal();
                      }}
                    >
                      Verified
                    </button>}
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
