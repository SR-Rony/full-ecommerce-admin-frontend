import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaPlus, FaSpinner, FaMoneyBillWave, FaCheck, FaSync, FaBan } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Contentlayout from '@/shared/layout-components/layout/content-layout';
import { API } from '@/utils/instance';
import { FiCopy, FiCheck } from 'react-icons/fi'; // Import React Icons

import moment from 'moment';
import { FaMinus } from 'react-icons/fa6';
import Loader from '@/shared/Loader/Loader';
export default function CustomerWallet() {
  const router = useRouter();
  const { id } = router.query;
  const isMounted = useRef(true);

  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState({
    customer: true,
    transactions: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [transactionType, setTransactionType] = useState('credit'); // 'credit' or 'debit'
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [selectedCustomer,setSelectedCustomer] = useState(null);
  const limit = 10;
  const [emailSent, setEmailSent] = useState('no')
  const [transactionId,setTransactionId] = useState("");
  const [note,setNote] = useState("");
  const [showRegenTokenModal, setShowRegenTokenModal] = useState(false);
  const [showInvalidateTokenModal, setShowInvalidateTokenModal] = useState(false);
  const [isProcessingToken, setIsProcessingToken] = useState(false);
  const [tokenAction, setTokenAction] = useState(''); // 'regenerate' or 'invalidate'
  const [isUpdatingRefundRequest, setIsUpdatingRefundRequest] = useState(false);
  const [showRefundRequestConfirmation, setShowRefundRequestConfirmation] = useState(false);
  const [pendingRefundRequestValue, setPendingRefundRequestValue] = useState(false);
  const [nextRefundRequestValue, setNextRefundRequestValue] = useState(null);

  const fetchCustomerData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(prev => ({ ...prev, customer: true }));
      const response = await API.get(`/admin/customers/profile/${id}`);
      
      if (isMounted.current) {
        if (response.data.success) {
          console.log(response.data.data,'customers')
          setCustomer(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to load customer data');
        }
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error fetching customer data:', error);
        toast.error(error.response?.data?.message || 'Failed to load customer data');
      }
    } finally {
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, customer: false }));
      }
    }
    setTransactionId("");
    setNote("");
  }, [id]);

  const fetchTransactions = useCallback(async (pageNum) => {
    if (!id) return;
    
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      const response = await API.get(`/admin/wallet/history/${id}`, {
        params: { page: pageNum, limit },
      });

      if (isMounted.current) {
        if (response.data.success) {
          setTransactions(Array.isArray(response.data.data) ? response.data.data : []);
          setTotalPages(response.data.paginate?.totalPage || 1);
          setTotalCount(response.data.paginate?.totalCount || 0);
        } else {
          throw new Error(response.data.message || 'Failed to load transactions');
        }
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error fetching transactions:', error);
        toast.error(error.response?.data?.message || 'Failed to load transactions');
        setTransactions([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, transactions: false }));
      }
    }
  }, [id]);

  const handleTransaction = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    // For debit, check if customer has sufficient balance
    if (transactionType === 'debit') {
      const currentBalance = customer.availableCreditBalance || 0;
      if (parsedAmount > currentBalance) {
        toast.error('Insufficient balance for this debit');
        return;
      }
    }

    setIsAddingMoney(true);
    try {
      const endpoint = transactionType === 'credit' ? '/admin/wallet/credit' : '/admin/wallet/debit';
      const response = await API.post(endpoint, {
        customerId: id,
        amount: parsedAmount,
        description: description || '',
        emailSent: emailSent || 'no',
      });

      if (response.data.success) {
        toast.success(`${transactionType === 'credit' ? 'Credit added' : 'Debit processed'} successfully`);
        setShowAddCreditModal(false);
        setAmount('');
        setDescription('');
        setCurrentPage(1);
        await Promise.all([fetchCustomerData(), fetchTransactions(1)]);
      } else {
        throw new Error(response.data.message || `Failed to process ${transactionType}`);
      }
    } catch (error) {
      console.error(`Error processing ${transactionType}:`, error);
      toast.error(error.response?.data?.message || `Failed to process ${transactionType}`);
    } finally {
      setIsAddingMoney(false);
    }
  };

  const handleMarkAsRefunded = async () => {
    if (!customer?._id) {
      toast.error('No customer data available');
      return;
    }
    if(!transactionId) {
        toast.error('Transaction ID is required');
        return;
    }

    setIsProcessingRefund(true);
    try {
      const response = await API.put(`/admin/wallet/refund-completed/${customer._id}`,{
        note,
        transactionId,
      });
      
      if (response.data.success) {
        toast.success('Refund marked as completed successfully');
        setShowRefundModal(false);
        await fetchCustomerData();
      } else {
        throw new Error(response.data.message || 'Failed to mark refund as completed');
      }
    } catch (error) {
      console.error('Error marking refund as completed:', error);
      toast.error(error.response?.data?.message || 'Failed to mark refund as completed');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const handleTokenAction = async () => {
    if (!customer?._id) {
      toast.error('No customer data available');
      return;
    }

    setIsProcessingToken(true);
    try {
      const endpoint = tokenAction === 'regenerate' 
        ? `/admin/wallet/regenerate-token/${customer._id}`
        : `/admin/wallet/invalidate-token/${customer._id}`;
      
      const response = await API.post(endpoint, { emailSent });
      
      if (response.data.success) {
        toast.success(`Token ${tokenAction}  successfully`);
        fetchCustomerData();
        setShowRegenTokenModal(false);
        setShowInvalidateTokenModal(false);
      } else {
        throw new Error(response.data.message || `Failed to ${tokenAction} token`);
      }
    } catch (error) {
      console.error(`Error ${tokenAction}ing token:`, error);
      toast.error(error.response?.data?.message || `Failed to ${tokenAction} token`);
    } finally {
      setIsProcessingToken(false);
      setTokenAction('');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const openTransactionModal = (type = 'credit') => {
    setTransactionType(type);
    setAmount('');
    setDescription('');
    setShowAddCreditModal(true);
  };

  useEffect(() => {
    isMounted.current = true;
    if (id) {
      fetchCustomerData();
      fetchTransactions(currentPage);
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [id, currentPage, fetchCustomerData, fetchTransactions]);

  useEffect(() => {
    if (customer) {
      setPendingRefundRequestValue(customer.allow_refund_request || false);
    }
  }, [customer]);

  const handleRefundRequestToggle = (newValue) => {
    if (!customer?._id) return;
    
    // Store the new value and show confirmation
    setNextRefundRequestValue(newValue);
    setShowRefundRequestConfirmation(true);
  };

  const confirmRefundRequestChange = async () => {
    if (!customer?._id || nextRefundRequestValue === null) {
      setShowRefundRequestConfirmation(false);
      return;
    }
    
    setIsUpdatingRefundRequest(true);
    try {
      const response = await API.put(`/admin/wallet/toggle-refund-request/${customer._id}`, {
        allow_refund_request: nextRefundRequestValue
      });
      
      if (response.data.success) {
        toast.success('Refund request setting updated successfully');
        // Update local state
        setCustomer(prev => ({
          ...prev,
          allow_refund_request: nextRefundRequestValue
        }));
        setPendingRefundRequestValue(nextRefundRequestValue);
      } else {
        throw new Error(response.data.message || 'Failed to update refund request setting');
      }
    } catch (error) {
      console.error('Error updating refund request setting:', error);
      toast.error(error.response?.data?.message || 'Failed to update refund request setting');
    } finally {
      setIsUpdatingRefundRequest(false);
      setShowRefundRequestConfirmation(false);
      setNextRefundRequestValue(null);
    }
  };

  const refundRequestUrlToken = customer?.creditBalanceRefund?.refund_request_url_token;
  const token_gen_at = customer?.creditBalanceRefund?.token_gen_at;
  const token_invalid_at = customer?.creditBalanceRefund?.token_invalid_at;
  return (
    <Contentlayout>
      <div className="bg-white p-6 rounded-lg shadow">
        {loading.customer && !customer ? (
          <div className="flex justify-center items-center p-8">
            <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2">Loading customer data...</span>
          </div>
        ) : customer ? (
          <>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
  {/* Back button */}
  <button
    onClick={() => router.push('/admin/wallet/balances')}
    className="flex items-center text-blue-600 hover:text-blue-800"
  >
    <FaArrowLeft className="mr-2" /> Back to Credit Balances
  </button>

  {/* Action buttons */}
  <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
    <button
      onClick={() => {
        setTokenAction('regenerate');
        setShowRegenTokenModal(true);
      }}
      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      disabled={isProcessingToken}
    >
      <FaSync className="-ml-1 mr-2 h-4 w-4" />
      Re-gen Token
    </button>

    <button
      onClick={() => {
        setTokenAction('invalidate');
        setShowInvalidateTokenModal(true);
      }}
      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      disabled={isProcessingToken}
    >
      <FaBan className="-ml-1 mr-2 h-4 w-4" />
      Invalidate Token
    </button>

    <button
      onClick={() => openTransactionModal('credit')}
      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      disabled={isAddingMoney || loading.customer}
    >
      <FaPlus className="-ml-1 mr-2 h-4 w-4" />
      Add Credit
    </button>

    <button
      onClick={() => openTransactionModal('debit')}
      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      disabled={isAddingMoney || loading.customer}
    >
      <FaBan className="-ml-1 mr-2 h-4 w-4" />
      Debit
    </button>
  </div>
  
</div>
     {/* Refund Request Toggle - More Visible Version */}
     <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="md:flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-800 flex items-center">
                Refund Request Settings
                <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                  pendingRefundRequestValue 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pendingRefundRequestValue ? 'Enabled' : 'Disabled'}
                </span>
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {pendingRefundRequestValue 
                  ? 'This customer can submit refund requests' 
                  : 'This customer cannot submit refund requests'}
              </p>
            </div>
            <div className="md:flex items-center">
              <div className="">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    pendingRefundRequestValue 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={() => handleRefundRequestToggle(!pendingRefundRequestValue)}
                  disabled={isUpdatingRefundRequest}
                >
                  {pendingRefundRequestValue ? 'Disable Refund Requests' : 'Enable Refund Requests'}
                </button>
                {isUpdatingRefundRequest && (
                  <FaSpinner className="animate-spin text-blue-600 ml-2" />
                )}
              </div>
            </div>
          </div>
        </div>

            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between flex-col md:flex-row items-start mb-4 gap-2">
                <h2 className="text-md md:text-xl font-semibold">
                  {customer?.firstName || 'N/A'} - ({customer?.email || 'N/A'}) {(customer?.site || 'N/A').toUpperCase()}'s Wallet
                </h2>
                {customer?.creditBalanceRefund?.refundRequestedAt && !customer?.creditBalanceRefund?.refundCompletedAt && (
                  <button
                    onClick={() => {
                      setTransactionId("");
                      setNote("");
                      setShowRefundModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    disabled={isProcessingRefund}
                  >
                    Mark as Refunded
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-500">Available Balance</p>
                  <p className="text-2xl font-bold">
                    ${parseFloat(customer.availableCreditBalance || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email || 'N/A'}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.phone?.number || 'N/A'}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-500">Last Transaction</p>
                  <p className="font-medium">
                    {customer.lastTransactionDate
                      ? formatDate(customer.lastTransactionDate)
                      : 'No transactions'}
                  </p>
                </div>
              </div>

              {refundRequestUrlToken || token_gen_at || token_invalid_at ? (
  <div className="mt-2 bg-white p-4 rounded shadow space-y-2">
    {/* Refund URL Token */}
    {refundRequestUrlToken && !loading?.customer && (
      <div className="flex items-center justify-between py-1">
        <span className="text-sm flex text-gray-600 font-medium flex-col md:flex-row md:gap-2">
          <span>Refund URL Token:</span>
          <span className="font-normal text-[12px] text-gray-800 flex items-center break-all">
            <a
              href={`https://hammerandbell.site/refund-request/${refundRequestUrlToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mr-2"
            >
              {`https://hammerandbell.site/refund-request/${refundRequestUrlToken}`}
            </a>
          </span>
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`https://hammerandbell.site/refund-request/${refundRequestUrlToken}`);
            toast.success('Refund URL copied to clipboard');
          }}
          className="ps-2 flex md:me-auto items-center gap-1 text-gray-500 hover:text-gray-800 transition"
          title="Copy to clipboard"
        >
          <FiCopy className="w-4 h-4" />
        </button>
      </div>
    )}
    {
      loading.customer&&(
        <>
        <Loader/>
        
        </>
      )
    }


    {/* Token Generated At */}
    {token_gen_at && (
      <div className="text-xs text-gray-600">
        <span>Token Generated At:</span>
        <span className="font-normal text-gray-800 pl-1">{formatDate(token_gen_at)}</span>
      </div>
    )}

    {/* Token Invalid At */}
    {token_invalid_at && (
      <div className="text-xs text-gray-600">
        <span>Token Invalidate At:</span>
        <span className="font-normal text-gray-800 pl-1">{formatDate(token_invalid_at)}</span>
      </div>
    )}

    <p className="text-xs text-gray-500 mt-1">
      This token provides access to the refund request form
    </p>
  </div>
) : (
  <p className="text-xs text-gray-500 mt-1 p-4 bg-white rounded shadow">
   Refund request token details are not available. You can generate a new token if needed.
  </p>
)}

              {customer.creditBalanceRefund?.refundRequestedAt && (
                <div className={`mt-4 p-2 md:p-4 rounded-md ${
                  customer.creditBalanceRefund?.refundCompletedAt 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {customer.creditBalanceRefund?.refundCompletedAt ? (
                        <FaCheck className="w-4 h-4 md:h-5 md:w-5 text-green-400" />
                      ) : (
                        <FaMoneyBillWave className="h-5 w-5 text-amber-400" />
                      )}
                    </div>
                    <div className="">
                      <h3 className="text-sm ml-3 font-medium">
                        {customer.creditBalanceRefund?.refundCompletedAt 
                          ? 'Refund Completed' 
                          : 'Refund Requested'}
                      </h3>
                    </div>
                  </div>
                  <RefundInfo customer={customer} />
                </div>
              )}


              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Transaction History</h3>

                {loading.transactions ? (
                  <div className="flex justify-center items-center p-8">
                    <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
                    <span className="ml-2">Loading transactions...</span>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No transactions found</div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Previous Balance
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    transaction.type === 'credit'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {transaction.type.toUpperCase()}
                                </span>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                }`}
                              >
                                {transaction.type === 'credit' ? '+' : '-'}$
                                {parseFloat(transaction.amount || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${parseFloat(transaction.previousBalance || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {transaction.description || 'No description'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalPages > 1 && (
                      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <div className="text-sm text-gray-700 py-2">
                            Page {currentPage} of {totalPages}
                          </div>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing{' '}
                              <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                              <span className="font-medium">
                                {Math.min(currentPage * limit, totalCount)}
                              </span>{' '}
                              of <span className="font-medium">{totalCount}</span> results
                            </p>
                          </div>
                          <div>
                            <nav
                              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                              aria-label="Pagination"
                            >
                              <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="sr-only">Previous</span>
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>

                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }

                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                      currentPage === pageNum
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}

                              <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="sr-only">Next</span>
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">Failed to load customer data</div>
        )}

        {showRefundModal && customer && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto md:hidden flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FaMoneyBillWave className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Mark Refund as Completed
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to mark this refund as completed?
                        </p>
                        <div className="mt-4 bg-amber-50 p-4 rounded-md">
                          <p className="text-sm font-medium text-gray-700">
                            Refund Amount: <span className="font-bold">${parseFloat(customer?.creditBalanceRefund?.refundAmount || 0).toFixed(2)}</span>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Requested on: {formatDate(customer?.creditBalanceRefund?.refundRequestedAt)}
                          </p>
                          <p className='font-[600] mt-2'>* Transaction ID:</p>
                          <input value={transactionId} onChange={(e)=>{
                            setTransactionId(e.target.value);
                          }} required className='form-input w-full border-black rounded-md' placeholder='Transaction ID'/>
                          <p className='font-[600] mt-2'>Note:</p>
                          <textarea onChange={(e)=>{
                            setNote(e.target.value);
                          }} placeholder='Note (optional)' className='form-textarea w-full border-black rounded-md'></textarea>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          This action will notify the customer that their refund has been processed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleMarkAsRefunded}
                    disabled={isProcessingRefund}
                  >
                    {isProcessingRefund ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Refund Completed'
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowRefundModal(false)}
                    disabled={isProcessingRefund}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        )}

        {/* Token Regeneration Confirmation Modal */}
        {showRegenTokenModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto p-2">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FaSync className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Regenerate Token
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to generate a new refund request token? This will invalidate the existing token.
                        </p>
                        <div className="mt-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={emailSent === 'yes'}
                              onChange={(e) => setEmailSent(e.target.checked ? 'yes' : 'no')}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Send email notification to customer
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                    onClick={handleTokenAction}
                    disabled={isProcessingToken}
                  >
                    {isProcessingToken ? 'Processing...' : 'Regenerate'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setShowRegenTokenModal(false)}
                    disabled={isProcessingToken}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invalidate Token Confirmation Modal */}
        {showInvalidateTokenModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto p-2">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FaBan className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Invalidate Token
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to invalidate the current refund request token? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                    onClick={handleTokenAction}
                    disabled={isProcessingToken}
                  >
                    {isProcessingToken ? 'Processing...' : 'Invalidate'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setShowInvalidateTokenModal(false)}
                    disabled={isProcessingToken}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

   

        {showAddCreditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {transactionType === 'credit' ? 'Add Credit' : 'Debit from'} Wallet
                </h2>
                <button
                  onClick={() => {
                    setShowAddCreditModal(false);
                 
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="font-medium">
                  Customer: {customer?.firstName} {customer?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Current Balance: ${(customer?.availableCreditBalance || 0).toFixed(2)}
                </p>
              </div>

              <form onSubmit={handleTransaction}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                    Amount to {transactionType === 'credit' ? 'Add' : 'Deduct'} ($)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={transactionType === 'debit' ? (customer?.availableCreditBalance || 0) : undefined}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter amount to ${transactionType}`}
                    required
                  />
                  {transactionType === 'debit' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: ${(customer?.availableCreditBalance || 0).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={`Enter description for this ${transactionType}`}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="emailSent" className="flex items-center space-x-2 cursor-pointer">
                    <input
                      id="emailSent"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                      checked={emailSent === 'yes'}
                      onChange={(e) => setEmailSent(e.target.checked ? 'yes' : 'no')}
                    />
                    <span className="text-sm text-gray-700 font-medium">Send email notification to customer</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => {
                      setShowAddCreditModal(false);
                      setAmount('');
                      setDescription('');
                    }}
                    disabled={isAddingMoney}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                      transactionType === 'credit'
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    }`}
                    disabled={isAddingMoney}
                  >
                    {isAddingMoney ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />
                        Processing...
                      </>
                    ) : (
                      `${transactionType === 'credit' ? 'Add' : 'Deduct'} $${amount || '0.00'}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showRefundRequestConfirmation && (
          <div className="fixed z-10 inset-0 overflow-y-auto p-2">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FaCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Confirm Refund Request Setting
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to {nextRefundRequestValue ? 'enable' : 'disable'} refund requests for this customer?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                    onClick={confirmRefundRequestChange}
                    disabled={isUpdatingRefundRequest}
                  >
                    {isUpdatingRefundRequest ? 'Processing...' : 'Confirm'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setShowRefundRequestConfirmation(false)}
                    disabled={isUpdatingRefundRequest}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Contentlayout>
  );
}




function CopyableField({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm flex text-gray-600 font-medium flex-col md:flex-row md:gap-2">
        <span>{label}:</span> <span className="font-normal text-[12px] text-gray-800">{value}</span>
      </span>
      <button
        onClick={handleCopy}
        className="md:ml-7 ps-2 flex md:me-auto items-center gap-1 text-gray-500 hover:text-gray-800 transition"
        title="Copy"
      >
        {copied ? (
          <>
            <FiCheck className="w-4 h-4 text-green-500" />
            {/* <span className="text-xs text-green-500">Copied!</span> */}
          </>
        ) : (
          <FiCopy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}


 function RefundInfo({ customer }) {
  const email = customer?.creditBalanceRefund?.refundInformation?.email || '';
  const btc = customer?.creditBalanceRefund?.refundInformation?.btcAddress || '';
  const amount = `$${parseFloat(customer?.creditBalanceRefund?.refundAmount || 0).toFixed(2)}`;
  const requested = formatDate(customer?.creditBalanceRefund?.refundRequestedAt);
  const transactionId = customer?.creditBalanceRefund?.transactionId||"";
  const note = customer?.creditBalanceRefund?.note||"N/A";

  const completed = customer?.creditBalanceRefund?.refundCompletedAt
    ? formatDate(customer?.creditBalanceRefund?.refundCompletedAt)
    : null;

  return (
    <div className="mt-3">
      <CopyableField label="Email" value={email} />
      <CopyableField label="BTC Address" value={btc} />
      <CopyableField label="Amount" value={amount} />
      <CopyableField label="Transaction ID" value={transactionId||"N/A"} />
 
      <div className="text-sm mt-2 mb-2 text-gray-600">
        <p>Note: <span className="text-gray-800">{note}</span></p>
      </div>
      <div className="text-sm text-gray-600">
        <p className='mb-2'>Requested: <span className="text-gray-800">{requested}</span></p>
        {completed && (
          <p>Completed: <span className="text-gray-800">{completed}</span></p>
        )}
      </div>
    </div>
  );
}



function formatDate(dateStr) {
  return dateStr ? moment(dateStr).format('MMM D, YYYY, h:mm A') : 'N/A';
}