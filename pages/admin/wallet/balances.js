import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaWallet, FaPlus, FaUser, FaMinus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Contentlayout from '@/shared/layout-components/layout/content-layout';
import { API } from '@/utils/instance';
import { debounce } from 'lodash';

const WalletBalances = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState(''); // For the input field
  const [searchTerm, setSearchTerm] = useState(''); // For the actual search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddCreditModalOpen, setIsAddCreditModalOpen] = useState(false);
  const [isAddDebitModalOpen, setIsAddDebitModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('credit'); // 'credit' or 'debit'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedCustomerForTopUp, setSelectedCustomerForTopUp] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const dropdownRef = useRef(null);
  const debouncedSearchRef = useRef();
  const debouncedCustomerSearchRef = useRef();
  const limit = 10;
  const router = useRouter();
  const [type, setType] = useState('all')
  const [emailSent, setEmailSent] = useState('no')
  // Initialize debounced functions
  useEffect(() => {
    // For main search
    debouncedSearchRef.current = debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 500);

    // For customer search in modal
    debouncedCustomerSearchRef.current = debounce((query) => {
      searchCustomers(query);
    }, 300);

    return () => {
      debouncedSearchRef.current?.cancel();
      debouncedCustomerSearchRef.current?.cancel();
    };
  }, []);

  // Fetch wallet balances when searchTerm or currentPage changes
  useEffect(() => {
    fetchWalletBalances();
  }, [searchTerm, currentPage]);

  const fetchWalletBalances = async (paramType = 'all') => {
    try {
      setLoading(true);
      const response = await API.get('/admin/wallet/customers/balances', {
        params: {
          page: currentPage,
          limit,
          search: searchTerm,
          type: paramType || 'all',
          
        }
      });

      if (response.data && response.data.success) {
        setCustomers(response.data);
        setTotalPages(response?.data?.paginate?.totalPage || 1);
      } else {
        setCustomers({ data: [] });
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching wallet balances:', error);
      toast.error(error.response?.data?.message || 'Failed to load wallet balances');
      setCustomers({ data: [] });
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearchRef.current(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Cancel any pending debounce and trigger search immediately
    debouncedSearchRef.current?.cancel();
    setSearchTerm(inputValue);
    setCurrentPage(1);
  };

  const handleTransaction = async (e) => {
    e.preventDefault();

    if (!selectedCustomer || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // For debit, check if customer has sufficient balance
    if (transactionType === 'debit') {
      const currentBalance = selectedCustomer.availableCreditBalance || 0;
      if (parseFloat(amount) > currentBalance) {
        toast.error('Insufficient balance for this debit');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const endpoint = transactionType === 'credit' ? '/admin/wallet/credit' : '/admin/wallet/debit';
      const response = await API.post(endpoint, {
        customerId: selectedCustomer._id,
        amount: parseFloat(amount),
        description: description || '',
        emailSent: emailSent || 'no'
      });

      if (response.data && response.data.success) {
        toast.success(`${transactionType === 'credit' ? 'Credit added' : 'Debit processed'} successfully`);
        setIsAddCreditModalOpen(false);
        setIsAddDebitModalOpen(false);
        setAmount('');
        setDescription('');
        fetchWalletBalances();
      } else {
        throw new Error(response.data?.message || `Failed to process ${transactionType}`);
      }
    } catch (error) {
      console.error(`Error processing ${transactionType}:`, error);
      toast.error(error.response?.data?.message || `Failed to process ${transactionType}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTransactionModal = (customer, type = 'credit') => {
    setSelectedCustomer(customer);
    setTransactionType(type);
    setAmount('');
    setDescription('');
    if (type === 'credit') {
      setIsAddCreditModalOpen(true);
    } else {
      setIsAddDebitModalOpen(true);
    }
  };

  const searchCustomers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await API.get(`/admin/customers?isBlocked=false&customerName=${encodeURIComponent(query)}`);
      if (response.data && response.data.success) {
        setSearchResults(response.data.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Failed to search customers');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCustomerSearch = (query) => {
    setCustomerSearchQuery(query);
    if (query.trim().length > 1) {
      setIsSearching(true);
      debouncedCustomerSearchRef.current(query);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleTopUpConfirm = async () => {
    if (!selectedCustomerForTopUp || !topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast.error('Please select a customer and enter a valid amount');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await API.post('/admin/wallet/credit', {
        customerId: selectedCustomerForTopUp,
        amount: parseFloat(topUpAmount),
        description: description || '',
        emailSent: emailSent|| 'no',
      
      });

      if (response.data && response.data.success) {
        toast.success('Wallet topped up successfully');
        setIsTopUpModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedCustomerForTopUp('');
        setTopUpAmount('');
        setDescription('');
        setCustomerSearchQuery('');
        setSearchResults([]);
        fetchWalletBalances();
        setType('all');
      } else {
        throw new Error(response.data?.message || 'Failed to top up wallet');
      }
    } catch (error) {
      console.error('Error topping up wallet:', error);
      toast.error(error.response?.data?.message || 'Failed to top up wallet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectCustomer = (customerId, customerName) => {
    setSelectedCustomerForTopUp(customerId);
    setCustomerSearchQuery(customerName);
    setIsCustomerDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCustomerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset modal states when closing
  const closeTopUpModal = () => {
    setIsTopUpModalOpen(false);
    setSelectedCustomerForTopUp('');
    setTopUpAmount('');
    setDescription('');
    setCustomerSearchQuery('');
    setSearchResults([]);
    setIsCustomerDropdownOpen(false);
  };

  return (
    <Contentlayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <FaWallet className="mr-2 text-blue-600" />
            Credit Balances
          </h1>
          <button
            onClick={() => setIsTopUpModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold py-2 px-4 rounded flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Balance
          </button>
        </div>

        {/* Search */}


        <div className="mb-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row md:items-end gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            {/* Dropdown */}
            <div className="w-full md:w-64">
              <label
                htmlFor="refundType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter Refund Requests
              </label>
              <select
                id="refundType"
                value={type}
                onChange={(e) => {
                  setType(e.target.value)
                  fetchWalletBalances(e.target.value)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm text-gray-700"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="-">No Refund/Reqeuest</option>
                <option value="requested">Requested</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search by customer name or email..."
                  value={inputValue}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto">
              <button
                type="submit"
                className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </form>
        </div>


        {/* Customers Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Customer
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Refund Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Refund Requested
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Refund Completed
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      Array(5).fill(0).map((_, index) => (
                        <tr key={`skeleton-${index}`} className="animate-pulse">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                              <div className="ml-4">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="h-4 w-48 bg-gray-200 rounded"></div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                            <div className="h-8 w-20 bg-gray-200 rounded-md inline-block"></div>
                            <div className="h-8 w-20 bg-gray-200 rounded-md inline-block"></div>
                          </td>
                        </tr>
                      ))
                    ) : customers?.data?.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <FaWallet className="h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {searchTerm ? 'Try adjusting your search or filter to find what you\'re looking for.' : 'No customers with wallet balances found.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      customers?.data?.map((customer) => (
                        <tr key={customer._id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <FaUser className="h-5 w-5" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {customer?.firstName || 'N/A'} - ({customer?.email || ''}) {(customer?.site || 'N/A').toUpperCase()}'s Wallet
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {customer.phone?.number || 'No phone'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="text-gray-900">{customer.email}</div>
                            <div className="text-xs text-gray-500">
                              Member since {new Date(customer.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${customer.isBlocked
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                              }`}>
                              {customer.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                            {customer.isTestCustomer && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                Test Account
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            ${customer.availableCreditBalance?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            {customer.creditBalanceRefund?.refundRequestedAt ? (
                              customer.creditBalanceRefund?.refundCompletedAt ? (
                                // Completed
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Refunded ${parseFloat(customer.creditBalanceRefund?.refundAmount || 0).toFixed(2)}
                                </span>
                              ) : (
                                // Requested but not completed = Requested
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Requested ${parseFloat(customer.creditBalanceRefund?.refundAmount || 0).toFixed(2)}
                                </span>
                              )
                            ) : customer.availableCreditBalance > 0 ? (
                              // No refund requested but has balance = Pending
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                             -
                              </span>
                            ) : (
                              // No balance, no refund
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                -
                              </span>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                            <div className="font-mono font-medium text-gray-900 text-center">
                              {customer.creditBalanceRefund?.refundRequestedAt ? 'Yes' : 'No'}

                            </div>
                            <div className='text-xs text-gray-500 text-center'>
                              {customer.creditBalanceRefund?.refundRequestedAt ? `(${new Date(customer.creditBalanceRefund?.refundRequestedAt).toLocaleString()})` : ''}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <div className="font-mono font-medium text-gray-900 text-center">
                              {customer.creditBalanceRefund?.refundCompletedAt ? 'Yes' : 'No'}
                            </div>
                            <div className='text-xs text-gray-500 text-center'>
                              {customer.creditBalanceRefund?.refundCompletedAt ? `(${new Date(customer.creditBalanceRefund?.refundCompletedAt).toLocaleString()})` : ''}
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
  <button
    onClick={() => router.push(`/admin/wallet/customer/${customer._id}`)}
    className="inline-flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
  >
    View
  </button>

  <button
    onClick={() => openTransactionModal(customer, 'credit')}
    className="inline-flex items-center bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-green-300"
  >
    <FaPlus className="mr-1" /> Add Credit
  </button>

  <button
    onClick={() => openTransactionModal(customer, 'debit')}
    className="inline-flex items-center bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-red-300"
  >
    <FaMinus className="mr-1" /> Debit
  </button>
</td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {!loading && customers?.data?.length > 0 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <div className="text-sm text-gray-700 py-2">
                        Page {currentPage} of {totalPages}
                      </div>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * limit, customers?.paginate?.totalCount || customers?.data?.length || 0)}
                          </span>{' '}
                          of <span className="font-medium">{customers?.paginate?.totalCount || customers?.data?.length || 0}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
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
                                onClick={() => setCurrentPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Combined Transaction Modal */}
        {(isAddCreditModalOpen || isAddDebitModalOpen) && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {transactionType === 'credit' ? 'Add Credit to' : 'Debit from'} Wallet
                </h2>
                <button
                  onClick={() => {
                    setIsAddCreditModalOpen(false);
                    setIsAddDebitModalOpen(false);
                    setSelectedCustomer(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="mb-4">
                <p className="font-medium">
                  Customer: {selectedCustomer.firstName} {selectedCustomer.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Current Balance: ${(selectedCustomer.availableCreditBalance || 0).toFixed(2)}
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
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Amount to {transactionType === 'credit' ? 'Add' : 'Debit'} ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={transactionType === 'debit' ? (selectedCustomer.availableCreditBalance || 0) : undefined}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter amount to ${transactionType}`}
                    required
                  />
                  {transactionType === 'debit' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: ${(selectedCustomer.availableCreditBalance || 0).toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="description">
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
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={emailSent === 'yes'}
                      onChange={(e) => setEmailSent(e.target.checked ? 'yes' : 'no')}
                      className="rounded text-blue-600 focus:ring focus:ring-blue-200"
                    />
                    <span className="text-sm text-gray-700 font-medium">Send email notification to customer</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddCreditModalOpen(false);
                      setIsAddDebitModalOpen(false);
                      setSelectedCustomer(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : `${transactionType === 'credit' ? 'Add' : 'Deduct'} $${amount || '0.00'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Top Up Wallet Modal */}
        {isTopUpModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Top Up Customer Wallet</h2>

              <div className="space-y-4">
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Search Customer
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Search by name or email..."
                      value={customerSearchQuery}
                      onChange={(e) => handleCustomerSearch(e.target.value)}
                      onFocus={() => setIsCustomerDropdownOpen(true)}
                    />
                    {isCustomerDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {isSearching ? (
                          <div className="p-2 text-gray-500">Searching...</div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((customer) => (
                            <div
                              key={customer._id}
                              className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedCustomerForTopUp === customer._id ? 'bg-blue-50' : ''
                                }`}
                              onClick={() => {
                                const customerName = customer.firstName ? customer.firstName : customer.email;
                                handleSelectCustomer(customer._id, customerName);
                              }}
                            >
                              <div className="font-medium">
                                {customer.firstName || "N/A"} - {customer.email || "N/A"} | {customer?.site?.toUpperCase() || "---"}
                              </div>
                              {customer?.firstName && <div className="text-sm text-gray-600">{customer.email || "---"}</div>}
                              <div className="text-sm text-gray-500">
                                Available balance: ${parseFloat(customer?.availableCreditBalance || 0).toFixed(2)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-gray-500">
                            {customerSearchQuery ? 'No customers found' : 'Start typing to search customers'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter amount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a description for this transaction"
                  />
                </div>
              </div>
              <div className="my-6">
  <label htmlFor="emailSent" className="flex items-center space-x-2 cursor-pointer">
    <input
      id="emailSent"
      type="checkbox"
      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
      checked={emailSent === 'yes'}
      onChange={(e) => setEmailSent(e.target.checked ? 'yes' : 'no')}
    />
    <span className="text-sm text-gray-700 font-medium">Send email notification to customer </span>
  </label>
</div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={closeTopUpModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => {
                    if (selectedCustomerForTopUp && topUpAmount && parseFloat(topUpAmount) > 0) {
                      setIsConfirmModalOpen(true);
                    } else {
                      toast.error('Please select a customer and enter a valid amount');
                    }
                  }}
                  disabled={!selectedCustomerForTopUp || !topUpAmount || parseFloat(topUpAmount) <= 0}
                >
                  Add Credit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Confirm Top Up</h2>

              <div className="space-y-4 mb-6">
                <p>
                  Are you sure you want to add <span className="font-bold">${parseFloat(topUpAmount).toFixed(2)}</span> to
                  {selectedCustomerForTopUp && (
                    <span className="font-bold ml-1">
                      {searchResults.find(c => c._id === selectedCustomerForTopUp)?.firstName ||
                        searchResults.find(c => c._id === selectedCustomerForTopUp)?.email}'s
                    </span>
                  )}{' '}
                  wallet?
                </p>
                <p className="text-sm text-gray-600">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsConfirmModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  onClick={handleTopUpConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Confirm Top Up'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Contentlayout>
  );
};

export default WalletBalances;