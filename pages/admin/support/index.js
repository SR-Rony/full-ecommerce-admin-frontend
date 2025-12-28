"use client"
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import Seo from "@/shared/layout-components/seo/seo";
import {
  addAdminTicketMessage,
  getAdminTicketDetails,
  getAdminTickets,
  getAdminTicketStats,
  updateAdminTicketStatus,
  getAdminTicketByOrderAndTicketId
} from "@/utils/instance";
import moment from "moment";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { FiClock, FiMessageSquare, FiRefreshCw, FiSearch, FiSend, FiUser, FiX } from "react-icons/fi";
import { IoTicketOutline } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";

const SupportTickets = () => {
  const router = useRouter();
  
  // State management
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [stats, setStats] = useState({});
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(""); // For debounce search
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("lastMessage");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Infinite scroll state
  const [hasMoreTickets, setHasMoreTickets] = useState(true);
  const [conversationPage, setConversationPage] = useState(1);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  
  // Message form
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Mobile modal state
  const [showMobileModal, setShowMobileModal] = useState(false);
  
  // URL parameter handling state
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Debounce search
  const debounceTimeout = useRef(null);
  
  // Add debounce timeout refs for refresh functions
  const refreshTicketsTimeout = useRef(null);
  const refreshConversationsTimeout = useRef(null);

  // Client-side only effect to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Debounce function
  const debounceSearch = (value) => {
    setInputValue(value);
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1); // Reset to first page on new search
      setTickets([]); // Clear tickets for new search
      setHasMoreTickets(true); // Reset hasMore flag
    }, 500); // 500ms delay
  };
  
  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (refreshTicketsTimeout.current) {
        clearTimeout(refreshTicketsTimeout.current);
      }
      if (refreshConversationsTimeout.current) {
        clearTimeout(refreshConversationsTimeout.current);
      }
    };
  }, []);

  // Fetch tickets
  const fetchTickets = useCallback(async (page = currentPage, append = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }), // Keep as 'search'
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter })
      };

      const response = await getAdminTickets(params);
      if (response.data.success) {
        const newTickets = response.data.data.tickets;
        if (newTickets.length === 0) {
          setHasMoreTickets(false);
        } else {
          setTickets(prev => append ? [...prev, ...newTickets] : newTickets);
          setTotalPages(response.data.data.pagination.totalPages);
          setHasMoreTickets(page < response.data.data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setHasMoreTickets(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Load more tickets
  const loadMoreTickets = useCallback(() => {
    if (!hasMoreTickets || loading) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchTickets(nextPage, true);
  }, [currentPage, fetchTickets, hasMoreTickets, loading]);

  // Fetch ticket details and conversations
  const fetchTicketDetails = useCallback(async (ticketId, page = 1, append = false) => {
    setConversationLoading(true);
    try {
      const response = await getAdminTicketDetails(ticketId, {
        page,
        limit: 20 // Let backend handle sorting logic
      });
      
      if (response.data.success) {
        setSelectedTicket(response.data.data.ticket);
        
        const newConversations = response.data.data.conversations;
        if (newConversations.length === 0) {
          setHasMoreConversations(false);
        } else {
          if (append) {
            // For loading older messages, prepend to the beginning
            setConversations(prev => [...newConversations, ...prev]);
          } else {
            // For initial load or refresh, replace all conversations
            setConversations(newConversations);
            // Auto-scroll to bottom for initial load
            setTimeout(() => {
              const scrollableElement = document.getElementById('conversationScrollable') || document.getElementById('mobileConversationScrollable');
              if (scrollableElement) {
                scrollableElement.scrollTop = scrollableElement.scrollHeight;
              }
            }, 100);
          }
          setHasMoreConversations(newConversations.length === 20);
        }
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      setHasMoreConversations(false);
    } finally {
      setConversationLoading(false);
    }
  }, []);

  // Load more conversations
  const loadMoreConversations = useCallback(() => {
    if (!hasMoreConversations || conversationLoading || !selectedTicket) return;
    
    const nextPage = conversationPage + 1;
    setConversationPage(nextPage);
    fetchTicketDetails(selectedTicket._id, nextPage, true);
  }, [conversationPage, fetchTicketDetails, hasMoreConversations, conversationLoading, selectedTicket]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await getAdminTicketStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // Handle ticket selection
  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setConversations([]); // Clear previous conversations
    setConversationPage(1); // Reset conversation page
    setHasMoreConversations(true); // Reset hasMore flag
    fetchTicketDetails(ticket._id, 1, false);
    
    // Update URL with ticket parameters for shareable links
    if (ticket.orderId && ticket._id) {
      const newUrl = `/admin/support?openTicket=true&orderId=${ticket.orderId}&ticketId=${ticket._id}`;
      router.push(newUrl, undefined, { shallow: true });
    }
    
    // Show modal on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowMobileModal(true);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
  };

  // Handle ticket deselection
  const handleTicketDeselect = () => {
    setSelectedTicket(null);
    setConversations([]);
    setConversationPage(1);
    setHasMoreConversations(true);
    
    // Clean up URL parameters
    router.push('/admin/support', undefined, { shallow: true });
  };
  
  // Close mobile modal
  const closeMobileModal = () => {
    setShowMobileModal(false);
    // Restore body scrolling
    document.body.style.overflow = 'auto';
    
    // Also deselect ticket when closing mobile modal
    handleTicketDeselect();
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    setSendingMessage(true);
    try {
      const response = await addAdminTicketMessage(selectedTicket._id, {
        message: newMessage
      });
      
      if (response.data.success) {
        const newMessageData = response.data.data;
        
        // Add the new message to the end of conversations (newest at bottom)
        setConversations(prev => [...prev, newMessageData]);
        setNewMessage("");
        
        // Update the ticket in the tickets list with the new last message
        setTickets(prev => {
          const updatedTickets = prev.map(ticket => 
            ticket._id === selectedTicket._id 
              ? { 
                  ...ticket, 
                  lastMessage: {
                    message: newMessageData.message,
                    sender: newMessageData.sender,
                    createdAt: newMessageData.createdAt
                  }
                }
              : ticket
          );
          
          // Sort the tickets by lastMessage.createdAt if that's the current sort
          if (sortBy === 'lastMessage') {
            return updatedTickets.sort((a, b) => {
              const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(a.createdAt);
              const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(b.createdAt);
              
              return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
            });
          }
          
          return updatedTickets;
        });
        
        // Update the selected ticket with the new last message
        setSelectedTicket(prev => ({
          ...prev,
          lastMessage: {
            message: newMessageData.message,
            sender: newMessageData.sender,
            createdAt: newMessageData.createdAt
          }
        }));
        
        // Scroll to bottom after adding message
        setTimeout(() => {
          const scrollableElement = document.getElementById('conversationScrollable') || document.getElementById('mobileConversationScrollable');
          if (scrollableElement) {
            scrollableElement.scrollTop = scrollableElement.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Update ticket status
  const handleStatusUpdate = async (status) => {
    if (!selectedTicket) return;
    
    try {
      const response = await updateAdminTicketStatus(selectedTicket._id, { status });
      if (response.data.success) {
        // Update the selected ticket status immediately
        setSelectedTicket(prev => ({ ...prev, status }));
        
        // Reset pagination and clear tickets
        setCurrentPage(1);
        setTickets([]);
        setHasMoreTickets(true);
        
        // Add a small delay to ensure backend processing completes
        setTimeout(() => {
          // Fetch tickets and ticket details
          fetchTickets(1, false);
          fetchTicketDetails(selectedTicket._id, 1, false);
          
          // Also refresh stats to show updated counts
          fetchStats();
        }, 300);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Handle URL parameters for direct ticket access
  const handleUrlParameters = useCallback(async () => {
    // Only run on client side and when router is ready
    if (!isClient || !router.isReady || urlParamsProcessed) return;
    
    const { openTicket, orderId, ticketId } = router.query;
    
    if (openTicket === 'true' && orderId && ticketId) {
      console.log("Processing URL parameters...", { orderId, ticketId });
      setUrlParamsProcessed(true);
      
      try {
        console.log("Making API call to fetch ticket...");
        
        // Fetch the specific ticket using orderId and ticketId
        const response = await getAdminTicketByOrderAndTicketId(orderId, ticketId, {
          page: 1,
          limit: 20
        });
        
        console.log("API response received:", response);
        
        if (response?.data?.success) {
          const { ticket, conversations: ticketConversations } = response.data.data;
          
          console.log("Ticket fetched successfully:", ticket);
          console.log("Conversations fetched:", ticketConversations);
          
          // Set the selected ticket and conversations
          setSelectedTicket(ticket);
          setConversations(ticketConversations || []);
          setConversationPage(1);
          setHasMoreConversations(response.data.data.pagination?.hasMore || false);
          
          // Add ticket to list if not already there
          setTickets(prev => {
            const existingTicket = prev.find(t => t._id === ticket._id);
            if (!existingTicket) {
              return [ticket, ...prev];
            }
            return prev;
          });
          
          // Handle mobile modal and auto-scroll
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setShowMobileModal(true);
            document.body.style.overflow = 'hidden';
          }
          
          // Auto-scroll to bottom of conversations after a delay
          setTimeout(() => {
            const scrollableElement = document.getElementById('conversationScrollable') || document.getElementById('mobileConversationScrollable');
            if (scrollableElement) {
              scrollableElement.scrollTop = scrollableElement.scrollHeight;
            }
          }, 200);
          
          // Don't clean up URL parameters - keep them for shareable links
          // The URL will only be cleaned when user manually deselects the ticket
          
        } else {
          console.error("API call failed:", response?.data?.message || "Unknown error");
          // Only clean up URL on failure
          setTimeout(() => {
            router.replace('/admin/support', undefined, { shallow: true });
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching ticket from URL parameters:", error);
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          response: error.response?.data
        });
        
        // Only clean up URL on error
        setTimeout(() => {
          router.replace('/admin/support', undefined, { shallow: true });
        }, 1000);
      }
    }
  }, [isClient, router.isReady, router.query, urlParamsProcessed, router]);

  // Effects
  useEffect(() => {
    // Reset and fetch tickets when filters change
    setCurrentPage(1);
    setTickets([]);
    setHasMoreTickets(true);
    fetchTickets(1, false);
  }, [searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  // Handle URL parameters when router is ready and on client side
  useEffect(() => {
    if (isClient) {
      handleUrlParameters();
    }
  }, [isClient, handleUrlParameters]);

  // Initial data fetch - separate from URL parameter handling
  useEffect(() => {
    if (isClient && router.isReady && !urlParamsProcessed) {
      const { openTicket, orderId, ticketId } = router.query;
      // Only fetch initial tickets if we're not processing URL parameters
      if (!(openTicket === 'true' && orderId && ticketId)) {
        fetchTickets(1, false);
      }
    }
  }, [isClient, router.isReady, router.query, urlParamsProcessed, fetchTickets]);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Add refreshing states
  const [refreshingTickets, setRefreshingTickets] = useState(false);
  const [refreshingConversations, setRefreshingConversations] = useState(false);
  
  // Enhanced refresh tickets function with debouncing
  const handleRefreshTickets = useCallback(async () => {
    // Prevent multiple calls if already refreshing or loading
    if (loading || refreshingTickets) return;
    
    // Clear any existing timeout
    if (refreshTicketsTimeout.current) {
      clearTimeout(refreshTicketsTimeout.current);
    }
    
    // Debounce the refresh call
    refreshTicketsTimeout.current = setTimeout(async () => {
      setRefreshingTickets(true);
      try {
        // Reset pagination and clear current data
        setCurrentPage(1);
        setTickets([]);
        setHasMoreTickets(true);
        
        // Clear selected ticket if it exists
        if (selectedTicket) {
          setSelectedTicket(null);
          setConversations([]);
          setConversationPage(1);
          setHasMoreConversations(true);
        }
        
        // Fetch fresh data
        await Promise.all([
          fetchTickets(1, false),
          fetchStats()
        ]);
        
        console.log("Tickets refreshed successfully");
      } catch (error) {
        console.error("Error refreshing tickets:", error);
      } finally {
        setRefreshingTickets(false);
      }
    }, 300); // 300ms debounce delay
  }, [fetchTickets, fetchStats, loading, selectedTicket]);
  
  // Enhanced refresh conversations function with debouncing
  const handleRefreshConversations = useCallback(async () => {
    // Prevent multiple calls if already refreshing or loading
    if (!selectedTicket || conversationLoading || refreshingConversations) return;
    
    // Clear any existing timeout
    if (refreshConversationsTimeout.current) {
      clearTimeout(refreshConversationsTimeout.current);
    }
    
    // Debounce the refresh call
    refreshConversationsTimeout.current = setTimeout(async () => {
      setRefreshingConversations(true);
      try {
        // Reset conversation pagination
        setConversationPage(1);
        setConversations([]);
        setHasMoreConversations(true);
        
        // Fetch fresh conversations
        await fetchTicketDetails(selectedTicket._id, 1, false);
        
        console.log("Conversations refreshed successfully");
      } catch (error) {
        console.error("Error refreshing conversations:", error);
      } finally {
        setRefreshingConversations(false);
      }
    }, 300); // 300ms debounce delay
  }, [selectedTicket, fetchTicketDetails, conversationLoading]);

  // Add a comprehensive refresh function that refreshes everything
  const handleRefreshAll = useCallback(async () => {
    if (loading || refreshingTickets || (selectedTicket && (conversationLoading || refreshingConversations))) return;
    
    setRefreshingTickets(true);
    if (selectedTicket) {
      setRefreshingConversations(true);
    }
    
    try {
      // Reset all pagination and clear data
      setCurrentPage(1);
      setTickets([]);
      setHasMoreTickets(true);
      
      if (selectedTicket) {
        setConversationPage(1);
        setConversations([]);
        setHasMoreConversations(true);
      }
      
      // Fetch all fresh data
      const promises = [
        fetchTickets(1, false),
        fetchStats()
      ];
      
      if (selectedTicket) {
        promises.push(fetchTicketDetails(selectedTicket._id, 1, false));
      }
      
      await Promise.all(promises);
      
      console.log("All data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing all data:", error);
    } finally {
      setRefreshingTickets(false);
      if (selectedTicket) {
        setRefreshingConversations(false);
      }
    }
  }, [fetchTickets, fetchStats, fetchTicketDetails, loading, selectedTicket, conversationLoading, refreshingConversations]);

  return (
    <Fragment>
      <Seo title="Support Tickets" />
      <Contentlayout>
        <div className="flex flex-col h-full">
          {/* Header with Stats */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <IoTicketOutline className="mr-2" />
                Support Tickets
              </h1>
              
              {/* Add refresh button for stats */}
              <button
                onClick={handleRefreshTickets}
             
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Refresh tickets"
              >
                <FiRefreshCw className={`h-5 w-5 ${(refreshingTickets || loading) ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IoTicketOutline className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTickets || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiClock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Open Tickets</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.statusStats?.open || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FiMessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Resolved Tickets</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.statusStats?.resolved || 0}</p>
                  </div>
                </div>
              </div>
               <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FiUser className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Closed Tickets</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalClosedTickets || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row flex-1 gap-6 h-[calc(100vh-300px)]">
            {/* Left Side - Ticket List */}
            <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
              {/* Filters */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex flex-col space-y-3">
                  {/* Search with Refresh Button */}
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Email, or Message..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        value={inputValue}
                        onChange={(e) => debounceSearch(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleRefreshTickets}
                     
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        refreshingTickets || loading
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 cursor-not-allowed'
                          : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={refreshingTickets || loading ? "Refreshing..." : "Refresh tickets"}
                    >
                      <FiRefreshCw className={`h-5 w-5 transition-transform duration-200 ${
                        (refreshingTickets || loading) ? 'animate-spin' : 'hover:rotate-180'
                      }`} />
                    </button>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <select
                      className="w-full sm:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    
                    <select
                      className="w-full sm:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option value="">All Priority</option>
                    
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ticket List with Infinite Scroll */}
              <div id="ticketListScrollable" className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
                {tickets.length === 0 && loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                    No tickets found
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={tickets.length}
                    next={loadMoreTickets}
                    hasMore={hasMoreTickets}
                    loader={<div className="text-center py-4"><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>}
                    scrollableTarget="ticketListScrollable"
                    endMessage={
                      <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                        All tickets loaded
                      </p>
                    }
                  >
                    {tickets.map((ticket) => (
                      <div
                        key={ticket._id}
                        className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedTicket?._id === ticket._id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => handleTicketSelect(ticket)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            #{ticket._id.slice(-6)} - {ticket.issue}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                        
                        {/* Customer Information */}
                        <div className="mb-2 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FiUser className="h-4 w-4 mr-1" />
                            <span className="font-medium">
                              {ticket.customerId?.firstName || ticket.customerId?.lastName 
                                ? `${ticket.customerId.firstName || ''} ${ticket.customerId.lastName || ''}`.trim()
                                : 'Unknown Customer'
                              }
                            </span>
                          </div>
                          {ticket.customerId?.email && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                              <span className="text-xs ml-5">{ticket.customerId.email}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span>{moment(ticket.createdAt).fromNow()}</span>
                        </div>
                        
                        {/* Last Message Display */}
                        {ticket.lastMessage && (
                          <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-600 dark:text-gray-300">
                                {ticket.lastMessage.sender === 'admin' ? 'Admin' : 'Customer'}:
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {moment(ticket.lastMessage.createdAt).format('MMM DD, HH:mm')}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-200 truncate">
                              {ticket.lastMessage.message}
                            </p>
                          </div>
                        )}
                        
                        {ticket.orderId && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Order: {ticket.orderId}
                          </div>
                        )}
                      </div>
                    ))}
                  </InfiniteScroll>
                )}
              </div>
            </div>

            {/* Right Side - Ticket Details (Desktop Only) */}
            <div className="hidden md:flex md:flex-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {selectedTicket ? (
                <div className="flex flex-col max-h-[calc(100vh-180px)] w-full">
                  {/* Ticket Details Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        #{selectedTicket._id.slice(-6)} - {selectedTicket.subject}
                      </h2>
                      <div className="flex items-center space-x-2">
                        {/* Add refresh button for conversations on desktop */}
                        <button
                          onClick={handleRefreshConversations}
                          disabled={refreshingConversations || conversationLoading}
                          className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Refresh conversations"
                        >
                          <FiRefreshCw className={`h-5 w-5 ${(refreshingConversations || conversationLoading) ? 'animate-spin' : ''}`} />
                        </button>
                        {/* Add close button */}
                        <button
                          onClick={handleTicketDeselect}
                          className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Close ticket details"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Created:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {moment(selectedTicket.createdAt).format('MMM DD, YYYY HH:mm')}
                        </span>
                      </div>
                      {selectedTicket.orderId && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Order ID:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{selectedTicket.orderId}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Customer:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {selectedTicket.customerId?.firstName || selectedTicket.customerId?.lastName 
                            ? `${selectedTicket.customerId.firstName || ''} ${selectedTicket.customerId.lastName || ''}`.trim()
                            : 'Unknown Customer'
                          }
                        </span>
                      </div>
                      {selectedTicket.customerId?.email && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{selectedTicket.customerId.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Update Buttons */}
                    {selectedTicket.status === 'open' && (
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate('resolved')}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Mark as Resolved
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('closed')}
                          className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Close Ticket
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Conversations with Infinite Scroll */}
                  <div id="conversationScrollable" className="flex-1 overflow-y-auto p-4">
                    {conversations.length === 0 && conversationLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : conversations.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                        No messages yet
                      </div>
                    ) : (
                      <InfiniteScroll
                        dataLength={conversations.length}
                        next={loadMoreConversations}
                        hasMore={hasMoreConversations}
                        loader={<div className="text-center py-4"><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>}
                        scrollableTarget="conversationScrollable"
                        inverse={true} // Changed to true for proper chat behavior
                        endMessage={
                          <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                            All messages loaded
                          </p>
                        }
                        className="space-y-4"
                      >
                        {conversations.map((conversation) => (
                          <div
                            key={conversation._id}
                            className={`flex ${conversation.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                conversation.sender === 'admin'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                            >
                              <p className="text-sm">{conversation.message}</p>
                              <p className={`text-xs mt-1 ${
                                conversation.sender === 'admin' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {conversation.sender === 'admin' ? 'Admin' : 'Customer'} • {moment(conversation.createdAt).format('MMM DD, HH:mm')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </InfiniteScroll>
                    )}
                  </div>

                  {/* Message Input */}
                  {selectedTicket.status === 'open' && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sendingMessage ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <FiSend className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center w-full justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <IoTicketOutline className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a ticket to view details</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Modal for Ticket Details */}
            {showMobileModal && selectedTicket && (
              <div className="md:hidden fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-lg max-h-[90vh] flex flex-col">
                  {/* Modal Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      #{selectedTicket._id.slice(-6)} - {selectedTicket.issue}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleRefreshConversations}
                        disabled={refreshingConversations || conversationLoading}
                        className="p-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Refresh messages"
                      >
                        <FiRefreshCw className={`h-4 w-4 ${(refreshingConversations || conversationLoading) ? 'animate-spin' : ''}`} />
                      </button>
                      <button 
                        onClick={closeMobileModal}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <FiX className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Ticket Info */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Created:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {moment(selectedTicket.createdAt).format('MMM DD, YYYY HH:mm')}
                        </span>
                      </div>
                      {selectedTicket.orderId && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Order ID:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{selectedTicket.orderId}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">Customer:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {selectedTicket.customerId?.firstName || selectedTicket.customerId?.lastName 
                            ? `${selectedTicket.customerId.firstName || ''} ${selectedTicket.customerId.lastName || ''}`.trim()
                            : 'Unknown Customer'
                          }
                        </span>
                      </div>
                      {selectedTicket.customerId?.email && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{selectedTicket.customerId.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Update Buttons */}
                    {selectedTicket.status === 'open' && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            handleStatusUpdate('resolved');
                            closeMobileModal();
                          }}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Mark as Resolved
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate('closed');
                            closeMobileModal();
                          }}
                          className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Close Ticket
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Conversations with Infinite Scroll */}
                  <div id="mobileConversationScrollable" className="flex-1 overflow-y-auto p-4">
                    {conversations.length === 0 && conversationLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : conversations.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                        No messages yet
                      </div>
                    ) : (
                      <InfiniteScroll
                        dataLength={conversations.length}
                        next={loadMoreConversations}
                        hasMore={hasMoreConversations}
                        loader={<div className="text-center py-4"><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>}
                        scrollableTarget="mobileConversationScrollable"
                        inverse={true} // Changed to true for proper chat behavior
                        endMessage={
                          <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                            All messages loaded
                          </p>
                        }
                        className="space-y-4"
                      >
                        {conversations.map((conversation) => (
                          <div
                            key={conversation._id}
                            className={`flex ${conversation.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg ${
                                conversation.sender === 'admin'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                            >
                              <p className="text-sm">{conversation.message}</p>
                              <p className={`text-xs mt-1 ${
                                conversation.sender === 'admin' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {conversation.sender === 'admin' ? 'Admin' : 'Customer'} • {moment(conversation.createdAt).format('MMM DD, HH:mm')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </InfiniteScroll>
                    )}
                  </div>

                  {/* Message Input */}
                  {selectedTicket.status === 'open' && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sendingMessage ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <FiSend className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Contentlayout>
    </Fragment>
  );
};

export default SupportTickets;
