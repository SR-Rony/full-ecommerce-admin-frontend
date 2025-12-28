import ColorPicker from "@/components/ColorPicker/colorPicker";
import { customColors } from "@/components/ColorPicker/customColor";
import ProductsSelectInput from "@/components/Coupons/ProductsSelectInput";
import MultipleCustomerSelect from "@/components/Customers/MuiltipleCustomerSelect";
import CategoriesSelect from "@/components/Products/CategoriesSelect";
import CountrySelector from "@/components/Products/CountrySelector";
import KeywordSelectInput from "@/components/Products/KeywordSelectInput";
import ProductIncludes from "@/components/Products/ProductIncludes";
import ProductSelectInput from "@/components/Products/ProductSelectInput";
import SelectCycleGroup from "@/components/Products/SelectCycleGroup";
import Switch from "@/components/Products/Switch";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import { genSlug, isValidArray, productDataBySumRegular, productDataBySumSale } from "@/utils/func";
import {
  getProductCategories,
  getProducts,
  getProductsSlugCheck,
  getShippingCountriesApi,
  updateProduct,
} from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import _ from "lodash";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import Swal from "sweetalert2";
import ProductImageUpload from "../../Products/ProductImageUpload";

export default function ProductEditModal({
  isOpen,
  setIsOpen,
  setProductData,
  productData,
  type,
}) {
  const { Product, Countries } = useFullStage();
  const [isRequestProduct, setIsRequestProduct] = useState(false);
  const [initPaginate, setInitPaginate] = useState(false);
  const [products, setProducts] = Product.Products;
  const [singleProductDetails, setSingleProductDetails] =
    Product.ProductSingleDetails;
  const [productPage, setProductPage, productLimit, setProductLimit] =
    Product.ProductPaginate;
  const [isSlugRequest, setIsSlugRequest] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const [countries, setCountries] = Countries.Countries;
  const [defaultCountriesData, setDefaultCountriesData] =
    Countries.DefaultCountriesData;
  const [customerSearch, setCustomerSearch] = useState("");
  const fetchProductCategories = async () => {
    try {
      const res = await getProductCategories();
      if (Array.isArray(res?.data?.data) && res.data?.data.length > 0) {
        const catItems = res.data?.data.map((itm) => {
          return {
            id: itm?._id,
            label: itm?.name,
            value: itm?.slug,
          };
        });
        setCategories(catItems);
      }
    } catch (error) {
      /* empty */
    }
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const changeHandler = (key, e) => {
    if (e.target.value == "hb" || e.target.value == "auctropin") {
      setProductData({ ...productData, site: e.target.value });
      fetchProducts({ site: e.target.value, q: productData?.q || "" });
    } else {
      if (key == "title") {
        setProductData({
          ...productData,
          [key]: e.target.value,
          slug: genSlug(e.target.value),
        });
      } else {
        setProductData({ ...productData, [key]: e.target.value });
      }
    }
  };

  const onChangeColorHandler = (keys, value) => {
    setProductData({
      ...productData,
      [keys]: value.hex,
    });
  };

  const changeHandlerBoolean = (key, e) => {
    if (key == "isGeneral") {
      setProductData((prev) => {
        const update = {
          ...productData,
          isGeneral: e.target.checked,
          ["cycle.isCycle"]: false,
          ["bundle.isLimited"]: false,
        };
        return {
          ...prev,
          ...update,
        };
      });
    } else if (key == "cycle.isCycle") {
      setProductData((prev) => {
        const update = {
          ...productData,
          isGeneral: false,
          ["cycle.isCycle"]: e.target.checked,
          ["bundle.isLimited"]: false,
        };
        return {
          ...prev,
          ...update,
        };
      });
    } else if (key == "bundle.isLimited") {
      setProductData((prev) => {
        const update = {
          ...productData,
          isGeneral: false,
          ["cycle.isCycle"]: false,
          ["bundle.isLimited"]: e.target.checked,
        };
        return {
          ...prev,
          ...update,
        };
      });
    } else {
      setProductData({ ...productData, [key]: e.target.checked });
    }
  };

  const HandleCategoriesSelect = (selectedOptions) => {
    if (selectedOptions.length) {
      setProductData((prev) => {
        return {
          ...prev,
          selectedCategories: selectedOptions,
        };
      });
    } else {
      setProductData((prev) => {
        return {
          ...prev,
          selectedCategories: [],
        };
      });
    }
  };
  const handleProductIncludesAdd = () => {
    scrollToBottom();
    const newItem = { name: "", quantity: 1, dosage: "", selectIncludeProduct: { label: "", value: "", site: productData?.site || "", price: { regular: 0, sale: 0 } } };
    setProductData((prev) => {
      const copy = prev.hasOwnProperty("details.includes")
        ? [...(prev["details.includes"] || prev?.details?.includes), newItem]
        : [newItem];
      return {
        ...prev,
        ["details.includes"]: copy,
      };
    });
  };

  const EndRef = useRef(null);
  const scrollToBottom = () => {
    EndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function handleDebounceFn(inputValue) {
    setIsSlugRequest(true);
    getProductsSlugCheck(inputValue)
      .then((res) => {
        if (res?.data?.success) {
          ToastEmitter("success", res?.data.message);
        } else {
          ToastEmitter("error", res?.data.message);
        }
        setIsSlugRequest(false);
      })
      .catch((err) => {
        setIsSlugRequest(false);
        ToastEmitter("error", err.response?.data?.message);
      });
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function handleSlugCheck() {
    if (singleProductDetails?.slug == productData?.slug)
      return ToastEmitter("success", "great choice slug is available!");
    handleDebounceFn(productData?.slug);
  }

  const handleUpdateProduct = async () => {
    let data = {
      ...productData,
    };
    // if (data?.availability?.isInternational === false) {
    //   if (!data?.availability?.countries?.length) {
    //     return ToastEmitter("error", "Please select a availability country!");
    //   }

    // }

    if (_.get(data, 'cycle.isCycle') === true) {

      data['price.regular'] = productDataBySumRegular(data['details.includes'], data?.site);
      data['price.sale'] = productDataBySumSale(data['details.includes'], data?.site);
    }
    if (_.get(data, 'restrictOptions.isRestricted') === true) {
      const customerIds =_.get(data, 'restrictOptions.customers')||[]
        data['restrictOptions.customers'] = Array.isArray(customerIds) && customerIds.length > 0 ?customerIds.map(item => item?.value) : [];
    } else {
      data['restrictOptions.customers'] = [];
    }
    if (isValidArray(data?.availability?.countries)) {
      const availability = data?.availability || {};
      const countriesArr = availability.countries.map(
        (item) => item?._id || item?.id
      );
      data = {
        ...data,
        availability: {
          ...availability,
          countries: countriesArr,
        },
      };
    }

    if (isValidArray(data?.selectedCategories)) {
      data["categories"] = data?.selectedCategories.map(
        (item) => item?._id || item?.id
      );
    } else {
      data["categories"] = [];
    }
    if (isValidArray(data?.selectedBundleProducts)) {
      data["bundle.products"] = data?.selectedBundleProducts.map(
        (item) => item?._id || item?.id
      );
    } else {
      data["bundle.products"] = [];
    }
    setIsRequestProduct(true);
    await updateProduct({ data, slug: singleProductDetails?.slug })
      .then((res) => {
        if (res?.data?.success) {
          setProductData(res?.data?.data);
          setSingleProductDetails(res?.data?.data);
          if (Array.isArray(products?.data) && products?.data.length) {
            setProducts((prev) => {
              return {
                ...prev,
                data: prev.data.map((item) => {
                  if (res?.data?.data?._id == item?._id) {
                    return res?.data?.data;
                  } else {
                    return item;
                  }
                }),
              };
            });
          }
          Swal.fire({
            title: "Success",
            text: res.data?.message,
            icon: "success",
          });
          closeModal();
        } else {
          Swal.fire({
            title: "Error!",
            text: res.data?.message,
            icon: "error",
          });
        }
        setIsRequestProduct(false);
      })
      .catch((err) => {
        setIsRequestProduct(false);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message,
          icon: "error",
        });
      });
  };
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

  const fetchCountries = async () => {
    try {
      const res = await getShippingCountriesApi({ isActive: true });

      // console.log(res.data.data,'shipping?.countries');
      if (isValidArray(res?.data?.data)) {
        const modifiedData = res.data.data.map((item) => {
          return {
            _id: item?._id,
            ...item.country,
          };
        });

        const defaultCountriesData = res.data.data.find((item) => {
          // console.log(item);
          if (item?.country?.value == "US") {
            return item;
          }
        });
        setDefaultCountriesData(defaultCountriesData);
        setCountries([...modifiedData]);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    if (!countries?.length) {
      fetchCountries();
    }
  }, []);

  const countrySelectOnChange = (value) => {
    const availability = productData?.availability || {};

    setProductData((prevData) => ({
      ...prevData,
      ["shippingCountry"]: value,
      availability: {
        ...availability,
        countries: isValidArray(value) ? value : [],
      },
    }));
  };

  const changeHandlerProductAvailabilityBoolean = (keys, e) => {
    const availability = productData?.availability || {};

    setProductData({
      ...productData,
      shippingCountry: e.target.checked
        ? defaultCountriesData?.country
        : productData?.shippingCountry || [],
      availability: {
        ...availability,
        isInternational: e.target.checked,
        countries: e.target.checked
          ? [defaultCountriesData]
          : availability?.countries || [],
      },
    });
  };

  const fetchProducts = async (val = {}) => {
    try {
      const res = await getProducts({
        // isSoldOut: false,
        isExcludeBundle: true,
        isActive: true,
        ...val,
        site: { value: val?.site || "" },
      });

      if (res?.data?.success) {
        const searchBundleProducts = isValidArray(res?.data?.data)
          ? res.data.data
            .filter((e) => e.bundle?.isLimited == false)
            .map((item) => {
              return {
                _id: item?._id,
                value: item?._id,
                label: item?.title,
                site: item?.site || "",
                bundle: item?.bundle
              };
            })
          : [];

        setProductData((prev) => {
          console.log(prev);
          return {
            ...prev,
            searchBundleProducts: searchBundleProducts,
            selectedBundleProducts: isValidArray(prev?.selectedBundleProducts)
              ? prev?.selectedBundleProducts.filter(
                (item) => item?.site == val?.site
              )
              : [],
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  function handleDebounceSearchProductsFn(val, site) {
    if (productData["bundle.isLimited"] == true) {
      fetchProducts({
        q: val, site: site || "",
        isExcludeBundle: true,
        isActive: true
      });
    } else {
      fetchProducts({ q: val, site: site || "" });
    }
  }

  const debounceSearchProductsFn = useCallback(
    _.debounce(handleDebounceSearchProductsFn, 1000),
    []
  );

  function onChangeSearchProductsDebounce(value) {
    setProductData((prev = {}) => {
      return {
        ...prev,
        q: value,
      };
    });
    // console.log(productData.site,'productData.site');
    debounceSearchProductsFn(value, productData.site || "");
  }
  const selectProductOptions = (keys, value) => {
    setProductData({ ...productData, [keys]: value });
  };

  let optionsBundle = isValidArray(productData?.searchBundleProducts) ? productData?.searchBundleProducts.filter((item) => {
    return item?.bundle?.isLimited == false && productData?.site == item?.site;
  }) : [];
  // console.log(optionsBundle,'productData?.searchBundleProducts');
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => closeModal()}>
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
                <Dialog.Panel className="w-full transform overflow-y-auto pb-6  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all rounded-md ">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Product {type}
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => closeModal()}
                      />
                    </button>
                  </div>

                  <div className="mt-2">
                    {/* title and slug */}
                    <div className="md:flex items-center gap-2">
                      <div className="mt-2 w-full md:w-[50%]">
                        <label
                          htmlFor="title"
                          className="block text-sm mb-2 dark:text-white capitalize"
                        >
                          {" "}
                          Title*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="title"
                            onChange={(e) => changeHandler("title", e)}
                            value={productData?.title || ""}
                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-2  w-full md:w-[50%] flex gap-2 items-center">
                        <div className=" w-[70%]">
                          <label
                            htmlFor="slug"
                            className="block text-sm mb-2 dark:text-white capitalize"
                          >
                            {" "}
                            Slug*
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="slug"
                              onChange={(e) => changeHandler("slug", e)}
                              value={productData?.slug || ""}
                              className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required
                            />
                          </div>
                        </div>
                        <div className="w-[30%]">
                          {isSlugRequest ? (
                            <button className="block bg-blue-400 text-white rounded-sm text-center w-full h-full py-2 mt-7 cursor-not-allowed">
                              <Loader
                                width="w-5"
                                height="h-5"
                                bg="transparent"
                              />
                            </button>
                          ) : (
                            <button
                              className="block bg-blue-400 text-white rounded-sm text-center w-full h-full py-2 mt-7"
                              onClick={() => handleSlugCheck()}
                            >
                              Check
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mt-2 w-full md:w-[100%]">
                        <label
                          htmlFor="categories"
                          className="block text-sm mb-2 dark:text-white capitalize"
                        >
                          Select Categories
                        </label>
                        <div className="relative">
                          <CategoriesSelect
                            options={categories}
                            defaultOptions={
                              productData?.selectedCategories || []
                            }
                            onChange={HandleCategoriesSelect}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div>
                        <div>
                          <div className="mt-6">
                            <h2 className="text-[16px] capitalize font-bold">
                              Site
                            </h2>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex ml-3">
                            <div className="flex items-center me-4">
                              <input
                                id="hammer-radio"
                                checked={productData?.site == "hb"}
                                type="radio"
                                value="hb"
                                name="inline-radio-group"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                onChange={(e) => {
                                  changeHandler("site", e);
                                }}
                              />
                              <label
                                htmlFor="hammer-radio"
                                className="ms-2 text-sm font-medium text-gray-900"
                              >
                                Hammer & Bell
                              </label>
                            </div>

                            <div className="flex items-center me-4">
                              <input
                                checked={productData?.site == "auctropin"}
                                id="auctropin-radio"
                                type="radio"
                                value="auctropin"
                                name="inline-radio-group"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                onChange={(e) => {
                                  changeHandler("site", e);
                                }}
                              />
                              <label
                                htmlFor="auctropin-radio"
                                className="ms-2 text-sm font-medium text-gray-900"
                              >
                                Auctropin
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">
                          Product Type
                        </h2>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {/* checked, onChange, key */}
                        <div className="flex items-center gap-4">
                          <Switch
                            keys="isGeneral"
                            name="isGeneral"
                            onChange={changeHandlerBoolean}
                            defaultChecked={productData["isGeneral"]}
                            disabled={productData["isGeneral"]}
                            checked={productData["isGeneral"]}
                          >
                            {" "}
                          </Switch>
                        </div>

                        <div className="flex items-center gap-4">
                          <Switch
                            keys="bundle.isLimited"
                            name="isBundle"
                            disabled={productData["bundle.isLimited"]}
                            onChange={changeHandlerBoolean}
                            defaultChecked={productData["bundle.isLimited"]}
                            checked={productData["bundle.isLimited"]}
                          >
                            {" "}
                          </Switch>
                        </div>

                        <div>
                          <Switch
                            keys="cycle.isCycle"
                            name="isCycle"
                            onChange={changeHandlerBoolean}
                            disabled={productData["cycle.isCycle"]}
                            defaultChecked={productData["cycle.isCycle"]}
                            checked={productData["cycle.isCycle"]}
                          >
                            {" "}
                          </Switch>
                        </div>
                      </div>
                    </div>

                    {productData["bundle.isLimited"] &&
                      !productData["isGeneral"] &&
                      !productData["cycle.isCycle"] && (
                        <>
                          {/* subtitle  */}
                          <div className="mt-4 flex gap-2  flex-col md:flex-row    items-center">
                            <div className="w-full md:w-[70%]">
                              <label
                                htmlFor="subTitle"
                                className="block text-sm  dark:text-white capitalize "
                              >
                                Sub Title
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="subTitle"
                                  placeholder="Ex: 3 COUNT MEGA BUNDLE"
                                  onChange={(e) => changeHandler("subTitle", e)}
                                  value={productData?.subTitle || ""}
                                  className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70 placeholder-gray-300"
                                  required
                                />
                              </div>
                            </div>
                            <div className="w-full md:w-[30%]">
                              <p
                                htmlFor="size"
                                className="text-sm  dark:text-white capitalize"
                              >
                                Bundle Size
                              </p>

                              <input
                                className="w-full rounded-sm placeholder-gray-300"
                                onChange={(e) =>
                                  changeHandler("bundle.size", e)
                                }
                                defaultValue=""
                                min={1}
                                value={productData["bundle.size"] || ""}
                                type="number"
                                placeholder="Ex: 3"
                              />
                            </div>
                          </div>

                          <div className="w-full h-full mt-6">
                            <label
                              htmlFor="categories"
                              className="block text-sm mb-2 dark:text-white capitalize"
                            >
                              Select Product for Bundle
                            </label>
                            <ProductsSelectInput
                              isSingleProduct={true}
                              keys="selectedBundleProducts"
                              inputValue={productData?.q || ""}
                              searchOptions={
                                optionsBundle
                              }
                              selectedOptions={
                                Array.isArray(
                                  productData?.selectedBundleProducts || []
                                )
                                  ? productData?.selectedBundleProducts || []
                                  : [
                                    productData?.selectedBundleProducts || [],
                                  ].filter((item) => {
                                    return item?.bundle?.isLimited == false && productData?.site == item?.site;
                                  })
                              }
                              onChange={(keys, e) => {
                                // console.log("ONCHANGE::", keys, e);
                                if (Array.isArray(e)) {
                                  selectProductOptions(keys, e);
                                } else {
                                  selectProductOptions(keys, [e]);
                                }
                              }}
                              onInputChange={onChangeSearchProductsDebounce}
                            />
                          </div>
                        </>
                      )}
                    {productData["cycle.isCycle"] &&
                      !productData["isGeneral"] &&
                      !productData["bundle.isLimited"] && (
                        <>
                          {/* subtitle  */}
                          <div className="mt-4 flex gap-2  flex-col md:flex-row    items-center">
                            <div className="w-full md:w-[100%]">
                              <label
                                htmlFor="subTitle"
                                className="block text-sm  dark:text-white capitalize "
                              >
                                Sub Title
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="subTitle"
                                  placeholder="Ex: Cycle Sub Title"
                                  onChange={(e) => changeHandler("subTitle", e)}
                                  value={productData?.subTitle || ""}
                                  className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70 placeholder-gray-300"

                                />
                              </div>
                            </div>

                          </div>
                        </>
                      )}

                    {/* details */}
                    {/* description */}

                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">
                          details
                        </h2>
                      </div>
                      <div className="mt-4">
                        <div className="mt-2">
                          <label
                            htmlFor="description"
                            className="block text-sm mb-2 dark:text-white capitalize"
                          >
                            Description*
                          </label>
                          <div className="relative">
                            <textarea
                              type="text"
                              defaultValue={
                                productData?.details?.description || ""
                              }
                              name="description"
                              onChange={(e) =>
                                changeHandler("details.description", e)
                              }
                              value={productData["details.description"]}
                              className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70 h-[200px]"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="md:flex items-center gap-2 mt-4">
                        {!productData["cycle.isCycle"] && (
                          <div className="mt-2 w-full md:w-[50%]">
                            <label
                              htmlFor="dose"
                              className="block text-sm mb-2 dark:text-white capitalize"
                            >
                              dose
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="dose"
                                onChange={(e) =>
                                  changeHandler("details.dose", e)
                                }
                                value={productData["details.dose"]}
                                className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                required
                              />
                            </div>
                          </div>
                        )}
                        {!productData["cycle.isCycle"] && (
                          <div
                            className={`mt-2 w-full md:${productData["bundle.isLimited"] ||
                              productData["isGeneral"]
                              ? "w-[50%]"
                              : "w-full"
                              }`}
                          >
                            <label
                              htmlFor="effectiveTime"
                              className="block text-sm mb-2 dark:text-white capitalize"
                            >
                              effective Time
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="effectiveTime"
                                onChange={(e) =>
                                  changeHandler("details.effectiveTime", e)
                                }
                                value={productData["details.effectiveTime"]}
                                className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/*comprisedOf  */}

                    <div className="mt-4  w-full md:w-[100%]">
                      <label
                        htmlFor="comprisedOf"
                        className="block text-sm mb-2 dark:text-white capitalize"
                      >
                        Comprised Of
                      </label>
                      <div className="relative">
                        <ProductSelectInput
                          placeholder="Write Comprised Of..."
                          keys={"comprisedOf"}
                          value={
                            productData["comprisedOf"] ||
                            productData?.comprisedOf ||
                            []
                          }
                          setProductData={setProductData}
                        />
                      </div>
                    </div>

                    {/* benefits */}
                    {false && productData["bundle.isLimited"] && (
                      <div className="mt-4">
                        <div className="mt-2 w-full md:w-[100%]">
                          <label
                            htmlFor="benefits"
                            className="block text-sm mb-2 dark:text-white capitalize"
                          >
                            Benefits
                          </label>
                          <div className="relative">
                            <ProductSelectInput
                              keys={"details.benefits"}
                              value={
                                productData["details.benefits"] ||
                                productData?.details?.benefits ||
                                []
                              }
                              setProductData={setProductData}
                              placeholder="Benefits"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {productData["cycle.isCycle"] && (
                      <>
                        <div className="mt-4 w-full border p-4 rounded-sm">
                          <div className="flex justify-between">
                            <label
                              htmlFor="details.includes"
                              className="block text-sm mb-2 capitalize"
                            >
                              Product includes
                            </label>
                            <button
                              className="cursor-pointer "
                              onClick={() => handleProductIncludesAdd()}
                            >
                              <IoAdd size={18} color="black" />
                            </button>
                          </div>
                          <div className="relative py-2">
                            <ProductIncludes
                              productData={productData}
                              setProductData={setProductData}
                              EndRef={EndRef}
                            />
                          </div>
                        </div>
                        <div className="mt-4 w-full md:w-[100%]">
                          <label
                            htmlFor="details.cycleLength"
                            className="block text-sm mb-2 dark:text-white capitalize"
                          >
                            Product cycleLength
                          </label>
                          <div className="relative">
                            <textarea
                              type="text"
                              name="details.cycleLength"
                              onChange={(e) =>
                                changeHandler("details.cycleLength", e)
                              }
                              value={productData["details.cycleLength"]}
                              className="resize-none	py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-4 w-full md:w-[100%]">
                          <label
                            htmlFor="details.cycleLength"
                            className="block text-sm mb-2 dark:text-white capitalize"
                          >
                            Select Cycle Group
                          </label>
                          <div className="relative">
                            <SelectCycleGroup productData={productData} setProductData={setProductData} />
                          </div>
                        </div>
                      </>
                    )}
                    {/*  */}
                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">
                          Price
                        </h2>
                      </div>
                      {
                        (productData['cycle.isCycle']) === true ? <div className="md:flex items-center gap-2 mt-4">
                          <div className="mt-2  w-full md:w-[50%]">
                            <label
                              htmlFor="regularPrice"
                              className="block text-sm mb-2 dark:text-white capitalize"
                            >
                              Regular Price*
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                name="price.regular"
                                disabled={true}
                                // onChange={(e) =>
                                //   changeHandler("price.regular", e)
                                // }
                                value={
                                  productDataBySumRegular(productData['details.includes'], productData?.site)
                                }
                                className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                required
                              />
                            </div>
                          </div>
                          <div className="mt-2  w-full md:w-[50%]">
                            <label
                              htmlFor="salePrice"
                              className="block text-sm mb-2 dark:text-white capitalize"
                            >
                              Sale Price*
                            </label>
                            <div className="relative">

                              <input
                                type="number"
                                min={0}
                                name="price.sale"
                                disabled={true}
                                // onChange={(e) => changeHandler("price.sale", e)}
                                value={productDataBySumSale(productData['details.includes'], productData?.site)}
                                className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                required
                              />
                            </div>
                          </div>
                        </div> : <div className="md:flex items-center gap-2 mt-4">
                          <div className="mt-2  w-full md:w-[50%]">
                            <label
                              htmlFor="regularPrice"
                              className="block text-sm mb-2 dark:text-white capitalize"
                            >
                              Regular Price*
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                name="price.regular"
                                onChange={(e) =>
                                  changeHandler("price.regular", e)
                                }
                                value={productData["price.regular"]}
                                className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                required
                              />
                            </div>
                          </div>
                          <div className="mt-2  w-full md:w-[50%]">
                            <label
                              htmlFor="salePrice"
                              className="block text-sm mb-2 dark:text-white capitalize"
                            >
                              Sale Price*
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                name="price.sale"
                                onChange={(e) => changeHandler("price.sale", e)}
                                value={productData["price.sale"]}
                                className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">
                          SEO
                        </h2>
                      </div>
                      {/* keywords */}
                      <div className=" mt-4">
                        <div className="mt-2  w-full md:w-[100%]">
                          <label
                            htmlFor="seo.keywords"
                            className="block text-sm mb-2 dark:text-white capitalize"
                          >
                            Keywords (comma separated)
                          </label>
                          <div className="relative">
                            <KeywordSelectInput
                              placeholder="Write seo keywords"
                              keys={"seo.keywords"}
                              value={
                                productData["seo.keywords"] ||
                                productData?.seo?.keywords ||
                                []
                              }
                              setProductData={setProductData}
                            />
                          </div>
                        </div>
                        <div className="mt-4  w-full md:w-[100%]">
                          <label
                            htmlFor="seo.metaDescription"
                            className="block text-sm mb-2 dark:text-white capitalize"
                          >
                            Meta Description
                          </label>
                          <div className="relative">
                            <textarea
                              defaultValue={
                                productData?.seo?.metaDescription || ""
                              }
                              type="text"
                              name="seo.metaDescription"
                              onChange={(e) =>
                                changeHandler("seo.metaDescription", e)
                              }
                              value={productData["seo.metaDescription"]}
                              className="py-2 px-3 block h-[100px] w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* images */}
                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">
                          Images
                        </h2>
                      </div>
                      <div className="div my-3">
                        <ProductImageUpload
                          handleFileSave={handleFileSave}
                          productData={productData}
                          setProductData={setProductData}
                        />
                      </div>
                    </div>
                    {/* {type === 'edit' && <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">Images</h2>
                      </div>
                      <div className="div my-3">
                        <ProductImageUpload handleFileSave={handleUpdate} productData={productData} setProductData={setProductData} />
                      </div>
                    </div>} */}
                    {/* product functionality */}

                    <div>
                      <div>
                        <div className="mt-6">
                          <h2 className="text-[16px] capitalize font-bold">
                            Product Action
                          </h2>
                        </div>
                      </div>
                      {/* product functionality */}

                      <div className="mt-4">
                        <div>
                          <Switch
                            keys="isActive"
                            defaultChecked={productData?.isActive}
                            name={`Active`}
                            onChange={changeHandlerBoolean}
                            checked={productData?.isActive}
                          >
                            {" "}
                          </Switch>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-4 mt-4">
                          <Switch
                            keys="isSoldOut"
                            name="isSoldOut"
                            onChange={changeHandlerBoolean}
                            defaultChecked={productData?.isSoldOut}
                            checked={productData?.isSoldOut}
                          >
                            {" "}
                          </Switch>
                        </div>

                        <div className="w-[100%] my-4 !hidden">
                          <p className="py-2 font-bold ">
                            Is International Product?
                          </p>

                          <Switch
                            keys="isInternational"
                            name="Is International"
                            onChange={changeHandlerProductAvailabilityBoolean}
                            defaultChecked={
                              productData?.availability?.isInternational
                            }
                            checked={productData?.availability?.isInternational}
                          >
                            {" "}
                          </Switch>

                          {!productData?.availability?.isInternational && (
                            <div className="my-4">
                              <CountrySelector
                                onChange={countrySelectOnChange}
                                selectedOptions={
                                  productData?.shippingCountry || ""
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <Switch
                            keys="featured.on"
                            name="isFeatured"
                            onChange={changeHandlerBoolean}
                            defaultChecked={productData["featured.on"]}
                            checked={productData["featured.on"]}
                          >
                            {" "}
                          </Switch>
                          {productData["featured.on"] && (
                            <div className="flex gap-2 items-center">
                              <span>Priority</span>
                              <input
                                className="w-[70px] rounded-sm text-center"
                                onChange={(e) =>
                                  changeHandler("featured.priority", e)
                                }
                                type="number"
                                min={0}
                                defaultValue={
                                  productData["featured.priority"] || 0
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div>
                          <Switch
                            keys="showAsNewProduct"
                            defaultChecked={productData?.showAsNewProduct}
                            name={`showAsNewProduct`}
                            onChange={changeHandlerBoolean}
                            checked={productData?.showAsNewProduct}
                          >
                            {" "}
                          </Switch>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div>
                          <Switch
                            keys="hasWarningFlag"
                            defaultChecked={productData?.hasWarningFlag}
                            name={`hasWarningFlag`}
                            onChange={changeHandlerBoolean}
                            checked={productData?.hasWarningFlag}
                          >
                            {" "}
                          </Switch>
                        </div>
                      </div>
                      {productData?.hasWarningFlag && (
                        <>
                          <div className="mt-2 pl-3">
                            <div>
                              <span>Warning Text: (max: 160 characters)</span>
                              <br />
                              <input
                                className="w-full rounded-sm"
                                onChange={(e) =>
                                  changeHandler("warningText", e)
                                }
                                type="text"
                                maxLength={160}
                                value={productData?.warningText || ""}
                              />
                            </div>
                          </div>
                          <div className="mt-2 pl-3 flex gap-2">
                            <div>
                              <span>Warning Text Color:</span>
                              <br />
                              <ColorPicker
                                color={productData?.warningTextColor || ""}
                                handleChange={onChangeColorHandler}
                                keys="warningTextColor"
                              />
                            </div>
                            <div>
                              <span>Warning Background Color:</span>
                              <br />
                              <ColorPicker
                                color={productData?.warningBgColor || ""}
                                handleChange={onChangeColorHandler}
                                keys="warningBgColor"
                              />
                            </div>
                            <div>
                              <span>Warning Icon Color:</span>
                              <br />
                              <ColorPicker
                                color={productData?.warningIconColor || ""}
                                handleChange={onChangeColorHandler}
                                keys="warningIconColor"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {productData?.site == 'auctropin' &&
                        <div className="mt-4">

                          <div>
                            <p className="mt-8 mb-4 text-[16px] capitalize font-bold">Product Variations</p>
                            <div className="flex flex-wrap">
                              {
                                customColors.map((color, i) => (
                                  <div key={i} style={{
                                    background: color.color,
                                    color: "white",
                                    margin: "0px 10px",
                                    padding: "6px 12px",
                                    borderRadius: "5px",

                                    border: `${color.color == productData?.productVariations?.color ? "4px solid orange" : "4px solid transparent"}`,

                                  }}
                                    onClick={() => {

                                      setProductData((prev) => {
                                        const productVariations = prev?.productVariations || {};
                                        return {
                                          ...prev,
                                          "productVariations": {
                                            ...productVariations,
                                            color: color.color
                                          }
                                        };
                                      });
                                    }}

                                    className="cursor-pointer"
                                  >
                                    {color.color}
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>}

                    </div>
                  </div>

                  <div>
                    <div>
                      <div className="mt-6">
                        <h2 className="text-[16px] capitalize font-bold">
                          Product Restrictions
                        </h2>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div>
                        <Switch
                          keys="restrictOptions.isRestricted"
                          defaultChecked={productData?.["restrictOptions.isRestricted"]}
                          name={`Enable Restrictions`}
                          onChange={changeHandlerBoolean}
                          checked={productData?.["restrictOptions.isRestricted"]}
                        >
                          {" "}
                        </Switch>
                      </div>
                    </div>

                    {productData?.["restrictOptions.isRestricted"] && <div className="mt-4">

                    <MultipleCustomerSelect
                      existingCustomerIds={_.get(productData, 'restrictOptions.customers')}
                      onChange={(value) => {

                        // console.log(value, "value");
                        setProductData((prev) => ({
                          ...prev,
                          restrictOptions: {
                            ...(prev?.restrictOptions || {}),
                            customers: value
                          }
                        }));
                      }}
                    />

                  </div>}
                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 w-[80px focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    {isRequestProduct ? (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"
                      >
                        <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                        onClick={async () => {
                          await handleUpdateProduct();
                        }}
                      >
                        Update
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
