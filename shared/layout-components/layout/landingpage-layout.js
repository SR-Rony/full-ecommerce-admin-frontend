
import React, { Fragment, useEffect } from 'react';

const Landingswitcher = dynamic(() => import("../switcher/landingswitcher"), {ssr: false,});

import Backtotop from '../backtotop/backtotop';
import dynamic from 'next/dynamic';

const Landingpagelayout = ({ children }) => {
    
    useEffect(() => {
        import("preline");
        
      }, []);
	
  return (
    <Fragment>
   
      <Landingswitcher/>
   {children}
    {/* <Backtotop/> */}
    <div id="responsive-overlay"></div>
</Fragment>
  );
};

export default Landingpagelayout;
