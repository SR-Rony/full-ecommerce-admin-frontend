import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitterHTML } from "@/utils/Toast";
import { isValidArray } from "@/utils/func";
import { customersBulkBlocked } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function CustomerBlockedModal({ setSelectAllChecked, actionType, isOpen, setSelectedItems, fetchCustomers, setIsOpen, type }) {
  const { Customer } = useFullStage();
  const [customerSingleDetails, setCustomerSingleDetails] = Customer.CustomerSingleDetails;
  const [customerPage, setCustomerPage, orderLimit, setCustomerLimit] = Customer.CustomerPaginate;
  const [customers, setCustomers] = Customer.Customers;
  const [isRequestCustomer, setIsRequestCustomer] = useState(false);
  const [loaderType, setLoaderType] = useState('');
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleBlockedCustomer = async (isBlocked) => {
    setIsRequestCustomer(true);
    setLoaderType(isBlocked ? "blocked" : "active");
    try {
      const response = await customersBulkBlocked({
        customerIds: customerSingleDetails?.customerIds,
        isBlocked: isBlocked
      });

      const successCount = response?.data?.data?.updateCustomers?.length || 0;
      const failCount = response?.data?.data?.failedUpdateCustomers?.length || 0;

      Swal.fire({
        icon: 'success',
        title: 'Bulk Operation Results',
        html: `
      <p>Successfully ${isBlocked ? 'blocked' : 'unblocked'} ${successCount} customers</p>
      <p>Failed to ${isBlocked ? 'block' : 'unblock'} ${failCount} customers</p>
    `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });

      if (response?.data?.success) {
        setLoaderType('');
        setIsRequestCustomer(false);

        // Update customers list with new blocked status
        const updatedCustomers = isValidArray(customers?.data)
          ? customers?.data.map(customer => {
            const wasUpdated = isValidArray(response?.data?.data?.updateCustomers) &&
              response?.data?.data?.updateCustomers.includes(customer?._id);

            return wasUpdated
              ? { ...customer, isBlocked: actionType?.isBlocked }
              : customer;
          })
          : customers?.data;

        // Reset states
        setCustomerSingleDetails({});
        setSelectedItems([]);
        setSelectAllChecked(false);
        await fetchCustomers();
      }

      setIsRequestCustomer(false);

    } catch (error) {
      const successCount = error?.response?.data?.data?.updateCustomers?.length || 0;
      const failCount = error?.response?.data?.data?.failedUpdateCustomers?.length || 0;

      // Reset states
      setSelectAllChecked(false);
      setSelectedItems([]);
      setIsRequestCustomer(false);
      setLoaderType('');

      Swal.fire({
        icon: 'error',
        title: 'Bulk Operation Failed',
        html: `
      <p>Successfully ${isBlocked ? 'blocked' : 'unblocked'} ${successCount} customers</p>
      <p>Failed to ${isBlocked ? 'block' : 'unblock'} ${failCount} customers</p>
    `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    }
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
                    > Bulk{" "}
                      {`Bulk ${actionType?.isBlocked ? 'Block Selected Customers' : 'Unblock Selected Customers'}`}
                    </Dialog.Title>
                    <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                  </div>
                  <div className="mt-2">
                    <h2>Are you sure you want to {actionType?.isBlocked ? 'block' : 'unblock'} selected customers?</h2>
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
                      className="inline-flex w-auto justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                      className="inline-flex w-auto justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                      onClick={async () => {
                        await handleBlockedCustomer(actionType?.isBlocked);
                        closeModal();
                      }}
                    >
                      Bulk {actionType?.isBlocked ? 'Block' : 'Unblock'}
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
