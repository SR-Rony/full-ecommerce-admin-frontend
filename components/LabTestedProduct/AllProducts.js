import useClickOutSide from "@/hooks/useClickOutside";
import { useFullStage } from "@/hooks/useFullStage";
import Paginate from "@/shared/Paginate/Paginate";
import ProductSkeleton from "@/shared/skeleton/ProductSkeleton";
import { isValidArray } from "@/utils/func";
import { getLabTestedProducts } from "@/utils/instance";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BsFilter } from "react-icons/bs";
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import EmptyTableSectionTwo from "../EmptyDataSection/EmptyTableSectionTwo";
import CreateShippingCountriesModal from "../Modals/LabTestedProduct/CreateShippingCountriesModal";
import ProductCreateModal from "../Modals/LabTestedProduct/ProductCreateModal";
import ProductDelete from "../Modals/LabTestedProduct/ProductDelete";
import ProductDetails from "../Modals/LabTestedProduct/ProductDetails";
import ProductEditModal from "../Modals/LabTestedProduct/ProductEditModal";
import OrderSiteStatus from "../Shared/OrderSiteStatus";
import SearchProduct from "./SearchProduct";
import SortProductSelect from "./SortProductSelect";
import { Dialog, Transition } from '@headlessui/react';
import { IoMdCloseCircle } from "react-icons/io";

const PdfViewerModal = ({ isOpen, setIsOpen, url }) => {
    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog
                as="div"
                
                className="fixed inset-0 z-[1000] overflow-y-auto"
               
                onClose={() => {
                    console.log("on close");
                    setIsOpen(false)
                }}
            >                
                 
                <div className="flex items-center justify-center min-h-screen">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-[70rem] p-1 mx-2 md:p-6 my-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-md rounded-2xl border">
                            <div className="flex justify-between items-center mb-4">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-black">
                                    LAB REPORT
                                </Dialog.Title>
                                <button
                                    className="text-gray-400 hover:text-gray-500"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <IoMdCloseCircle size={22} />
                                </button>
                            </div>
                            <img className='w-[100%] h-auto overflow-y-scroll' src={url} alt="report" />
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};


const AllProducts = (params = {}) => {
  const [updateData, setUpdateData] = useState({});
  const { q, categories, isBundle, isActive } = params;
  const [activeTab, setActiveTab] = useState("productDetails");
  const { Product, Countries } = useFullStage();
  const [productData, setProductData] = useState({ site: "hb" });
  const [isRequestProduct, setIsRequestProduct] = useState(false);
  const [productCreateModalOpen, setProductCreateModalOpen] = useState(false);
  const [initPaginate, setInitPaginate] = useState(false);
  const [products, setProducts] = useState({});
  const [singleProductDetails, setSingleProductDetails] = useState({});
  const [productCategories, setProductCategories] = Product.ProductCategories;
  const [productPage, setProductPage, productLimit, setProductLimit] =
    Product.ProductPaginate;
  const [productEditModalOpen, setProductEditModalOpen] = useState(false);
  const [isPopup, setPopup] = useState(false);
  const popupRef = useState(null);

  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [
    productFeaturedPhotoUpdateModalOpen,
    setProductFeaturedPhotoUpdateModalOpen,
  ] = useState(false);
  const [query, setQuery] = useState({
    site: { label: "All Sites", value: "" },
  });
  const [defaultCountriesData, setDefaultCountriesData] =
    Countries.DefaultCountriesData;
  const [shippingUpdateData, setShippingUpdateData] = useState({});
  const [shippingSettings, setShippingSettings] = useState({});
  const [createShippingCountriesModalOpen, setShippingCountriesModalOpen] =
    useState(false);
  const [isProductDetailsOpenModal, setIsProductDetailsOpenModal] =
    useState(false);
  const [defaultProducts, setDefaultProducts] = useState([]);

  const [reportLink,setReportLink] = useState(null);

  const router = useRouter();
  useEffect(() => {
    if (params && Object.values(params).length) {
      setQuery({ ...query, ...params });
    }
  }, [params]);
  const HandleSetProduct = (data) => {
    setProducts(data);
  };
  const fetchProducts = async () => {
    try {
      setIsRequestProduct(true);
      const queryFilter = {
        q: query?.q ?? "",
        page: 1,
        limit: productLimit || 20,
        isActive: query?.isActive ?? "",
      };
      const res = await getLabTestedProducts(queryFilter);
      setIsRequestProduct(false);

      HandleSetProduct(res.data);
    } catch (error) {
      setIsRequestProduct(false);
      /* empty */
    }
  };

  const fetchProductsQueries = async (val) => {
    try {
      setIsRequestProduct(true);
      const res = await getLabTestedProducts(val);
      setIsRequestProduct(false);
      HandleSetProduct(res.data);
      return true;
    } catch (error) {
      setIsRequestProduct(false);
      return false;
      /* empty */
    }
  };

  const fetchPaginateProducts = async () => {
    try {
      setIsRequestProduct(true);
      const queryFilter = {
        q: query?.q ?? "",
        page: productPage || 1,
        limit: productLimit,
        isActive: query?.isActive ?? "",
      };
      const res = await getLabTestedProducts(queryFilter);
      setIsRequestProduct(false);
      HandleSetProduct(res.data);
    } catch (error) {
      setIsRequestProduct(false);
      /* empty */
    }
  };

  useMemo(() => {
    if (initPaginate) {
      fetchPaginateProducts();
    }
  }, [productPage]);

  useEffect(() => {
    fetchProducts();
    setInitPaginate(true);
  }, [q]);

  function handleDebounceFn(val) {
    fetchProductsQueries(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function handleChange(keys, value) {
    const val = { ...query, [keys]: value };
    setQuery(val);
    debounceFn(val);
  }
  const resetHandler = async () => {
    setQuery({});
    await fetchProducts();
    return true;
  };

  const handleSetSelectedData = (pData) => {
    const selectedProducts = isValidArray(pData?.products)
      ? pData?.products.map((item) => {
          return {
            ...item,
            value: item._id,
            title: item.title,
            label: item.title,
          };
        })
      : [];
    const productsIds = isValidArray(pData?.products)
      ? pData?.products.map((item) => item._id)
      : [];
    setDefaultProducts(selectedProducts);
    setSingleProductDetails({ ...pData, products: productsIds });
    setProductData({ ...pData, products: productsIds });
    console.log(selectedProducts);
    setProductEditModalOpen(true);
  };

  const handleCreateState = () => {
    setProductData({
      site: "hb",
      isActive: true,
    });
    setSingleProductDetails({
      site: "hb",
      isActive: true,
    });
  };

  useEffect(() => {
    if (router?.query?.slug) {
      setIsProductDetailsOpenModal(true);
    }
  }, [router?.query?.slug]);

  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      fetchProductsQueries({ ...query, site });
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };

  const ProductCard = ({
    data,
    setProductData,
    setEditModal,
    setDeleteModal,
  }) => (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Background Image with Overlay */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: `url(${data?.bgImage || "/thumbnail_tested.png"})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 backdrop-blur-[2px]"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6">
          {/* Lab Badge */}
          <div className="flex justify-end">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              LAB TESTED
            </span>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">{data?.title}</h3>
            
            {/* Test Info */}
            <div className="space-y-2 bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="flex items-center justify-between text-white text-sm">
                <span className="text-gray-300">Advertised At:</span>
                <span className="font-bold">{data?.advertisedAt}</span>
              </div>
              <div className="flex items-center justify-between text-white text-sm">
                <span className="text-gray-300">Tested At:</span>
                <span className="font-bold">{data?.testedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-750 dark:to-gray-800 space-y-2">
        {/* Primary Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              setReportLink(data.reportLink);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Lab Report
          </button>
          
          <button
            onClick={() => {
              const url = isValidArray(data?.products)
                ? `/admin/products/all?productIds=${data.products
                    .map((item) => item._id)
                    .toString()}`
                : "";

              if (url) {
                window.open(url, "_blank");
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            View Products
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => {
              setEditModal(data);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium rounded-lg border border-blue-200 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          <button
            onClick={() => {
              setProductData(data);
              setSingleProductDetails(data);
              setDeleteModal(true);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 font-medium rounded-lg border border-red-200 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  useClickOutSide(popupRef, () => {
    setPopup(false);
  });

  return (
    <div>
      <div className="col-span-12 xxl:col-span-6 py-4">
        {/* Professional Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            {/* Large Screen Header */}
            <div className="hidden lg:flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-gray-900 dark:text-white">Lab Tested Products</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Manage verified lab test results</p>
                </div>
                <div className="ml-4">
                  <SearchProduct
                    keys="q"
                    onChangeHandler={handleChange}
                    query={query}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <OrderSiteStatus
                  align={"left"}
                  data={updateData}
                  setData={setUpdateData}
                  query={query}
                  onChanges={onChangeSiteType}
                />
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <SortProductSelect
                  setQuery={setQuery}
                  query={query}
                  resetHandler={resetHandler}
                  fetchProductsQueries={fetchProductsQueries}
                />
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <button
                  onClick={() => {
                    setActiveTab("productDetails");
                    handleCreateState();
                    setProductCreateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
                >
                  <FaPlus size={14} />
                  Add New Lab Test
                </button>
              </div>
            </div>

            {/* Small Screen Header */}
            <div className="flex lg:hidden flex-wrap justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h5 className="text-base font-bold text-gray-900 dark:text-white">Lab Tests</h5>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none">
                  <SearchProduct
                    keys="q"
                    onChangeHandler={handleChange}
                    query={query}
                  />
                </div>
                <button
                  onClick={() => setPopup(true)}
                  className="inline-flex items-center gap-1 px-3 py-2 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                >
                  <BsFilter size={16} />
                </button>
                <button
                  onClick={() => {
                    setActiveTab("productDetails");
                    handleCreateState();
                    setProductCreateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                >
                  <FaPlusCircle size={14} />
                  Add
                </button>
              </div>

              {isPopup && (
                <div className="fixed -top-[65px] left-0 w-screen h-screen bg-black/50 backdrop-blur-sm z-50">
                  <div
                    ref={popupRef}
                    className="absolute m-auto inset-0 w-[90%] sm:w-[77%] h-fit p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-4 flex-wrap"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                      <OrderSiteStatus
                        setPopup={setPopup}
                        align={"left"}
                        data={updateData}
                        setData={setUpdateData}
                        query={query}
                        onChanges={onChangeSiteType}
                      />
                      <SortProductSelect
                        setPopup={setPopup}
                        setQuery={setQuery}
                        query={query}
                        resetHandler={resetHandler}
                        fetchProductsQueries={fetchProductsQueries}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 min-h-screen">
            {isRequestProduct && (
              <div className="mx-auto pb-4">
                <ProductSkeleton count={4} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl p-4">
              {!isRequestProduct &&
                isValidArray(products?.data) &&
                products.data.map((item, i) => (
                  <ProductCard
                    setEditModal={handleSetSelectedData}
                    setDeleteModal={setProductDeleteModalOpen}
                    setProductData={setProductData}
                    key={i}
                    data={item}
                  />
                ))}
            </div>

            {!isRequestProduct && !isValidArray(products?.data) && (
              <>
                <main id="content" className="mx-auto w-full min-h-screen mt-6">
                  {/* <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                    <h1 className="block font-bold text-xl my-2">Search No Result</h1>
                    <p>We're sorry. We cannot find any matches for your search term.</p>

                  </div> */}
                  <div className="  w-10/12  lg:w-6/12 mx-auto">
                    <EmptyTableSectionTwo />
                  </div>
                </main>
              </>
            )}
            <div className="flex items-center justify-center gap-4 mt-6">
              {!isRequestProduct && (
                <Paginate
                  setInitPaginate={setInitPaginate}
                  currentPage={productPage}
                  setCurrentPage={setProductPage}
                  totalPages={products?.paginate?.totalPage || 0}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <ProductCreateModal
        site={productData?.site}
        setDefaultProducts={setDefaultProducts}
        defaultProducts={defaultProducts}
        productData={productData}
        setProductData={setProductData}
        isOpen={productCreateModalOpen}
        setIsOpen={setProductCreateModalOpen}
        type="Create"
        setProducts={setProducts}
      />
      <ProductEditModal
        site={productData?.site}
        setDefaultProducts={setDefaultProducts}
        defaultProducts={defaultProducts}
        productData={productData}
        setProductData={setProductData}
        isOpen={productEditModalOpen}
        setIsOpen={setProductEditModalOpen}
        type="edit"
        setProducts={setProducts}
      />
      <ProductDelete
        productData={productData}
        setProducts={setProducts}
        setDefaultProducts={setDefaultProducts}
        defaultProducts={defaultProducts}
        setProductData={setProductData}
        isOpen={productDeleteModalOpen}
        setIsOpen={setProductDeleteModalOpen}
        type="delete"
      />

      <CreateShippingCountriesModal
        setDefaultProducts={setDefaultProducts}
        defaultProducts={defaultProducts}
        setIsOpen={setShippingCountriesModalOpen}
        isOpen={createShippingCountriesModalOpen}
        shippingUpdateData={shippingUpdateData}
        setShippingUpdateData={setShippingUpdateData}
        shippingSettings={shippingSettings}
        setShippingSettings={setShippingSettings}
      />

      <ProductDetails
        setDefaultProducts={setDefaultProducts}
        defaultProducts={defaultProducts}
        isOpen={isProductDetailsOpenModal}
        setIsOpen={setIsProductDetailsOpenModal}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      <PdfViewerModal isOpen={!!reportLink} setIsOpen={(e)=>{
        setReportLink(false);
      }} url={reportLink||""}/>
    </div>
  );
};

export default AllProducts;
