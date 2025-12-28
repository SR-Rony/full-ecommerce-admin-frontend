import AllProducts from "@/components/Products/AllProducts";
import Contentlayout from "@/shared/layout-components/layout/content-layout";

const all = () => {
  return (
    <Contentlayout>
      <div className="py-4">
        <AllProducts />
      </div>
    </Contentlayout>
  );
};

export default all;
