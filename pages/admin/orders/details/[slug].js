'use client';
import Contentlayout from "@/shared/layout-components/layout/content-layout";
// const OrderDetails = dynamic(
//   () => import('@/components/Orders/OrderDetails'),
//   { ssr: false }
// );
const orderDetails = () => {
  return (
    <div>
    <Contentlayout>
    {/* <OrderDetails/> */}
    </Contentlayout>
    </div>
  );
};

export default orderDetails;
