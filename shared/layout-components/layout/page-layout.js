
import store from "@/shared/redux/store";
import { Fragment, useEffect, useState } from "react";
import { Provider } from "react-redux";
import Footer from "../footer/footer";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import Switcher from "../switcher/switcher";

const Pagelayout = ({children}) => {
	
	let [MyclassName , setMyClass] = useState("");

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
			
			<Switcher/>
			<div className="page bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
				<Sidebar/>
				<Header/>
				<div className="content relative backdrop-blur-sm bg-slate-800/20 border border-purple-500/20 rounded-lg m-4 shadow-2xl">
					
						{children}
					
				</div>
				<Footer />
			</div>
			{/* <Backtotop /> */}
			<div id="responsive-overlay" className="bg-slate-900/80 backdrop-blur-sm"></div>
			</Provider>
		</Fragment>
	);
};

export default Pagelayout;
