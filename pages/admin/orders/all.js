import Order from "@/components/Orders/Order";
import Contentlayout from "@/shared/layout-components/layout/content-layout";

const all = () => {
    const defaultOptions =[{
        label: 'Paid',
        value: 'PAID',
      },
      {
        label: 'Packed',
        value: 'PACKED',
      },
      {
        label: 'Partially Shipped',
        value: 'PARTIALLY_SHIPPED',
      },
      {
        label: 'Fully Shipped',
        value: 'FULLY_SHIPPED',
      }
    
    ];

    return (
        <Contentlayout>
           <Order trackingStatus="PAID,PACKED,PARTIALLY_SHIPPED,FULLY_SHIPPED"defaultOptions={defaultOptions}  isPendingOrder={false}isTestOrder={false}/>
        </Contentlayout>
    );
};

export default all;
