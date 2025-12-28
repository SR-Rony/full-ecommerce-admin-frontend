
import React, { Fragment, useEffect } from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";
import Authenticationswitcher from "../switcher/authenticationswitcher";

const Authenticationlayout = ({ children }) => {

    useEffect(() => {
        import('preline');
    }, []);

    return (
        <Fragment>
           
                <HelmetProvider>
                    <Helmet>
                        <html className="h-full"/>
                    </Helmet>
                    <Authenticationswitcher/>
                    {children}
                </HelmetProvider>
    
        </Fragment>

    );
};

export default Authenticationlayout;
