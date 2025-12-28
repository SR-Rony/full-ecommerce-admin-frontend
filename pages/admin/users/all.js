import Admin from "@/components/Admins/Admin";
import Contentlayout from "@/shared/layout-components/layout/content-layout";

const index = () => {
  return (
    <div>
          <Contentlayout>
           <Admin isBlocked={false}/>
        </Contentlayout>
    </div>
  );
};

export default index;
