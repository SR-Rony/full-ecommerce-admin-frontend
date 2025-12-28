import { useFullStage } from "@/hooks/useFullStage";

import { isValidArray, numberWithCommas } from "@/utils/func";
import { useState } from "react";
import ProductDetails from "../Modals/Products/ProductDetails";
import Table from "@/shared/components/Table";

const AnalyticsGroupProducts = ({
  isRequestProduct,
  products: _products,
  className = "box",
  type,
  dateRange = "daily",
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
  const getAmount = (price, otherPrice) => {
    return (parseFloat(price || 0) + parseFloat(otherPrice || 0)).toFixed(2);
  };

  return (
    <div className="w-full h-full mb-10">
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
            <Table.Empty message="No product data available" icon="📦" />
          )}
          {!isRequestProduct &&
            isValidArray(_products) &&
            _products.map((item, i) => (
              <Table.Row
                key={i}
                onClick={() => {
                  handleOpenProductDetailsModal(item?.product?.slug);
                }}
                hoverable={true}
              >
                <Table.Cell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white">
                      {item?.title}
                    </span>
                    {item?.isBundle === true && (
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
                  <div>
                    {item?.bundleSales?.bundleSalesQuantity ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {item?.bundleSize === 0
                            ? item?.productQuantity +
                              (item?.bundleSales?.bundleSalesQuantity || 0)
                            : item?.productQuantity}
                        </span>
                        {item?.bundleSize === 0 && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">
                            ({item?.bundleSales?.bundleSalesQuantity || 0}x Bundle)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item?.productQuantity}
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      $
                      {item?.bundleSize === 0 &&
                      item?.bundleSales?.bundleSalesAmount
                        ? getAmount(
                            item.productSalesAmount,
                            item?.bundleSales?.bundleSalesAmount
                          )
                        : parseFloat(item.productSalesAmount || 0).toFixed(2) ||
                          "0.00"}
                    </span>
                    {item?.bundleSize === 0 &&
                      item?.bundleSales?.bundleSalesAmount && (
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          (${parseFloat(
                            item?.bundleSales?.bundleSalesAmount || 0
                          ).toFixed(2)} Bundle)
                        </span>
                      )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <span className="text-purple-600 dark:text-purple-400">👁️</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {numberWithCommas(item?.productView) || 0}
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

export default AnalyticsGroupProducts;
