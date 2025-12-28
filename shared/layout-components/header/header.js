import { useFullStage } from "@/hooks/useFullStage";
import { ThemeChanger } from "@/shared/redux/action";
import store from "@/shared/redux/store";
import { ProfileAvatarOutput, isValidArray } from "@/utils/func";
import {
  LogOutApi,
  handleLogoutLocalStorage,
  markAsAllReadNotifications,
  markAsSingleReadNotifications,
  removeNotifications,
} from "@/utils/instance";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import Modalsearch from "../modal-search/modalsearch";

const Header = ({ local_varaiable, ThemeChanger }) => {
  const { Auth, Order, Notifications } = useFullStage();
  const [notifications, setNotifications] = Notifications;
  const [authData, setAuthData] = Auth;
  let [storedata, SetStoreData] = useState(local_varaiable);
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const router = useRouter();
  //full screen

  function Fullscreen() {
    if (
      (document.fullScreenElement && document.fullScreenElement === null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  useEffect(() => {
    const handleResize = () => {
      const windowObject = window;
      if (windowObject.innerWidth <= 991) {
        // ThemeChanger({ ...local_varaiable, "dataToggled": "close" })
      } else {
        // ThemeChanger({...local_varaiable,"dataToggled":""})
      }
    };
    handleResize(); // Check on component mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    SetStoreData(local_varaiable);
  }, [local_varaiable]);

  function menuClose() {
    const theme = store.getState();
    ThemeChanger({ ...theme, dataToggled: "close" });
  }

  const toggleSidebar = () => {
    const theme = store.getState();
    let sidemenuType = theme.dataNavLayout;
    if (window.innerWidth >= 992) {
      if (sidemenuType === "vertical") {
        let verticalStyle = theme.dataVerticalStyle;
        const navStyle = theme.dataNavStyle;
        switch (verticalStyle) {
          // closed
          case "closed":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "close-menu-close") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "close-menu-close" });
            }
            break;
          // icon-overlay
          case "overlay":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "icon-overlay-close") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              if (window.innerWidth >= 992) {
                ThemeChanger({ ...theme, dataToggled: "icon-overlay-close" });
              }
            }
            break;
          // icon-text
          case "icontext":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "icon-text-close") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "icon-text-close" });
            }
            break;
          // doublemenu
          case "doublemenu":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "double-menu-open") {
              ThemeChanger({ ...theme, dataToggled: "double-menu-close" });
            } else {
              let sidemenu = document.querySelector(".side-menu__item.active");
              if (sidemenu) {
                ThemeChanger({ ...theme, dataToggled: "double-menu-open" });
                if (sidemenu.nextElementSibling) {
                  sidemenu.nextElementSibling.classList.add(
                    "double-menu-active"
                  );
                } else {
                  ThemeChanger({ ...theme, dataToggled: "" });
                }
              }
            }

            // doublemenu(ThemeChanger);
            break;
          // detached
          case "detached":
            if (theme.dataToggled === "detached-close") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "detached-close" });
            }
            break;

          // default
          case "default":
            ThemeChanger({ ...theme, dataToggled: "" });
        }
        switch (navStyle) {
          case "menu-click":
            if (theme.dataToggled === "menu-click-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "menu-click-closed" });
            }
            break;
          // icon-overlay
          case "menu-hover":
            if (theme.dataToggled === "menu-hover-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "menu-hover-closed" });
            }
            break;
          case "icon-click":
            if (theme.dataToggled === "icon-click-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "icon-click-closed" });
            }
            break;
          case "icon-hover":
            if (theme.dataToggled === "icon-hover-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "icon-hover-closed" });
            }
            break;
        }
      }
    } else {
      const theme = store.getState();
      if (theme.dataToggled === "close") {
        ThemeChanger({ ...theme, dataToggled: "open" });
        setTimeout(() => {
          if (theme.dataToggled == "open") {
            document
              .querySelector("#responsive-overlay")
              .classList.add("active");
            document
              .querySelector("#responsive-overlay")
              .addEventListener("click", () => {
                document
                  .querySelector("#responsive-overlay")
                  .classList.remove("active");
                menuClose();
              });
          }
          window.addEventListener("resize", () => {
            if (window.screen.width >= 992) {
              document
                .querySelector("#responsive-overlay")
                .classList.remove("active");
            }
          });
        }, 100);
      } else {
        ThemeChanger({ ...theme, dataToggled: "close" });
      }
    }
  };
  //Dark Model
  const ToggleDark = () => {
    ThemeChanger({
      ...local_varaiable,
      class: local_varaiable.class == "dark" ? "light" : "dark",
      dataHeaderStyles:
        local_varaiable.dataHeaderStyles == "dark" ? "light" : "dark",
      dataMenuStyles:
        local_varaiable.dataNavLayout == "horizontal"
          ? local_varaiable.dataMenuStyles == "dark"
            ? "light"
            : "dark"
          : "dark",
    });
    const theme = store.getState();

    if (theme.class != "dark") {
      ThemeChanger({
        ...theme,
        bodyBg: "",
        darkBg: "",
        dataHeaderStyles: "",
      });
      // localStorage.setItem("Syntolighttheme", "light");
      localStorage.removeItem("Syntodarktheme");
      localStorage.removeItem("SyntoHeader");
      localStorage.removeItem("SyntoMenu");
    } else {
      localStorage.setItem("Syntodarktheme", "dark");
      localStorage.removeItem("Syntolighttheme");
    }
  };

  const cartProduct = [
    {
      id: 1,
      src: "/assets/img/ecommerce/products/1.png",
      name: "Black Heals For Women",
      newpr: "$699",
      oldpr: "$999",
    },
    {
      id: 2,
      src: "/assets/img/ecommerce/products/2.png",
      name: "Tshirt For Men",
      newpr: "$245",
      oldpr: "$599",
    },
    {
      id: 3,
      src: "/assets/img/ecommerce/products/9.png",
      name: "Travel Bag For Womens",
      newpr: "$299",
      oldpr: "$399",
    },
    {
      id: 4,
      src: "/assets/img/ecommerce/products/10.png",
      name: "Leather Wallet For girls",
      newpr: "$100",
      oldpr: "$150",
    },
  ];

  const [allData, setAllData] = useState(cartProduct);
  function handleRemove(id) {
    const newList = allData.filter((idx) => idx.id !== id);
    setAllData(newList);
  }

  const notificationdata = [
    {
      id: 1,
      src: "/assets/img/users/17.jpg",
      heading: "Elon Isk",
      class: "Hello there! how are you doing?...",
      data: "2 min",
    },
    {
      id: 2,
      src: "/assets/img/users/2.jpg",
      heading: "Shakira Sen",
      class: "I would like to discuss about that...",
      data: "09:43",
    },
    {
      id: 3,
      src: "/assets/img/users/21.jpg",
      heading: "Sebastain",
      class: "Shall we go to the cafe at downto...",
      data: "yesterday",
    },
    {
      id: 4,
      src: "/assets/img/users/11.jpg",
      heading: "Charlie Davieson",
      class: "Lorem ipsum dolor sit amet, cons...",
      data: "yesterday",
    },
  ];
  const [allData1, setAllData1] = useState(notificationdata);

  useEffect(() => {
    const navbar = document.querySelector(".header");
    const navbar1 = document.querySelector(".app-sidebar");
    
    if (!navbar) return; // Exit if navbar doesn't exist
    
    const sticky = navbar.clientHeight;
    // const sticky1 = navbar1.clientHeight;

    function stickyFn() {
      if (window.pageYOffset >= sticky) {
        navbar?.classList.add("sticky-pin");
        navbar1?.classList.add("sticky-pin");
      } else {
        navbar?.classList.remove("sticky-pin");
        navbar1?.classList.remove("sticky-pin");
      }
    }

    window.addEventListener("scroll", stickyFn);
    window.addEventListener("DOMContentLoaded", stickyFn);

    // Cleanup event listeners when the component unmounts
    return () => {
      window.removeEventListener("scroll", stickyFn);
      window.removeEventListener("DOMContentLoaded", stickyFn);
    };
  }, []);

  const handleLogOut = async () => {
    try {
      const data = await LogOutApi(authData?._id);
      handleLogoutLocalStorage();
    } catch (error) {
      handleLogoutLocalStorage();
    }
  };

  async function handleRemove1(id) {
    try {
      setNotifications((prev) => {
        const notificationsArr = isValidArray(prev?.notifications)
          ? prev?.notifications.filter((item) => item?._id !== id)
          : [];
        const unreadCount = isValidArray(notificationsArr)
          ? notificationsArr.filter((item) => item?.isRead === false).length
          : 0;
        return {
          ...prev,
          unreadCount: unreadCount,
          notifications: notificationsArr,
        };
      });
      await removeNotifications(id);
    } catch (error) {
      //
    }
  }

  async function HandleMarkAsSingleNotification(obj) {
    try {
      setNotifications((prev) => {
        const notificationsArr = isValidArray(prev?.notifications)
          ? prev?.notifications.map((item) => {
              if (item?._id == obj?._id) {
                return {
                  ...item,
                  isRead: true,
                };
              } else {
                return item;
              }
            })
          : [];
        const unreadCount = isValidArray(notificationsArr)
          ? notificationsArr.filter((item) => item?.isRead === false).length
          : 0;
        return {
          ...prev,
          unreadCount: unreadCount,
          notifications: notificationsArr,
        };
      });
      markAsSingleReadNotifications(obj?._id);
      if (obj?.info?.type == "order") {
        setOrderSingleDetails({});
        router.push(`/admin/orders/all?orderId=${obj?.info?.uriCode}`);
      } else if (obj?.info?.type == "orderComment") {
        setOrderSingleDetails({});
        router.push(
          `/admin/orders/all?orderId=${obj?.info?.uriCode}&comment=true`
        );
      }
    } catch (error) {
      //
    }
  }
  async function HandleMarkAsAllRead() {
    try {
      setNotifications((prev) => {
        const notificationsArr = isValidArray(prev?.notifications)
          ? prev?.notifications.map((item) => {
              return {
                ...item,
                isRead: true,
              };
            })
          : [];
        return {
          ...prev,
          unreadCount: 0,
          notifications: notificationsArr,
        };
      });
      const res = await markAsAllReadNotifications();
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    menuClose();
  }, []);

  // console.log(notifications, 'notifications');
  return (
    <Fragment>
      <header className="header custom-sticky !top-0 !w-full z-[10000]">
        <nav className="main-header" aria-label="Global">
          <div className="header-content">
            <div className="header-left">
              <div className="">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={() => toggleSidebar()}
                >
                  <span className="sr-only">Toggle Navigation</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>

                  {/* <i className="ri-arrow-right-circle-line header-icon toggle-icon"></i> */}
                </button>
              </div>
            </div>
            {/* 
                        <div className="responsive-logo">
                            <Link className="responsive-logo-dark" href={`/components/dashboards/sales`} aria-label="Brand">
                                <img src={`/assets/img/brand-logos/desktop-logo.png`} alt="logo" className="mx-auto" /></Link>
                            <Link className="responsive-logo-light" href={`/components/dashboards/sales`} aria-label="Brand">
                                <img src={`/assets/img/brand-logos/desktop-dark.png`} alt="logo" className="mx-auto" /></Link>
                        </div> */}

            <div className="header-right">
              <div className="responsive-headernav">
                <div className="header-nav-right">
                  <div
                    className="header-fullscreen hidden lg:block"
                    onClick={() => Fullscreen()}
                  >
                    <Link
                      aria-label="anchor"
                      href="#!"
                      className="inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] rounded-full font-medium bg-gray-100 hover:bg-gray-200 text-gray-500 align-middle focus:outline-none focus:ring-0 focus:ring-gray-400 focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-white/70 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                    >
                      <i className="ri-fullscreen-line header-icon full-screen-open"></i>
                      <i className="ri-fullscreen-line header-icon fullscreen-exit-line hidden"></i>
                    </Link>
                  </div>

                  <div
                    className="header-notification hs-dropdown ti-dropdown hidden sm:block"
                    data-hs-dropdown-placement="bottom-right"
                  >
                    <button
                      id="dropdown-notification"
                      type="button"
                      className="hs-dropdown-toggle ti-dropdown-toggle p-0 border-0 flex-shrink-0 h-[2.375rem] w-[2.375rem] rounded-full shadow-none focus:ring-gray-400 text-xs dark:focus:ring-white/10"
                    >
                      <i className="ri-notification-2-line header-icon animate-bell"></i>
                      <span className="flex absolute h-5 w-5 top-0 ltr:right-0 rtl:left-0 -mt-1 ltr:-mr-1 rtl:-ml-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/80 opacity-75"></span>
                        <span
                          className="relative inline-flex rounded-full h-5 w-5 bg-success text-white justify-center items-center"
                          id="notify-data"
                        >
                          {notifications?.unreadCount || 0}
                        </span>
                      </span>
                    </button>
                    <div
                      className="hs-dropdown-menu ti-dropdown-menu w-[20rem] border-0"
                      aria-labelledby="dropdown-notification"
                    >
                      <div className="ti-dropdown-header !bg-primary border-b dark:border-white/10 flex justify-between items-center">
                        <p className="ti-dropdown-header-title !text-white font-semibold">
                          Notifications
                        </p>
                        <button
                          className="badge bg-black/20 text-white rounded-sm"
                          onClick={() => HandleMarkAsAllRead()}
                        >
                          Mark All Read
                        </button>
                      </div>
                      <div className="ti-dropdown-divider divide-y divide-gray-200 dark:divide-white/10">
                        <div
                          className="py-2 first:pt-0 last:pb-0"
                          id="allNotifyContainer"
                        >
                          {isValidArray(notifications?.notifications) ? (
                            notifications?.notifications.map(
                              (notification, i) => (
                                <div
                                  className="ti-dropdown-item relative header-box cursor-pointer"
                                  key={i}
                                  style={{
                                    background: notification?.isRead
                                      ? ""
                                      : "#f2f6f9",
                                  }}
                                >
                                  <div
                                    className="flex space-x-3 rtl:space-x-reverse"
                                    onClick={() =>
                                      HandleMarkAsSingleNotification(
                                        notification
                                      )
                                    }
                                  >
                                    <div className="ltr:mr-2 rtl:ml-2 avatar rounded-full ring-0">
                                      <img
                                        src={ProfileAvatarOutput(
                                          notification?.customer?.avatar
                                        )}
                                        alt="img"
                                        className="rounded-sm"
                                      />
                                    </div>
                                    <div className="relative w-full">
                                      <h5 className="text-sm text-gray-800 dark:text-white font-semibold mb-1">
                                        {notification?.customer?.firstName ||
                                          ""}{" "}
                                        {notification?.customer?.lastName ||
                                          " "}
                                      </h5>
                                      <p className="text-xs mb-1 max-w-[200px] truncate">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-gray-400 dark:text-white/70">
                                        {notification?.createdAt &&
                                          moment(
                                            notification?.createdAt
                                          ).fromNow()}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleRemove1(notification?._id)
                                    }
                                    aria-label="anchor"
                                    href="#!"
                                    className="header-remove-btn ltr:ml-auto rtl:mr-auto text-lg text-gray-500/20 dark:text-white/20 hover:text-gray-800 dark:hover:text-white"
                                  >
                                    <i className="ri-close-circle-line"></i>
                                  </button>
                                </div>
                              )
                            )
                          ) : (
                            <p className="py-4 text-center">
                              Notification is empty
                            </p>
                          )}
                        </div>
                        {/* {isValidArray(notifications?.notifications) && <div className="py-2 first:pt-0 px-5">
                                                    <Link className="w-full ti-btn ti-btn-primary p-2" href={`/components/pages/mail/mail/`}>
                                                        View All
                                                    </Link>
                                                </div>} */}
                      </div>
                    </div>
                  </div>

                  <div
                    className="header-profile hs-dropdown ti-dropdown"
                    data-hs-dropdown-placement="bottom-right"
                  >
                    <button
                      id="dropdown-profile"
                      type="button"
                      className="hs-dropdown-toggle ti-dropdown-toggle gap-2 p-0 flex-shrink-0 h-8 w-8 rounded-full shadow-none focus:ring-gray-400 text-xs dark:focus:ring-white/10"
                    >
                      <img
                        className="avatar shadow-none  !ring-transparent w-[30px] h-[30px] rounded-full"
                        src={ProfileAvatarOutput(authData.avatar ?? "")}
                        alt="profile-img"
                      />
                    </button>

                    <div
                      className="hs-dropdown-menu ti-dropdown-menu border-0 w-[20rem]"
                      aria-labelledby="dropdown-profile"
                    >
                      <div className="ti-dropdown-header !bg-primary flex items-center">
                        <div className="ltr:mr-3 rtl:ml-3">
                          <img
                            className="avatar shadow-none rounded-full !ring-transparent"
                            src={ProfileAvatarOutput(authData.avatar ?? "")}
                            alt="profile-img"
                          />
                        </div>
                        <div>
                          <p className="ti-dropdown-header-title !text-white">
                            {authData?.firstName ?? "N/A"}{" "}
                            {authData?.lastName ?? ""}
                          </p>
                          {/* <p className="ti-dropdown-header-content !text-white/50">Web Designer</p> */}
                        </div>
                      </div>
                      <div className="mt-2 ti-dropdown-divider">
                        <Link
                          href={`/admin/${authData?._id}`}
                          className="ti-dropdown-item"
                        >
                          <i className="ti ti-user-circle text-lg"></i>
                          Profile
                        </Link>

                        <button
                          onClick={() => handleLogOut()}
                          className="ti-dropdown-item cursor-pointer"
                        >
                          <i className="ti ti-logout  text-lg"></i>
                          Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Modalsearch />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  local_varaiable: state,
});
export default connect(mapStateToProps, { ThemeChanger })(Header);
