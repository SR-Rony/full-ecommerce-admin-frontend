import ProductsSelectInput from "@/components/Coupons/ProductsSelectInput";
import Loader from "@/shared/Loader/Loader";
import { isValidArray } from "@/utils/func";
import {
  editOrderApi,
  getAllFreebies,
  getCouponByCode,
  getProducts,
  getShippingSettings
} from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import _, { update } from "lodash";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
const getProductQuantity = (cartsProducts, productId) => {
  if (!isValidArray(cartsProducts)) return 1;
  const existingProduct = cartsProducts.find(
    (item) => (item?.product?._id||item.product)?.toString() === productId.toString()
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
    console.log('[DEBUG] enableAllProducts');
    const allProductCouponApplyAmount = dbProducts.reduce((acc, curr) => {
      return (
        acc +
        (parseFloat(curr?.price?.sale) || 0) *
          getProductQuantity(cartsProducts, curr?._id)
      );
    }, 0);

    const finalAmount = applyDiscount(
      allProductCouponApplyAmount,
      couponPercent
    );
    console.log("[DEBUG] couponPercent",couponPercent,"allProductCouponApplyAmount",allProductCouponApplyAmount,"finalAmount",finalAmount);
    const totalCouponProductDiscount =
      allProductCouponApplyAmount - finalAmount;
    return {
      finalAmount: (finalAmount === 0 ? 0 : finalAmount + shippingCost).toFixed(
        2
      ),
      discountedCouponAmount: totalCouponProductDiscount.toFixed(2),
    };
  } else {
    console.log('[DEBUG] enableAllProducts  false, dbProducts',dbProducts);
    const filterMyCartsDiscloseCouponAmount = dbProducts
      .filter(
        (item) =>
          !couponProductsArr.some(
            (coupon) => item?.product._id?.toString() == coupon?.toString()
          )
      )
      .reduce((acc, curr) => {
        return (
          acc +
          (parseFloat(curr?.price?.sale) || 0) *
            getProductQuantity(cartsProducts, curr.product?._id)
        );
      }, 0);
    const totalCouponProductAmount = dbProducts
      .filter((item) =>
        couponProductsArr.some(
          (coupon) => item?.product._id?.toString() == coupon?.toString()
        )
      )
      .reduce((acc, curr) => {
        return (
          acc +
          (curr?.price?.sale || 0) *
            getProductQuantity(cartsProducts, curr?.product._id)
        );
      }, 0);

    console.log("[DEBUG] totalCouponProductAmount ",totalCouponProductAmount,'arr',couponProductsArr);

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

    console.log("[DEBUG] couponPercent",couponPercent,"finalAmount",finalAmount,"shippingCost",shippingCost);

    return {
      finalAmount: finalAmount.toFixed(2),
      discountedCouponAmount: totalCouponProductDiscount.toFixed(2),
    };
  }
}
export default function OrderEditModal({
  isOpen,
  setIsOpen,
  data,
  setData,
  fetchOrders,
}) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const searchResultProducts = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditReq, setIsEditReq] = useState(false);
  let [products,setProducts] = useState([]);
  let [freebies, setFreebies] = useState([]);
  let [freebieProduct, setFreebieProduct] = useState(null);
  let [selectedFreebie, setSelectedFreebie] = useState(null);
  let [couponData, setCouponData] = useState({ code: "" });
  let [shippingOption, setShippingOption] = useState(null);
  const getProductObject = (product, quantity) => {
    return {
      product: product,
      title: product.title,
      quantity: quantity,
      price: product.price,
      totalAmount: parseFloat(product.price.sale) * quantity,
      bundleProducts: product.bundle?.products,
      isBundle: product.bundle?.isLimited,
      subTitle: product.subTitle,
      bundleSize: product.bundle?.size,
      images: product.images,
    };
  };


  const applyCoupon = async (couponCode,force=false)=> {
    if (couponData?._id) {
      setCouponData({ code: "" });
      couponData = { code: "" };
      calculateOrderSummaryAndUpdate(data);
      toast.error("Coupon removed!");
      return;
    }

    if (!products.length) {
      return toast.error("Please select products.");
    }

    if(!couponCode && force) {
      setCouponData({code: ''});
      return;
    }

    try {
      const res = await getCouponByCode({
        code: couponCode || couponData.code,
        cartProducts: products.map((e) => e.product?._id || e.product),
      },force);
      if (res.data.data?._id) {
        setCouponData(res.data.data);
        couponData = res.data.data;
        calculateOrderSummaryAndUpdate(data);
        if(!force) {
          toast.success("Coupon applied!");
        }
      } else {
        if(!force) {
          toast.error(res.data?.message);
        }
      }
    } catch (err) {
      console.log("error", err);
      toast.error(err?.response?.data?.message || err?.message);
      if(force) {
        calculateOrderSummaryAndUpdate(data);
      }
    }
  };

  const fetchProducts = async (q) => {
    setSearchLoading(true);
    const res = await getProducts({
      isSoldOut: false,
      q: q,
      isActive: true,
      site: data.site,
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
    async function init() {
      try {
        setIsLoading(true);
        const res2 = await getAllFreebies();
        setFreebies(res2.data.data);
        freebies = res2.data.data;
        const res = await getShippingSettings({ site: data?.site });
        await fetchProducts();
        const option = res.data.data[0];
        if (!option) {
          toast.error("Shipping setting not found.");
        } else {
          shippingOption = option;
          setShippingOption(option);
          console.log("Shipping option selected to use:",option);
          setData((o) => ({
            ...o,
            shipping: { ...o.shipping, shippingOptionSetting: option._id },
          }));
          setIsLoading(false);
        }

        const p = JSON.parse(
          JSON.stringify(data.products || [])
        );
        console.log("converted Products", p);
        products = p;
        setProducts(p);
        if(p.length) {
          applyCoupon(data?.orderSummary?.coupon?.code,true);
        }

        // set freebie here.
        if(data.freeBuy?.freeBuyId) {
          const selectedFreebieObj = res2.data.data.filter((e)=>e._id == data.freeBuy.freeBuyId)[0];
          selectedFreebie = selectedFreebieObj;
          setSelectedFreebie(selectedFreebieObj);
          freebieProduct = selectedFreebieObj.freeProducts.filter((e)=>e._id == (data.freeBuy.freeBuyProduct.product?._id || data.freeBuy.freeBuyProduct.product))[0];
          console.log("[DEBUG] set freebieProduct",freebieProduct);
          setFreebieProduct(freebieProduct);
        }

      } catch (err) {
        console.log("Error:", err);
        toast.error("Please refresh the page.");
      }
    }
    init();
  }, []);

  function handleDebounceFn(val) { }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function onChangeDebounce(value) {
    setSearchTerm(value);
    debounceFn(value);
  }

  const updateQuantity = (productId, quantity) => {
    const target = products.filter(
      (e) => (e.product?._id || e.product) == productId
    )[0];
    target.quantity += quantity;
    setProducts(
      products.filter(
        (e) => e.quantity
      )
    );
    products = products.filter(
      (e) => e.quantity
    );
    calculateOrderSummaryAndUpdate(data);
  };

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
    o.products = products;
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
      console.log("[DEBUG] products",products);
      const result = calculateTotalAmountWithCouponProducts(
        products,
        products,
        couponData.enableAllProducts
          ? products
            .filter(
              (e) =>{
                console.log(e,"pass");
                return  !couponData.excludeProducts
                .map((p) => p?.toString())
                .includes(e?.product._id?.toString());
              }
               
            )
            .map((e) => e?.product?._id)
          : couponData.products.map((e) => e?._id || e),
        0,
        couponData.value,
        false, //enableAllProducts,
        shippingOption.shippingCountry?.country
      );
      console.log("CouponResult::",result);
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

    setData(o);
  };

  console.log("selected freebie",selectedFreebie);

  const updateQuantityWithProduct = (productId, quantity, productsList) => {
    const validProducts = isValidArray(productsList || products)
      ? productsList || products
      : [];
    
    if (!validProducts.length) {
      return;
    }

    // // Check if the product is removed
    // if (isProductRemoved(productId?._id||productId)) {
    //   toast.error(`Product already ${productId?.title} is removed, no updates applied.`);
    //   return;
    // }
  
    const updatedProducts = validProducts.map((e) => {
      if ((e?.product?._id || e?.product) == (productId?._id || productId)) {
        return {
          ...e,
          quantity: Math.max(1, e.quantity + quantity), // Ensure quantity does not go below 1
        };
      }
      return e; // Return unchanged product if it doesn't match
    });
  
    console.log(updatedProducts, "Updated products list");
  
    // // Update the state or perform further actions
    // setData((o) => ({
    //   ...o,
    //   products: updatedProducts,
    // }));

    products = updatedProducts;
    setProducts(updatedProducts);
    calculateOrderSummaryAndUpdate(data);
  };

  const onEditOrder = async () => {
    try {
      if(selectedFreebie?._id && !freebieProduct?._id) {
        toast.error("Please select freebie!");
        return;
      }
      setIsEditReq(true);
      const res = await editOrderApi({
        orderId: data.orderId,
        products: products,
        orderSummary: {
          "productsSubtotal": data.orderSummary.productsSubtotal,
          "shippingCost": data.orderSummary.shippingCost,
          "totalSaving": data.orderSummary.totalSaving,
          "totalAmount": data.orderSummary.totalAmount,
          "coupon": {
              "coupon": couponData?._id,
              "amount": data.orderSummary.coupon.amount,
              "code": couponData?.code,
          }
        },
        freeBuy: {
          "isFreeBuy": !!freebieProduct?._id,
          "freeBuyId": selectedFreebie?._id,
          "freeBuyProduct": {
              "product": freebieProduct?._id,
              "title": freebieProduct?.title,
              "quantity": 1,
              "price": freebieProduct?.price,
              "subTitle": freebieProduct?.subTitle,
              "bundle": freebieProduct?.bundle,
              "cycle": freebieProduct?.cycle,
          },
          "minimumThreshold": selectedFreebie?.minimumThreshold,
        }
      });
      if (res.data.success) {
        setData(res.data.data);
        if (fetchOrders) {
          fetchOrders();
        }
        toast.success("Order successfully updated!");
        closeModal();
      }
    } catch (err) {
      toast.error(err?.response?.message || err?.message);
    }
    setIsEditReq(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };


  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full md:max-w-[86%] transform  rounded-2xl bg-white p-3 md:p-8 text-left align-middle shadow-xl transition-all rounded-md px-4   lg:px-[40px] h-[90%]">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      <div>
                        <p className="text-2xl font-bold">Edit Order</p>
                      </div>
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>
                  <>
                    <div className="">
                      <hr />
                      <div className="flex flex-col gap-4 mt-4">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xl text-slate-500 font-semibold py-2 pt-4">
                              Order Products:
                            </label>
                            <div className="flex flex-wrap mb-2 gap-2 mt-4">
                              {isValidArray(products) &&
                                products.map((product) => (
                                  <div
                                    key={product._id}
                                    className="flex items-center gap-1  shadow-md rounded-md p-2 max-w-[400px] bg-white"
                                    
                                  >
                                    <div className="w-[80px] h-[80px] bg-slate-100 border rounded-md">
                                      <img
                                        src={
                                          ((product?.product?.images || product?.images)?.map((e) => e.imgUrl) ||
                                            [])[0]
                                        }
                                        alt={"Product image"}
                                        className="w-full h-full rounded-md"
                                      />
                                    </div>
                                    <div className="ms-1">
                                      <p className="text-md font-semibold">
                                        {product.title}
                                      </p>
                                      <p className="text-[12px] font-semibold text-yellow-500">
                                        {product.subTitle}
                                      </p>
                                      <div className="flex items-center">
                                        <p className="text-sm font-semibold text-black">
                                          $
                                          {(
                                            parseFloat(product.price.sale) *
                                            product.quantity
                                          ).toFixed(2)}
                                        </p>
                                        <p className="text-[12px] font-semibold ms-1 text-slate-400 line-through">
                                          $
                                          {(
                                            parseFloat(product.price.regular) *
                                            product.quantity
                                          ).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 ms-1">
                                      <>
                                        <div
                                          onClick={() => {
                                            updateQuantityWithProduct(product.product?._id || product.product, -1,products);
                                          }}
                                          className="border cursor-pointer hover:bg-slate-200 shadow-sm rounded-full p-2 py-0 border-black"
                                        >
                                          -
                                        </div>
                                        {product.quantity}
                                        <div
                                          onClick={() => {
                                            updateQuantityWithProduct(product.product?._id || product.product, 1,products);
                                          }}
                                          className="border cursor-pointer hover:bg-slate-200 shadow-sm rounded-full p-2 py-0 border-black"
                                        >
                                          +
                                        </div>
                                      </>
                                    </div>
                                    <div className="flex items-center gap-2 ms-1">
                                      <div
                                        onClick={() => {
                                          console.log("Products",products);
                                          products = [...products].filter((e)=> (e.product?._id || e.product) != ( product.product?._id || product.product )  );
                                          setProducts(products);
                                          calculateOrderSummaryAndUpdate(data);
                                        }}
                                        className="border cursor-pointer text-[12px] md:text-md hover:bg-slate-200 shadow-sm rounded-full p-2 md:p-2 py-0"
                                        style={
                                          {
                                              color: "red",
                                              border: "1px solid red",
                                            }
                                        }
                                      >
                                        {"Remove"}
                                      </div>

                                    </div>
                                  </div>
                                ))}

                            </div>
                          </div>
                          { isValidArray(data.originalOrder?.products) && <div className="min-w-[230px]">
                            <label className="text-lg text-slate-500 font-semibold py-2 pt-4">
                              Original Order Details:
                            </label>
                            <div>
                              <div className="mb-2 gap-2 mt-4">
                                <p className="text-md font-[600] underline">Products:</p>
                                {isValidArray(data.originalOrder?.products) &&
                                  data.originalOrder?.products.map((product) => (
                                    <div
                                      key={product._id}
                                      className="flex items-center gap-1 py-2 rounded-md max-w-[400px]" 
                                    >
                                      <div className="ms-1">
                                        <p className="text-md font-semibold">
                                        x{product.quantity} {product.title}
                                        </p>
                                      </div>
                                    </div>
                                ))}
                                <p className="text-md underline text-slate-600 mt-2 font-[600]">
                                  Order Summary:
                                </p>
                                <p className="text-md ms-2 mt-2">
                                  <span className="font-semibold">Shipping Cost:</span> $
                                  {data?.originalOrder?.orderSummary?.shippingCost}
                                </p>
                                <p className="text-md ms-2">
                                  <span className="font-semibold">Products Subtotal:</span> $
                                  {data?.originalOrder?.orderSummary?.productsSubtotal}
                                </p>
                                <p className="text-md ms-2">
                                  <span className="font-semibold">Saving from Coupon:</span> $
                                  {data?.originalOrder?.orderSummary?.coupon?.amount}
                                </p>
                                <p className="text-md ms-2 mb-1">
                                  <span className="font-semibold">Total Saving:</span> $
                                  {data?.originalOrder?.orderSummary?.totalSaving}
                                </p>
                                <hr />
                                <p className="text-md font-semibold mt-2 ms-2">
                                  Total: ${data?.originalOrder?.orderSummary?.totalAmount}
                                </p>
                              </div>
                            </div>
                          </div>}
                        </div>

                        <div>
                          <p className="text-lg text-slate-500 mb-2 mt-4">
                            Add new product
                          </p>
                          <div className="flex w-full md:w-[400px]">
                            <div className="flex-1 w-[250px]">
                              <ProductsSelectInput
                                keys="selectedFreeBuyProductOptions"
                                searchOptions={searchResults || []}
                                isSingleProduct={true}
                                selectedOptions={[selectedProduct].filter(
                                  (e) => e
                                )}
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
                                  if (data?.products?.some((e) => (e.product?._id || e.product)==selectedProduct?._id)
                                ) {

                                  console.log(selectedProduct?._id,"selectedProduct");
                                  updateQuantityWithProduct(selectedProduct?._id, 1,data?.products);

                                return;
                                }
                                  const product =
                                  searchResultProducts.current.filter(
                                    (e) => e?._id == selectedProduct?._id
                                  )[0];
                                if (product) {
                                  if (
                                    products.filter(
                                      (p) =>
                                        (p.product?._id || p.product) ==
                                        selectedProduct?._id
                                    )[0]
                                  ) {
                                    updateQuantity(selectedProduct?._id, 1,data?.products);
                                  } else {
                                    const p = getProductObject(product, 1);
                                    products = [...products,p];
                                    setProducts(products);
                                    calculateOrderSummaryAndUpdate(data);
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
                              applyCoupon(null);
                            }}
                            className="p-2 font-semibold text-white bg-black"
                          >
                            {couponData?._id ? "Remove" : "Apply"}
                          </button>
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
                                    calculateOrderSummaryAndUpdate(data);
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
                          {data?.orderSummary?.shippingCost}
                        </p>
                        <p className="text-md">
                          <span className="font-semibold">Products Subtotal:</span> $
                          {data?.orderSummary?.productsSubtotal}
                        </p>
                        <p className="text-md">
                          <span className="font-semibold">Saving from Coupon:</span> $
                          {data?.orderSummary?.coupon?.amount}
                        </p>
                        <p className="text-md">
                          <span className="font-semibold">Total Saving:</span> $
                          {data?.orderSummary?.totalSaving}
                        </p>
                        <hr />
                        <p className="text-lg font-semibold">
                          Total: ${data?.orderSummary?.totalAmount}
                        </p>
                        <button
                          disabled={isEditReq}
                          onClick={() => {
                            onEditOrder();
                          }}
                          className="rounded-sm bg-black p-2 mb-4 text-white max-w-[250px] font-semibold w-full mt-4 hover:opacity-75"
                        >
                          {isEditReq ? (
                            <Loader bg="transparent" />
                          ) : (
                            "Update Order"
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
