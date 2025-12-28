
"use client";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import { orderBulkTrackingUpdate, orderStatusSingleUpdate, orderTrackNumberRemove, orderTrackNumberUpdate } from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function BulkTrackingNumberUpdateVersion2({ isOpen, setIsOpen, setSelectAllChecked, setSelectedItems, fetchPaginateOrders, fetchOrderStats }) {
    const [orderReq,setOrderReq] = useState(true);
          // Bulk tracking state variables
  const [bulkTrackingText, setBulkTrackingText] = useState('');
  const [updateExistingTracking, setUpdateExistingTracking] = useState(false);
  const [bulkTrackingRequest, setBulkTrackingRequest] = useState(false);
  const [bulkTrackingResults, setBulkTrackingResults] = useState([]);
  const [bulkTrackingSummary, setBulkTrackingSummary] = useState(null);
    useEffect(()=>{
setOrderReq(false);
    },[]);
      // Bulk tracking number update function
  const handleBulkTrackingUpdate = async () => {
    if (!bulkTrackingText.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Please enter tracking data",
        icon: "error",
      });
      return;
    }

    setBulkTrackingRequest(true);
    setBulkTrackingResults([]);
    setBulkTrackingSummary(null);

    try {
      // Parse the textarea input
      const lines = bulkTrackingText.trim().split('\n').filter(line => line.trim());
      const trackingData = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        let orderId = '';
        let trackingNumber = '';

        // Format 1: ORDER_ID:TRACKING_NUMBER
        if (trimmedLine.includes(':') && !trimmedLine.toLowerCase().includes('order')) {
          const parts = trimmedLine.split(':');
          if (parts.length === 2) {
            orderId = parts[0].trim();
            trackingNumber = parts[1].trim();
          }
        }
        // Format 2: ORDER #BGaOr8 - 9400 1379 0324 4999 4684 45
        else if (trimmedLine.toLowerCase().includes('order') && trimmedLine.includes(' - ')) {
          const parts = trimmedLine.split(' - ');
          if (parts.length === 2) {
            // Extract order ID (remove "ORDER #" prefix)
            orderId = parts[0].trim().replace(/^ORDER\s*#?/i, '').trim();
            // Extract tracking number
            trackingNumber = parts[1].trim();
          }
        }
        // Format 3: #324234 this is order - 32423 this is tracking
        else if (trimmedLine.includes(' - ') && trimmedLine.toLowerCase().includes('this is')) {
          const parts = trimmedLine.split(' - ');
          if (parts.length === 2) {
            // Extract order ID (remove # if present and clean up)
            orderId = parts[0].trim().replace(/^#/, '').replace(/\s+this\s+is\s+order\s*$/i, '').trim();
            // Extract tracking number (clean up)
            trackingNumber = parts[1].trim().replace(/^this\s+is\s+tracking\s*/i, '').trim();
          }
        }
        // Format 4: Simple dash format HB240001 - 1Z999AA1234567890
        else if (trimmedLine.includes(' - ') && !trimmedLine.toLowerCase().includes('order') && !trimmedLine.toLowerCase().includes('this is')) {
          const parts = trimmedLine.split(' - ');
          if (parts.length === 2) {
            orderId = parts[0].trim();
            trackingNumber = parts[1].trim();
          }
        }

        // Add to tracking data if both values are found
        if (orderId && trackingNumber) {
          trackingData.push({
            orderId: orderId,
            trackingNumber: trackingNumber
          });
        }
      }

      if (trackingData.length === 0) {
        throw new Error('No valid tracking data found. Please check the format and try again.');
      }

      // Make API call to bulk update tracking numbers
      const result = await orderBulkTrackingUpdate({
        trackingData,
        updateExisting: updateExistingTracking
      });

      if (result.data.success) {
        setBulkTrackingResults(result.data.data.results);
        setBulkTrackingSummary(result.data.data.summary);
        
        // Show success message
        Swal.fire({
          title: "Bulk Update Completed!",
          text: `${result.data.data.summary.successful} successful, ${result.data.data.summary.failed} failed, ${result.data.data.summary.alreadyExists} already exist, ${result.data.data.summary.skipped || 0} skipped (fully shipped)`,
          icon: "success",
        });

        // Refresh order details if any updates were successful
        if (result.data.data.summary.successful > 0) {
        fetchOrderStats();
          fetchPaginateOrders();
        }
      } else {
        throw new Error(result.data.message || 'Failed to update tracking numbers');
      }
    } catch (error) {
      console.error('Bulk tracking update error:', error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update tracking numbers",
        icon: "error",
      });
    } finally {
      setBulkTrackingRequest(false);
    }
  };

  const closeModal =()=>{
    setIsOpen(false);
  };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
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
                                <Dialog.Panel className="w-full max-w-7xl transform rounded-2xl bg-white p-[15px] text-left align-middle shadow-xl transition-all rounded-md px:[5px] lg:px-[40px] h-full lg:h-[760px] overflow-auto">
                                    <div className="flex item-center justify-between pt-2">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 capitalize"
                                        >
                                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Bulk Tracking Update</h3>
                                        </Dialog.Title>

                                        <button><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>
                                 
                    {/* Full Width Bulk Tracking Update Section */}
                    {!orderReq && (
                      <div className="w-full h-full lg:mt-8  lg:p-6 bg-gray-50 rounded-lg lg:border">
                    
                        {/* Instructions */}
                        <div className="mb-4 p-4 bg-blue-50 lg:border border-blue-200 rounded-md">
                          <h4 className="text-sm font-semibold text-blue-800 mb-3">📋 Instructions:</h4>
                          <ul className="text-sm text-blue-700 space-y-2">
     
                            <li>• <strong>Format:</strong> <code className="bg-blue-100 px-2 py-1 rounded">ORDER #BGaOr8 - 9400 1379 0324 4999 4684 45</code></li>
                          
                            <li>• Enter one order per line, use this format above</li>
                            <li>• Check &quot;Update existing&quot; to overwrite existing tracking numbers</li>
                          </ul>
                        </div>
                        
                        {/* Copyable Example */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600">Example (Click to copy):</label>
      
                          </div>
                          <div className="p-3 bg-gray-100 border rounded text-sm font-mono text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                               onClick={() => {
                                 const example = "ORDER #BGaOr8 - 9400 1379 0324 4999 4684 45\nORDER #hUomSE - 9400 1379 0324 4999 4684 52\nORDER #zV6BsN - 9400 1379 0324 4999 4684 69";
                                 navigator.clipboard.writeText(example);
                                 Swal.fire({
                                   title: "Copied!",
                                   text: "Example copied to clipboard",
                                   icon: "success",
                                   timer: 1500,
                                   showConfirmButton: false
                                 });
                               }}>
                          <small>
                            ORDER #BGaOr8 - 9400 1379 0324 4999 4684 45<br/>
                            ORDER #hUomSE - 9400 1379 0324 4999 4684 52
                          </small>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Column - Input */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tracking Data (Paste your data here)
                              </label>
                            <textarea
                                className="w-full text-xs h-40 p-4 border border-gray-300 rounded-md font-mono focus:ring-2 text-[10px] focus:ring-blue-500 focus:border-blue-500 placeholder:text-[10px]"
                                placeholder={`Paste your tracking data here...\nExample:\nORDER #BGaOr8 - 9400 1379 0324 4999 4684\nORDER #hUomSE - 9400 1379 0324 4999 4684`}
                                value={bulkTrackingText}
                                onChange={(e) => setBulkTrackingText(e.target.value)}/>
                            </div>

                            <div className="flex space-x-3">
                              {bulkTrackingRequest ? (
                                <button className="px-6 py-3 bg-blue-500 text-white rounded-md cursor-not-allowed flex items-center">
                                  <Loader bg="transparent" width={"w-4"} height={"h-4"} />
                                  <span className="ml-2">Processing...</span>
                                </button>
                              ) : (
                                <button
                                  className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                  onClick={handleBulkTrackingUpdate}
                                >
                                  Update Bulk Tracking
                                </button>
                              )}
                              <button
                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                onClick={() => {
                                  setBulkTrackingText('');
                                  setBulkTrackingResults([]);
                                  setBulkTrackingSummary(null);
                                  setUpdateExistingTracking(false);
                                }}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                          
                          {/* Right Column - Results */}
                          <div className="space-y-4">
                            {bulkTrackingResults.length > 0 && (
                              <>
                                <h4 className="text-sm font-semibold text-gray-700">Update Results:</h4>
                                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3 bg-white">
                                  {bulkTrackingResults.map((result, index) => (
                                    <div
                                      key={index}
                                      className={`p-3 rounded text-sm ${
                                        result.status === 'success'
                                          ? 'bg-green-100 text-green-800 border border-green-200'
                                          : result.status === 'already_exists'
                                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                          : result.status === 'skipped'
                                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                          : 'bg-red-100 text-red-800 border border-red-200'
                                      }`}
                                    >
                                      <div className="font-medium">
                                        {result.orderId} : {result.trackingNumber}
                                      </div>
                                      <div className="text-xs mt-1">{result.message}</div>
                                    </div>
                                  ))}
                                </div>
                                {bulkTrackingSummary && (
                                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                                    <strong>Summary:</strong> {bulkTrackingSummary.successful} successful, {bulkTrackingSummary.failed} failed, {bulkTrackingSummary.alreadyExists} already exist, {bulkTrackingSummary.skipped || 0} skipped (fully shipped)
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
