import EmptyTableSection from "@/components/EmptyDataSection/EmptyTableSection";
import ProductDetails from "@/components/Modals/Products/ProductDetails";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import TableSkeleton from "@/shared/skeleton/TableSkeleton";
import { isValidArray, numberWithCommas } from "@/utils/func";
import Table from "@/shared/components/Table";

import { useState } from "react";

const DashboardTopSalesProduct = ({
  isRequestProduct,
  products: _products,
  className = "box",
  type,
}) => {
  const { Product } = useFullStage();
  const [productDetailsActiveTab, setProductDetailsActiveTab] =
    useState("productDetails");

  const [productDetailsModalOpen, setProductDetailsModalOpen] = useState(false);
  const [products, setProducts] = Product.Products;
  const [singleProductDetails, setSingleProductDetails] =
    Product.ProductSingleDetails;
  const handleOpenProductDetailsModal = (productSlug) => {
    setProductDetailsActiveTab("productDetails");
    setSingleProductDetails((prev) => {
      return {
        ...prev,
        slug: productSlug,
      };
    });
    setProductDetailsModalOpen(true);
  };
  return (
    <div className="w-full h-full">
      <Table variant="modern" hoverable={true}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Product</Table.Head>
            <Table.Head>Sale Price</Table.Head>
            <Table.Head>Sold Count</Table.Head>
            <Table.Head>Sold Amount</Table.Head>
            <Table.Head>Views</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isRequestProduct && (
            <Table.Loading rows={5} columns={5} />
          )}
          {!isRequestProduct && !isValidArray(_products) && (
            <Table.Empty message="No top sales data available" icon="🏆" />
          )}
          {!isRequestProduct &&
            isValidArray(_products) &&
            _products.map((item, i) => (
              <Table.Row
                key={i}
                onClick={() => {
                  handleOpenProductDetailsModal(item?.slug);
                }}
                hoverable={true}
              >
                <Table.Cell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white">
                      {item?.title}
                    </span>
                    {item?.bundle?.isLimited === true && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({item?.subTitle || ""})
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    ${parseFloat(item?.price?.sale || 0).toFixed(2) || "0.00"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item?.stats?.totalSoldCount || 0}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ${parseFloat(item?.stats?.totalSoldAmount || 0).toFixed(2)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <span className="text-purple-600 dark:text-purple-400">👁️</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {numberWithCommas(item?.stats?.viewCount || 0) || 0}
                    </span>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <ProductDetails
        isOpen={productDetailsModalOpen}
        setIsOpen={setProductDetailsModalOpen}
        setActiveTab={setProductDetailsActiveTab}
        activeTab={productDetailsActiveTab}
      />
    </div>
  );
};

export default DashboardTopSalesProduct;
