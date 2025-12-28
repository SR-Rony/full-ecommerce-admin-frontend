import CustomerDetailsModal from '@/components/Modals/Customer/CustomerDetailsModal';
import MobileChatModal from '@/components/Modals/MobileChatModal/MobileChatModal';
import OrderSiteStatus from '@/components/Shared/OrderSiteStatus';
import { useFullStage } from '@/hooks/useFullStage';
import Loader from '@/shared/Loader/Loader';
import Contentlayout from '@/shared/layout-components/layout/content-layout';
import { ToastEmitter } from '@/utils/Toast';
import { ProfileAvatarOutput, downloadFile, downloadZip, isValidArray, viewFileSrc } from '@/utils/func';
import { createLiveChatMessage, fileUpload, getConversationLiveChat, getLiveChat, getLiveChatOptions } from '@/utils/instance';
import _ from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CgAttachment } from 'react-icons/cg';
import { FaFilePdf } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { TbFileZip } from 'react-icons/tb';

const MessagingApp = () => {

  const { Auth, LiveChat, Customer } = useFullStage();
  const [selectedContact, setSelectedContact] = LiveChat.SelectedContact;
  const [showModal, setShowModal] = useState(false);
  const [presences, setPresences] = LiveChat.Presences;
  const [issueOptions, setIssueOptions] = useState({});
  const [chatList, setChatList] = LiveChat.ChatList;
  const [conversation, setConversation] = LiveChat.Conversation;
  const [chatPage, setChatPage] = useState(1);
  const [authData, setAuthData] = Auth;
  const [messagePage, setMessagePage] = useState(1);
  const limit = 100;
  const [chatQuery, setChatQuery] = useState({});
  const [query, setQuery] = useState({ site: { label: "All Sites", value: "" }, });

  const router = useRouter();
  const [customerDetailsModalOpen, setCustomerDetailsModalOpen] = useState(false);
  const [customerActiveTab, setCustomerActiveTab] = useState('Profile');

  const [customerSingleDetails, setCustomerSingleDetails] = Customer.CustomerSingleDetails;
  const handleOpenProductDetailsModal = (customerId) => {

    setCustomerActiveTab('Profile');
    setCustomerSingleDetails((prev) => {
      return {
        ...prev,
        _id: customerId
      };
    });
    // setCustomerDetailsModalOpen(true);
  };

  // Function  to handle contact click
  const [isSendReq, setIsSendReq] = useState(false);
  const [isFileUploadReq, setIsFileUploadReq] = useState(false);
  const [counter, setCounter] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    message: "",
    issueType: "account", // Default value for the dropdown
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((e) => e + 1);
    }, 10 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [messageReq, setMessageReq] = useState(false);
  const [chatReq, setChatReq] = useState(false);

  const messagesEndRef = useRef(null);

  const bottomScroll = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    bottomScroll();
  }, [conversation?.data]);
  const handleContactClick = async (contact) => {
    window.localStorage.setItem('issueTypeWTC', contact?.issueType);
    bottomScroll();
    setSelectedContact(contact);
    
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    console.log('Mobile detected:', isMobile, 'Window width:', window.innerWidth);
    
    if (isMobile) {
      // For mobile devices, show modal first, then update URL
      console.log('Setting showModal to true');
      setShowModal(true);
      // Fetch conversation data for mobile
      await fetchConversation({ chatId: contact?._id });
      // Update URL without causing navigation
      window.history.pushState(null, '', `/admin/chats/${contact?._id}?contact=${encodeURIComponent(JSON.stringify(contact))}`);
    } else {
      // For desktop, navigate normally
      const queryData = {
        pathname: `/admin/chats/${contact?._id}`,
        query: { contact: JSON.stringify(contact) }
      };
      router.push(queryData);
    }
  };

  // Handle screen resize and initial mobile detection
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (!isMobile && showModal) {
        setShowModal(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showModal]);

  const fetchChatIssueOptions = async () => {
    try {
      const resData = await getLiveChatOptions({});
      if (resData?.data?.success) {
        setIssueOptions(resData?.data);
      }
    } catch (error) {

    }
  };
  const fetchChats = async (args = {}) => {
    try {
      setChatReq(true);
      const resData = await getLiveChat({ ...chatQuery, page: chatPage, limit, ...args });
      setChatReq(false);
      if (resData?.data?.success) {
        const chatId = isValidArray(resData?.data?.data) ? resData?.data?.data[0]?.chat?._id : '';
        // if (chatId) {
        //   fetchConversation({ chatId: chatId });
        // }
        setChatList(resData?.data);
      }
    } catch (error) {
      setChatReq(false);
    }
  };
  const fetchConversation = async (args = {}) => {
    try {
      setMessageReq(true);
      const resData = await getConversationLiveChat({ ...query, page: messagePage, limit, ...args });
      setMessageReq(false);
      if (resData?.data?.success) {
        setConversation(resData?.data);
      }
    } catch (error) {
      setMessageReq(false);
    }
  };

  useEffect(() => {
    fetchChatIssueOptions();

  }, []);

  useMemo(() => {
    fetchChats();
  }, [chatPage]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setChatQuery({
      ...chatQuery,
      [name]: value,
    });

    try {
      await fetchChats({ [name]: value });
    } catch (error) {

    }
  };

  const handleMediaUpload = async (e) => {
    try {

      let media = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const formData = new FormData();
        formData.append("anyFiles", e.target.files[i]);
        setIsFileUploadReq(true);
        const resData = await fileUpload(formData, true);
        setIsFileUploadReq(false);

        if (resData?.data?.success) {
          media.push(resData?.data?.data);
        } else {
          ToastEmitter("error", resData?.data?.message || "File failed to upload.");
        }

      }
      await handleCreateMessageSubmit(media);
    } catch (error) {
      setIsFileUploadReq(false);
      ToastEmitter("error", error?.response?.data?.message || error?.message || "File failed to upload.");
    }
  };

  const handleCreateMessageSubmit = async (mediaFiles) => {
    try {

      if (!selectedContact?._id) return ToastEmitter('error', 'Please select a contact!');
      formData.media = mediaFiles || [];
      formData.issueType = selectedContact?.issueType;
      formData.chat = selectedContact?._id;
      formData.firstName = authData?.firstName || "";
      formData.lastName = authData?.lastName || "";
      formData.email = authData?.email;

      let formDataP = _.omitBy(formData, _.isNil);

      setIsSendReq(true);
      const resData = await createLiveChatMessage(formDataP);
      setIsSendReq(false);
      if (resData?.data?.success) {
        setFormData({});
        resData.data.data['unreadCount'] = 0;
        const data = isValidArray(chatList?.data) ? (chatList.data.map(item => {
          if (item?._id.toString() == selectedContact?._id?.trim().toString()) {
            return {
              ...item,
              lastMessage: resData.data.data,
              lastMessageUpdatedAt: new Date().getTime()
            };
          } else {
            return item;
          }

        }).sort((a, b) => moment(b?.lastMessageUpdatedAt) - moment(a?.lastMessageUpdatedAt))) : [];
        setChatList((prev) => {
          return {
            ...prev,
            data: data
          };
        });
        setConversation((prev) => {
          return {
            ...prev,
            data: isValidArray(prev?.data)
              ? _.uniqBy(
                [
                  ...prev?.data,
                  resData?.data?.data
                ],
                (item) => item?._id?.toString()
              )
              : [
                resData?.data?.data
              ]
          };
        });
      }
    } catch (error) {
      setIsSendReq(false);
      console.log(error);
    }
  };

  // console.log(formData);

  useEffect(() => {
    try {
      const parseData = JSON.parse(router?.query?.contact);
      setSelectedContact(parseData);
    } catch (error) {
      console.error(error.message, 'parseError');
    }
  }, [router?.query.contact]);

  const isUserOnline = (contact) => {
    //return presences[contact?.uuid]? (presences[contact?.uuid]?.connected && presences[contact?.uuid]?.activeAt  && (new Date()- new Date(presences[contact?.uuid]?.activeAt)) < 1000*60*10) :false;
    return presences[contact?.uuid] ? (presences[contact?.uuid]?.connected) : false;
  };

  const getPresenceStatus = (contact) => {

    // let siteDomain = presences[contact?.uuid]?.siteDomain || "hb";
    let siteDomain = "hb_site";

    if (contact?.site == 'hb') {
      siteDomain = "hb_site";
    } else {
      siteDomain = "auctropin_shop";
    }
    // console.log(siteDomain,"contact site");
    if (!contact?.uuid || !presences[contact?.uuid]?.activeAt) {
      return <>@{siteDomain}</>;
    }
    const ago = moment(new Date(presences[contact?.uuid]?.activeAt)).fromNow();
    return isUserOnline(contact) ? (
      <span className="font-[600] text-[16px] text-green-600">
        Online@{siteDomain}
      </span>
    ) : (
      <span className="font-[600] text-gray-500 italic text-[14px]">
        {ago}@{siteDomain}
      </span>
    );
  };

  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      setConversation({});
      await fetchChats({ site });

    } catch (error) {
      console.log(error, "error in hammer bell site filter");
    }
  };
  return (
    <Contentlayout>

      <div className="w-full relative bg-white">

        {/* Main Content */}
        {/* component */}
        <div className="lg:flex h-[90%] overflow-hidden">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 bg-white border-r border-gray-300">
            {/* Sidebar Header */}
            <header className="p-4  border-gray-300 flex justify-between items-center bg-white border-b text-white">

              <h1 className="text-xl font-semibold text-gray-900">Chats</h1>

              <div className=''>
                <OrderSiteStatus
                  data={chatList}
                  setData={setChatList}
                  align={"right"}
                  query={query}
                  onChanges={onChangeSiteType}
                />
                {/* <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                  id="issueType"
                  name="issueType"
                  value={chatQuery?.issueType}
                  onChange={handleChange}
                >
                  {isValidArray(issueOptions?.data) &&
                    issueOptions.data.map((item, i) => (
                      <option
                        key={i}
                        value={item?.name}
                        className="capitalize"
                      >
                        {convertSlugToTitle(item.name)}
                      </option>
                    ))}
                </select> */}
              </div>
            </header>
            {/* Contact List */}

            <div className="overflow-y-auto h-screen p-3 mb-9 pb-20 relative">
              {
                isValidArray(chatList?.data) ? chatList?.data.map((contact, i) => (
                  <div key={i} className={`flex items-center mb-4 cursor-pointer hover:bg-gray-200 p-2 rounded-md ${selectedContact == contact._id ? "bg-gray-300" : contact?.
                    lastMessage?.isRead === false && "bg-gray-100"}`} onClick={() => {
                      handleContactClick(contact);
                    }}>
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                      <img src={ProfileAvatarOutput(viewFileSrc(contact?.admin?.avatar || contact?.customer?.avatar))} alt="User Avatar" className="w-12 h-12 rounded-full" />
                    </div>
                    <div className="flex-1 relative">
                      <div className='flex justify-between items-center'>
                        <h2 className="text-lg font-semibold">{contact?.firstName || "---"} {" "} {contact?.lastName || "---"}</h2>
                        {getPresenceStatus(contact)}
                        {(contact?.lastMessage?.unreadCount?.adminUnread) ? <button
                        >

                          <span className="flex absolute h-4 w-auto text-xs top-2 right-1">
                            <span
                              className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/80 opacity-75"></span>
                            <span
                              className="relative text-xs inline-flex rounded-full h-auto w-auto py-1 px-1 bg-success text-white justify-center items-center" id="notify-data">{contact?.lastMessage?.unreadCount?.adminUnread || 0}</span>
                          </span>
                        </button> : ''}

                      </div>

                      {/* <p className="text-gray-600">{contact.lastMessage?.message}</p> */}

                      <div className="">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-col w-full h-full  border-gray-200 bg-transparent rounded-e-xl rounded-es-xl">
                            {isValidArray(contact?.lastMessage?.media) && (
                              <>
                                <div className="flex flex-wrap gap-2">
                                  {contact.lastMessage.media.map((media, i) => (
                                    <div
                                      className="group relative"
                                      key={i}
                                      title={contact?.lastMessage?.updatedAt ? moment(contact?.lastMessage?.updatedAt).format('llll') : ""}
                                    >
                                      <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                        {/* <button
                                          data-tooltip-target="download-image-1"
                                          className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none text-white focus:ring-gray-50"
                                          onClick={() => downloadFile(viewFileSrc(media?.url), media?.name)}
                                        >
                                          <svg
                                            className="w-4 h-4 text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 16 18"
                                          >
                                            <path
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                            />
                                          </svg>
                                        </button> */}

                                      </div>
                                      {media.resource_type ==
                                        "image" && (
                                          <img

                                            src={viewFileSrc(media?.url)}
                                            className="w-4 h-4 rounded-lg"
                                            alt=""
                                          />
                                        )}
                                      {media.resource_type ==
                                        "video" && (
                                          <video
                                            src={viewFileSrc(media?.url)}
                                            className="w-4 h-4 rounded-lg"

                                            alt=""
                                          />
                                        )}
                                      {media.resource_type ==
                                        "audio" && (
                                          <audio
                                            src={viewFileSrc(media?.url)}
                                            className="w-4 h-4 rounded-lg"
                                            alt=""
                                          />
                                        )}

                                      {media.resource_type == 'pdf' && <div className="p-3">
                                        <span> {media?.name}</span>
                                        <FaFilePdf />

                                      </div>}

                                      {media.resource_type == 'doc' && <div className="p-3">
                                        <span> {media?.name}</span>  <IoDocumentText />
                                      </div>}

                                      {media.resource_type == 'text' && <div className="p-3">
                                        <span> {media?.name}</span>
                                        <IoDocumentText />
                                      </div>}

                                      {media.resource_type == 'other' && <div className="p-3">
                                        <span> {media?.name}</span>
                                        <TbFileZip />
                                      </div>}

                                    </div>
                                  ))}
                                </div>

                              </>
                            )}
                          </div>
                        </div>

                        {contact?.lastMessage?.message && (
                          <div>
                            <span
                              className="px-1 py-2 text-xs"
                              title={moment(contact?.updatedAt).format("llll")}
                            >
                              {contact?.lastMessage?.message}
                            </span>
                          </div>
                        )}
                        <i className="block my-0 py-0 text-[12px]">
                          {moment(contact.lastMessage?.createdAt).format(
                            "yyyy-MM-DD hh:mm a"
                          )}
                        </i>
                      </div>

                    </div>
                  </div>
                )):<p className="text-center pt-2">{chatReq? "Loading..":"No conversation found"}</p>
              }
              {
                chatReq && <div className='absolute top-[30%] left-0 right-0 mx-auto'>
                  <Loader bg='transparent' />
                </div>
              }
            </div>
          </div>
          {/* Main Chat Area */}
          {/* all chats route only disabled single chart data */}
          {!showModal && false && <div className="flex-1 relative">

            <header className="bg-white p-[14px] text-gray-700 h-[71px] border-b flex items-center gap-6">
              {/* {console.log(conversation?.data)} */}
              <div>
                {selectedContact?.customer?._id ? <h1 className="text-2xl font-semibold cursor-pointer" onClick={() => {
                  handleOpenProductDetailsModal(selectedContact?.customer?._id);

                }}>{selectedContact?.firstName || ""} {" "} {selectedContact?.lastName || ""}</h1> :
                  <h1 className="text-2xl font-semibold">{selectedContact?.firstName || ""} {" "} {selectedContact?.lastName || ""}</h1>}
                <div className='flex items-center gap-4'>

                  <p>{selectedContact?.email || ""}</p> |
                  <p className=""> Registered Customer: {selectedContact?.customer?._id ? "Yes" : "No"}</p>
                </div>
              </div>

            </header>
            {isValidArray(conversation?.data) ? <>

              <div className="relative">
                {/* component */}
                <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen overflow-hidden">
                  <div
                    id="popup_messages_chat"
                    className="flex flex-col space-y-4 p-3 overflow-x-hidden overflow-y-auto"
                  >
                    {isValidArray(conversation?.data) ? (
                      conversation.data.map((msg, i) =>
                        !msg?.admin?._id ? (
                          <div className="chat-message" key={i} >
                            <div className="flex items-end">
                              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">

                                <div className="flex flex-col gap-1">
                                  <div className="flex flex-col w-full max-w-[326px]  border-gray-200 bg-transparent rounded-e-xl rounded-es-xl">
                                    {isValidArray(msg.media) && (
                                      <>
                                        <div className="flex flex-wrap justify-end gap-2">
                                          {msg.media.map((media, i) => (
                                            <div
                                              className="group relative"
                                              key={i}
                                              title={moment(msg?.updatedAt).format('llll')}
                                            >
                                              <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                <button
                                                  data-tooltip-target="download-image-1"
                                                  className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none text-white focus:ring-gray-50"
                                                  onClick={() => downloadFile(viewFileSrc(media?.url), media?.name)}
                                                >
                                                  <svg
                                                    className="w-4 h-4 text-white"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 16 18"
                                                  >
                                                    <path
                                                      stroke="currentColor"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                    />
                                                  </svg>
                                                </button>

                                              </div>
                                              {media.resource_type ==
                                                "image" && (
                                                  <img

                                                    src={viewFileSrc(media?.url)}
                                                    className="rounded-lg"
                                                    alt=""
                                                  />
                                                )}
                                              {media.resource_type ==
                                                "video" && (
                                                  <video
                                                    src={viewFileSrc(media?.url)}
                                                    className="rounded-lg"
                                                    alt=""
                                                  />
                                                )}
                                              {media.resource_type ==
                                                "audio" && (
                                                  <audio
                                                    src={viewFileSrc(media?.url)}
                                                    className="rounded-lg"
                                                    alt=""
                                                  />
                                                )}

                                              {media.resource_type == 'pdf' && <div className="p-3">
                                                <span> {media?.name}</span>
                                                <FaFilePdf />

                                              </div>}

                                              {media.resource_type == 'doc' && <div className="p-3">
                                                <span> {media?.name}</span>  <IoDocumentText />

                                              </div>}

                                              {media.resource_type == 'text' && <div className="p-3">
                                                <span> {media?.name}</span>
                                                <IoDocumentText />
                                              </div>}

                                              {media.resource_type == 'other' && <div className="p-3">
                                                <span> {media?.name}</span>
                                                <TbFileZip />

                                              </div>}
                                              {isFileUploadReq && (
                                                <Loader bg="transparent" />
                                              )}

                                            </div>
                                          ))}
                                        </div>
                                        {msg?.media?.length >= 2 && <div className="flex justify-between items-center">
                                          <button className="text-xs font-normal inline-flex items-center hover:underline" onClick={() => downloadZip(msg?.media)}>
                                            <svg
                                              className="w-[10px] h-[10px] me-1.5"
                                              aria-hidden="true"
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 16 18"
                                            >
                                              <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                              />
                                            </svg>
                                            Save all
                                          </button>
                                        </div>}
                                      </>
                                    )}
                                  </div>
                                </div>
                                {msg?.message && (
                                  <div>
                                    <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600" title={moment(msg?.updatedAt).format('llll')}>
                                      {msg?.message}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {msg?.message &&
                                !isValidArray(msg?.media) && (
                                  <img
                                    src={ProfileAvatarOutput(
                                      msg?.admin?.avatar
                                    )}

                                    alt="My profile"
                                    className="w-6 h-6 rounded-full order-1 border"
                                    title={`${msg?.admin?.firstName || "---"
                                      } ${msg?.admin?.lastName || "---"}`}
                                  />
                                )}

                              {!msg?.message &&
                                isValidArray(msg?.media) && (
                                  <img
                                    src={ProfileAvatarOutput(
                                      msg?.admin?.avatar
                                    )}
                                    alt="My profile"
                                    className="w-6 h-6 rounded-full order-1 border"
                                    title={`${msg?.admin?.firstName || "---"
                                      } ${msg?.admin?.lastName || "---"}`}
                                  />
                                )}

                              {msg?.message && isValidArray(msg?.media) && (
                                <img
                                  src={ProfileAvatarOutput(
                                    msg?.admin?.avatar
                                  )}
                                  alt="My profile"
                                  className="w-6 h-6 rounded-full order-1 border"
                                  title={`${msg?.admin?.firstName || "---"
                                    } ${msg?.admin?.lastName || "---"}`}
                                />
                              )}

                            </div>

                          </div>
                        ) : (
                          <div className="chat-message" key={i} >
                            <div className="flex items-end justify-end">
                              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                                <div className="flex flex-col gap-1">
                                  <div className="flex flex-col w-full max-w-[326px]  border-gray-200 bg-transparent rounded-e-xl rounded-es-xl">
                                    {isValidArray(msg.media) && (
                                      <>
                                        <div className="flex flex-wrap justify-end gap-2">
                                          {msg.media.map((media, i) => (
                                            <div
                                              className="group relative"
                                              key={i}
                                              title={moment(msg?.updatedAt).format('llll')}
                                            >
                                              <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                <button
                                                  data-tooltip-target="download-image-1"
                                                  className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none text-white focus:ring-gray-50"
                                                  onClick={() => downloadFile(viewFileSrc(media?.url), media?.name)}
                                                >
                                                  <svg
                                                    className="w-4 h-4 text-white"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 16 18"
                                                  >
                                                    <path
                                                      stroke="currentColor"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                    />
                                                  </svg>
                                                </button>

                                              </div>
                                              {media.resource_type ==
                                                "image" && (
                                                  <img

                                                    src={viewFileSrc(media?.url)}
                                                    className="rounded-lg"
                                                    alt=""
                                                  />
                                                )}
                                              {media.resource_type ==
                                                "video" && (
                                                  <video
                                                    src={viewFileSrc(media?.url)}
                                                    className="rounded-lg"
                                                    alt=""
                                                  />
                                                )}
                                              {media.resource_type ==
                                                "audio" && (
                                                  <audio
                                                    src={viewFileSrc(media?.url)}
                                                    className="rounded-lg"
                                                    alt=""
                                                  />
                                                )}

                                              {media.resource_type == 'pdf' && <div className="p-3">
                                                <span> {media?.name}</span>
                                                <FaFilePdf />

                                              </div>}

                                              {media.resource_type == 'doc' && <div className="p-3">
                                                <span> {media?.name}</span>  <IoDocumentText />

                                              </div>}

                                              {media.resource_type == 'text' && <div className="p-3">
                                                <span> {media?.name}</span>
                                                <IoDocumentText />
                                              </div>}

                                              {media.resource_type == 'other' && <div className="p-3">
                                                <span> {media?.name}</span>
                                                <TbFileZip />

                                              </div>}
                                              {isFileUploadReq && (
                                                <Loader bg="transparent" />
                                              )}

                                            </div>
                                          ))}
                                        </div>
                                        {msg?.media?.length >= 2 && <div className="flex justify-between items-center">
                                          <button className="text-xs font-normal inline-flex items-center hover:underline" onClick={() => downloadZip(msg?.media)}>
                                            <svg
                                              className="w-[10px] h-[10px] me-1.5"
                                              aria-hidden="true"
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 16 18"
                                            >
                                              <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                              />
                                            </svg>
                                            Save all
                                          </button>
                                        </div>}
                                      </>
                                    )}
                                  </div>
                                </div>

                                {msg?.message && (
                                  <div>
                                    <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-black text-white " title={moment(msg?.updatedAt).format('llll')}>
                                      {msg?.message}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {msg?.message &&
                                !isValidArray(msg?.media) && (
                                  <img
                                    src={ProfileAvatarOutput(
                                      msg?.customer?.avatar
                                    )}

                                    alt="My profile"
                                    className="w-6 h-6 rounded-full order-2 border"
                                    title={`${msg?.customer?.firstName || "---"
                                      } ${msg?.customer?.lastName || "---"}`}
                                  />
                                )}

                              {!msg?.message &&
                                isValidArray(msg?.media) && (
                                  <img
                                    src={ProfileAvatarOutput(
                                      msg?.customer?.avatar
                                    )}
                                    alt="My profile"
                                    className="w-6 h-6 rounded-full order-2 border"
                                    title={`${msg?.customer?.firstName || "---"
                                      } ${msg?.customer?.lastName || "---"}`}
                                  />
                                )}

                              {msg?.message && isValidArray(msg?.media) && (
                                <img
                                  src={ProfileAvatarOutput(
                                    msg?.customer?.avatar
                                  )}
                                  alt="My profile"
                                  className="w-6 h-6 rounded-full order-2 border"
                                  title={`${msg?.customer?.firstName || "---"
                                    } ${msg?.customer?.lastName || "---"}`}
                                />
                              )}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <>{isFileUploadReq && <Loader bg="transparent" />}</>
                    )}
                  </div>
                </div>
                <style
                  dangerouslySetInnerHTML={{
                    __html:
                      "\n.scrollbar-w-2::-webkit-scrollbar {\n  width: 0.25rem;\n  height: 0.25rem;\n}\n\n.scrollbar-track-blue-lighter::-webkit-scrollbar-track {\n  --bg-opacity: 1;\n  background-color: #f7fafc;\n  background-color: rgba(247, 250, 252, var(--bg-opacity));\n}\n\n.scrollbar-thumb-blue::-webkit-scrollbar-thumb {\n  --bg-opacity: 1;\n  background-color: #edf2f7;\n  background-color: rgba(237, 242, 247, var(--bg-opacity));\n}\n\n.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {\n  border-radius: 0.25rem;\n}\n",
                  }}
                />
              </div>

            </> : <>

            </>}

            {
              messageReq && <dv className="absolute top-[30%] mx-auto left-0 right-0">
                <Loader bg="transparent" />
              </dv>
            }
            {/* Chat Input */}
            <footer className="bg-white  border-gray-300 w-full p-4 absolute bottom-0  hidden lg:block">

              <div className="relative flex gap-2 justify-between items-center">
                <div className="relative w-full">
                  <div className="absolute left-2 top-[18px]">
                    <label>
                      <CgAttachment className="cursor-pointer" />

                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => {

                          handleMediaUpload(e);
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    name="message"
                    value={formData?.message || ""}
                    onChange={handleChangeForm}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        await handleCreateMessageSubmit();
                      }
                    }}
                    placeholder="Write your message!"
                    className="text-xs pl-8 block w-full focus:outline-none focus:placeholder-gray-400 text-gray-500 placeholder-gray-400 bg-gray-200 rounded-md p-4 px-4"
                  />
                </div>
                <div className="relative right-0 items-center inset-y-0 hidden sm:flex">
                  {isSendReq ? (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-black hover:bg-gray-700 focus:outline-none cursor-not-allowed"
                    >
                      {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-6 w-6 ml-2 transform rotate-90"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg> */}
                      <Loader bg="transparent" className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-black hover:bg-gray-700 focus:outline-none"
                      onClick={() => {
                        handleCreateMessageSubmit();
                      }}
                    >
                      {/* <span className="">Send</span> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-6 w-6 ml-2 transform rotate-90"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

            </footer>
          </div>}
        </div>

        {/* Modal for mobile */}
        <MobileChatModal 
          isOpen={showModal} 
          setIsOpen={setShowModal} 
          isFileUploadReq={isFileUploadReq} 
          selectedContact={selectedContact} 
          conversation={conversation} 
          messageReq={messageReq} 
          isSendReq={isSendReq} 
          handleCreateMessageSubmit={handleCreateMessageSubmit} 
          handleMediaUpload={handleMediaUpload} 
          formData={formData} 
          setFormData={setFormData}
          handleChange={handleChange}
          handleChangeForm={handleChangeForm}
          onBackClick={() => {
            setShowModal(false);
            setSelectedContact(null);
            router.push('/admin/chats/all');
          }}
        />
        <CustomerDetailsModal isOpen={customerDetailsModalOpen} setIsOpen={setCustomerDetailsModalOpen} setActiveTab={setCustomerActiveTab} activeTab={customerActiveTab} />
      </div>
    </Contentlayout >
  );
};

export default MessagingApp;