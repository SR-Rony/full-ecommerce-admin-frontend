import ProductsSelectInput from "@/components/Coupons/ProductsSelectInput";
import CustomerCreateModal from "@/components/Modals/Customer/CustomerCreateModal";
import CustomerShippingInfoUpdateModal from "@/components/Modals/Customer/CustomerShippingInfoUpdateModal";
import Loader from "@/shared/Loader/Loader";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { ToastEmitter } from "@/utils/Toast";
import {
  addressConcat,
  firstNameGet,
  isValidArray,
  isValidEmail,
  lastNameGet,
} from "@/utils/func";
import {
  createOrderApi,
  getAllFreebies,
  getCouponByCode,
  getCustomerProfile,
  getCustomers,
  getCustomersSearch,
  getProducts,
  getShippingSettings,
} from "@/utils/instance";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";

const getProductQuantity = (cartsProducts, productId) => {
  if (!isValidArray(cartsProducts)) return 1;
  const existingProduct = cartsProducts.find(
    (item) => item?.product.toString() === productId.toString()
  );
  if (existingProduct) {
    return existingProduct.quantity;
  } else {
    return 1;
  }
};

function applyDiscount(originalPrice, discountPercentage) {
  const parsedOriginalPrice = parseFloat(originalPrice);
  const parsedDiscountPercentage = parseFloat(discountPercentage);
  // console.log("originalPrice",parsedOriginalPrice,"discount",parsedDiscountPercentage);

  if (isNaN(parsedOriginalPrice) || isNaN(parsedDiscountPercentage)) {
    return 0;
  }

  const discountDecimal = parsedDiscountPercentage / 100;
  const discountedPrice =
    parsedOriginalPrice - parsedOriginalPrice * discountDecimal;

  const roundedDiscountedPrice = Math.round(discountedPrice * 100) / 100;

  return roundedDiscountedPrice;
}

function calculateTotalAmountWithCouponProducts(
  dbProducts = [],
  cartsProducts = [],
  couponProductsArr = [],
  shippingCost = 0,
  couponPercent = 0,
  enableAllProducts,
  shippingSelect
) {
  console.log("dbProducts", dbProducts, "couponProducts", couponProductsArr);

  if (enableAllProducts) {
    const allProductCouponApplyAmount = dbProducts.reduce((acc, curr) => {
      if (curr?.availability?.isInternational === true) {
        return (
          acc +
          (parseFloat(curr?.price?.sale) || 0) *
            getProductQuantity(cartsProducts, curr?._id)
        );
      } else {
        if (
          isValidArray(curr?.availability?.countries) &&
          curr?.availability?.countries.some(
            (item) => item?.country?.value == shippingSelect?.value
          )
        ) {
          return (
            acc +
            (parseFloat(curr?.price?.sale) || 0) *
              getProductQuantity(cartsProducts, curr?._id)
          );
        }
        return acc;
      }
    }, 0);

    const finalAmount = applyDiscount(
      allProductCouponApplyAmount,
      couponPercent
    );
    const totalCouponProductDiscount =
      allProductCouponApplyAmount - finalAmount;
    return {
      finalAmount: (finalAmount === 0 ? 0 : finalAmount + shippingCost).toFixed(
        2
      ),
      discountedCouponAmount: totalCouponProductDiscount.toFixed(2),
    };
  } else {
    const filterMyCartsDiscloseCouponAmount = dbProducts
      .filter(
        (item) =>
          !couponProductsArr.some(
            (coupon) => item?._id?.toString() == coupon?.toString()
          )
      )
      .reduce((acc, curr) => {
        if (curr?.availability?.isInternational === true) {
          return (
            acc +
            (parseFloat(curr?.price?.sale) || 0) *
              getProductQuantity(cartsProducts, curr?._id)
          );
        } else {
          if (
            isValidArray(curr?.availability?.countries) &&
            curr?.availability?.countries.some(
              (item) => item?.country?.value == shippingSelect?.value
            )
          ) {
            return (
              acc +
              (parseFloat(curr?.price?.sale) || 0) *
                getProductQuantity(cartsProducts, curr?._id)
            );
          }
          return acc;
        }
      }, 0);
    const totalCouponProductAmount = dbProducts
      .filter((item) =>
        couponProductsArr.some(
          (coupon) => item?._id?.toString() == coupon?.toString()
        )
      )
      .reduce((acc, curr) => {
        if (curr?.availability?.isInternational === true) {
          return (
            acc +
            (curr?.price?.sale || 0) *
              getProductQuantity(cartsProducts, curr?._id)
          );
        } else {
          if (
            isValidArray(curr?.availability?.countries) &&
            curr?.availability?.countries.some(
              (item) => item?.country?.value == shippingSelect?.value
            )
          ) {
            return (
              acc +
              (curr?.price?.sale || 0) *
                getProductQuantity(cartsProducts, curr?._id)
            );
          } else {
            console.log("invalid country.");
          }
          return acc;
        }
      }, 0);

    const couponFinalAmount = applyDiscount(
      totalCouponProductAmount,
      couponPercent
    );
    const totalCouponProductDiscount =
      totalCouponProductAmount - couponFinalAmount;

    const finalAmount =
      filterMyCartsDiscloseCouponAmount + couponFinalAmount === 0
        ? 0
        : filterMyCartsDiscloseCouponAmount + couponFinalAmount + shippingCost;

    return {
      finalAmount: finalAmount.toFixed(2),
      discountedCouponAmount: totalCouponProductDiscount.toFixed(2),
    };
  }
}

const Index = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResult] = useState([]);
  const [customerResults, setCustomerResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const searchResultProducts = useRef([]);
  const searchResultCustomers = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shippingOption, setShippingOption] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCustomerShippingOpen, setCustomerShippingOpen] = useState(false);
  const [customerShipping, setCustomerShipping] = useState(null);
  const [orderCreated, setOrderCreated] = useState(null);
  let [couponData, setCouponData] = useState({ code: "" });
  const [customerCreateModalOpen, setCustomerCreateModalOpen] = useState(false);
  const [customerDetailsModalOpen, setCustomerDetailsModalOpen] =
    useState(false);
  const [customerUpdateData, setCustomerUpdateData] = useState(null);
  const [freebies, setFreebies] = useState([]);
  let [freebieProduct, setFreebieProduct] = useState(null);
  const [selectedFreebie, setSelectedFreebie] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [site, setSite] = useState("hb");
  const [inputEmail, setInputEmail] = useState("");
  const [inputEmailReq, setInputEmailReq] = useState(false);
  const [order, setOrder] = useState({
    customer: null,
    orderId: null,

    products: [],
    freeBuy: {
      isFreeBuy: false,
      freeBuyId: null,
      freeBuyProduct: null,
      minimumThreshold: null, // string,
    },
    orderSummary: {
      productsSubtotal: 0, // string
      shippingCost: 0,
      totalSaving: 0,
      totalAmount: 0, // string
      coupon: {
        coupon: null,
        amount: "0", // string
        code: null,
      },
    },
    shipping: {
      shippingOptionSetting: null, // object id string.
      /// other fields populated on backend side.
    },
    status: "PENDING",
    statusUpdatedAtRecords: [
      {
        status: "PENDING",
        updatedAt: new Date(),
      },
    ],
    tracking: {
      numbers: [],
    },
    comments: [],
    site: site,
  });

  const fetchProducts = async (q) => {
    setSearchLoading(true);
    const res = await getProducts({
      isSoldOut: false,
      q: q,
      isActive: true,
      site: site,
      limit: 200,
    });
    setSearchLoading(false);
    if (res?.data?.success) {
      const ids = res.data.data.map((e) => e._id);
      searchResultProducts.current.filter((e) => !ids.includes(e._id));
      searchResultProducts.current.push(...res.data.data);
      const searchOptions = isValidArray(res?.data?.data)
        ? res.data.data.map((item) => {
            return {
              _id: item?._id,
              value: item?._id,
              label: item?.bundle?.isLimited
                ? `${item?.title} (${item?.subTitle})`
                : item?.title,
            };
          })
        : [];

      setSearchResult(searchOptions);
    }
  };

  useEffect(() => {
    async function fetchShippingOption() {
      try {
        setIsLoading(true);
        const res2 = await getAllFreebies();
        setFreebies(res2.data.data);
        const res = await getShippingSettings({ site: site });
        await fetchProducts();
        const option = res.data.data[0];
        if (!option) {
          toast.error("Shipping setting not found.");
        } else {
          setShippingOption(option);
          //setOrder((o)=>({...o,orderSummary: {...o.orderSummary,shippingCost: option.cost} }));
          setOrder((o) => ({
            ...o,
            shipping: { ...o.shipping, shippingOptionSetting: option._id },
          }));
          setIsLoading(false);
        }
      } catch (err) {
        toast.error("Please refresh the page.");
      }
    }
    fetchShippingOption();
  }, []);

  const getFreebieObject = (freebie, product) => {
    if (!freebie || !product) {
      return {
        isFreeBuy: false,
        freeBuyId: null,
        freeBuyProduct: null,
        minimumThreshold: null, // string,
      };
    }
    return {
      isFreeBuy: true,
      freeBuyId: freebie._id,
      freeBuyProduct: {
        product: product._id,
        title: product.title,
        quantity: 1,
        price: product.price,
      },
      minimumThreshold: freebie.minimumThreshold,
    };
  };

  const calculateOrderSummaryAndUpdate = (o) => {
    const orderSummary = o.orderSummary;
    let shippingReducedCost = 0;

    orderSummary.productsSubtotal = !o.products?.length
      ? "0.00"
      : o.products
          .map((e) => parseFloat(e.price.sale) * e.quantity)
          .reduce((a, b) => a + b)
          .toFixed(2);

    // coupon.
    let couponAmount = 0;
    orderSummary.coupon.amount = 0;
    orderSummary.coupon.coupon = couponData?._id || null;
    orderSummary.coupon.code = couponData?._id
      ? couponData?.code || null
      : null;

    console.log("couponData", couponData, shippingOption);

    if (couponData?._id) {
      const dbProducts = o.products.map((e) => e.productData);
      const result = calculateTotalAmountWithCouponProducts(
        dbProducts,
        o.products,
        couponData.enableAllProducts
          ? dbProducts
              .filter(
                (e) =>
                  !couponData.excludeProducts
                    .map((p) => p.toString())
                    .includes(e._id.toString())
              )
              .map((e) => e._id)
          : couponData.products.map((e) => e?._id || e),
        0,
        couponData.value,
        false, //enableAllProducts,
        shippingOption.shippingCountry?.country
      );
      orderSummary.coupon.amount = parseFloat(result.discountedCouponAmount);
      couponAmount = orderSummary.coupon.amount;
      console.log("couponAmount", couponAmount);
    }

    let totalAfterSaving =
      parseFloat(orderSummary.productsSubtotal) - parseFloat(couponAmount);

    if (shippingOption?.freeShipping?.allow) {
      orderSummary.shippingCost =
        parseFloat(totalAfterSaving) >= shippingOption.freeShipping.amount
          ? 0
          : shippingOption.cost;
      if (!orderSummary.shippingCost) {
        shippingReducedCost = shippingOption.cost;
      }
    } else {
      orderSummary.shippingCost = shippingOption.cost;
    }

    freebies.sort((a, b) =>
      parseFloat(a.minimumThreshold) < parseFloat(b.minimumThreshold) ? -1 : 1
    );
    let reachedFreebie = null;
    for (let freebie of freebies) {
      if (totalAfterSaving >= parseFloat(freebie.minimumThreshold)) {
        reachedFreebie = freebie;
      }
    }

    let freebieProductPrice = 0;
    if (reachedFreebie) {
      if (reachedFreebie?._id != selectedFreebie?._id) {
        setFreebieProduct(null);
        freebieProduct = null;
      } else if (freebieProduct?._id) {
        freebieProductPrice = parseFloat(freebieProduct.price.sale);
      }
      setSelectedFreebie(reachedFreebie);
    } else {
      setSelectedFreebie(null);
      setSelectedProduct(null);
    }

    orderSummary.totalSaving = !o.products?.length
      ? "0.00"
      : (
          freebieProductPrice +
          shippingReducedCost +
          o.products
            .map(
              (e) =>
                (parseFloat(e.price.regular) - parseFloat(e.price.sale)) *
                e.quantity
            )
            .reduce((a, b) => a + b)
        ).toFixed(2);
    orderSummary.totalAmount = !o.products?.length
      ? orderSummary.shippingCost
      : (
          parseFloat(orderSummary.shippingCost) +
          o.products
            .map((e) => parseFloat(e.price.sale) * e.quantity)
            .reduce((a, b) => a + b)
        ).toFixed(2);
    orderSummary.totalAmount = (
      parseFloat(orderSummary.totalAmount) - couponAmount
    ).toFixed(2);

    o.freeBuy = getFreebieObject(selectedFreebie, freebieProduct);

    setOrder(o);
  };

  function handleDebounceFn(val) {
    //fetchProducts(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function onChangeDebounce(value) {
    setSearchTerm(value);
    debounceFn(value);
  }

  const fetchCustomers = async (q) => {
    try {
      setSearchLoading(true);
      const res = await getCustomersSearch({ q });
      setSearchLoading(false);
      if (res?.data?.success) {
        const ids = res.data.data.map((e) => e._id);
        searchResultCustomers.current.filter((e) => !ids.includes(e._id));
        searchResultCustomers.current.push(...res.data.data);
        const searchOptions = isValidArray(res?.data?.data)
          ? res.data.data.map((item) => {
              return {
                _id: item?._id,
                value: item?._id,
                label: item?.email,
              };
            })
          : [];
        setCustomerResults(searchOptions);
      }
    } catch (error) {
      setSearchLoading(false);
      console.log(error);
    }
  };

  function handleDebounceFnCustomer(val) {
    fetchCustomers(val);
  }

  const debounceFnCustomer = useCallback(
    _.debounce(handleDebounceFnCustomer, 1000),
    []
  );

  function onChangeDebounceCustomer(value) {
    setSearchTerm(value);
    debounceFnCustomer(value);
  }

  const getProductObject = (product, quantity) => {
    return {
      product: product._id,
      title: product.title,
      quantity: quantity,
      price: product.price,
      totalAmount: parseFloat(product.price.sale) * quantity,
      bundleProducts: product.bundle?.products,
      isBundle: product.bundle?.isLimited,
      subTitle: product.subTitle,
      bundleSize: product.bundle?.size,
      images: product.images,
      productData: product,
    };
  };

  const updateQuantity = (productId, quantity) => {
    order.products
      .filter((e) => e.product == productId)
      .forEach((e) => {
        e.quantity = e.quantity + quantity;
      });
    order.products = order.products.filter((e) => e.quantity);
    setOrder((o) => ({ ...o }));
    calculateOrderSummaryAndUpdate({ ...order });
  };

  const onCreateOrder = async () => {
    try {
      if (!order.products.length) {
        return toast.error("Please select at least one product.");
      }
      if (!order.customer) {
        return toast.error("Please select customer.");
      }
      if (selectedFreebie?._id && !freebieProduct?._id) {
        return toast.error("Please select a freebie product.");
      }

      setIsCreating(true);
      const orderData = JSON.parse(JSON.stringify(order));
      /// prepare data.
      const res = await createOrderApi(orderData);
      setOrderCreated(res.data.data);
    } catch (err) {
      toast.error(err?.response?.message || err?.message);
    }
    setIsCreating(false);
  };

  const openShippingView = async () => {
    const customerId = selectedCustomer?._id;
    const profile = (await getCustomerProfile(customerId)).data.data;
    setCustomerProfile({
      ...profile,
      nameUpdateData: {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
      },
      shippingInfoUpdateData: profile.shippingInfo || {},
    });
    setCustomerDetailsModalOpen(true);
  };

  if (!shippingOption) {
    return (
      <Contentlayout>
        <div className="mt-[60px] h-screen flex items-center justify-center">
          <Loader />
        </div>
      </Contentlayout>
    );
  }

  if (orderCreated) {
    return (
      <Contentlayout>
        <div className="mt-[60px] h-screen flex flex-col items-center justify-center">
          <FaCheckCircle className="text-3xl text-green-500 my-2" />
          <p className="my-2 text-lg">#{orderCreated.order?.orderId}</p>
          <h3 className="my-4 font-semibold text-2xl">
            Order Created Successfully
          </h3>
          {orderCreated.paymentDetails && (
            <div className="bg-slate-50 p-4 rounded-md border border-black shadow-md">
              <h3 className="text-lg font-semibold text-slate-500">
                Payment Information:
              </h3>
              <p className="my-2">
                BTC Address Pay In:{" "}
                <span className="font-semibold">
                  {orderCreated.paymentDetails?.pay_address}
                </span>
              </p>
              <p className="my-2">
                BTC Amount To Be Paid:{" "}
                <span className="font-semibold">
                  {orderCreated.paymentDetails?.pay_amount}
                </span>
              </p>
            </div>
          )}
          <div className="bg-slate-50 p-4 mt-2 rounded-md border border-black shadow-md min-w-[432.5px]">
            <h3 className="text-lg font-semibold text-slate-500">
              Order Summary:
            </h3>
            <p className="text-md">
              <span className="font-semibold">Shipping Cost:</span> $
              {order.orderSummary.shippingCost}
            </p>
            <p className="text-md">
              <span className="font-semibold">Products Subtotal:</span> $
              {order.orderSummary.productsSubtotal}
            </p>
            <p className="text-md">
              <span className="font-semibold">Saving from Coupon:</span> $
              {order.orderSummary.coupon?.amount}
            </p>
            <p className="text-md">
              <span className="font-semibold">Total Saving:</span> $
              {order.orderSummary.totalSaving}
            </p>
            <hr />
            <p className="text-lg font-semibold">
              Total: ${order.orderSummary.totalAmount}
            </p>
          </div>
        </div>
      </Contentlayout>
    );
  }

  const HandleFindCustomersByEmail = async (val = {}) => {
    try {
      if (!val?.email) {
        return ToastEmitter("error", "Please enter a email!");
      }
      if (!val?.site?.value) {
        return ToastEmitter("error", "Please select a site!");
      }
      if (!isValidEmail(val?.email)) {
        return ToastEmitter("error", "Please enter a valid email!");
      }
      setInputEmailReq(true);
      const res = await getCustomers({ ...val });
      setInputEmailReq(false);
      if (res?.data?.success) {
        if (!res?.data?.data?.length) {
          setSelectedCustomer({});
          return ToastEmitter(
            "error",
            "No customer found, but you can add new customer for this email"
          );
        } else {
          setSelectedCustomer(res?.data?.data[0]);
          setOrder((o) => ({ ...o, customer: res?.data?.data[0]?._id }));
          return ToastEmitter("success", "Customer found");
        }
      }
    } catch (error) {
      setInputEmailReq(false);
      console.log(error);
    }
  };
  return (
    <>
      <Contentlayout>
        <div className="mt-[60px] h-screen">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-2xl font-bold">Create New Order</p>
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <div className="flex md:justify-end items-center">
                <button
                  className="font-semibold bg-black text-white p-2 rounded-md"
                  onClick={() => {
                    setCustomerUpdateData({ site: site });
                    setCustomerCreateModalOpen(true);
                  }}
                >
                  + Add Customer
                </button>
              </div>
              <div className="mt-4">
                <label className="text-xl text-slate-500 font-semibold">
                  Select site*
                </label>
                <div className=" border py-4 rounded-sm">
                  <div className="flex ml-3">
                    <div className="flex items-center">
                      <input
                        id="hammer-radio"
                        checked={site == "hb"}
                        type="radio"
                        value="hb"
                        name="inline-radio-group"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        onChange={(e) => {
                          setSite(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="hammer-radio"
                        className="ms-2 text-sm font-medium text-gray-900"
                      >
                        Hammer & Bell
                      </label>
                    </div>
                    {/* 
                    <div className="flex items-center ml-4">
                      <input checked={site == 'auctropin'} id="auctropin-radio" type="radio" value="auctropin" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onChange={(e) => {
                        setSite(e.target.value);
                      }} />
                      <label htmlFor="auctropin-radio" className="ms-2 text-sm font-medium text-gray-900">Auctropin</label>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="max-w-[400px] my-4">
                <label className="text-xl text-slate-500 font-semibold">
                  Customer:
                </label>
                <br></br>
                <div className="flex items-center justify-between flex-col gap-2 md:gap-0   md:flex-row">
                  <input
                    type="text"
                    placeholder="Enter email..."
                    className="  w-full md:w-[70%]"
                    value={inputEmail}
                    onChange={(e) => {
                      setInputEmail(e.target.value);
                    }}
                  />
                  {inputEmailReq ? (
                    <button className="p-2 font-semibold text-white h-[40px] bg-black gap-2 w-[40%] flex items-center cursor-not-allowed">
                      {" "}
                      <span>Find Customer</span>{" "}
                      <Loader bg="transparent" width={"w-4"} height={"h-4"} />{" "}
                    </button>
                  ) : (
                    <button
                      className="p-2 font-semibold text-white h-[40px] bg-black  w-full  md:w-[40%]"
                      onClick={() => {
                        HandleFindCustomersByEmail({
                          email: inputEmail,
                          site: { value: site },
                        });
                      }}
                    >
                      {" "}
                      Find Customer
                    </button>
                  )}
                </div>
              </div>

              {selectedCustomer?._id && (
                <>
                  <div>
                    <div>
                      <label className="text-xl text-slate-500 font-semibold">
                        Selected Customer
                      </label>
                    </div>

                    <div className="rounded-md py-3">
                      <div className="capitalize ">
                        Current Name for Receiver:{" "}
                        <span className="font-semibold text-md">
                          {firstNameGet(selectedCustomer?.shippingInfo)}{" "}
                          {lastNameGet(selectedCustomer?.shippingInfo)}
                        </span>{" "}
                        <span className="font-semibold text-md">
                          {selectedCustomer?.site}
                        </span>{" "}
                      </div>
                      <div className="capitalize ">
                        Email:{" "}
                        <span className="font-semibold text-md">
                          {selectedCustomer?.email}
                        </span>{" "}
                      </div>
                      {/* <div className="capitalize ">
                      Site:{" "}
                      <span className="font-semibold text-md">
                        {selectedCustomer?.site}
                      </span>{" "}
                    </div>
                    <div className="capitalize ">
                      current address:{" "}
                      <span className="font-semibold text-md">
                        {addressConcat(selectedCustomer?.shippingInfo)}
                      </span>{" "}
                    </div>
                    <div className="capitalize ">
                      Apartment or Unit:{" "}
                      <span className="font-semibold text-md">
                        {selectedCustomer?.shippingInfo?.aptUnit || ""}
                      </span>{" "}
                    </div> */}
                    </div>
                  </div>
                  <button
                    onClick={openShippingView}
                    className="text-blue-600  font-semibold underline"
                  >
                    CLICK TO EDIT SHIPPING ADDRESS.
                  </button>
                </>
              )}
            </div>

            <div>
              <label className="text-xl text-slate-500 font-semibold py-2 pt-4">
                Products:
              </label>
              <div className="flex flex-wrap mb-2 gap-2 mt-4">
                {order.products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-1 bg-white shadow-md rounded-md p-2 max-w-[400px]"
                  >
                    <div className="w-[80px] h-[80px] bg-slate-100 border rounded-md">
                      <img
                        src={(product.images?.map((e) => e.imgUrl) || [])[0]}
                        alt={"Product image"}
                        className="w-full h-full rounded-md"
                      />
                    </div>
                    <div className="ms-1">
                      <p className="text-md font-semibold">{product.title}</p>
                      <p className="text-[12px] font-semibold text-yellow-500">
                        {product.subTitle}
                      </p>
                      <div className="flex items-center">
                        <p className="text-sm font-semibold text-black">
                          $
                          {(
                            parseFloat(product.price.sale) * product.quantity
                          ).toFixed(2)}
                        </p>
                        <p className="text-[12px] font-semibold ms-1 text-slate-400 line-through">
                          $
                          {(
                            parseFloat(product.price.regular) * product.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ms-1">
                      <div
                        onClick={() => {
                          updateQuantity(product.product, -1);
                        }}
                        className="border cursor-pointer hover:bg-slate-200 shadow-sm rounded-full p-2 py-0 border-black"
                      >
                        -
                      </div>
                      {product.quantity}
                      <div
                        onClick={() => {
                          updateQuantity(product.product, 1);
                        }}
                        className="border cursor-pointer hover:bg-slate-200 shadow-sm rounded-full p-2 py-0 border-black"
                      >
                        +
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-lg text-slate-500 underline mb-2">
                Search and add product.
              </p>
              <div className="flex max-w-[400px]">
                <div className="flex-1 w-[240px] md:w-full">
                  <ProductsSelectInput
                    keys="selectedFreeBuyProductOptions"
                    searchOptions={searchResults || []}
                    isSingleProduct={true}
                    selectedOptions={[selectedProduct].filter((e) => e)}
                    onChange={(keys, e) => {
                      setSelectedProduct(e);
                    }}
                    onInputChange={onChangeDebounce}
                  />
                </div>
                <button
                  disabled={!selectedProduct?._id}
                  onClick={(_) => {
                    if (!selectedProduct?._id) {
                      return;
                    }
                    const product = searchResultProducts.current.filter(
                      (e) => e?._id == selectedProduct?._id
                    )[0];
                    if (product) {
                      if (
                        order.products.filter(
                          (p) => p.product == selectedProduct?._id
                        )[0]
                      ) {
                        updateQuantity(selectedProduct?._id, 1);
                      } else {
                        const o = {
                          ...order,
                          products: [
                            ...order.products,
                            getProductObject(product, 1),
                          ],
                        };
                        setOrder(o);
                        calculateOrderSummaryAndUpdate(o);
                      }
                      setSelectedProduct(null);
                    }
                  }}
                  className="p-2 font-semibold text-white px-4 bg-black"
                >
                  ADD
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 max-w-[400px]">
              <label className="text-xl text-slate-500 font-semibold">
                Coupon:
              </label>
              <input
                disabled={!!couponData?._id}
                value={couponData?.code}
                onChange={(e) => {
                  setCouponData((c) => ({ code: e.target.value }));
                }}
                type="text"
                className="flex-1 w-[100px] md:w-full disabled:bg-slate-200"
                placeholder="Enter Coupon"
              />
              <button
                onClick={async () => {
                  if (couponData?._id) {
                    setCouponData({ code: "" });
                    couponData = { code: "" };
                    calculateOrderSummaryAndUpdate(order);
                    toast.error("Coupon removed!");
                    return;
                  }
                  if (!order.products.length) {
                    return toast.error("Please select products.");
                  }
                  try {
                    const res = await getCouponByCode({
                      code: couponData.code,
                      cartProducts: order.products.map((e) => e.product),
                    });
                    if (res.data.data?._id) {
                      setCouponData(res.data.data);
                      couponData = res.data.data;
                      calculateOrderSummaryAndUpdate(order);
                      toast.success("Coupon applied!");
                    } else {
                      toast.error(res.data?.message);
                    }
                  } catch (err) {
                    console.log("error", err);
                    toast.error(err?.response?.data?.message || err?.message);
                  }
                }}
                className="p-2 font-semibold text-white bg-black"
              >
                {couponData?._id ? "Remove" : "Apply"}
              </button>
            </div>
            <br />
            <div className="flex items-center  flex-wrap   gap-2">
              <label className="text-xl text-slate-500 font-semibold">
                Order Status:
              </label>
              <select
                value={order.status}
                onChange={(e) => {
                  setOrder((o) => ({ ...o, status: e.target.value }));
                }}
              >
                <option value={"PENDING"}>PENDING</option>
                <option value={"PAID"}>PAID</option>
                <option value={"PACKED"}>PACKED</option>
                <option value={"PARTIALLY_SHIPPED"}>PARTIALLY_SHIPPED</option>
                <option value={"FULLY_SHIPPED"}>FULLY_SHIPPED</option>
              </select>
            </div>
            <br />
            {selectedFreebie?._id && (
              <div>
                <label className="text-xl text-slate-500 font-semibold py-2 pt-4">
                  Choose freebie product for minimumThresold $
                  {selectedFreebie.minimumThreshold}:
                </label>
                <div className="flex flex-wrap mb-2 gap-2 mt-4">
                  {selectedFreebie.freeProducts.map((product) => (
                    <div
                      onClick={() => {
                        freebieProduct = product;
                        calculateOrderSummaryAndUpdate(order);
                        setFreebieProduct(product);
                      }}
                      key={product._id}
                      className="flex items-center gap-1 bg-white shadow-md cursor-pointer rounded-md p-2 max-w-[400px]"
                    >
                      <div className="w-[65px] h-[65px] bg-slate-100 border rounded-md">
                        <img
                          src={(product.images?.map((e) => e.imgUrl) || [])[0]}
                          alt={"Product image"}
                          className="w-full h-full rounded-md"
                        />
                      </div>
                      <div className="ms-1">
                        <p className="text-md font-semibold">{product.title}</p>
                        <p className="text-[12px] font-semibold text-yellow-500">
                          {product.subTitle}
                        </p>
                        <div className="flex items-center">
                          <p className="text-sm font-semibold text-black">
                            ${parseFloat(product.price.sale).toFixed(2)}
                          </p>
                          <p className="text-[12px] font-semibold ms-1 text-slate-400 line-through">
                            ${parseFloat(product.price.regular).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ms-1">
                        <div className="border cursor-pointer shadow-sm text-green-400 text-xl">
                          {freebieProduct?._id == product._id ? (
                            <FaCircleCheck />
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <hr />
            <h3 className="text-2xl text-slate-600 font-semibold">
              Order Summary:
            </h3>
            <p className="text-md">
              <span className="font-semibold">Shipping Cost:</span> $
              {order.orderSummary.shippingCost}
            </p>
            <p className="text-md">
              <span className="font-semibold">Products Subtotal:</span> $
              {order.orderSummary.productsSubtotal}
            </p>
            <p className="text-md">
              <span className="font-semibold">Saving from Coupon:</span> $
              {order.orderSummary.coupon?.amount}
            </p>
            <p className="text-md">
              <span className="font-semibold">Total Saving:</span> $
              {order.orderSummary.totalSaving}
            </p>
            <hr />
            <p className="text-lg font-semibold">
              Total: ${order.orderSummary.totalAmount}
            </p>
            <button
              disabled={isCreating}
              onClick={() => {
                onCreateOrder();
              }}
              className="rounded-sm bg-primary p-2 mb-4 text-white max-w-[250px] font-semibold  w-full mt-4 hover:opacity-75"
            >
              {isCreating ? <Loader bg="transparent" /> : "Add Order"}
            </button>
          </div>
        </div>
      </Contentlayout>
      {customerProfile && (
        <CustomerShippingInfoUpdateModal
          key={customerProfile}
          isOpen={customerDetailsModalOpen}
          setIsOpen={setCustomerDetailsModalOpen}
          profile={customerProfile}
          setProfile={setCustomerProfile}
        />
      )}
      <CustomerCreateModal
        isOpen={customerCreateModalOpen}
        setIsOpen={setCustomerCreateModalOpen}
        data={customerUpdateData}
        setData={setCustomerUpdateData}
        fetchData={(v) => {}}
      />
    </>
  );
};

export default Index;
