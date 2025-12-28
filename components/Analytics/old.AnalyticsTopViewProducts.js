import { useFullStage } from "@/hooks/useFullStage";
import CountryFlag from "@/shared/Country/CountryFlag";
import Loader from "@/shared/Loader/Loader";
import { ProductImageOutput, isValidArray, lastCommaAdd, numberWithCommas } from "@/utils/func";

import Image from "next/image";
import { useState } from "react";
import ProductDetails from "../Modals/Products/ProductDetails";

const AnalyticsTopViewProducts = ({ isRequestProduct, products: _products,className="box",type,dateRange="daily" }) => {

  const { Product } = useFullStage();
  const [productDetailsActiveTab, setProductDetailsActiveTab] = useState('productDetails');

  const [productDetailsModalOpen, setProductDetailsModalOpen] = useState(false);
  const [products, setProducts] = Product.Products;
  const [singleProductDetails, setSingleProductDetails] = Product.ProductSingleDetails;
  const handleOpenProductDetailsModal = (productSlug) => {
    // console.log(productSlug,'productSlug');
    setProductDetailsActiveTab('productDetails');
    setSingleProductDetails((prev)=>{
      return {
        ...prev,
        slug:productSlug
      };
    });
    setProductDetailsModalOpen(true);
  };
  const getAmount = (price, otherPrice) => {
    return (parseFloat(price || 0) + parseFloat(otherPrice || 0)).toFixed(2);
  };
  return (
    <div  className="w-full h-full overflow-auto">
      <div className="col-span-12 xxl:col-span-6">
        <div className={className}>

          <div className="box-body max-h-screen">
            {isRequestProduct && <div className="mx-auto pb-4">
              <Loader />
            </div>}
            {
              isValidArray(_products) ? <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-col">
                {
                  !isRequestProduct && isValidArray(_products) && _products.map((item, i) => (
                 
                    <li className="mb-6 border rounded-sm cursor-pointer" key={i} onClick={() => {
                      handleOpenProductDetailsModal(item?.product?.slug);
                    }} >

                        {/* {console.log(item?.bundleSales)} */}
                     
                      <div className="p-4 block text-sm font-semibold  bg-slate-100">
                      <button onClick={() => {
                          handleOpenProductDetailsModal(item?.product?.slug);
                        }} >{item?.product?.title}</button>
                        <div className=" flex gap-0 flex-wrap items-center" style={{ marginTop: item?.product?.availability?.isInternational ? "7px" : "" }}>
                          <p className="!text-[12px] me-2">Available:</p>

                          {item?.product?.availability?.isInternational === true ? (
                            <Image
                              width={20}
                              height={20}
                              src="/global.svg"
                              className=""
                              alt=""
                            />
                          ) : <>
                            {
                              isValidArray(item?.product?.availability?.countries) && item?.product?.availability?.countries.map(
                                (ct, inx) => (
                                  <div key={inx}>
                                    <CountryFlag scale={0.8} country={ct?.country} />
                                  </div>
                                )
                              )
                            }
                          </>}
                        </div>
                      </div>
                      <div className="!rounded-sm  text-gray-800 dark:text-white w-full p-4">
                        <div className="sm:flex items-center w-full">
                    
                          <div className="ltr:pr-4 rtl:pl-4 inline-block relative cursor-pointer"onClick={() => {
                          handleOpenProductDetailsModal(item?.product?.slug);
                        }}>
                            <img src={ProductImageOutput(item?.product?.images)} alt="img" className="avatar w-28 h-28 rounded-sm" />
                            {item?.product?.isSoldOut === true ? <img
                              width={90}
                              height={90}
                              alt="Bundle"
                              src="/sold-out.png"
                              className="absolute  -top-[55px] -left-[15px]"
                            /> : (
                              <>
                                {item?.product?.bundle?.isLimited === true ? (
                                  <img
                                    width={200}
                                    height={200}
                                    alt="Bundle"
                                    src="/limited_0b.undle.7be79f82.png"
                                    className="absolute  -top-[50px] -left-[38px]"
                                  />
                                ) : (
                                  <img
                                    width={50}
                                    height={50}
                                    alt="Sale"
                                    src={"/salephoto.webp"}
                                    className="absolute -top-[30px] -left-[16px] "
                                  />
                                )}
                              </>
                            )}
                          </div>

                          <div className="mt-2 sm:mt-0 flex-1 font-semibold">
                          <div className="flex items-center  pb-1 cursor-pointer"title={isValidArray(item?.product?.categories) && item.product?.categories.map((category, i) => (
                               `${category?.name}`
                                ))}>
                              <i
                                className="ri-price-tag-3-line text-sm"></i> &nbsp;{item?.product?.categories?.length||0}
                            </div>
                            
                            <div>
                              <p className="text-xs my-1 dark:text-white ">
                                <strong> SALE: </strong>$
                                {
                                  parseFloat(item?.product?.price?.sale || 0).toFixed(2) || '0.00'}
                              </p>
                           
                             <p className="text-xs my-1 dark:text-white ">
                                    <strong> SOLD COUNT:</strong>{" "}
                                    {item?.bundleSales?.bundleSalesQuantity ? <span className="">
                                      {item?.bundleSize === 0 ? `${item?.productQuantity + (item?.bundleSales?.bundleSalesQuantity || 0)} (${item?.bundleSales?.bundleSalesQuantity || 0}x Bundle sold)` : item?.productQuantity ||0}
                                    </span> : item?.productQuantity ||0}
                                  </p>
                              
                                <p className="text-xs my-1 dark:text-white ">
                                  <strong>SOLD AMOUNT: </strong>$

                                  {

                                    item?.bundleSize === 0 &&item?.bundleSales?.bundleSalesAmount? `${getAmount(item.productSalesAmount, item?.bundleSales?.bundleSalesAmount)} ($${parseFloat(item?.bundleSales?.bundleSalesAmount || 0).toFixed(2)} Bundle sold)` : parseFloat(item.productSalesAmount || 0).toFixed(2) || '0.00'

                                  }

                                </p>
                        
                            </div>

                            <div className="">

                              <div className="min-w-fit text-xs text-gray-500 dark:text-white/70 inline-flex">
                                <span className="ltr:mr-2 rtl:ml-2 my-auto">{numberWithCommas(item?.productView)||0} Views</span>

                              </div>
                              {/* <div className="pt-1">
                                <StarRatings
                                  rating={product?.ratingInfo?.avgRating}
                                  starRatedColor="#57e32c"
                                  isAggregateRating={false}
                                  starDimension="15px"
                                  starSpacing="4px"
                                  numberOfStars={5}
                                  name='rating'
                                />
                              </div> */}
                            </div>
                            {/* <div className="flex items-center gap-2 justify-end pt-3">

                              <button className="flex items-center gap-1 cursor-pointer" onClick={() => {
                                handleSetSelectedData(product);
                                setProductEditModalOpen(true);
                              }}><RiEditLine size={18} />
                                Edit</button> |
                              <button className="flex items-center gap-1 cursor-pointer" onClick={() => {
                                handleSetSelectedData(product);
                                setProductDeleteModalOpen(true);
                              }}><MdOutlineDeleteOutline size={18} /> Delete</button>
                            </div> */}
                          </div>
                        </div>
                      </div>

                    </li>
                  ))}

              </ul> :
                !isRequestProduct && <>
                  <main id="content" className="mx-auto w-full max-h-screen mt-6">
                    <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                      <h1 className="block font-bold text-xl my-2">{type&&type} No Result</h1>
                      <p>We're sorry. We cannot find any matches for your { type&&type.toLowerCase()} term.</p>

                    </div>
                  </main>

                </>

            }

          </div>
        </div>
      </div>
      <ProductDetails isOpen={productDetailsModalOpen} setIsOpen={setProductDetailsModalOpen} setActiveTab={setProductDetailsActiveTab} activeTab={productDetailsActiveTab} />
    </div>
  );
};

export default AnalyticsTopViewProducts;
