import { useFullStage } from "@/hooks/useFullStage";
import Link from "next/link";
import { useEffect, useState } from "react";
import MenuItems from "../sidebar/nav";

const Modalsearch = () => {
  const {Notifications} = useFullStage();
  const [notifications,setNotifications] = Notifications;
  //Search functionality
  const [show, setShow] = useState("false");

  const handleClose = () => setShow("false");
  const handleShow = () => setShow("false");

  const [show1, setShow1] = useState("false");
  const [InputValue, setInputValue] = useState("");
  const [show2, setShow2] = useState("false");
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [searchval, setsearchval] = useState("Type something");
  const [NavData, setNavData] = useState([]);

  useEffect(() => {
    const clickHandler = (event) => {
      const searchResult = document.querySelector(".search-result");
      if (searchResult) {
        searchResult.classList.add("hidden");
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  const myfunction = (inputvalue) => {
    document.querySelector(".search-result")?.classList.remove("hidden");

    const i = [];
    const allElement2 = [];

    MenuItems.map((mainlevel) => {
      if (mainlevel.Items) {
        setShow1(true);
        mainlevel.Items.map((sublevel) => {
          if (sublevel.children) {
            sublevel.children.map((sublevel1) => {
              i.push(sublevel1);
              if (sublevel1.children) {
                sublevel1.children.map((sublevel2) => {
                  i.push(sublevel2);
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
    for (let allElement of i) {
      if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
        if (
          allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())
        ) {
          setShow2(true);
          allElement2.push(allElement);
        }
      }
    }
    if (!allElement2.length || inputvalue === "") {
      if ({ inputvalue } + "/" === "") {
        setShow2(false);
        setsearchval("Type something");
        setsearchcolor("text-dark");
      }
      if (!allElement2.length) {
        setShow2(false);
        setsearchcolor("text-danger");
        setsearchval("There is no component with this name");
      }
    }
    setNavData(allElement2);
  };

  return (
    <div
      id="search-modal"
      className="hs-overlay ti-modal hidden"
      // show={show}
      onClick={handleClose}
    >
      <div className="ti-modal-box">
        <div className="ti-modal-content">
          <div className="ti-modal-body">
            <div className="header-search">
              <label htmlFor="icon" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="search-btn">
                  <i className="ri ri-search-2-line search-btn-icon"></i>
                </div>
                <input
                  id="icon"
                  name="icon"
                  className="py-2 ltr:pl-11 rtl:pr-11 ti-form-input focus:z-10"
                  type="search"
                  defaultValue={InputValue}
                  autoComplete="off"
                  onChange={(ele) => {
                    myfunction(ele.target.value);
                    setInputValue(ele.target.value);
                  }}
                  placeholder="Search"
                />
                <div className="voice-search">
                  <i className="ri ri-mic-2-line voice-btn-icon"></i>
                </div>
                <div className="search-dropdown">
                  <i className="ri ri-more-2-line search-dropdown-btn-icon"></i>
                </div>
              </div>
            </div>
            {show1 ? (
              <div className="box search-result relative z-[9] search-fix  border border-gray-200 dark:border-white/10 mt-1 w-100">
                <div className="box-header">
                  <h6 className="box-title me-2 text-break">
                    Search result of {InputValue}
                  </h6>
                </div>
                <div className="box-body p-2 flex flex-col max-h-[250px] overflow-auto">
                  {show2 ? (
                    NavData.map((e) => (
                      <div
                        key={Math.random()}
                        className="ti-list-group gap-x-3.5 bg-white text-gray-800 dark:bg-bgdark dark:border-white/10 dark:text-white"
                      >
                        <Link
                          href={`${e.path}/`}
                          className="search-result-item"
                          onClick={() => {
                            setShow1("false"), setInputValue("");
                          }}
                        >
                          {e.title}
                        </Link>
                      </div>
                    ))
                  ) : (
                    <b className={`${searchcolor} `}>{searchval}</b>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="mt-5 ">
              <p className="font-semibold text-[13px] text-gray-400 dark:text-gray-200 mb-2">
                Are You Looking For...
              </p>
              <div className="space-x-3 rtl:space-x-reverse">
                <div className="badge rounded-sm bg-secondary/20 text-secondary relative header-box">
                  <Link
                    href={`/components/pages/team/`}
                    className="w-full my-auto items-center flex space-x-2 rtl:space-x-reverse"
                  >
                    <span className="inline-block text-secondary mr-1">
                      <i className="ri ri-user-line text-sm"></i>
                    </span>
                    Team
                  </Link>
                  <Link
                    href="#!"
                    className="header-remove-btn flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full text-secondary hover:bg-secondary hover:text-secondary focus:outline-none focus:bg-secondary focus:text-white"
                  >
                    <span className="sr-only">Remove badge</span>
                    <svg
                      className="h-4 w-4 hover:fill-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                    </svg>
                  </Link>
                </div>
                <div className="badge rounded-sm bg-secondary/20 text-secondary relative header-box">
                  <Link
                    href={`/components/forms/form-elements/`}
                    className="w-full my-auto items-center flex space-x-2 rtl:space-x-reverse"
                  >
                    <span className="inline-block text-secondary mr-1">
                      <i className="ri ri-file-text-line text-sm"></i>
                    </span>
                    Forms
                  </Link>
                  <Link
                    href="#!"
                    className="header-remove-btn flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full text-secondary hover:bg-secondary hover:text-secondary focus:outline-none focus:bg-secondary focus:text-white"
                  >
                    <span className="sr-only">Remove badge</span>
                    <svg
                      className="h-4 w-4 hover:fill-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                    </svg>
                  </Link>
                </div>
                <div className="badge rounded-sm bg-secondary/20 text-secondary relative header-box">
                  <Link
                    href={`/components/maps/simple-maps/`}
                    className="w-full my-auto items-center flex space-x-2 rtl:space-x-reverse"
                  >
                    <span className="inline-block text-secondary mr-1">
                      <i className="ri ri-map-pin-line text-sm"></i>
                    </span>
                    Maps
                  </Link>
                  <Link
                    href="#!"
                    className="header-remove-btn flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full text-secondary hover:bg-secondary hover:text-secondary focus:outline-none focus:bg-secondary focus:text-white"
                  >
                    <span className="sr-only">Remove badge</span>
                    <svg
                      className="h-4 w-4 hover:fill-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                    </svg>
                  </Link>
                </div>
                <div className="badge rounded-sm bg-secondary/20 text-secondary relative header-box">
                  <Link
                    href={`/components/widgets/widgets`}
                    className="w-full my-auto items-center flex space-x-2 rtl:space-x-reverse"
                  >
                    <span className="inline-block text-secondary mr-1">
                      <i className="ri ri-server-line text-sm"></i>
                    </span>
                    Widgets
                  </Link>
                  <Link
                    href="#!"
                    className="header-remove-btn flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full text-secondary hover:bg-secondary hover:text-secondary focus:outline-none focus:bg-secondary focus:text-white"
                  >
                    <span className="sr-only">Remove badge</span>
                    <svg
                      className="h-4 w-4 hover:fill-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="font-semibold text-sm text-gray-500 mb-2">
                Recent Search :
              </p>
              <div className="p-2 border dark:border-white/10 rounded-sm flex items-center text-gray-500 mb-1 relative header-box">
                <Link
                  href={`/components/advance-ui/notifications/`}
                  className="w-full my-auto items-center flex"
                >
                  <span className="text-sm">Notifications</span>
                </Link>
                <a
                  aria-label="anchor"
                  href="#!"
                  className="ltr:ml-auto rtl:mr-auto flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full text-gray-500 focus:outline-none header-remove-btn"
                >
                  <i className="ri-close-line"></i>
                </a>
              </div>
              <div className="p-2 border dark:border-white/10 rounded-sm flex items-center text-gray-500 mb-1 relative header-box">
                <Link
                  href={`/components/component/alerts/`}
                  className="w-full my-auto items-center flex"
                >
                  <span className="text-sm">Alerts</span>
                </Link>
                <a
                  aria-label="anchor"
                  href="#!"
                  className="ltr:ml-auto rtl:mr-auto flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full text-gray-500 focus:outline-none header-remove-btn"
                >
                  <i className="ri-close-line"></i>
                </a>
              </div>
              <div className="p-2 border dark:border-white/10 rounded-sm flex items-center text-gray-500 relative header-box">
                <Link
                  href={`/components/basic-ui/table/basic-tables/`}
                  className="w-full my-auto items-center flex"
                >
                  <span className="text-sm">Tables</span>
                </Link>
                <a
                  aria-label="anchor"
                  href="#!"
                  className="ltr:ml-auto rtl:mr-auto flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full text-gray-500 focus:outline-none header-remove-btn"
                >
                  <i className="ri-close-line"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="ti-modal-footer">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className="ti-btn-group !py-1 ti-btn-soft-primary dark:border-white/10"
              >
                Search
              </button>
              <button
                type="button"
                className="ti-btn-group !py-1 ti-btn-primary dark:border-white/10"
              >
                Clear Recents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modalsearch;
