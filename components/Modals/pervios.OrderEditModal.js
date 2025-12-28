import ProductsSelectInput from "@/components/Coupons/ProductsSelectInput";
import CustomerShippingInfoUpdateModal from "@/components/Modals/Customer/CustomerShippingInfoUpdateModal";
import Loader from "@/shared/Loader/Loader";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { ToastEmitter } from "@/utils/Toast";
import { addressConcat, isValidArray, isValidEmail } from "@/utils/func";
import {
  editOrderApi,
  getAllFreebies,
  getCouponByCode,
  getCustomerProfile,
  getCustomers,
  getCustomersSearch,
  getProducts,
  getShippingSettings,
} from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import _ from "lodash";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import CustomerEditModal from "./Customer/CustomerEditModal";

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
  const [adminProducts, setAdminProducts] = useState([]);

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

  useEffect(() => {
    const editedByAdmins = JSON.parse(
      JSON.stringify(data.editedByAdmins || [])
    );
    const convertedProducts = [];
    for (let obj of editedByAdmins) {
      if (obj.status == "added") {
        console.log("obj", obj);
        const p = getProductObject(obj.product, obj.quantity);
        p.status = obj.status;
        convertedProducts.push(p);
      } else {
        convertedProducts.push({
          product: obj.product,
          quantity: obj.quantity,
          status: obj.status,
        });
      }
    }
    console.log("converted Products", convertedProducts);
    setAdminProducts(convertedProducts);
  }, [data]);

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
    async function fetchShippingOption() {
      try {
        setIsLoading(true);
        const res = await getShippingSettings({ site: data?.site });
        await fetchProducts();
        const option = res.data.data[0];
        if (!option) {
          toast.error("Shipping setting not found.");
        } else {
          setData((o) => ({
            ...o,
            shipping: { ...o.shipping, shippingOptionSetting: option._id },
          }));
          setIsLoading(false);
        }
      } catch (err) {
        console.log("Error:", err);
        toast.error("Please refresh the page.");
      }
    }
    fetchShippingOption();
  }, []);

  function handleDebounceFn(val) {}

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function onChangeDebounce(value) {
    setSearchTerm(value);
    debounceFn(value);
  }

  const updateQuantity = (productId, quantity) => {
    const target = adminProducts.filter(
      (e) => (e.product?._id || e.product) == productId && e.status == "added"
    )[0];
    target.quantity += quantity;
    setAdminProducts(
      adminProducts.filter(
        (e) => (!!e.quantity && e.status == "added") || e.status == "removed"
      )
    );
  };

  const onEditOrder = async () => {
    try {
      const convertedData = adminProducts.map((e) => {
        return {
          product: e.product?._id || e.product,
          quantity: e.quantity,
          status: e.status,
        };
      });
      setIsEditReq(true);
      const res = await editOrderApi({
        orderId: data.orderId,
        products: convertedData,
      });
      if (res.data.success) {
        setData(res.data.data);
        if (fetchOrders) {
          fetchOrders();
        }
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

  /// check if product is removed by admin.
  const isProductRemoved = (id) => {
    return !!adminProducts.filter(
      (e) => e.status == "removed" && id == (e.product?._id || e.product)
    )[0];
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
                <Dialog.Panel className="w-full md:max-w-[60%] transform  rounded-2xl bg-white p-3 md:p-8 text-left align-middle shadow-xl transition-all rounded-md px-4   lg:px-[40px] h-[90%]">
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
                        <div>
                          <label className="text-xl text-slate-500 font-semibold py-2 pt-4">
                            Order Original Products:
                          </label>
                          <div className="flex flex-wrap mb-2 gap-2 mt-4">
                            {isValidArray(data?.products) &&
                              data.products.map((product) => (
                                <div
                                  key={product._id}
                                  className="flex items-center gap-1  shadow-md rounded-md p-2 max-w-[400px] bg-white"
                                  style={{
                                    border: isProductRemoved(
                                      product?.product?._id || product?.product
                                    )
                                      ? "2px solid red"
                                      : "",
                                  }}
                                >
                                  <div className="w-[80px] h-[80px] bg-slate-100 border rounded-md">
                                    <img
                                      src={
                                        ((product?.product?.images || product?.images )?.map((e) => e.imgUrl) ||
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
                                    {isProductRemoved(
                                      product?.product?._id || product?.product
                                    ) ? (
                                      <span className="text-red-500 text-[10px]">
                                        This product has been removed by admin.
                                      </span>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 ms-1">
                                    <div
                                      onClick={() => {
                                        if (
                                          isProductRemoved(
                                            product?.product?._id ||
                                              product?.product
                                          )
                                        ) {
                                          /// remove from removed list.
                                          setAdminProducts(
                                            adminProducts.filter(
                                              (e) =>
                                                !(
                                                  e.status == "removed" &&
                                                  (e.product?._id ||
                                                    e.product) ==
                                                    (product.product?._id ||
                                                      product.product)
                                                )
                                            )
                                          );
                                        } else {
                                          /// add to removed list.
                                          adminProducts.push({
                                            product:
                                              product.product?._id ||
                                              product.product,
                                            status: "removed",
                                          });
                                          setAdminProducts([...adminProducts]);
                                        }
                                      }}
                                      className="border cursor-pointer text-[12px] md:text-md hover:bg-slate-200 shadow-sm rounded-full p-2 md:p-2 py-0"
                                      style={
                                        isProductRemoved(
                                          product?.product?._id ||
                                            product?.product
                                        )
                                          ? {
                                              color: "green",
                                              border: "1px solid green",
                                            }
                                          : {
                                              color: "red",
                                              border: "1px solid red",
                                            }
                                      }
                                    >
                                      {isProductRemoved(
                                        product?.product?._id ||
                                          product?.product
                                      )
                                        ? "Re-Add"
                                        : "Remove"}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xl text-slate-500 font-semibold py-2 pt-4">
                            Admin Added Products:
                          </label>
                          <div className="flex flex-wrap mb-2 gap-2 mt-4">
                            {adminProducts
                              .filter((e) => e.status == "added")
                              .map((product) => (
                                <div
                                  key={product._id}
                                  className="flex items-center gap-1 bg-white shadow-md rounded-md p-2 max-w-[400px]"
                                >
                                  <div className="w-[80px] h-[80px] bg-slate-100 border rounded-md">
                                    <img
                                      src={
                                        (product.images?.map((e) => e.imgUrl) ||
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
                                if (
                                  data.products
                                    .map((e) => e.product?._id || e.product)
                                    .includes(selectedProduct?._id)
                                ) {
                                  toast.error(
                                    "This product already exists in original ordered products list."
                                  );
                                  return;
                                }
                                const product =
                                  searchResultProducts.current.filter(
                                    (e) => e?._id == selectedProduct?._id
                                  )[0];
                                if (product) {
                                  if (
                                    adminProducts.filter(
                                      (p) =>
                                        (p.product?._id || p.product) ==
                                        selectedProduct?._id
                                    )[0]
                                  ) {
                                    updateQuantity(selectedProduct?._id, 1);
                                  } else {
                                    const p = getProductObject(product, 1);
                                    p.status = "added";
                                    setAdminProducts([...adminProducts, p]);
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
