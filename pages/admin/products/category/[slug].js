import AllProducts from "@/components/Products/AllProducts";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { useRouter } from "next/router";

const all = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const categories = router.query.slug;

  return (
    <Contentlayout>
      <div>
<AllProducts categories={categories}/>
     
      </div>
    </Contentlayout>
  );
};

export default all;
