import Order from "@/components/Orders/Order";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { useRouter } from "next/router";

const customerOrders = () => {
  const router = new useRouter();
  const defaultOptions = [{
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
   
      <Order customerId={router?.query?.customerId ?? ""} trackingStatus="PAID,PACKED,PARTIALLY_SHIPPED,FULLY_SHIPPED" defaultOptions={defaultOptions} />
    </Contentlayout>
  );
};

export default customerOrders;
