import { Dialog, Fragment, Transition } from "@headlessui/react";
import { IoIosCloseCircle } from "react-icons/io";

import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";

import {
  ProductImageOutput,
  ProfileAvatarOutput,
  getProductIncludeData,
  isValidArray,
  numberWithCommas,
} from "@/utils/func";

import ProductDelete from "@/components/Modals/Products/ProductDelete";
import ProductEditModal from "@/components/Modals/Products/ProductEditModal";
import ProductFeaturedPhotoUpdateModal from "@/components/Modals/Products/ProductFeaturedPhotoUpdateModal";

import ProductError404 from "@/components/Products/ProductError404";
import DropdownReview from "@/components/Shared/DropdownReview";
import { ToastEmitter } from "@/utils/Toast";
import {
  getOrderReviews,
  getSingleProductDetails,
  updateProduct,
} from "@/utils/instance";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import StarRatings from "react-star-ratings";

const ProductDetails = ({ isOpen, setIsOpen, setActiveTab, activeTab }) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  const { Product } = useFullStage();
  const [isRequest, setIsRequest] = useState(false);
  const [isOrderReview, setIsOrderReview] = useState(false);
  const [isRequestProduct, setIsRequestProduct] = useState(false);
  const [products, setProducts] = Product.Products;
  const [singleProductDetails, setSingleProductDetails] =
    Product.ProductSingleDetails;
  const [productPage, setProductPage, productLimit, setProductLimit] =
    Product.ProductPaginate;
  const router = useRouter();
  const slug = router?.query?.slug || singleProductDetails?.slug;
  const [productData, setProductData] = useState({});
  const [productEditModalOpen, setProductEditModalOpen] = useState(false);
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [
    productFeaturedPhotoUpdateModalOpen,
    setProductFeaturedPhotoUpdateModalOpen,
  ] = useState(false);
  const [initPaginate, setInitPaginate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewQuery, setReviewQuery] = useState({});
  const [orderReviews, setOrderReviews] = useState({});
  const cardVariants = {
    offscreen: {
      y: 100,

      opacity: 80,
      visibility: "hidden",
    },

    onscreen: {
      y: 0,

      opacity: 100,
      visibility: "visible",
      transition: {
        delay: 0.2,
        type: "spring",
        bounce: 0.6,
        duration: 0.6,
      },
    },
  };
  const cardVariantsTag = {
    offscreen: {
      opacity: 0,
      scale: 0.5,
      background: "red",
      visibility: "hidden",
    },
    onscreen: {
      opacity: 100,
      background: "",
      scale: 1,

      visibility: "visible",
      transition: {
        delay: 0.5,
        type: "spring",
        bounce: 0.5,
        duration: 1,
      },
    },
  };
  const cardVariantsTagtwo = {
    offscreen: {
      opacity: 0,
      scale: 0.5,
      y: -100,
      background: "red",
      visibility: "hidden",
    },
    onscreen: {
      opacity: 100,
      background: "",
      y: 0,
      scale: 1,

      visibility: "visible",
      transition: {
        delay: 1,
        type: "spring",
        bounce: 0.5,
        duration: 1,
      },
    },
  };

  const fetchSingleProduct = async () => {
    try {
      if (slug) {
        setIsRequest(true);
        const res = await getSingleProductDetails(slug);
        setIsRequest(false);
        if (res?.data?.success) {
          setSingleProductDetails(res?.data?.data);
        }
      }
    } catch (error) {
      setIsRequest(false);
      // //console.log(error);
    }
  };
  const fetchProductReviews = async (productDetails) => {
    if (productDetails?._id) {
      try {
        setIsOrderReview(true);
        const res = await getOrderReviews({ productId: productDetails?._id });
        console.log(res.data);
        setIsOrderReview(false);
        if (res?.data?.success) {
          setOrderReviews(res?.data);
        }
      } catch (error) {
        setIsOrderReview(false);
        // //console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchSingleProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // const paginationReviewFetch = async (productDetails) => {
  //     if (productDetails?._id) {
  //         try {

  //             setIsOrderReview(true);
  //             const res = await getOrderReviews({ page: currentPage, sort: reviewQuery?.sort ?? "", limit: 5, productId: productDetails?._id });
  //             console.log(res.data);
  //             setIsOrderReview(false);
  //             if (res?.data?.success) {
  //                 setOrderReviews(res?.data);
  //             }

  //         } catch (error) {
  //             setIsOrderReview(false);
  //             // //console.log(error);
  //         }
  //     }
  // };

  const sortReviewFetch = async (productDetails, sort) => {
    if (productDetails?._id) {
      try {
        setIsOrderReview(true);
        const res = await getOrderReviews({
          sort: sort ?? "",
          productId: productDetails?._id,
        });
        console.log(res.data);
        setIsOrderReview(false);
        if (res?.data?.success) {
          setOrderReviews(res?.data);
        }
      } catch (error) {
        setIsOrderReview(false);
        // //console.log(error);
      }
    }
  };
  // useEffect(() => {
  //     if (initPaginate) {
  //         paginationReviewFetch(singleProductDetails)
  //     }
  // }, [currentPage]);
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

  const handleSortReview = (value) => {
    setReviewQuery({ sort: value ?? "" });
    sortReviewFetch(singleProductDetails, value);
  };
  const renderContent = () => {
    switch (activeTab) {
      case "productDetails":
        return (
          <div className="w-full h-full">
            {/* single product div  */}
            <div className="max-w-[1390px] w-11/12 mx-auto   flex flex-col md:flex-row gap-4">
              <>
                {isRequest ? (
                  <div className="mx-auto w-[400px] mt-6">
                    <Loader bg="transparent" />
                  </div>
                ) : singleProductDetails?._id ? (
                  <>
                    <div className="md:w-4/12 py-10 rounded-md bg-white dark:bg-dark-solid h-fit shadow">
                      <div
                        className="card-container"
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <div className="card relative" variants={cardVariants}>
                          {" "}
                          {singleProductDetails?.isSoldOut === true ? (
                            <img
                              width={90}
                              height={90}
                              alt="Bundle"
                              src="/sold-out.png"
                              className="absolute  -top-[55px] -left-[15px]"
                            />
                          ) : (
                            <>
                              {singleProductDetails?.isSoldOut === false && (
                                <>
                                  {singleProductDetails?.showAsNewProduct ===
                                    true ? (
                                    <img
                                      width={60}
                                      height={60}
                                      className="absolute  top-[-20px] left-[23px]"
                                      src="/new.png"
                                      alt="NEW"
                                    />
                                  ) : (
                                    singleProductDetails?.bundle?.isLimited ===
                                    true && (
                                      <img
                                        width={200}
                                        height={200}
                                        alt="Bundle"
                                        src="/limited_0b.undle.7be79f82.png"
                                        className="absolute  -top-[60px] -left-[30px]"
                                      />
                                    )
                                  )}
                                </>
                              )}
                            </>
                          )}
                          <p className="text-right cursor-pointer text-bold pr-7 relative -top-2"></p>
                          <img
                            width={380}
                            height={380}
                            alt="product"
                            className="w-full "
                            src={ProductImageOutput(
                              singleProductDetails?.images
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="md:w-8/12  ">
                      <div className="p-5 bg-white rounded-md dark:bg-dark-solid shadow">
                        <div className="text-center flex justify-center">
                          <div>
                            <div className="flex items-center gap-4">
                              <button
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => {
                                  const selectedBundleProducts = isValidArray(
                                    singleProductDetails?.bundle?.products
                                  )
                                    ? singleProductDetails?.bundle?.products.map(
                                      (item) => {
                                        return {
                                          _id: item?._id,
                                          value: item?._id,
                                          label: item?.title,
                                        };
                                      }
                                    )
                                    : [];

                                  const shippingCountry = isValidArray(
                                    singleProductDetails?.availability
                                      ?.countries
                                  )
                                    ? singleProductDetails.availability.countries.map(
                                      (item) => {
                                        return {
                                          ...item,
                                          ...item?.country,
                                        };
                                      }
                                    )
                                    : [];

                                  const selectedCategories = isValidArray(
                                    singleProductDetails?.categories
                                  )
                                    ? singleProductDetails?.categories.map(
                                      (item) => {
                                        return {
                                          _id: item?._id,
                                          value: item?._id,
                                          label: item?.name,
                                        };
                                      }
                                    )
                                    : [];

                                    if (isValidArray( singleProductDetails?.details?.includes)) {
                                      singleProductDetails['details.includes'] = singleProductDetails.details.includes.map(item => ({
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
                                    singleProductDetails['details.includes']=[];
                                  }
                                  const tempData = {
                                 
                                    ...singleProductDetails,
                                    ["restrictOptions.isRestricted"]: singleProductDetails?.restrictOptions?.isRestricted || false, 
                                    ["restrictOptions.minOrder"]: singleProductDetails?.restrictOptions?.minOrder || 0,
                                    selectCycleGroup:{
                                      label:singleProductDetails?.cycle?.cycleGroup||"",
                                      value:singleProductDetails?.cycle?.cycleGroup||""
                                    },
                                    ["price.regular"]:
                                      singleProductDetails?.price?.regular,
                                    ["price.sale"]:
                                      singleProductDetails?.price?.sale,
                                    ["price.discount"]:
                                      singleProductDetails?.price?.discount,
                                    ["details.description"]:
                                      singleProductDetails?.details
                                        ?.description,
                                    ["details.dose"]:
                                      singleProductDetails?.details?.dose,
                                    ["details.effectiveTime"]:
                                      singleProductDetails?.details
                                        ?.effectiveTime,
                                    ["details.benefits"]:
                                      singleProductDetails?.details?.benefits,
                                    ["details.cycleLength"]:
                                      singleProductDetails?.details
                                        ?.cycleLength,
                                    ["featured.on"]:
                                      singleProductDetails?.featured?.on,
                                    ["featured.priority"]:
                                      singleProductDetails?.featured?.priority,
                                    isGeneral:
                                      singleProductDetails?.isGeneral ?? true,
                                    ["cycle.isCycle"]:
                                      (singleProductDetails?.isGeneral ??
                                        true) === true
                                        ? false
                                        : singleProductDetails?.cycle?.isCycle,
                                    ["bundle.isLimited"]:
                                      (singleProductDetails?.isGeneral ??
                                        true) === true
                                        ? false
                                        : singleProductDetails?.bundle
                                          ?.isLimited,
                                    ["bundle.size"]:
                                      parseInt(
                                        singleProductDetails?.bundle?.size
                                      ) || "",
                                    ["seo.metaDescription"]:
                                      singleProductDetails?.seo
                                        ?.metaDescription,
                                    ["seo.keywords"]:
                                      singleProductDetails?.seo?.keywords ?? [],
                                    ["availability.isInternational"]:
                                      singleProductDetails?.availability
                                        .isInternational,
                                    ["availability.countries"]:
                                      singleProductDetails?.availability
                                        ?.countries ?? [],
                                    selectedBundleProducts:
                                      selectedBundleProducts,
                                    shippingCountry: shippingCountry,
                                    selectedCategories: selectedCategories,
                                  };
                                  setSingleProductDetails(tempData);
                                  setProductData(tempData);
                                  setProductEditModalOpen(true);
                                }}
                              >
                                <RiEditLine size={18} />
                                Edit
                              </button>{" "}
                              |
                              <button
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => {
                                  setSingleProductDetails(singleProductDetails);
                                  setProductDeleteModalOpen(true);
                                }}
                              >
                                <MdOutlineDeleteOutline size={18} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="py-5 relative  rounded-t-md text-xl   md:text-2xl font-semibold text-center dark: text-black">
                          <p className="pt-2 px-5 text-center text-[18px] lg:text-[25px] font-[600]">
                            {singleProductDetails?.title?.toUpperCase()}
                          </p>
                          {singleProductDetails?.bundle?.isLimited && (
                            <>
                              {singleProductDetails?.subTitle && (
                                <p className="text-[18px] lg:text-[25px] font-[600] text-[#FCAD4F] text-center">
                                  {" "}
                                  {singleProductDetails?.subTitle}
                                </p>
                              )}
                            </>
                          )}
                          {singleProductDetails?.cycle?.isCycle && singleProductDetails?.subTitle && (
                            <>

                              <p className="text-[18px] lg:text-[25px] font-[600] text-[#4e80fc] text-center">
                                {" "}
                                {singleProductDetails?.subTitle}
                              </p>

                            </>
                          )}
                          {!singleProductDetails?.cycle?.isCycle && singleProductDetails?.details?.dose && (
                            <p className="py-2 px-5 text-center text-[18px] lg:text-[25px] font-[400] bg-black text-white  rounded-md">
                              {singleProductDetails?.details?.dose}
                            </p>
                          )}

                          {singleProductDetails?.cycle?.isCycle && singleProductDetails?.details?.cycleLength && (
                            <p className="py-2 px-5 text-center text-[18px] lg:text-[25px] font-[400] bg-black text-white  rounded-md">
                              {singleProductDetails?.details?.cycleLength}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center border rounded-sm w-full gap-4 mx-auto my-4 bg-white py-2 dark:bg-dark-solid shadow px-3">
                        <div className="w-[50%]">
                          <p className="text-gray-400 text-sm p-1 dark:">
                            <strong> REG:</strong>{" "}
                            <span className="line-through ">
                              $
                              {parseFloat(
                                singleProductDetails?.price?.regular || 0
                              ).toFixed(2)}
                            </span>
                          </p>
                          <p className="text-sm p-1 dark: ">
                            <strong> DISCOUNT: </strong>$
                            {parseFloat(
                              singleProductDetails?.price?.discount || 0
                            ).toFixed(2)}
                          </p>
                          <p className="text-sm p-1 dark: ">
                            <strong> SALE: </strong>$
                            {parseFloat(
                              singleProductDetails?.price?.sale || 0
                            ).toFixed(2)}
                          </p>

                          <p className="bg-transparent dark: p-1 text-sm capitalize flex items-center gap-1 flex-wrap">
                            <strong className="">
                              <span>AVG. REVIEW:</span>{" "}
                            </strong>
                            <div className="relative -top-[2px]">
                              <StarRatings
                                rating={
                                  singleProductDetails?.ratingInfo?.avgRating
                                }
                                starRatedColor="#57e32c"
                                isAggregateRating={false}
                                starDimension="17px"
                                starSpacing="4px"
                                numberOfStars={5}
                                name="rating"
                              />
                            </div>
                          </p>
                          {/* <p className="bg-transparent dark:  p-1 text-sm cursor-pointer text-blue-500  capitalize"><strong>View All Reviews</strong></p> */}
                        </div>
                        <div className="w-[50%]">
                          <p className="bg-transparent dark: p-1 text-sm  capitalize">
                            <strong className="capitalize">
                              {" "}
                              TOTAL VIEWS:
                            </strong>{" "}
                            {singleProductDetails?.stats?.viewCount}
                          </p>
                          <p className="bg-transparent dark: p-1 text-sm  capitalize">
                            <strong className="capitalize">
                              {" "}
                              TOTAL SOLD COUNT:
                            </strong>{" "}
                            {singleProductDetails?.stats?.totalSoldCount}
                          </p>
                          <p className="bg-transparent dark: p-1 text-sm  capitalize">
                            <strong className="capitalize">
                              {" "}
                              TOTAL SOLD AMOUNT:
                            </strong>{" "}
                            $
                            {singleProductDetails?.stats?.totalSoldAmount &&
                              parseFloat(
                                singleProductDetails?.stats?.totalSoldAmount ||
                                0
                              ).toFixed(2)}
                          </p>

                          <p className="bg-transparent dark: p-1 text-sm  capitalize">
                            <strong className=""> LAST SOLD AT:</strong>{" "}
                            {singleProductDetails?.stats?.lastSoldAt
                              ? moment(
                                singleProductDetails?.stats?.lastSoldAt
                              ).format("YYYY-MM-DD")
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={` bg-white dark:  text-left my-3 px-4 py-4 rounded-sm dark:bg-dark-solid shadow`}
                      >
                        {" "}
                        {singleProductDetails?.details?.description && (
                          <div
                            className="card-container"
                            initial="offscreen"
                            whileInView="onscreen"
                            viewport={{ once: true, amount: 0.4 }}
                          >
                            <div
                              className="card  capitalize"
                              variants={cardVariantsTag}
                            >
                              <strong className="text-[17.2556px] font-[600]">
                                {" "}
                                Description:
                              </strong>{" "}
                              {singleProductDetails?.details?.description}
                              {singleProductDetails?.cycle?.isCycle &&
                                isValidArray(
                                  getProductIncludeData(
                                    singleProductDetails?.details?.includes,
                                    singleProductDetails?.site
                                  )
                                ) && (
                                  <div className="mt-5">
                                    <strong>
                                      {" "}
                                      Products In This Cycle & Recommended
                                      Dosages: <br />
                                      (For more product details,please quick on
                                      each name)
                                    </strong>
                                  </div>
                                )}
                              {singleProductDetails?.cycle?.isCycle &&
                                isValidArray(
                                  getProductIncludeData(
                                    singleProductDetails?.details?.includes,
                                    singleProductDetails?.site
                                  )
                                ) &&
                                getProductIncludeData(
                                  singleProductDetails?.details?.includes,
                                  singleProductDetails?.site
                                ).map((includeItem, i) => (
                                  <div key={i}>
                                    {includeItem?.product?.slug ? (
                                      <Link
                                        href={`/admin/products/details/${includeItem?.product?.slug}`}
                                        legacyBehavior
                                      >
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          • x{includeItem?.quantity || 1}{" "}
                                          {includeItem?.product?.title}{" "}
                                          {includeItem?.product?.details
                                            ?.dose || ""}{" "}
                                          {includeItem?.dosage && "|"}{" "}
                                          {includeItem?.dosage || ""}
                                        </a>
                                      </Link>
                                    ) : (
                                      <p className={`cursor-pointer`}>
                                        • x{includeItem?.quantity || 1}{" "}
                                        {includeItem?.product?.title}{" "}
                                        {includeItem?.product?.details?.dose ||
                                          ""}{" "}
                                        {includeItem?.dosage && "|"}{" "}
                                        {includeItem?.dosage || ""}
                                      </p>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        <div
                          className="card-container"
                          initial="offscreen"
                          whileInView="onscreen"
                          viewport={{ once: true, amount: 0.4 }}
                        >
                          <div
                            className="card  capitalize"
                            variants={cardVariantsTagtwo}
                          >
                            {!singleProductDetails.cycle?.isCycle ? (
                              <div
                                className="card"
                                variants={cardVariantsTagtwo}
                              >
                                {isValidArray(
                                  singleProductDetails.details?.benefits
                                ) &&
                                  singleProductDetails.bundle?.isLimited &&
                                  false && (
                                    <p className="my-3">
                                      <strong className="text-[17.2556px] font-[600]">
                                        {" "}
                                        Benefits:{" "}
                                      </strong>{" "}
                                      {singleProductDetails.details?.benefits.map(
                                        (benefit, i) => (
                                          <span key={i} className=" pr-1">
                                            {benefit}
                                            {i ===
                                              singleProductDetails.details
                                                ?.benefits.length -
                                              1
                                              ? ""
                                              : ","}
                                          </span>
                                        )
                                      )}
                                    </p>
                                  )}{" "}
                                {singleProductDetails.details?.dose && (
                                  <p className="my-4">
                                    <strong className="text-[17.2556px] font-[600]">
                                      Dose:{" "}
                                    </strong>{" "}
                                    {singleProductDetails.details?.dose}
                                  </p>
                                )}
                                {isValidArray(
                                  singleProductDetails?.comprisedOf
                                ) &&
                                  singleProductDetails?.comprisedOf.filter(
                                    (item) => item
                                  ).length > 0 && (
                                    <p className="my-4">
                                      <strong className="text-[17.2556px] font-[600] pb-3">
                                        {" "}
                                        Comprised Of: <br />
                                      </strong>{" "}
                                      {singleProductDetails?.comprisedOf
                                        .filter((item) => item)
                                        .map((comprised, i) => (
                                          <p key={i} className="">
                                            - {comprised}
                                          </p>
                                        ))}
                                    </p>
                                  )}{" "}
                                {singleProductDetails.details
                                  ?.effectiveTime && (
                                    <p>
                                      <strong className="text-[17.2556px] font-[600]">
                                        {" "}
                                        Effective Time:{" "}
                                      </strong>{" "}
                                      {
                                        singleProductDetails.details
                                          ?.effectiveTime
                                      }
                                    </p>
                                  )}{" "}
                              </div>
                            ) : (
                              <div
                                className="card"
                                variants={cardVariantsTagtwo}
                              >
                                {isValidArray(
                                  singleProductDetails?.comprisedOf
                                ) &&
                                  singleProductDetails?.comprisedOf.filter(
                                    (item) => item
                                  ).length > 0 && (
                                    <p className="my-4">
                                      <strong className="text-[17.2556px] font-[600] pb-3">
                                        {" "}
                                        Comprised Of: <br />
                                      </strong>{" "}
                                      {singleProductDetails?.comprisedOf
                                        .filter((item) => item)
                                        .map((comprised, i) => (
                                          <p key={i} className=" ">
                                            - {comprised}
                                          </p>
                                        ))}
                                    </p>
                                  )}{" "}
                                {/* {isValidArray(
                                  singleProductDetails.details?.includes
                                ) &&
                                  singleProductDetails.details?.includes.filter(
                                    (item) => item?.name
                                  ).length > 0 && (
                                    <p className="my-4">
                                      <strong className="text-[17.2556px] font-[600] pb-3 inline-block">
                                        {" "}
                                        Product Includes: <br />
                                      </strong>{" "}
                                      {singleProductDetails.details?.includes
                                        .filter((item) => item?.name)
                                        .map((include, i) => (
                                          <p key={i} className=" pr-1 pb-3">
                                            - {include.quantity}{" "}
                                            {include?.name || ""} (
                                            {include.dosage})
                                            {i ===
                                            singleProductDetails.details?.includes.filter(
                                              (item) => item?.name
                                            ).length -
                                              1 ? (
                                              ""
                                            ) : (
                                              <></>
                                            )}
                                          </p>
                                        ))}
                                    </p>
                                  )}{" "} */}
                                {singleProductDetails.details?.cycleLength && (
                                  <p className="my-4">
                                    <strong className="text-[17.2556px] font-[600]">
                                      Cycle Length:{" "}
                                    </strong>{" "}
                                    {singleProductDetails.details?.cycleLength}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  !isRequestProduct && <ProductError404 />
                )}
              </>
            </div>

            {singleProductDetails?._id && (
              <>
                <ProductEditModal
                  productData={productData}
                  setProductData={setProductData}
                  isOpen={productEditModalOpen}
                  setIsOpen={setProductEditModalOpen}
                  type="Update"
                />
                <ProductDelete
                  productData={productData}
                  setProductData={setProductData}
                  isOpen={productDeleteModalOpen}
                  setIsOpen={setProductDeleteModalOpen}
                  type="delete"
                  closeMainModal={closeModal}
                />
                <ProductFeaturedPhotoUpdateModal
                  handleFileSave={handleFileSave}
                  productData={productData}
                  setProductData={setProductData}
                  isOpen={productFeaturedPhotoUpdateModalOpen}
                  setIsOpen={setProductFeaturedPhotoUpdateModalOpen}
                />
              </>
            )}
          </div>
        );
      case "reviews":
        return (
          <div className="max-w-[1390px] w-11/12 mx-auto flex flex-col md:flex-row gap-4">
            <div className="w-full lg:w-[40%]">
              <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center w-[70%]">
                  <StarRatings
                    rating={orderReviews?.data?.avgRatingReviews}
                    starRatedColor="#57e32c"
                    isAggregateRating={false}
                    starDimension="15px"
                    starSpacing="4px"
                    numberOfStars={5}
                    name="rating"
                  />
                  <p className="ms-1 text-sm font-medium text-gray-500">
                    {orderReviews?.data?.avgRatingReviews}
                  </p>
                  <p className="ms-1 text-sm font-medium text-gray-500">
                    out of
                  </p>
                  <p className="ms-1 text-sm font-medium text-gray-500">5</p>
                </div>

                <div className="w-[25%]">
                  {/* handleSortReview */}
                  <div className="max-w-sm mx-auto">
                    <DropdownReview
                      onChanges={handleSortReview}
                      options={["latest", "oldest"]}
                      selectedOption={reviewQuery?.sort || "latest"}
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">
                ({numberWithCommas(orderReviews?.data?.totalReviewsCount)})
                global ratings
              </p>
              {isValidArray(orderReviews?.data?.stars) &&
                orderReviews?.data?.stars.map((rating, index) => (
                  <div key={index} className="flex items-center mt-4 mx-auto">
                    <p className="text-sm font-medium text-blue-600">
                      {rating.star} star
                    </p>
                    <div className="w-[60%] h-5 mx-4 bg-gray-200 rounded">
                      <div
                        className="h-5 bg-[#57e32c] rounded"
                        style={{ width: `${rating.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {rating.percentage}%
                    </span>
                  </div>
                ))}
            </div>

            <div className="w-full lg:w-[60%]  p-3 lg:px-6 border rounded-md">
              <div className="w-full  overflow-auto h-full lg:h-[450px]">
                {isOrderReview && (
                  <div className="flex items-center justify-center">
                    <Loader bg="transparent" />{" "}
                  </div>
                )}

                {!isOrderReview && (
                  <>
                    {isValidArray(orderReviews?.data?.reviews) ? (
                      orderReviews.data.reviews.map((review, index) => (
                        <article
                          key={index}
                          className={`h-auto py-3 ${index < orderReviews.data.reviews.length - 1
                              ? "border-b"
                              : ""
                            }`}
                        >
                          <div className="flex items-center my-4">
                            <img
                              className="w-10 h-10 me-4 rounded-full"
                              src={ProfileAvatarOutput(
                                review?.customer?.avatar
                              )}
                              alt=""
                            />
                            <div className="font-medium">
                              <p>
                                {review?.customer?.firstName || "---"}{" "}
                                {review?.customer?.lastName || "---"}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {" "}
                                <time
                                  dateTime={moment(
                                    review?.orderReview?.createdAt,
                                    "MMMM D, YYYY"
                                  ).format("YYYY-MM-DD HH:mm")}
                                >
                                  {moment(
                                    review?.orderReview?.createdAt
                                  ).format("MMMM D, YYYY")}
                                </time>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center mb-1 space-x-1">
                            <StarRatings
                              rating={review?.orderReview?.ratingStar}
                              starRatedColor="#57e32c"
                              isAggregateRating={false}
                              starDimension="15px"
                              starSpacing="4px"
                              numberOfStars={5}
                              name="rating"
                            />
                          </div>

                          <p className="mb-2 text-gray-500">
                            {review?.orderReview?.reviewMessage || ""}
                          </p>
                        </article>
                      ))
                    ) : (
                      <div className="flex items-center justify-center">
                        <p> No Reviews</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 
                            <div className='flex items-center pt-10'>
                                {(orderReviews?.data?.paginate?.totalCount || 0) !== 0 && <Paginate setCurrentPage={setCurrentPage} setInitPaginate={setInitPaginate} totalPages={orderReviews?.data?.paginate?.totalPages || 0} currentPage={currentPage} />}
                            </div> */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // console.log(orderReviews?.data?.paginate?.totalCount)

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => { }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full m-auto lg:w-[80%] h-screen transform overflow-auto rounded-2xl p-3 bg-white lg:p-8 text-left align-middle shadow-xl transition-all rounded-md lg:px-[40px] ">
                  <div className="flex flex-wrap item-center justify-end sticky top-0 md:top-4   xl:top-0      right-0  ">
                    <button>
                      <IoIosCloseCircle
                        size={24}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>
                  <div className="order-details  ">
                    <div className="order-details__header flex flex-wrap justify-between items-center mb-4 border-b">
                      <ul className="flex flex-wrap gap-10">
                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md  border-transparent ${activeTab === "productDetails"
                              ? "!border-b-2 !border-blue-600 !text-blue-600"
                              : "text-gray-600 hover:text-gray-800"
                            }`}
                          onClick={() => handleTabClick("productDetails")}
                        >
                          PRODUCT DETAILS
                        </li>

                        <li
                          className={`cursor-pointer border-b py-2 rounded-t-md border-transparent ${activeTab === "reviews"
                              ? "!border-b-2 !border-blue-600 !text-blue-600"
                              : "text-gray-600 hover:text-gray-800"
                            }`}
                          onClick={() => {
                            fetchProductReviews(singleProductDetails);
                            handleTabClick("reviews");
                          }}
                        >
                          REVIEWS
                        </li>
                      </ul>
                    </div>
                    <div className="mt-20">
                      {isRequestProduct && <Loader bg="transparent" />}
                    </div>
                    {!isRequestProduct && renderContent()}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductDetails;
