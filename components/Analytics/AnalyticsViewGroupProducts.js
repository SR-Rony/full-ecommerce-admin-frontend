import { useFullStage } from "@/hooks/useFullStage";

import { isValidArray, numberWithCommas } from "@/utils/func";
import { useState } from "react";
import ProductDetails from "../Modals/Products/ProductDetails";

const AnalyticViewGroupProducts = ({ isRequestProduct, products: _products, className = "box", type, dateRange = "daily" }) => {
  const { Product } = useFullStage();
  const [productDetailsActiveTab, setProductDetailsActiveTab] = useState('productDetails');

  const [productDetailsModalOpen, setProductDetailsModalOpen] = useState(false);
  const [products, setProducts] = Product.Products;
  const [singleProductDetails, setSingleProductDetails] = Product.ProductSingleDetails;
  const handleOpenProductDetailsModal = (productSlug) => {
    setProductDetailsActiveTab('productDetails');
    setSingleProductDetails((prev) => {
      return {
        ...prev,
        slug: productSlug
      };
    });
    setProductDetailsModalOpen(true);
  };
  const getAmount = (price, otherPrice) => {
    return (parseFloat(price || 0) + parseFloat(otherPrice || 0)).toFixed(2);
  };

  // {console.log(_products);}
  return (
    <div className="w-full  mb-10">
      <div className="relative overflow-x-auto  sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 relative">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 top-0">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Sale
              </th>
              <th scope="col" className="px-6 py-3">
                Sold Count
              </th>
              <th scope="col" className="px-6 py-3">
                Sold Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Views
              </th>
            </tr>
          </thead>
          {/* {console.log(_products)} */}
          <tbody >
            {!isRequestProduct && isValidArray(_products) &&
              _products.map((item, i) => (
                <tr className="bg-white border-b hover:bg-gray-50 cursor-pointer" key={i} onClick={() => {
                  handleOpenProductDetailsModal(item?.product?.slug);
                }}>
                 
                  <td className="px-6 py-2 text-xs ">{item?.product?.title}  {item?.product?.bundle?.isLimited===true?`(${item?.product?.subTitle||""})`:""}</td>
                  <td className="px-6 py-2">
                    <p className="text-xs dark:text-white ">
                      ${parseFloat(item?.product?.price?.sale || 0).toFixed(2) || '0.00'}
                    </p>
                  </td>
                  <td className="px-6 py-2">
                    <p className="text-xs dark:text-white ">
                      {item?.bundleSales?.bundleSalesQuantity ? (
                        <span className="">
                          {item?.bundleSize === 0
                            ? `${item?.productQuantity + (item?.bundleSales?.bundleSalesQuantity || 0)} (${item?.bundleSales?.bundleSalesQuantity || 0
                            }x Bundle sold)`
                            : item?.productQuantity}
                        </span>
                      ) : (
                        item?.productQuantity
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-2">
                    <p className="text-xs my-1 dark:text-white ">
                      ${
                        item?.bundleSize === 0 && item?.bundleSales?.bundleSalesAmount
                          ? `${getAmount(
                            item.productSalesAmount,
                            item?.bundleSales?.bundleSalesAmount
                          )} ($${parseFloat(item?.bundleSales?.bundleSalesAmount || 0).toFixed(2)} Bundle sold)`
                          : parseFloat(item.productSalesAmount || 0).toFixed(2) || '0.00'
                      }
                    </p>
                  </td>
                  <td className="px-6 ">
                    <span className="ltr:mr-2 rtl:ml-2 my-auto">
                      {numberWithCommas(item?.productView) || 0}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

  {!isRequestProduct&& !isValidArray(_products) && <p className="text-center pt-[30px] w-full h-[170px]"> No Data Available</p>}
      </div>
      <ProductDetails isOpen={productDetailsModalOpen} setIsOpen={setProductDetailsModalOpen} setActiveTab={setProductDetailsActiveTab} activeTab={productDetailsActiveTab} />
    </div>
  );
};

export default AnalyticViewGroupProducts;
