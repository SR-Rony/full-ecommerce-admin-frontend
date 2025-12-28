import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import {
  customersActivated,
  customersBulkActivated,
  updateCustomerActive,
} from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";

export default function CustomerActiveModal({
  setSelectAllChecked,
  isOpen,
  fetchCustomers,
  setSelectedItems,
  setIsOpen,
  type,
}) {
  const { Customer } = useFullStage();
  const [customerSingleDetails, setCustomerSingleDetails] =
    Customer.CustomerSingleDetails;
  const [customers, setCustomers] = Customer.Customers;
  const [isRequestCustomer, setIsRequestCustomer] = useState(false);
  const [loaderType, setLoaderType] = useState("");
  const [activationResults, setActivationResults] = useState({
    updateCustomers: [], // Successfully activated
    updateFailedData: [], // Failed activations
    alreadyApproved: [], // Already approved
    inProgress: [], // Currently processing
  });
  const [processingQueue, setProcessingQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalToProcess, setTotalToProcess] = useState(0);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setActivationResults({
        updateCustomers: [],
        updateFailedData: [],
        alreadyApproved: [],
        inProgress: [],
      });
      setProcessingQueue([]);
      setIsProcessing(false);
      setTotalToProcess(0);
    }
  }, [isOpen]);

  // Close modal and trigger bulk activation for remaining customers

  const closeModal = () => {
    if (isValidArray(processingQueue)) {
      toast.success("Bulk activation has been initiated and is now running in the background.");
 
      customersBulkActivated({ customerIds: processingQueue })
        .then(async (response) => {
          fetchCustomers();
        })
        .catch((error) => {
          console.error("Bulk activation error:", error.message);
          toast.error("Bulk activation failed: " + error.message); // Optional
        });

      // Clear queue to prevent re-processing
      setIsOpen(false);
      setProcessingQueue([]);
    }
    fetchCustomers();
    setIsOpen(false);
  };

  // Process single customer activation
  const processCustomerActivation = async (customerId) => {
    try {
      const response = await customersActivated({ customerId });
      const customerEmail =
        customers?.data?.find((c) => c._id === customerId)?.email || "N/A";

      if (response?.data?.success) {
        setActivationResults((prev) => ({
          ...prev,
          inProgress: prev.inProgress.filter((item) => item.id !== customerId),
          updateCustomers: [
            ...prev.updateCustomers,
            {
              id: customerId,
              email: customerEmail,
              reason: "Customer activated and email sent successfully",
            },
          ],
        }));
        return true;
      } else {
        throw new Error(
          response?.data?.message || "Failed to activate customer"
        );
      }
    } catch (error) {
      const customerEmail =
        customers?.data?.find((c) => c._id === customerId)?.email || "N/A";
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";

      setActivationResults((prev) => ({
        ...prev,
        inProgress: prev.inProgress.filter((item) => item.id !== customerId),
        [errorMessage.includes("already approved")
          ? "alreadyApproved"
          : "updateFailedData"]: [
          ...prev[
            errorMessage.includes("already approved")
              ? "alreadyApproved"
              : "updateFailedData"
          ],
          {
            id: customerId,
            email: customerEmail,
            reason: errorMessage.includes("already approved")
              ? "Customer is already approved"
              : `Failed: ${errorMessage}`,
          },
        ],
      }));
      return false;
    }
  };

  // Process queue sequentially
  const processQueue = useCallback(async () => {
    if (!processingQueue.length || isProcessing) return;

    setIsProcessing(true);
    const customerId = processingQueue[0];
    const customerEmail =
      customers?.data?.find((c) => c._id === customerId)?.email ||
      "Processing...";

    // Mark customer as in-progress
    setActivationResults((prev) => ({
      ...prev,
      inProgress: [
        ...prev.inProgress,
        {
          id: customerId,
          email: customerEmail,
          reason: "Sending approval email and activating account...",
        },
      ],
    }));

    // Remove customer from queue
    setProcessingQueue((prev) => prev.slice(1));

    // Process customer
    await processCustomerActivation(customerId);

    // Refresh customer list when queue is empty
    if (processingQueue.length === 1) {
      await fetchCustomers();
    }
     fetchCustomers();
    setIsProcessing(false);
  }, [processingQueue, isProcessing, customers?.data, fetchCustomers]);

  // Loop-based queue processing
  useEffect(() => {
    if (isOpen && processingQueue.length > 0) {
      const timer = setTimeout(() => {
        processQueue();
      }, 1000); // Delay between each customer
      return () => clearTimeout(timer);
    }
  }, [processQueue, processingQueue, isOpen]);

  // Start activation process
  const handleActivatedCustomer = async (isBlocked) => {
    setIsRequestCustomer(true);
    setLoaderType(isBlocked ? "blocked" : "active");

    const customerIds = customerSingleDetails?.customerIds || [];
    setTotalToProcess(customerIds.length);
    setProcessingQueue(customerIds);

    setCustomerSingleDetails({});
    setSelectedItems([]);
    setSelectAllChecked(false);

    setIsRequestCustomer(false);
    setLoaderType("");
  };

  // Render result table for each status category
  const ResultTable = ({ data, title, emptyMessage, isInProgress }) => {
    if (!isValidArray(data)) return null;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          {title} ({data.length})
          {isInProgress && (
            <Loader bg="transparent" width={"w-4"} height={"h-4"} />
          )}
        </h3>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b hover:bg-gray-50 ${
                    isInProgress
                      ? "bg-blue-50"
                      : title.includes("Failed")
                      ? "bg-red-50"
                      : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3">{item.email || "N/A"}</td>
                  <td className="px-4 py-3">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const hasResults =
    isValidArray(activationResults.updateCustomers) ||
    isValidArray(activationResults.updateFailedData) ||
    isValidArray(activationResults.alreadyApproved) ||
    isValidArray(activationResults.inProgress);

  const isStillProcessing = isValidArray(processingQueue) || isProcessing;

  const progress = totalToProcess
    ? Math.round(
        ((activationResults.updateCustomers.length +
          activationResults.updateFailedData.length +
          activationResults.alreadyApproved.length) /
          totalToProcess) *
          100
      )
    : 0;

  return (
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

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="w-full max-w-4xl rounded-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 capitalize"
                  >
                   Account Activation & Approval Action
                    {isStillProcessing && (
                      <span className="text-sm text-blue-500 ml-2">
                        (Processing... {Math.min(progress, 100)}%)
                      </span>
                    )}
                  </Dialog.Title>
                  <button>
                    <IoIosCloseCircle size={18} onClick={closeModal} />
                  </button>
                </div>

                {!hasResults ? (
                  <>
                    <div className="mt-4">
                      <h2 className="text-lg">
                        Are you sure you want to approve selected customers?
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        This will activate and send approval emails to{" "}
                        {customerSingleDetails?.customerIds?.length || 0}{" "}
                        selected customers one by one.
                      </p>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </button>
                      {isRequestCustomer ? (
                        <button
                          type="button"
                          className="inline-flex gap-2 justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-not-allowed"
                        >
                          <Loader
                            bg="transparent"
                            width={"w-5"}
                            height={"h-5"}
                          />
                          Processing...
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={() => handleActivatedCustomer(false)}
                        >
                          Start Approval Action
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {totalToProcess > 0 && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 text-center">
                          Progress:{" "}
                          {activationResults.updateCustomers.length +
                            activationResults.updateFailedData.length +
                            activationResults.alreadyApproved.length}{" "}
                          of {totalToProcess} ({Math.min(progress, 100)}%)
                        </p>
                      </div>
                    )}
                    <div className="mt-4 space-y-6">
                      <ResultTable
                        data={activationResults.inProgress}
                        title="Currently Processing"
                        emptyMessage="No customers currently being processed"
                        isInProgress={true}
                      />
                      <ResultTable
                        data={activationResults.updateCustomers}
                        title="Successfully Activated Customers"
                        emptyMessage="No customers were successfully activated"
                      />
                      <ResultTable
                        data={activationResults.updateFailedData}
                        title="Failed to Activate Customers"
                        emptyMessage="No activation failures"
                      />
                      <ResultTable
                        data={activationResults.alreadyApproved}
                        title="Already Approved Customers"
                        emptyMessage="No customers were already approved"
                      />
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                    {isStillProcessing && (
                      <p className="text-sm text-blue-500 mt-2">
                        Note: The activation process will continue in the
                        background using bulk activation if you close the modal.
                      </p>
                    )}
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
