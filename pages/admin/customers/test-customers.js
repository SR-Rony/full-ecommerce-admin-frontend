import Customer from "@/components/Customers/Customer";
import Contentlayout from "@/shared/layout-components/layout/content-layout";

const index = () => {
  return (
    <div>
          <Contentlayout>
           <Customer isBlocked={''} isTestCustomer={true}/>
        </Contentlayout>
    </div>
  );
};

export default index;
