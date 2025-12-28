/* eslint-disable react-hooks/rules-of-hooks */
import SortCouponsSelect from "@/components/Coupons/SortCouponsSelect";
import EmptyTableSectionTwo from "@/components/EmptyDataSection/EmptyTableSectionTwo";
import CouponsCreateModal from "@/components/Modals/Coupons/CouponsCreateModal";
import CouponsDeleteModal from "@/components/Modals/Coupons/CouponsDeleteModal";
import CouponsEditModal from "@/components/Modals/Coupons/CouponsEditModal";
import OrderSiteStatus from "@/components/Shared/OrderSiteStatus";
import Loader from "@/shared/Loader/Loader";
import Paginate from "@/shared/Paginate/Paginate";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import ProductSkeleton from "@/shared/skeleton/ProductSkeleton";
import {
  getTimeRemaining,
  getTimeRemainingIsExpired,
  isValidArray,
} from "@/utils/func";
import { getCoupons, getProducts, listOfCouponProducts } from "@/utils/instance";
import _ from "lodash";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";

const all = () => {
  const [couponOpenData, setCouponOpenData] = useState({});
  const [isCouponReq, setIsCouponReq] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [query, setQuery] = useState({
    site: {
      label: "Hammer & Bell",
      value: "hb",
    },
  });
  const [coupons, setCoupons] = useState({});
  const [activeRange, setActiveRange] = useState("Active");
  const [createModalOpen, setCreateModalOpen] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [oldCode, setOldCode] = useState("");
  const [initPaginate, setInitPaginate] = useState(false);
  const [page, setPage] = useState(1);

  const buttonOptions = ["All", "Active", "Inactive", "Expired"];
  const fetchCoupons = async () => {
    try {
      setIsCouponReq(true);
      const res = await getCoupons({ filter: 'active', site: query?.site });
      setCoupons(res?.data);
      setIsCouponReq(false);
    } catch (error) {
      console.log(error, 'error');
      setIsCouponReq(false);
      setCoupons({});
    }
  };
  useEffect(() => {

    fetchCoupons();
  }, []);

  const fetchCouponsQueries = async (val) => {
    try {
      setIsCouponReq(true);
      const res = await getCoupons({ ...query, ...val, page: 1 });
      setCoupons(res?.data);
      setIsCouponReq(false);
    } catch (error) {
      setIsCouponReq(false);
      setCoupons({});
    }
  };

  function handleDebounceFn(val) {
    fetchCouponsQueries(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 500), []);

  function handleQueryChange(keys, value) {
    const val = { ...query, [keys]: value };
    setQuery(val);
    debounceFn(val);
  }

  const fetchPaginate = async () => {
    try {
      setIsCouponReq(true);
      const res = await getCoupons({ ...query, page });
      setCoupons(res?.data);
      setIsCouponReq(false);
    } catch (error) {
      setIsCouponReq(false);
      setCoupons({});
    }
  };

  useMemo(() => {
    if (initPaginate) {
      fetchPaginate();
    }
  }, [page]);

  const fetchProductsQueries = async (val = {}) => {
    try {
      const res = await getProducts(val);
      const searchOptions = isValidArray(res?.data?.data)
        ? res.data.data.map((item) => {
          return {
            _id: item?._id,
            value: item?._id,
            label: `${item?.title}${item?.subTitle? ` (${item.subTitle})`:''} | ${item.site.toUpperCase()}`,
          };
        })
        : [];
      setUpdateData((prev) => {
        return {
          ...prev,
          searchOptions: searchOptions,
        };
      });
      return searchOptions;
    } catch (error) {
      setCoupons({});
    }
  };

  function handleDebounceFnProducts(val) {
    fetchProductsQueries(val);
  }

  const debounceFnProducts = useCallback(
    _.debounce(handleDebounceFnProducts, 1000),
    []
  );

  function handleChangeProducts(val) {
    const value = { q: val || "" };
    debounceFnProducts(value);
  }

  const HandleDefaultUpdateOptionSet = async (coupon) => {
    let listOfProductOptions = [];
    let listOfProductSelected = [];
    if (isValidArray(coupon?.products)) {
      try {
        const products = coupon.products.map(item => item?._id || item);

        const res = await listOfCouponProducts({ products, site: coupon?.site });
        listOfProductOptions = isValidArray(res?.data?.data) ? res?.data?.data : [];
        listOfProductSelected= isValidArray(res?.data?.data) ? res?.data?.data.filter(fl => {
          if (fl?.displayCoupon && fl?.displayCoupon == coupon?._id) {
            return true;
          } else {
            return false;
          }
        }).map((cp) => ({ ...cp, selected: true })) : [];

      } catch (error) {
        console.log(error);
      }
    }
    const selectedProducts = isValidArray(coupon?.products)
      ? coupon?.products.map((item) => {
        return {
          _id: item?._id,
          value: item?._id,
          label: `${item?.title}${item?.subTitle? ` (${item.subTitle})`:''} | ${item.site.toUpperCase()}`,
        };
      })
      : [];
    const selectedExcludeProducts = isValidArray(coupon?.excludeProducts)
      ? coupon?.excludeProducts.map((item) => {
        return {
          _id: item?._id,
          value: item?._id,
          label: `${item?.title}${item?.subTitle? ` (${item.subTitle})`:''} | ${item.site.toUpperCase()}`,
        };
      })
      : [];

      console.log( listOfProductOptions,
        listOfProductSelected,`listOfProductOptions,
        listOfProductSelected`);
    setUpdateData((prev) => {
      return {
        ...prev,
        ...coupon,
        listOfProductOptions,
        listOfProductSelected,
        site: coupon?.site ?? "",
        selectedOptions: selectedProducts,
        selectedExcludeProductOptions: selectedExcludeProducts,
      };
    });

  };

  const HandleDefaultCreateOptionSet = async () => {
    setUpdateData((prev) => {
      return {
        enableAllProducts: true,
        selectedOptions: [],
        excludeProducts: [],
        site: "hb",
      };
    });
  };

  const resetHandler = async () => {
    await fetchCoupons();
  };

  const calculateFilters = (option) => {
    setActiveRange(option);
    setIsCouponReq(true);
    switch (option) {
      case "All":
        handleQueryChange("filter", "all");
        break;
      case "Active":
        handleQueryChange("filter", "active");
        break;
      case "Inactive":
        handleQueryChange("filter", "inactive");
        break;
      case "Expired":
        handleQueryChange("filter", "expired");
        break;
      default:
    }
  };

  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      fetchCouponsQueries({ ...query, site });
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };
  return (
    <Contentlayout>
      <div>
        <div className="  mx-auto lg:p-4  py-2 min-h-screen ">
          <div className="flex items-center gap-2 mb-4 justify-between flex-wrap">
            <h1 className="text-3xl font-bold">Coupons</h1>
            <div className="flex items-center gap-6">
              <SortCouponsSelect
                resetHandler={resetHandler}
                fetchCouponsQueries={fetchCouponsQueries}
                query={query}
                setQuery={setQuery}
              />
              <button
                className="hover:bg-blue-500 ms-auto py-2 px-4  bg-blue-400  text-white rounded-md block border-gray-200 text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                onClick={() => {
                  HandleDefaultCreateOptionSet();
                  setCreateModalOpen(true);
                }}
              >
                Create
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search coupons"
            className="w-full md:w-4/12 p-2 mb-4 border rounded border-blue-500"
            value={query?.q || ""}
            onChange={(e) => handleQueryChange("q", e.target.value)}
          />

          <div className="w-full items-center flex justify-between flex-wrap gap-4">
            <div className="lg:w-[85%] flex gap-4 flex-wrap">
              {buttonOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex"
                  onClick={() => {
                    calculateFilters(option);
                  }}
                >
                  <input
                    type="radio"
                    id={`buttonOption_${index}`}
                    name="date-range"
                    value={option}
                    className="mr-2 hidden"
                  />
                  {activeRange == option && isCouponReq ? (
                    <p
                      htmlFor={`buttonOption_${index}`}
                      className={`cursor-pointer px-3 py-[0.20rem] text-[12px] bg-gray-200 text-gray-800 rounded-[10px]  transition-colors duration-300 hover:bg-gray-300 flex items-center ${option == activeRange && "!bg-blue-500   !text-white"
                        }`}
                    >
                      <span className="flex items-center gap-x-2 justify-between">
                        <span> {option}</span>{" "}
                      </span>
                    </p>
                  ) : (
                    <p
                      htmlFor={`buttonOption_${index}`}
                      className={`cursor-pointer px-3 py-2 text-[12px] bg-gray-200 text-gray-800 rounded-[10px] transition-colors duration-300 hover:bg-gray-300 flex items-center ${option == activeRange &&
                        "!bg-blue-500 border !text-white"
                        }`}
                    >
                      {option}
                    </p>
                  )}
                </div>
              ))}{" "}
              {isCouponReq && <Loader width={"w-4 h-4"} bg="transparent" />}
            </div>
            <div className="lg:w-[12%]  flex justify-center rounded-md">
              <OrderSiteStatus
                align={"left"}
                data={couponOpenData}
                noAllSite={true}
                setData={setCouponOpenData}
                query={query}
                onChanges={onChangeSiteType}
              />
            </div>
          </div>
          {
            activeRange == 'All' && <div className="pl-3 pt-3 flex items-center gap-1 text-gray-500">
              <IoIosInformationCircleOutline size={20} />
              <p> All coupons</p>
            </div>

          }
          {
            activeRange == 'Active' && <div className="pl-3 pt-3 flex items-center gap-1 text-gray-500">
              <IoIosInformationCircleOutline size={20} />
              <p> All coupons where status is active & quantity or expiry date not expired. (Note: active coupons are applicable during checkout)</p>
            </div>

          }
          {
            activeRange == 'Inactive' && <div className="pl-3 pt-3 flex items-center gap-1 text-gray-500">
              <IoIosInformationCircleOutline size={20} />
              <p>All coupons were status inactive.</p>
            </div>

          }
          {
            activeRange == 'Expired' && <div className="pl-3 pt-3 flex items-center gap-1 text-gray-500">
              <IoIosInformationCircleOutline size={20} />
              <p>All coupons where status active but expired.</p>
            </div>

          }
          {!isCouponReq && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
              {isValidArray(coupons?.data) &&
                coupons?.data?.map((coupon, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setOldCode(coupon?.code);
                    }}
                  >
                    {/* {console.log((getTimeRemainingIsExpired(coupon)), 'coupon')} */}
                    <h2
                      className={`text-xl font-semibold px-4 py-2 border-t-0  ${coupon?.isActive === false ? "bg-red-500 text-white"
                        : getTimeRemainingIsExpired(coupon) ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                        }`}
                    >
                      {coupon?.code}
                    </h2>
                    <div
                      className=" mx-auto bg-white rounded-t-none rounded-md overflow-hidden shadow-md  p-4 pt-1"
                      key={i}
                    >
                      <p className="text-gray-600 py-1">
                        <span className="font-semibold">Amount:</span>{" "}
                        {coupon?.value}%
                      </p>
                      <p className="text-gray-600 py-1">
                        <span className="font-semibold">Total Uses:</span>{" "}
                        {coupon?.totalUses}
                      </p>
                      <p className="text-gray-600 py-1">
                        <span className="font-semibold">Total Customers:</span>{" "}
                        {coupon?.totalCustomers}
                      </p>
                      <p className="text-gray-600 py-1">
                        <span className="font-semibold">Quantity:</span>{" "}
                        {coupon?.quantity || "Unlimited"}
                      </p>
                      <p className="text-gray-600 py-1">
                        <span className="font-semibold">
                          Enable All Products:
                        </span>{" "}
                        {coupon?.enableAllProducts ? "Yes" : "No"}
                      </p>
                      {coupon?.enableAllProducts === false ? (
                        <div className="py-1">
                          <span className="font-semibold">
                            Enable Products:{" "}
                          </span>{" "}
                          {coupon?.products?.length || 0}
                        </div>
                      ) : (
                        <div className="py-1">
                          <span className="font-semibold">
                            Exclude Products:{" "}
                          </span>{" "}
                          {coupon?.excludeProducts?.length || 0}
                        </div>
                      )}
                      <p className="text-gray-600 py-1">
                        <span className="font-semibold">Expiry:</span>{" "}
                        {coupon?.expiry &&
                          moment(coupon?.expiry).format("YYYY-MM-DD")}{" "}
                        ({getTimeRemaining(coupon)})
                      </p>
                      <p className="text-gray-600 py-1">
                        <span className="font-semibold">status:</span>{" "}
                        {coupon.isActive ? "active" : "inactive"}
                      </p>
                      <p className="text-gray-600 py-1">
                        <span className="font-semibold">Site:</span>{" "}
                        {coupon.site ?? "N/A"}
                      </p>

                      <div className="flex items-center gap-2 justify-end pt-3">
                        <button
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => {
                            HandleDefaultUpdateOptionSet(coupon);
                            setEditModalOpen(true);
                          }}
                        >
                          <RiEditLine size={18} /> Edit
                        </button>
                        |
                        <button
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => {
                            setUpdateData(coupon);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <MdOutlineDeleteOutline size={18} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {/* <|=================| Loading Section |======================|> */}
          <div className="mt-6">
            {isCouponReq && <ProductSkeleton count={3} />}
          </div>

          {/* <|=================| Empty Data Section |=================|> */}

          {coupons?.data?.length == 0 && !isCouponReq && (
            <div className="w-8/12 lg:w-6/12 mx-auto">
              <EmptyTableSectionTwo />
            </div>
          )}
        </div>
        {
          <div className="my-10 flex items-center justify-center flex-wrap">
            <Paginate
              setCurrentPage={setPage}
              currentPage={page}
              totalPages={coupons?.paginate?.totalPage}
              setInitPaginate={setInitPaginate}
            />
          </div>
        }
      </div>
      {createModalOpen && (
        <CouponsCreateModal
          onInputChange={handleChangeProducts}
          coupons={coupons}
          setCoupons={setCoupons}
          isOpen={createModalOpen}
          setIsOpen={setCreateModalOpen}
          setUpdateData={setUpdateData}
          updateData={updateData}
        />
      )}

      {editModalOpen && (
        <CouponsEditModal
          onInputChange={handleChangeProducts}
          oldCode={oldCode}
          coupons={coupons}
          setCoupons={setCoupons}
          isOpen={editModalOpen}
          setIsOpen={setEditModalOpen}
          setUpdateData={setUpdateData}
          updateData={updateData}
        />
      )}

      {deleteModalOpen && (
        <CouponsDeleteModal
          coupons={coupons}
          oldCode={oldCode}
          setCoupons={setCoupons}
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          setUpdateData={setUpdateData}
          updateData={updateData}
        />
      )}
    </Contentlayout>
  );
};

export default all;
