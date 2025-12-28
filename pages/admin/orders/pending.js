import Order from "@/components/Orders/Order";
import Contentlayout from "@/shared/layout-components/layout/content-layout";

const pending = () => {
    const defaultOptions = [{
        label: 'Pending',
        value: 'PENDING',
    }];

    return (
        <Contentlayout>
            <Order trackingStatus="PENDING" defaultOptions={defaultOptions} isPendingOrder={true} isTestOrder={false}/>
        </Contentlayout>
    );
};

export default pending;
