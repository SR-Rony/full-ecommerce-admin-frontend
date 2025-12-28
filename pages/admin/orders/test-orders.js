import Order from "@/components/Orders/Order";
import Contentlayout from "@/shared/layout-components/layout/content-layout";

const testOrders = () => {
const defaultOptions = [
    {
      label: "Pending",
      value: "PENDING",
    },
    {
      label: "Paid",
      value: "PAID",
    },
    {
      label: "Packed",
      value: "PACKED",
    },
    {
      label: "Partially Shipped",
      value: "PARTIALLY_SHIPPED",
    },
    {
      label: "Fully Shipped",
      value: "FULLY_SHIPPED",
    },
  ];
    return (
        <Contentlayout>
            <Order trackingStatus="" defaultOptions={defaultOptions} isTestOrder={true}/>
        </Contentlayout>
    );
};

export default testOrders;
