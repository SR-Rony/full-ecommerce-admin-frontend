import { useFullStage } from "@/hooks/useFullStage";
import CountryFlag from "@/shared/Country/CountryFlag";
import Paginate from "@/shared/Paginate/Paginate";
import { ToastEmitter } from "@/utils/Toast";
import {
  ProductImageOutput,
  isValidArray,
  numberWithCommas,
} from "@/utils/func";
import { getProducts, setDisplayCouponAPI, updateProduct } from "@/utils/instance";
import _ from "lodash";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaPlus, FaPlusCircle, FaTicketAlt } from "react-icons/fa";
import {
  MdOutlineDeleteOutline
} from "react-icons/md";

import useClickOutSide from "@/hooks/useClickOutside";
import ProductSkeleton from "@/shared/skeleton/ProductSkeleton";
import {
  updateAppInfoSetting
} from "@/utils/instance";
import { BsFilter } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import StarRatings from "react-star-ratings";
import Swal from "sweetalert2";
import { customColors } from "../ColorPicker/customColor";
import EmptyTableSectionTwo from "../EmptyDataSection/EmptyTableSectionTwo";
import CreateShippingCountriesModal from "../Modals/Products/CreateShippingCountriesModal";
import ProductCreateModal from "../Modals/Products/ProductCreateModal";
import ProductDelete from "../Modals/Products/ProductDelete";
import ProductDetails from "../Modals/Products/ProductDetails";
import ProductEditModal from "../Modals/Products/ProductEditModal";
import ProductFeaturedPhotoUpdateModal from "../Modals/Products/ProductFeaturedPhotoUpdateModal";
import OrderSiteStatus from "../Shared/OrderSiteStatus";
import WarningFlagState from "../Shared/WarningFlagState";
import FilterProduct from "./FilterProduct";
import SearchProduct from "./SearchProduct";
import SortProductSelect from "./SortProductSelect";

const AllProducts = (params = {}) => {
  const [updateData, setUpdateData] = useState({});
  const { q, categories, isBundle, isActive } = params;
  const getIds = useSearchParams();
  const [activeTab, setActiveTab] = useState("productDetails");
  const productIds = getIds.get("productIds") ?? "";
  const { Product, Countries, Settings } = useFullStage();
  const [appInfoSetting, setAppInfoSetting] = Settings.AppInfoSetting;
  const [productData, setProductData] = useState({

  });
  const [isPopup, setPopup] = useState(false);
  const popupRef = useRef(null);
  const [isRequestProduct, setIsRequestProduct] = useState(false);
  const [productCreateModalOpen, setProductCreateModalOpen] = useState(false);
  const [initPaginate, setInitPaginate] = useState(false);
  const [products, setProducts] = Product.Products;
  const [singleProductDetails, setSingleProductDetails] =
    Product.ProductSingleDetails;
  const [productCategories, setProductCategories] = Product.ProductCategories;
  const [productPage, setProductPage, productLimit, setProductLimit] =
    Product.ProductPaginate;
  const [productEditModalOpen, setProductEditModalOpen] = useState(false);
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [
    productFeaturedPhotoUpdateModalOpen,
    setProductFeaturedPhotoUpdateModalOpen,
  ] = useState(false);
  const [query, setQuery] = useState({
    site: { label: "All Sites", value: "" },
    demand: { label: "All Warning Flags", value: "" },
  });
  const [customerUpdateData, setCustomerUpdateData] = useState({});
  const [defaultCountriesData, setDefaultCountriesData] =
    Countries.DefaultCountriesData;
  const [shippingUpdateData, setShippingUpdateData] = useState({});
  const [shippingSettings, setShippingSettings] = useState({});
  const [createShippingCountriesModalOpen, setShippingCountriesModalOpen] =
    useState(false);
  const [isProductDetailsOpenModal, setIsProductDetailsOpenModal] =
    useState(false);
  const router = useRouter();
  useEffect(() => {
    if (params && Object.values(params).length) {
      setQuery({ ...query, ...params, products: productIds });
    }
  }, [params]);
  const HandleSetProduct = (data) => {
    const resData = isValidArray(data?.data)
      ? data.data.map((item) => {
          const availability = item?.availability || {};
          return {
            ...item,
            shippingCountry: isValidArray(availability?.countries)
              ? availability.countries.map((ct) => {
                  return {
                    ...ct,
                    ...ct?.country,
                  };
                })
              : [],
            availability: {
              ...availability,
              countries: isValidArray(availability?.countries)
                ? availability.countries
                : [],
            },
          };
        })
      : [];
    setProducts({
      ...(data || {}),
      data: resData,
    });
  };
  const fetchProducts = async () => {
    try {
      setIsRequestProduct(true);
      const queryFilter = {
        q: q ?? "",
        products: productIds ?? "",
        page: 1,
        limit: productLimit,
        isActive: isActive ?? "",
        categories: categories ?? "",
        isBundle: isBundle ?? "",
      };
      const res = await getProducts(queryFilter);
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
      const res = await getProducts(val);
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
        categories: query?.categories ?? "",
        isBundle: query?.isBundle ?? "",
      };
      const res = await getProducts(queryFilter);
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

  const handleFileSave = async () => {
    try {
      const res = await updateProduct({
        data: { images: productData?.images },
        slug: singleProductDetails?.slug,
      });
      if (res.data.success) {
        setSingleProductDetails((prev) => {
          return {
            ...prev,
            images: res?.data?.data?.images,
          };
        });
        ToastEmitter("success", "Product Images update successfully!");
        return true;
      } else {
        ToastEmitter("success", "Product Images update failed!");
        return false;
      }
    } catch (error) {
      return false;
      //
    }
  };

  useEffect(() => {
    fetchProducts();
    setInitPaginate(true);
  }, [q, categories, productIds, isBundle, isActive]);

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
    await fetchProducts({});
    return true;
  };

  const handleSetSelectedData = (pData) => {
    const shippingCountry = isValidArray(pData?.availability?.countries)
      ? pData.availability.countries.map((item) => {
          return {
            ...item,
            ...item?.country,
          };
        })
      : [];

    const searchBundleProducts = isValidArray(products?.data)
      ? products?.data.map((item) => {
          return {
            _id: item?._id,
            value: item?._id,
            label: item?.title,
            bundle:item?.bundle,
            site:item?.site
          };
        })
      : [];
    const selectedBundleProducts = isValidArray(pData?.bundle?.products)
      ? pData?.bundle?.products.map((item) => {
          return {
            _id: item?._id,
            value: item?._id,
            label: item?.title,
            site: item?.site || "",
            bundle:item?.bundle,
            site:item?.site
          };
        })
      : [];

    const selectedCategories = isValidArray(pData?.categories)
      ? pData?.categories.map((item) => {
          return {
            _id: item?._id,
            value: item?._id,
            label: item?.name,
          };
        })
      : [];
      if (isValidArray(pData?.details?.includes)) {
        pData['details.includes'] = pData.details.includes.map(item => ({
            name: item?.name || null,
            quantity: item?.quantity,
            dosage: item?.dosage,
            selectIncludeProduct: {
                label: item?.selectIncludeProduct?.label || item?.product?.title || "",
                value: item?.selectIncludeProduct?.value || item?.product?._id || null,
                site: item?.selectIncludeProduct?.site || item?.product?.site || "",
                price:item?.selectIncludeProduct?.price || item?.product?.price || {regular:0,sale:0}
            },
            product: item?.selectIncludeProduct?.value || item?.product?._id || item?.product || null
        }));
    }else{
      pData['details.includes']=[];
    }
    
    const tempData = {
      ...pData,
      ["restrictOptions.isRestricted"]: pData?.restrictOptions?.isRestricted || false, 
      ["restrictOptions.minOrder"]: pData?.restrictOptions?.minOrder || 0,
      ["price.regular"]: pData?.price?.regular,
      ["price.sale"]: pData?.price?.sale,
      ["price.discount"]: pData?.price?.discount,
      ["details.description"]: pData?.details?.description,
      ["details.dose"]: pData?.details?.dose,
      ["details.effectiveTime"]: pData?.details?.effectiveTime,
      ["details.benefits"]: pData?.details?.benefits ?? [],
      ["details.cycleLength"]: pData?.details?.cycleLength,
      ["featured.on"]: pData?.featured?.on,
      ["featured.priority"]: pData?.featured?.priority,
      isGeneral: pData?.isGeneral ?? true,
      ["cycle.isCycle"]:
        (pData?.isGeneral ?? true) === true ? false : pData?.cycle?.isCycle,
      ["bundle.isLimited"]:
        (pData?.isGeneral ?? true) === true ? false : pData?.bundle?.isLimited,
      ["bundle.size"]: parseInt(pData?.bundle?.size) || "",
      ["seo.metaDescription"]: pData?.seo?.metaDescription,
      ["seo.keywords"]: pData?.seo?.keywords ?? [],
      selectCycleGroup:{
        label:pData?.cycle?.cycleGroup||"",
        value:pData?.cycle?.cycleGroup||""
      },
      ["availability.isInternational"]: pData?.availability.isInternational,
      ["availability.countries"]: pData?.availability?.countries ?? [],
      searchBundleProducts: searchBundleProducts,
      selectedBundleProducts: selectedBundleProducts,
      shippingCountry: shippingCountry,
      site: pData?.site ?? "",
      selectedCategories: selectedCategories,
    };
    setSingleProductDetails(tempData);
    setProductData(tempData);
  };

  const handleCreateState = () => {
    // console.log('click');
    const defaultCountry = {
      ...(defaultCountriesData || {}),
      ...(defaultCountriesData?.country || {}),
    };

    const searchBundleProducts = isValidArray(products?.data)
      ? products?.data.map((item) => {
          return {
            _id: item?._id,
            value: item?._id,
            label: item?.title,
            bundle:item?.bundle,
            site:item?.site
          };
        })
      : [];

    setProductData({
      isActive: true,
      isGeneral: true,
      productVariations:{
        color:customColors[0].color
      },
      warningTextColor: "#000000",
      hasWarningFlag: false,
      site: "hb",
      showAsNewProduct: true,
      ["cycle.isCycle"]: false,
      ["bundle.isLimited"]: false,
      searchBundleProducts: searchBundleProducts,
      shippingCountry: [defaultCountry],
      selectedCategories: [],
      availability: {
        isInternational: false,
        countries: [defaultCountry],
      },
    });
    setSingleProductDetails({
      isActive: true,
      isGeneral: true,
      hasWarningFlag: false,
      site: "hb",
      ["cycle.isCycle"]: false,
      ["bundle.isLimited"]: false,
      searchBundleProducts: searchBundleProducts,
      shippingCountry: [defaultCountry],
      selectedCategories: [],
      availability: {
        isInternational: false,
        countries: [defaultCountry],
      },
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
  const onChangeWarningFlagType = async (demand) => {
    setQuery({ ...query, demand });

    try {
      fetchProductsQueries({ ...query, demand });
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };
  const handleInputAlert = () => {
    //<b>%isOrAre%</b> base on products length in cart.<br/>
    Swal.fire({
      title: "Edit Cart Page Warning Text",
      html: `
        <label for="swal-input-text" style="font-size:12px;">
          <b>%product.names%</b> product names in cart.<br/>
          
          
        </label>
        <input style="font-size:12px;width:350px;" id="swal-input-text" type="text" placeholder="Type warning text..." class="swal2-input" value="${
          appInfoSetting.warningTexts?.cartPageWarningText
        }" />
        <br/>
        <label style="font-size:12px">**Leave empty to not show warning text in cart page.**</label>
          <br/>
          <br/>
          <label for="swal-input-color" style="margin-top:10px;font-size:14px;text-align:center;">Warning text color:</label>
          <br/>
          <input id="swal-input-color" type="color" value="${
            appInfoSetting.warningTexts?.cartPageWarningColor || "#000000"
          }" class="swal2-input" style="width:100px; height: 50px; margin-top:5px;" />
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        const textValue = document.getElementById("swal-input-text").value;
        const colorValue = document.getElementById("swal-input-color").value;
        return { text: textValue, color: colorValue };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          appInfoSetting.warningTexts.cartPageWarningText = result.value.text;
          appInfoSetting.warningTexts.cartPageWarningColor = result.value.color;
          const res = await updateAppInfoSetting(
            appInfoSetting?._id,
            appInfoSetting
          );
          if (res?.data?.success) {
            setAppInfoSetting(res?.data?.data);
            Swal.fire({
              title: "Success",
              text: "Cart page warning text and color updated.",
              icon: "success",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error?.response?.data?.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleSetDisplayCoupon = (product) => {
    Swal.fire({
      title: "Set display coupon",
      html: `
        <input style="font-size:12px;width:350px;" id="swal-input-text" type="text" placeholder="Enter coupon code." class="swal2-input" value="${
          product.displayCoupon?.code || ""
        }" />
        <br/>
        <label style="font-size:12px">**Leave empty to remove display coupon**</label>
        <br/>
      `,
      showCancelButton: true,
      confirmButtonText: "Apply",
      preConfirm: () => {
        const textValue = document.getElementById("swal-input-text").value;
        return { coupon: textValue};
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const couponCode = result?.value?.coupon;
          const res = await setDisplayCouponAPI(
            product._id,
            couponCode,
          );
          if (res?.data?.success) {
            product.displayCoupon = res.data.data;
            Swal.fire({
              title: "Success",
              text: res.data.message,
              icon: "success",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error?.response?.data?.message,
            icon: "error",
          });
        }
      }
    });
  };

  useClickOutSide(popupRef, () => {
    setPopup(false);
  });
  return (
    <div>
      <div className="col-span-12 xxl:col-span-6">
        <div className="box">
          <div className="box-header">
            {/* <|====================| Large Screen |===================|> */}
            <div className=" hidden   lg:flex  flex-wrap justify-between ">
              <div className="flex  flex-wrap  items-center gap-4">
                <h5 className="box-title my-auto">Products</h5>
                <SearchProduct
                  keys="q"
                  onChangeHandler={handleChange}
                  query={query}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 ">
                <button
                  onClick={handleInputAlert}
                  className="border rounded-md text-xs p-2 flex items-center gap-1"
                >
                  {" "}
                  <FaEdit /> Cart Page Warning Text
                </button>
                <WarningFlagState
                  data={updateData}
                  setData={setUpdateData}
                  query={query}
                  onChanges={onChangeWarningFlagType}
                />
                <div>
                  <OrderSiteStatus
                    align={"left"}
                    data={updateData}
                    setData={setUpdateData}
                    query={query}
                    onChanges={onChangeSiteType}
                  />
                </div>{" "}
                |
                <div>
                  <button
                    className="flex items-center gap-2"
                    onClick={() => router.push("/admin/categories/all")}
                  >
                    <TbCategory size={14} className="" /> Category
                  </button>
                </div>{" "}
                |
                <div>
                  <FilterProduct
                    setQuery={setQuery}
                    query={query}
                    resetHandler={resetHandler}
                    fetchProductsQueries={fetchProductsQueries}
                  />
                </div>{" "}
                |
                <div>
                  <SortProductSelect
                    setQuery={setQuery}
                    query={query}
                    resetHandler={resetHandler}
                    fetchProductsQueries={fetchProductsQueries}
                  />
                </div>{" "}
                |
                <button
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    setActiveTab("productDetails");
                    handleCreateState();
                    setProductCreateModalOpen(true);
                  }}
                >
                  <FaPlus size={14} /> Add new product
                </button>
              </div>
            </div>
            {/* <|====================| Small Screen |===================|> */}
            <div className="flex lg:hidden  flex-wrap justify-between  gap-2">
              <div className="flex  flex-wrap  items-center gap-4">
                <h5 className="box-title my-auto">Products</h5>

                <SearchProduct
                  keys="q"
                  onChangeHandler={handleChange}
                  query={query}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="flex items-center gap-2"
                  onClick={() => router.push("/admin/categories/all")}
                >
                  <TbCategory size={14} className="" /> Category
                </button>{" "}
                <button
                  onClick={() => {
                    setPopup(true);
                  }}
                  className="flex items-center gap-1 cursor-pointer border border-blue-500 text-blue-500 px-2 py-1 rounded-[3px]  "
                >
                  <BsFilter size={16} />
                </button>
                <button
                  className="flex items-center gap-1 cursor-pointer  bg-blue-500 text-white px-3 py-1 rounded-[3px]"
                  onClick={() => {
                    setActiveTab("productDetails");
                    handleCreateState();
                    setProductCreateModalOpen(true);
                  }}
                >
                  <FaPlusCircle size={14} /> Add product
                </button>{" "}
              </div>
              {isPopup && (
                <div className="fixed  -top-[65px] left-0 w-screen h-screen  bg-slate-700 bg-opacity-20 z-50">
                  <div
                    ref={popupRef}
                    className="absolute m-auto inset-0  w-fit  h-fit p-4  bg-white rounded-lg   flex  items-center justify-center gap-4 flex-wrap"
                  >
                    {" "}
                    <div className="z-30">
                      <OrderSiteStatus
                        setPopup={setPopup}
                        align={"left"}
                        data={updateData}
                        setData={setUpdateData}
                        query={query}
                        onChanges={onChangeSiteType}
                      />
                    </div>
                    <FilterProduct
                      setQuery={setQuery}
                      setPopup={setPopup}
                      query={query}
                      resetHandler={resetHandler}
                      fetchProductsQueries={fetchProductsQueries}
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
              )}
            </div>
          </div>
          <div className="box-body min-h-screen">
            {isRequestProduct && (
              <div className="mx-auto pb-4">
                <ProductSkeleton count={4} />
              </div>
            )}
            {isValidArray(products?.data) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {!isRequestProduct &&
                  isValidArray(products?.data) &&
                  products.data.map((product, i) => (
                    <div
                      key={i}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
                    >
                      {/* Header Section */}
                      <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-750 p-4">
                        {/* Badges */}
                        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                          {product?.isSoldOut === true && (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                              SOLD OUT
                            </span>
                          )}
                          {product?.showAsNewProduct === true && product?.isSoldOut !== true && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                              ✨ NEW
                            </span>
                          )}
                          {product?.bundle?.isLimited === true && product?.isSoldOut !== true && !product?.showAsNewProduct && (
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                              📦 BUNDLE
                            </span>
                          )}
                          {product?.cycle?.isCycle === true && (
                            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                              🔄 CYCLE
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => {
                            setActiveTab("productDetails");
                            setSingleProductDetails(product);
                            setIsProductDetailsOpenModal(true);
                          }}
                          className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 pr-24 min-h-[3.5rem]"
                        >
                          {product?.title}
                        </h3>

                        {/* Availability & Type Info */}
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Available:</span>
                            {product?.availability?.isInternational === true ? (
                              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                <Image
                                  width={16}
                                  height={16}
                                  src="/global.svg"
                                  alt="Global"
                                />
                                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Global</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                {isValidArray(product?.availability?.countries) &&
                                  product?.availability?.countries.map((ct, inx) => (
                                    <div key={inx} className="transform hover:scale-110 transition-transform">
                                      <CountryFlag scale={0.9} country={ct?.country} />
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {product?.isGeneral && (
                              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md">
                                General
                              </span>
                            )}
                            {product?.cycle?.isCycle && product?.cycle?.cycleGroup && (
                              <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-medium rounded-md">
                                Group: {product?.cycle?.cycleGroup}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Product Image & Details */}
                      <div className="p-4">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div
                            onClick={() => {
                              setActiveTab("productDetails");
                              setSingleProductDetails(product);
                              setIsProductDetailsOpenModal(true);
                            }}
                            className="flex-shrink-0 cursor-pointer group/image"
                          >
                            <div className="relative w-32 h-32 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                              <img
                                src={ProductImageOutput(product?.images)}
                                alt={product?.title}
                                className="w-full h-full object-contain transition-transform duration-300 group-hover/image:scale-110"
                              />
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 space-y-3">
                            {/* Categories */}
                            <div
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                              title={
                                isValidArray(product?.categories) &&
                                product?.categories.map((category) => category?.name).join(", ")
                              }
                            >
                              <i className="ri-price-tag-3-line"></i>
                              <span>{product?.categories?.length || 0} Categories</span>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-1">
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  ${product?.price?.sale}
                                </span>
                                {product?.price?.regular > product?.price?.sale && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ${product?.price?.regular}
                                  </span>
                                )}
                              </div>
                              {product?.price?.discount > 0 && (
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-md">
                                  💰 Save ${product?.price?.discount}
                                </div>
                              )}
                            </div>

                            {/* Site & Stats */}
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium rounded-md">
                                {product?.site?.toUpperCase() ?? "N/A"}
                              </span>
                              <span className="flex items-center gap-1">
                                <i className="ri-eye-line"></i>
                                {numberWithCommas(product?.stats?.viewCount)}
                              </span>
                            </div>

                            {/* Rating */}
                            <div>
                              <StarRatings
                                rating={product?.ratingInfo?.avgRating || 0}
                                starRatedColor="#3b82f6"
                                isAggregateRating={false}
                                starDimension="16px"
                                starSpacing="2px"
                                numberOfStars={5}
                                name="rating"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <button
                              onClick={() => handleSetDisplayCoupon(product)}
                              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <FaTicketAlt size={14} />
                              Display Coupon
                            </button>
                            
                            <button
                              onClick={() => {
                                setActiveTab("productDetails");
                                handleSetSelectedData(product);
                                setProductEditModalOpen(true);
                              }}
                              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                            >
                              <RiEditLine size={16} />
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                setActiveTab("productDetails");
                                handleSetSelectedData(product);
                                setProductDeleteModalOpen(true);
                              }}
                              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <MdOutlineDeleteOutline size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              !isRequestProduct && (
                <>
                  <main
                    id="content"
                    className="mx-auto w-full min-h-screen mt-6"
                  >
                    {/* <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                      <h1 className="block font-bold text-xl my-2">
                        Search No Result
                      </h1>
                      <p>
                        We're sorry. We cannot find any matches for your search
                        term.
                      </p>
                    </div> */}
                    <div className="w-10/12 md:w-4/12 mx-auto">
                      <EmptyTableSectionTwo />
                    </div>
                  </main>
                </>
              )
            )}
            <div className="flex items-center justify-center gap-4">
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
        productData={productData}
        setProductData={setProductData}
        isOpen={productCreateModalOpen}
        setIsOpen={setProductCreateModalOpen}
        type="Create"
      />
      <ProductEditModal
        productData={productData}
        setProductData={setProductData}
        isOpen={productEditModalOpen}
        setIsOpen={setProductEditModalOpen}
        type="edit"
      />
      <ProductDelete
        productData={productData}
        setProductData={setProductData}
        isOpen={productDeleteModalOpen}
        setIsOpen={setProductDeleteModalOpen}
        type="delete"
      />
      <ProductFeaturedPhotoUpdateModal
        handleFileSave={handleFileSave}
        productData={productData}
        setProductData={setProductData}
        isOpen={productFeaturedPhotoUpdateModalOpen}
        setIsOpen={setProductFeaturedPhotoUpdateModalOpen}
      />

      <CreateShippingCountriesModal
        setIsOpen={setShippingCountriesModalOpen}
        isOpen={createShippingCountriesModalOpen}
        shippingUpdateData={shippingUpdateData}
        setShippingUpdateData={setShippingUpdateData}
        shippingSettings={shippingSettings}
        setShippingSettings={setShippingSettings}
      />

      <ProductDetails
        isOpen={isProductDetailsOpenModal}
        setIsOpen={setIsProductDetailsOpenModal}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        data={customerUpdateData}
        setData={setCustomerUpdateData}
      />
    </div>
  );
};

export default AllProducts;
