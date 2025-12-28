"use client;";
import store from "@/shared/redux/store";
import { Fragment, useEffect, useState } from "react";
import { Provider } from "react-redux";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import Switcher from "../switcher/switcher";

const Contentlayout = ({ children, noPadding }) => {
  let [MyclassName, setMyClass] = useState("");

  const Bodyclickk = () => {
    if (localStorage.getItem("Syntoverticalstyles") == "icontext") {
      setMyClass("");
    }
  };
  useEffect(() => {
    import("preline");
  }, []);

  return (
    <Fragment>
      <Provider store={store}>
        <Switcher />
        <div className="page">
          <Sidebar />
          <Header />
          <div className="content">
            <div className={"main-content " + (noPadding ? "!px-0" : "")}>
              {children}
            </div>
          </div>
          {/* <Footer /> */}
        </div>
        {/* <Backtotop /> */}
        <div id="responsive-overlay"></div>
      </Provider>
    </Fragment>
  );
};

export default Contentlayout;
