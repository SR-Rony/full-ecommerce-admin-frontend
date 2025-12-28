/* eslint-disable no-lone-blocks */
/* eslint-disable react/no-unescaped-entities */
import { useFullStage } from "@/hooks/useFullStage";
import store from "@/shared/redux/store";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ThemeChanger } from "../../redux/action";
import MenuItems from "./nav";
import { FiMenu, FiX, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./sidebar.module.css";

let history = [];

const Sidebar = ({ local_varaiable, ThemeChanger }) => {
  const { Settings, Auth } = useFullStage();
  const [appInfoSetting, setAppInfoSetting] = Settings.AppInfoSetting;
  const [authData, setAuthData] = Auth;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  let router = useRouter();
  const [menuitems, setMenuitems] = useState(MenuItems);
  
  useEffect(() => {
    history.push(router.pathname);
    if (history.length > 2) {
      history.shift();
    }
    if (history[0] !== history[1]) {
      setSidemenu();
    }
    let mainContent = document.querySelector(".main-content");
    mainContent?.addEventListener("click", mainContentClickFn);
    return () => {
      mainContent?.removeEventListener("click", mainContentClickFn);
    };
  }, [router]);

  useEffect(() => {
    if (
      local_varaiable.dataNavLayout == "horizontal" &&
      window.innerWidth >= 992
    ) {
      clearMenuActive();
    }
  }, []);

  //  In Horizontal When we click the body it should we Closed
  function mainContentClickFn() {
    if (
      local_varaiable.dataNavLayout === "horizontal" &&
      window.innerWidth >= 992
    ) {
      clearMenuActive();
    }
  }
  function setSidemenu(list) {
    let dd = list ? list.path + "" : router.pathname;
    if (menuitems) {
      menuitems.filter((mainlevel) => {
        if (mainlevel.Items) {
          mainlevel.Items.filter((items) => {
            items.active = false;
            items.selected = false;

            if (dd === "") {
              dd = "/dashboards/sales/";
            }
            if (dd === items.path + "") {
              items.active = true;
              items.selected = true;
            }
            if (items.children) {
              items.children.filter((submenu) => {
                submenu.active = false;
                submenu.selected = false;
                if (dd === submenu.path + "") {
                  items.active = true;
                  items.selected = true;
                  submenu.active = true;
                  submenu.selected = true;
                }
                if (submenu.children) {
                  submenu.children.filter((submenu1) => {
                    submenu1.active = false;
                    submenu1.selected = false;
                    if (dd === submenu1.path + "") {
                      items.active = true;
                      items.selected = true;
                      submenu.active = true;
                      submenu.selected = true;
                      submenu1.active = true;
                      submenu1.selected = true;
                    }
                    return submenu1;
                  });
                }
                return submenu;
              });
            }
            return items;
          });
        }
        setMenuitems((arr) => [...arr]);
        return mainlevel;
      });
    }

    if (localStorage.getItem("Syntoverticalstyles") == "icontext") {
      // ThemeChanger({ ...local_varaiable, "iconText": "open" })
    }
    if (local_varaiable.dataToggled == "doublemenu") {
      ThemeChanger({ ...local_varaiable, dataToggled: "double-menu-open" });
    }
  }
  function toggleSidemenu(item) {
    {
      // To show/hide the menu
      if (!item.active) {
        menuitems.filter((mainlevel) => {
          if (mainlevel.Items) {
            mainlevel.Items.filter((sublevel) => {
              sublevel.active = false;
              if (item === sublevel) {
                sublevel.active = true;
              }
              if (sublevel.children) {
                sublevel.children.filter((sublevel1) => {
                  sublevel1.active = false;
                  if (item === sublevel1) {
                    sublevel.active = true;
                    sublevel1.active = true;
                  }
                  if (sublevel1.children) {
                    sublevel1.children.filter((sublevel2) => {
                      sublevel2.active = false;
                      if (item === sublevel2) {
                        sublevel.active = true;
                        sublevel1.active = true;
                        sublevel2.active = true;
                      }
                      if (sublevel2.children) {
                        sublevel2.children.filter((sublevel3) => {
                          sublevel3.active = false;
                          if (item === sublevel3) {
                            sublevel.active = true;
                            sublevel1.active = true;
                            sublevel2.active = true;
                            sublevel3.active = true;
                          }
                          return sublevel2;
                        });
                      }
                      return sublevel2;
                    });
                  }
                  return sublevel1;
                });
              }
              return sublevel;
            });
          }
          return mainlevel;
        });
      } else {
        item.active = !item.active;
      }
    }

    setMenuitems((arr) => [...arr]);
  }
  function clearMenuActive() {
    MenuItems.filter((mainlevel) => {
      if (mainlevel.Items) {
        mainlevel.Items.filter((sublevel) => {
          sublevel.active = false;
          if (sublevel.children) {
            sublevel.children.filter((sublevel1) => {
              sublevel1.active = false;
              if (sublevel1.children) {
                sublevel1.children.filter((sublevel2) => {
                  sublevel2.active = false;
                  return sublevel2;
                });
              }
              return sublevel1;
            });
          }
          return sublevel;
        });
      }
      return mainlevel;
    });
    setMenuitems((arr) => [...arr]);
  }
  function Onhover() {
    const theme = store.getState();
    if (
      (theme.dataToggled == "icon-overlay-close" ||
        theme.dataVerticalStyle == "detached") &&
      theme.iconOverlay != "open"
    ) {
      ThemeChanger({ ...theme, iconOverlay: "open" });
    }
  }
  function Outhover() {
    const theme = store.getState();
    if (
      (theme.dataToggled == "icon-overlay-close" ||
        theme.dataVerticalStyle == "detached") &&
      theme.iconOverlay == "open"
    ) {
      ThemeChanger({ ...theme, iconOverlay: "" });
    }
  }
  function Clickhandelar() {
    if (localStorage.getItem("Syntoverticalstyles") == "icontext") {
      ThemeChanger({ ...local_varaiable, iconText: "open" });
    }
    if (local_varaiable.dataVerticalStyle == "doublemenu") {
      ThemeChanger({
        ...local_varaiable,
        dataToggled:
          local_varaiable.dataToggled == "double-menu-open"
            ? ""
            : "double-menu-open",
      });
    }
  }

  let MenuOpen = (selectedItem) => {
    let productsInitClick = [];
    let ordersInitClick = [];
    let customersInitClick = [];
    for (let clickPath of selectedItem.children) {
      if (!clickPath.selected && selectedItem.path == "/admin/orders/alls") {
        ordersInitClick.push(clickPath);
      }
    }
    for (let clickPath of selectedItem.children) {
      if (!clickPath.selected && selectedItem.path == "/admin/products/alls") {
        productsInitClick.push(clickPath);
      }
    }
    for (let clickPath of selectedItem.children) {
      if (!clickPath.selected && selectedItem.path == "/admin/customers/alls") {
        customersInitClick.push(clickPath);
      }
    }
    let MainContent = document.querySelector(".main-content");
    if (
      local_varaiable.dataVerticalStyle == "icontext" &&
      local_varaiable.iconText != "open"
    ) {
      const theme = store.getState();
      ThemeChanger({ ...theme, iconText: "open" });
      MainContent?.addEventListener("click", (_event) => {
        const theme = store.getState();
        ThemeChanger({ ...theme, iconText: "" });
      });
    }
    const theme = store.getState();
    if (
      localStorage.Syntoverticalstyles == "doublemenu" &&
      theme.dataToggled != "double-menu-open"
    ) {
      const theme = store.getState();
      ThemeChanger({ ...theme, dataToggled: "double-menu-open" });
    }

    if (
      localStorage.Syntoverticalstyles == "doublemenu" &&
      theme.dataToggled != "double-menu-open"
    ) {
      const theme = store.getState();
      ThemeChanger({ ...theme, dataToggled: "double-menu-open" });
    }

    if (
      selectedItem.path == "/admin/orders/alls" &&
      ordersInitClick.length == 4
    ) {
      router.push("/admin/orders/all");
    }
    if (
      selectedItem.path == "/admin/products/alls" &&
      productsInitClick.length == 2
    ) {
      router.push("/admin/products/all");
    }
    if (
      selectedItem.path == "/admin/customers/alls" &&
      customersInitClick.length == 2
    ) {
      router.push("/admin/customers/all");
    }
  };
  function menuClose() {
    const theme = store.getState();
    ThemeChanger({ ...theme, dataToggled: "close" });
    document.querySelector("#responsive-overlay").classList.remove("active");
  }

  useEffect(() => {
    let mainContent = document.querySelector(".main-content");
    if (window.innerWidth <= 992) {
      mainContent.addEventListener("click", menuClose);
    } else {
      mainContent?.removeEventListener("click", menuClose);
    }
    window.addEventListener("resize", () => {
      // if(window.screen.width >= 991){
      // 	const theme = store.getState()
      // 	ThemeChanger({ ...theme, "dataToggled": "icon-overlay-close" })
      // }else{
      // 	if(window.screen.width <= 991){
      // 		const theme = store.getState()
      // 	ThemeChanger({ ...theme, "dataToggled": "close" })

      // 	}
      // 	  else{
      // 		if(window.screen.width <= 991) {
      // 			const theme = store.getState()
      // 			ThemeChanger({ ...theme, "dataToggled": "" })
      // 		 }
      // 	  }
      // }

      let mainContent = document.querySelector(".main-content");
      setTimeout(() => {
        if (window.innerWidth <= 992) {
          mainContent?.addEventListener("click", menuClose);
        } else {
          mainContent?.removeEventListener("click", menuClose);
        }
      }, 100);
    });
  }, []);
  function switcherArrowFn() {
    // used to remove is-expanded class and remove class on clicking arrow buttons
    function slideClick() {
      const slide = document.querySelectorAll(".slide");
      const slideMenu = document.querySelectorAll(".slide-menu");
      slide.forEach((element) => {
        if (element.classList.contains("is-expanded") == true) {
          element.classList.remove("is-expanded");
        }
      });
      slideMenu.forEach((element) => {
        if (element.classList.contains("open") == true) {
          element.classList.remove("open");
          element.style.display = "none";
        }
      });
    }

    slideClick();
  }
  let slideRight = () => {
    let menuNav = document.querySelector(".main-menu");
    let mainContainer1 = document.querySelector(".main-sidebar");
    if (menuNav && mainContainer1) {
      const isRTL =
        document.querySelector("html")?.getAttribute("dir") === "rtl";
      const menuNavStyle = getComputedStyle(menuNav);
      let marginLeftValue = Math.ceil(
        Number(menuNavStyle.marginLeft.split("px")[0])
      );
      let marginRightValue = Math.ceil(
        Number(menuNavStyle.marginRight.split("px")[0])
      );
      let check = menuNav.scrollWidth - mainContainer1.offsetWidth;
      let mainContainer1Width = mainContainer1.offsetWidth;

      if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
        if (!isRTL) {
          if (Math.abs(check) > Math.abs(marginLeftValue)) {
            menuNav.style.marginRight = "0px";
            if (
              !(
                Math.abs(check) >
                Math.abs(marginLeftValue) + mainContainer1Width
              )
            ) {
              mainContainer1Width = Math.abs(check) - Math.abs(marginLeftValue);
              document.querySelector("#slide-right")?.classList.add("hidden");
            }
            menuNav.style.marginLeft =
              Number(menuNav.style.marginLeft.split("px")[0]) -
              Math.abs(mainContainer1Width) +
              "px";
            document.querySelector("#slide-right")?.classList.remove("hidden");
          }
        } else {
          if (Math.abs(check) > Math.abs(marginRightValue)) {
            menuNav.style.marginLeft = "0px";
            if (
              !(
                Math.abs(check) >
                Math.abs(marginRightValue) + mainContainer1Width
              )
            ) {
              mainContainer1Width =
                Math.abs(check) - Math.abs(marginRightValue);
              document.querySelector("#slide-right")?.classList.add("hidden");
            }
            menuNav.style.marginRight =
              Number(menuNav.style.marginRight.split("px")[0]) -
              Math.abs(mainContainer1Width) +
              "px";
            document.querySelector("#slide-left")?.classList.remove("hidden");
          }
        }
      }
      let element = document.querySelector(".main-menu > .slide.open");
      let element1 = document.querySelector(".main-menu > .slide.open > ul");
      if (element) {
        element.classList.remove("active");
      }
      if (element1) {
        element1.style.display = "none";
      }
    }

    switcherArrowFn();
  };

  let slideLeft = () => {
    let menuNav = document.querySelector(".main-menu");
    let mainContainer1 = document.querySelector(".main-sidebar");
    if (menuNav && mainContainer1) {
      let marginLeftValue = Math.ceil(
        Number(window.getComputedStyle(menuNav).marginLeft.split("px")[0])
      );
      let marginRightValue = Math.ceil(
        Number(window.getComputedStyle(menuNav).marginRight.split("px")[0])
      );
      let check = menuNav.scrollWidth - mainContainer1.offsetWidth;
      let mainContainer1Width = mainContainer1.offsetWidth;
      if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
        if (!(document.querySelector("html")?.getAttribute("dir") === "rtl")) {
          if (Math.abs(check) <= Math.abs(marginLeftValue)) {
            menuNav.style.marginLeft = "0px";
          }
        } else {
          if (Math.abs(check) > Math.abs(marginRightValue)) {
            menuNav.style.marginLeft = 0;
            if (
              !(
                Math.abs(check) >
                Math.abs(marginRightValue) + mainContainer1Width
              )
            ) {
              mainContainer1Width =
                Math.abs(check) - Math.abs(marginRightValue);
              document.querySelector("#slide-right")?.classList.add("hidden");
            }
            menuNav.style.marginRight =
              Number(menuNav.style.marginRight.split("px")[0]) -
              Math.abs(mainContainer1Width) +
              "px";
            document.querySelector("#slide-left")?.classList.remove("hidden");
          }
        }
      }
      let element = document.querySelector(".main-menu > .slide.open");
      let element1 = document.querySelector(".main-menu > .slide.open >ul");
      if (element) {
        element.classList.remove("active");
      }
      if (element1) {
        element1.style.display = "none";
      }
    }

    switcherArrowFn();
  };
  const redirectMyOrders = (thirdlayer) => {
    if (thirdlayer.path == "/admin/customers/customerId/orders") {
      router.push(`/admin/customers/${authData?._id}/orders`);
    } else if (thirdlayer.path == "/admin/customers/customerId") {
      router.push(`/admin/customers/${authData?._id}`);
    } else {
      router.push(thirdlayer.path + "");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Fragment>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <FiX className="w-6 h-6 text-gray-700" />
        ) : (
          <FiMenu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          app-sidebar fixed top-0 left-0 h-full shadow-2xl z-40 transition-all duration-300 ease-in-out
          ${styles['sidebar-gradient']}
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        id="sidebar"
        onMouseOver={() => Onhover()}
        onMouseLeave={() => Outhover()}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          {appInfoSetting?.siteLogo && (
            <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-4'} ${styles['logo-container']}`}>
              <img
                src={appInfoSetting?.siteLogo}
                className="w-12 h-12 rounded-full object-cover cursor-pointer ring-2 ring-slate-600 hover:ring-blue-500 transition-all duration-300"
                alt="logo"
                onClick={() => router.push("/")}
              />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <h2 className="text-white font-bold text-lg">Admin Panel</h2>
                  <p className="text-slate-400 text-xs">Management Dashboard</p>
                </div>
              )}
            </div>
          )}
          
          {/* Desktop Collapse Toggle */}
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <FiChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>
        
        {/* Collapsed Expand Button */}
        {isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-full py-3 hover:bg-slate-700/50 transition-all duration-300"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <FiChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        )}

        {/* Sidebar Content */}
        <div className={`${isCollapsed ? 'h-[calc(100%-88px)]' : 'h-[calc(100%-176px)]'} overflow-y-auto ${styles['custom-scrollbar']}`}>
          <nav className="p-4">
            {menuitems.map((firstlayer, index) => (
              <div key={index} className="mb-6">
                {/* Category Title */}
                {firstlayer.menutitle && !isCollapsed && (
                  <div className="px-4 mb-3">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {firstlayer.menutitle}
                    </h3>
                  </div>
                )}
                
                {/* Menu Items */}
                <ul className="space-y-1">
                  {firstlayer.Items.map((secondlayer, idx) =>
                    secondlayer.type === "link" ? (
                      <li key={idx} className="relative group">
                        <Link
                          onClick={() => {
                            setSidemenu(secondlayer);
                            setIsMobileMenuOpen(false);
                          }}
                          href={secondlayer.path + "/"}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative
                            ${secondlayer.selected 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
                              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                            }
                            ${isCollapsed ? 'justify-center' : ''}
                            ${styles['menu-item']}
                          `}
                        >
                          <span className="text-xl flex-shrink-0">
                            {secondlayer.icon}
                          </span>
                          {!isCollapsed && (
                            <span className="font-medium">{secondlayer.title}</span>
                          )}
                        </Link>
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                          <div className={`${styles['sidebar-tooltip']} hidden lg:block`}>
                            {secondlayer.title}
                          </div>
                        )}
                      </li>
                    ) : secondlayer.type === "sub" ? (
                      <li key={idx} className="relative group">
                        <button
                          onClick={() => {
                            toggleSidemenu(secondlayer);
                            MenuOpen(secondlayer);
                          }}
                          className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 relative
                            ${secondlayer.selected 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
                              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                            }
                            ${styles['menu-item']}
                          `}
                        >
                          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                            <span className="text-xl flex-shrink-0">
                              {secondlayer.icon}
                            </span>
                            {!isCollapsed && (
                              <span className="font-medium">{secondlayer.title}</span>
                            )}
                          </div>
                          {!isCollapsed && (
                            <FiChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                secondlayer.active ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </button>
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                          <div className={`${styles['sidebar-tooltip']} hidden lg:block`}>
                            {secondlayer.title}
                          </div>
                        )}
                        
                        {/* Submenu */}
                        {secondlayer.active && !isCollapsed && (
                          <ul className="mt-2 ml-4 space-y-1 border-l-2 border-slate-700 pl-4 animate-fadeIn">
                            {secondlayer.children.map((thirdlayer, childIdx) => (
                              <li key={childIdx}>
                                <button
                                  onClick={() => {
                                    setSidemenu(thirdlayer);
                                    redirectMyOrders(thirdlayer);
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className={`
                                    w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm
                                    ${thirdlayer.selected
                                      ? 'bg-blue-500/20 text-blue-400 font-medium'
                                      : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
                                    }
                                  `}
                                >
                                  {thirdlayer.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50">
            <div className={`flex items-center gap-3 px-2 cursor-pointer ${styles['user-profile']}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {authData?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {authData?.name || 'Admin User'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {authData?.email || 'admin@example.com'}
                </p>
              </div>
              <button 
                className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                aria-label="User menu"
                title="User settings"
              >
                <FiChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Add padding to main content to account for sidebar */}
      <style jsx>{`
        @media (min-width: 1024px) {
          .main-content {
            margin-left: ${isCollapsed ? '5rem' : '18rem'};
            transition: margin-left 0.3s ease-in-out;
          }
        }
        
        /* Custom Scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 1);
        }
      `}</style>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  local_varaiable: state,
});

export default connect(mapStateToProps, { ThemeChanger })(Sidebar);
