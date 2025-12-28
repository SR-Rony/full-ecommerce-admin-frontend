import { socketListen } from '@/socket/socketListen';
import { socketListenEmitAndOn } from '@/socket/socketListenEmitAndOn';
import { isValidArray } from '@/utils/func';
import { getAppInfoSetting, getNotifications, getPresences } from '@/utils/instance';
import { socketURLAdminBackend } from '@/utils/proxy';
import _ from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import { createContext, useEffect, useRef, useState } from 'react';
import { FaMessage } from 'react-icons/fa6';
import io from 'socket.io-client';

export const MyContexts = createContext();

export function Providers({ children }) {
  const router = useRouter();
  const [authData, setAuthData] = useState({});
  const socketRef = useRef(null);
  const [appInfoSetting, setAppInfoSetting] = useState({});
  const [products, setProducts] = useState({});
  const [singleProductDetails, setSingleProductDetails] = useState({});
  const [productPage, setProductPage] = useState(1);
  const [productLimit, setProductLimit] = useState(30);
  const [productCategories, setProductCategories] = useState([]);
  const [singlePopupDetails, setSinglePopupDetails] = useState({});
  const [popups, setPopups] = useState({});
  const [popupPage, setPopupPage] = useState(1);
  const [popupLimit, setPopupLimit] = useState(30);
  const [popupCategories, setPopupCategories] = useState([]);
  const [popupProductSelects, setPopupProductSelects] = useState([]);
  const [orders, setOrders] = useState({});
  const [orderSingleDetails, setOrderSingleDetails] = useState({});
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(30);
  const [customers, setCustomers] = useState({});
  const [customerSingleDetails, setCustomerSingleDetails] = useState({});
  const [customerPage, setCustomerPage] = useState(1);
  const [customerLimit, setCustomerLimit] = useState(30);
  const [customerOrderCounts, setCustomerOrderCounts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [defaultCountriesData, setDefaultCountriesData] = useState({});
  const [presences,setPresences] = useState({});

  //admins
  const [admins, setAdmins] = useState({});
  const [adminSingleDetails, setAdminSingleDetails] = useState({});
  const [adminPage, setAdminPage] = useState(1);
  const [adminLimit, setAdminLimit] = useState(30);
  //Notifications
  const [notifications, setNotifications] = useState({ unreadCount: 0, notifications: [] });

  //live Chats
  const [conversation, setConversation] = useState({});
  const [chatList, setChatList] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const chatParamId = router?.query?.chatId;
  const notiInterval = useRef(null);

  const fetchAppInfoSetting = async () => {
    try {
      const res = await getAppInfoSetting();
      setAppInfoSetting(res?.data?.data);
    } catch (error) {
      // Handle error
    }
  };

  const initializeSocket = () => {
    socketRef.current = io(socketURLAdminBackend, {
      transports: ['websocket'],
      autoConnect: false,
      auth: {
        token: authData?.token,
      },
    });

  };

  const fetchPresences = async ()=> {
    try {
      const res = await getPresences();
      setPresences(res.data);
    } catch(error) {
      console.log("Error ",error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res?.data);

    } catch (error) {
      // 
    }
  };
  const handleSocketConnection = () => {
    if (socketRef.current && authData.token && authData?._id) {
      fetchNotifications();
      socketRef.current.auth = { token: authData.token };

    }
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }
  };

  const handleSocketDisconnection = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  useEffect(() => {
    const authenticateUser = () => {
      try {
        if (typeof window !== 'undefined') {
          const token = window.localStorage.getItem('token');
          const user = window.localStorage.getItem('user');
          const userInfo = JSON.parse(user);
          if (userInfo?._id) {
            try{
            socketRef.current.emit("join-admin",token);
            } catch(err) {}
            setAuthData(userInfo);

          } else {
            // router.push('/');
          }

        }
      } catch (error) {
        console.log(error);
        ToastEmitter('error', 'Failed to authenticate, please login!');
      }
    };

    authenticateUser();
    fetchAppInfoSetting();
    initializeSocket();
    //fetchPresences();
    // clearInterval(notiInterval.current);
    // notiInterval.current = setInterval(()=>{
    //   fetchNotifications();
    // },1*60*1000); // every 1min.

    return () => {
      handleSocketDisconnection();
    };
  }, [authData?.token]);
  // console.log(authData,'userinfo');
  useEffect(() => {
    handleSocketConnection();
  }, [authData?.token]);

  useEffect(() => {
    console.log("Socket.current",socketRef?.current);
    if (!socketRef?.current?.connected) {
      socketRef.current.connect();
    }
    if (socketRef?.current && authData?._id) {
      const io = socketRef.current;
      //socket connected checking
      io.off(socketListenEmitAndOn.init.ping_pong).on(socketListenEmitAndOn.init.ping_pong, (message) => {
        console.log(message);
        socketRef.current.emit("join-admin", window.localStorage.getItem('token'));
      });

      //notification
      io.off(socketListen.order.new_order_create).on(socketListen.order.new_order_create, (data = {}) => {
        const uniqueArr = isValidArray(notifications?.notifications) ? _.uniqBy([data, ...notifications?.notifications], '_id') : [data];
        const unreadCount = isValidArray(uniqueArr) ? uniqueArr.filter(item => item.isRead === false).length : 0;
        setNotifications((prev) => {
          return {
            ...prev,
            unreadCount: unreadCount,
            notifications: uniqueArr
          };
        });
        // console.log(data, 'new order create');
      });
      
      io.off("notifications").on("notifications",(data)=>{
        setNotifications((prev)=>{
          return {
            unreadCount: prev.unreadCount+1,
            notifications: [data,...prev.notifications]
          };
        });
        if(data?.message=="New Order.") {
          toast("New Order.",{
            duration: 10*1000,
            icon:<><FaMessage className='text-green-500'/></>,
            id: new Date().toString(),
            position:"top-center",
            style: {
              fontSize: '18px',
              padding: "10px 20px"
            }
          });
          const audio = new Audio("/assets/chat_received.wav");
          try {
            audio.play();
          } catch(err) {}
          let oldTitle = window.document.title;
          window.document.title = `New Order`;
          if(!oldTitle.includes("New Order")) {
            setTimeout(()=>{
              window.document.title = oldTitle;
            },10*1000);
          }
        }
      });

      io.off("comments").on("comments",(data)=>{
        if(orderSingleDetails?.orderId == data?.orderId) {
          setOrderSingleDetails((order)=>{
            return {...order,comments: data.comments};
          });
        }
        const comment = data.comments[ data.comments.length - 1];
        toast(comment.message||"New Comment",{
          duration: 10*1000,
          icon:<><FaMessage className='text-green-500'/> <span className='ps-2 font-[600]'>Order #{data.orderId}:</span> </>,
          id: new Date().toString(),
          position:"top-center",
          style: {
            fontSize: '18px',
            padding: "10px 20px"
          }
        });
        const audio = new Audio("/assets/chat_received.wav");
        try {
          audio.play();
        } catch(err) {}
        let oldTitle = window.document.title;
        window.document.title = `New Comment`;
        if(!oldTitle.includes("New Comment")) {
          setTimeout(()=>{
            window.document.title = oldTitle;
          },10*1000);
        }
      });

      //live chat chanel create
      io.off(socketListenEmitAndOn.liveChatCreate.admin.live_chat_admin_chat_created_received).on(socketListenEmitAndOn.liveChatCreate.admin.live_chat_admin_chat_created_received, (data = {}) => {
        try {
          const chat = data?.data;
          const message = data?.data?.lastMessage;
          if(!message.admin && (selectedContact?.uuid!=chat?.uuid || !window.location.href.includes("/admin/chats"))) {
            toast(message.message ? message?.message : message?.media?.length? "Sent an attachment.":"Sent a message.",{
              duration: 10*1000,
              icon:<><FaMessage className='text-green-500'/> <span className='ps-2 font-[600]'>{chat?.firstName}:</span> </>,
              id: new Date().toString(),
              position:"top-center",
              style: {
                fontSize: '18px',
                padding: "10px 20px"
              }
            });
          }
          if(!message?.admin) {
              const audio = new Audio("/assets/chat_received.wav");
              try {
                audio.play();
              } catch(err) {}
              let oldTitle = window.document.title;
              window.document.title = `${chat?.firstName}: New Message`;
              if(!oldTitle.includes("New Message")) {
                setTimeout(()=>{
                  window.document.title = oldTitle;
                },10*1000);
              }
          }
        } catch(err) {
          console.log("ERROR: 1" ,err);
        }

        const uniqueArr = isValidArray(chatList?.data) ? _.uniqBy([data?.data, ...chatList?.data], '_id') : [data?.data];
        setChatList((prev) => {
          return {
            ...prev,
            data: uniqueArr.sort((a, b) => moment(b?.lastMessageUpdatedAt) - moment(a?.lastMessageUpdatedAt))
          };
        });
        // console.log(data);
      });

      io.off("active_status").on("active_status",(data)=>{
        setPresences((prev)=>({...prev,[data.chatUuid]: data}));
      });
      io.off("all_active_status").on("all_active_status",(data)=>{
        setPresences(data);
      });

      io.off("live_chat_admin_chat_updated_received").on("live_chat_admin_chat_updated_received",(data)=>{
        const chat = data.data;
        const list = chatList.data.filter((e)=>e.uuid==chat.uuid)[0];
        if(list) {
          list.firstName = chat.firstName;
          list.lastName = chat.lastName;
          list.email = chat.email;
        }
        //list.sort((a,b)=> new Date(a.lastMessage.createdAt)<new Date(b.lastMessage.createdAt)? -1: 1 );
        setChatList((prev)=>({...prev, data: [...chatList.data]}));
        if(selectedContact?.uuid == chat?.uuid) {
          setSelectedContact(list);
        }
      });

      //live chat message create
      io.off(socketListenEmitAndOn.liveChatMessageCreate.admin.live_chat_admin_message_created_received).on(socketListenEmitAndOn.liveChatMessageCreate.admin.live_chat_admin_message_created_received, (data = {}) => {

        const chatId = data?.data?.chat?._id;
        if(!data?.data?.admin && (selectedContact?.uuid!=data?.data?.chat?.uuid || !window.location.href.includes("/admin/chats"))) {
          toast(data?.data?.message ? data?.data?.message : data?.data?.media?.length? "Sent an attachment.":"Sent a message.",{
            duration: 10*1000,
            icon:<><FaMessage className='text-green-500'/> <span className='ps-2 font-[600]'>{data.data?.chat?.firstName}:</span> </>,
            id: new Date().toString(),
            position:"top-center",
            style: {
              fontSize: '18px',
              padding: "10px 20px"
            }
          });
        }
        if(!data?.data?.admin) {
            const audio = new Audio("/assets/chat_received.wav");
            try {
              audio.play();
            } catch(err) {}
            let oldTitle = window.document.title;
            window.document.title = `${data?.data?.chat?.firstName}: New Message`;
            if(!oldTitle.includes("New Message")) {
              setTimeout(()=>{
                window.document.title = oldTitle;
              },10*1000);
            }
        }

        // console.log(chatParamId);
        const copyElemChatList = _.cloneDeep(chatList?.data || []) || [];
        const chatFindIndx = isValidArray(copyElemChatList) ? copyElemChatList.findIndex(doc => doc?._id === chatId) : -1;

        if (chatFindIndx !== -1) {
          const chatItem = {
            ...data?.data?.chat,
            lastMessageUpdatedAt: new Date().getTime(),
            lastMessage: data?.data,
            customer: data?.data?.customer,
            admin: data?.data?.admin,
          };

          copyElemChatList[chatFindIndx] = chatItem;
        } else {
          try {
          copyElemChatList.unshift(chatItem);
          } catch(err) {
            console.log(err);
          }
        }
        setChatList((prev) => {
          return {
            ...prev,
            data: copyElemChatList
          };
        });

        if (chatParamId == chatId) {
          const chatItem = {
            ...data?.data?.chat,
            lastMessageUpdatedAt: new Date().getTime(),
            lastMessage: data?.data,
            customer: data?.data?.customer,
            admin: data?.data?.admin,
          };

          const copyChatParamChatList = _.cloneDeep(chatList?.data || []) || [];
          const chatParamFindIndx = isValidArray(copyChatParamChatList) ? copyChatParamChatList.findIndex(doc => doc?._id === chatId) : -1;
          if (chatParamFindIndx !== -1) {
            const lastMessage = chatItem?.lastMessage || {};
            copyChatParamChatList[chatParamFindIndx] = {
              ...chatItem,
              lastMessage: {
                ...lastMessage,
                unreadCount: {
                  adminUnread: 0
                }
              }
            };
            setChatList((prev) => {
              return {
                ...prev,
                data: copyChatParamChatList
              };
            });
          }

          const messages = isValidArray(conversation?.data) ? _.uniqBy([...conversation?.data, data?.data], '_id') : [data?.data];
          setConversation((prev) => {
            return {
              ...prev,
              data: messages.filter((item) => {
                return chatParamId == item?.chat?._id;
              }).map((item) => {
                return {
                  ...item,
                  unreadCount: {
                    adminUnread: 0
                  }
                };
              }).sort((a, b) => moment(a?.updatedAt) - moment(b?.updatedAt))
            };
          });

          if (data?.data?._id) {
            io.emit(socketListenEmitAndOn.liveChatMessageRead.admin.live_chat_admin_message_read_received, chatId);
          }
        }

      });

    }
  });

  const allContexts = {
    Settings: {
      AppInfoSetting: [appInfoSetting, setAppInfoSetting],
    },
    Auth: [authData, setAuthData],
    Product: {
      ProductSingleDetails: [singleProductDetails, setSingleProductDetails],
      Products: [products, setProducts],
      ProductPaginate: [productPage, setProductPage, productLimit, setProductLimit],
      ProductCategories: [productCategories, setProductCategories],
    },
    Popup: {
      PopupSingleDetails: [singlePopupDetails, setSinglePopupDetails],
      Popups: [popups, setPopups],
      PopupPaginate: [popupPage, setPopupPage, popupLimit, setPopupLimit],
      ProductCategories: [productCategories, setProductCategories],
      PopupCategories: [popupCategories, setPopupCategories],
      PopupProductSelects: [popupProductSelects, setPopupProductSelects],
    },
    Order: {
      OrderSingleDetails: [orderSingleDetails, setOrderSingleDetails],
      Orders: [orders, setOrders],
      OrderPaginate: [orderPage, setOrderPage, orderLimit, setOrderLimit],
    },
    Customer: {
      CustomerSingleDetails: [customerSingleDetails, setCustomerSingleDetails],
      Customers: [customers, setCustomers],
      CustomerPaginate: [customerPage, setCustomerPage, customerLimit, setCustomerLimit],
      CustomerOrderCounts: [customerOrderCounts, setCustomerOrderCounts],
    },
    Admin: {
      AdminSingleDetails: [adminSingleDetails, setAdminSingleDetails],
      Admins: [admins, setAdmins],
      AdminPaginate: [adminPage, setAdminPage, adminLimit, setAdminLimit],
    },
    Countries: {
      Countries: [countries, setCountries],
      DefaultCountriesData: [defaultCountriesData, setDefaultCountriesData],
    },
    IO: socketRef?.current,
    Notifications: [notifications, setNotifications],
    LiveChat: {
      ChatList: [chatList, setChatList],
      Conversation: [conversation, setConversation],
      SelectedContact: [selectedContact, setSelectedContact],
      Presences: [presences,setPresences]
    },
  };

  return (
    <MyContexts.Provider value={allContexts}>{children}</MyContexts.Provider>
  );
}
