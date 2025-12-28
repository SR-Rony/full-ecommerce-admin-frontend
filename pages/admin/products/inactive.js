import AllProducts from "@/components/Products/AllProducts";
import Contentlayout from "@/shared/layout-components/layout/content-layout";

const all = () => {

  return (
    <Contentlayout>
      <div>
<AllProducts isActive={false}/>
     
      </div>
    </Contentlayout>
  );
};

export default all;
