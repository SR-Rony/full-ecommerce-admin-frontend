import Switch from "@/components/Admins/Switch";
import ProductsSelectInput from "@/components/Coupons/ProductsSelectInput";
import OrderSiteStatus from "@/components/Shared/OrderSiteStatus";
import Loader from "@/shared/Loader/Loader";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { isValidArray } from "@/utils/func";
import {
  createFreeBuy,
  getAllFreebies,
  getFreeBuy,
  getProducts,
  updateFreeBuy,
} from "@/utils/instance";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";

const Index = () => {
  const [freebieOpenData, setFreebieOpenData] = useState({});
  const [query, setQuery] = useState({
    site: {
      label: "Hammer & Bell",
      value: "hb",
    },
  });

  const [freebies, setFreebies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newFreebie, setNewFreebie] = useState();
  async function fetchFreebies(val = {}) {
    setIsLoading(true);
    setFreebies([]);
    const data = await getAllFreebies({ ...query, ...val });
    setFreebies(data.data["data"]);
    setIsLoading(false);
  }
  useEffect(() => {
    fetchFreebies();
  }, []);
  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      fetchFreebies({ ...query, site });
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };
  return (
    <Contentlayout>
      <div className="mt-[20px] lg:mt-[60px] min-h-screen pb-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎁 Freebies Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage promotional freebies for your store</p>
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              <OrderSiteStatus
                align={"left"}
                data={freebieOpenData}
                setData={setFreebieOpenData}
                query={query}
                noAllSite={true}
                onChanges={onChangeSiteType}
              />
              <button
                onClick={() => {
                  if (newFreebie) {
                    setNewFreebie(null);
                  } else {
                    setNewFreebie({
                      freeProducts: [],
                      minimumThreshold: 0,
                    });
                  }
                }}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                  transition-all duration-300 transform hover:scale-105 shadow-lg
                  ${
                    newFreebie
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                  }
                `}
              >
                {newFreebie ? (
                  <>
                    <span>✕ Cancel</span>
                  </>
                ) : (
                  <>
                    <span>+</span>
                    <span>Add New Freebie</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* New Freebie Card */}
        {newFreebie && (
          <div className="mb-6">
            <FreebieCard
              key={newFreebie}
              freebie={newFreebie}
              refresh={() => {
                fetchFreebies();
                setNewFreebie(null);
              }}
            />
          </div>
        )}

        {/* Freebies Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader />
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading freebies...</p>
            </div>
          </div>
        ) : freebies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {freebies.map((e) => {
              return (
                <FreebieCard
                  key={e._id}
                  freebie={e}
                  refresh={() => {
                    fetchFreebies();
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Freebies Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Click "Add New Freebie" to create your first promotional freebie
            </p>
          </div>
        )}
      </div>
    </Contentlayout>
  );
};

const FreebieCard = ({ freebie, refresh }) => {
  const [formData, setFormData] = useState(freebie);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResult] = useState([]);

  const [updateData, setUpdateData] = useState({
    ...freebie,
    selectedFreeBuyProductOptions: freebie.freeProducts?.map((e) => ({
      id: e?._id,
      value: e?._id,
      label: e?.bundle?.isLimited
                  ? `${e?.title} (${e?.subTitle}) | ${e.site?.toUpperCase()}`
                  : `${e?.title} | ${e.site?.toUpperCase()}`,
    })),
  });

  const fetchProducts = async (q) => {
    try {
      setSearchLoading(true);
      const res = await getProducts({ isSoldOut: false, q: q, isActive: true });
      setSearchLoading(false);
      if (res?.data?.success) {
        const searchOptions = isValidArray(res?.data?.data)
          ? res.data.data.map((item) => {
              return {
                _id: item?._id,
                value: item?._id,
                label: item?.bundle?.isLimited
                  ? `${item?.title} (${item?.subTitle}) | ${item.site.toUpperCase()}`
                  : `${item?.title} | ${item.site.toUpperCase()}`,
              };
            })
          : [];

        setSearchResult(searchOptions);
      }
    } catch (error) {
      setSearchLoading(false);

      console.log(error);
    }
  };
  const fetchFreeBuy = async () => {
    try {
      setLoading(true);
      const res = await getFreeBuy();
      setLoading(false);
      if (res?.data?.success) {
        setFormData(() => {
          return {
            ...res.data.data,
            freeProduct: res?.data?.data?.freeProduct?._id,
            title: res?.data?.data?.freeProduct.title,
          };
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const updateFreeBuyHandler = async () => {
    try {
      setLoading(true);
      formData.freeProducts = updateData.selectedFreeBuyProductOptions.map(
        (e) => e.id || e._id
      );
      const res = freebie?._id
        ? await updateFreeBuy(formData)
        : await createFreeBuy(formData);
      setLoading(false);
      if (res?.data?.success) {
        setFormData(() => {
          return {
            ...res?.data?.data,
            freeProduct: res?.data?.data?.freeProduct?._id,
            title: res?.data?.data?.freeProduct?.title,
          };
        });
        Swal.fire({
          title: "Success!",
          text: res?.data?.message,
          icon: "success",
        });
        refresh();
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message,
        icon: "error",
      });
      console.log(error);
      refresh();
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "minimumThreshold" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFreeBuyHandler();
  };

  function handleDebounceFn(val) {
    fetchProducts(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function onChangeDebounce(value) {
    setSearchTerm(value);
    debounceFn(value);
  }

  const handleSwitch = (keys, value) => {
    setFormData((prev) => {
      return {
        ...prev,
        isActive: !prev?.isActive,
      };
    });
  };

  useEffect(() => {
    fetchFreeBuy();
  }, []);

  const selectProductOptions = (keys, value) => {
    setUpdateData({ ...updateData, [keys]: value });
  };

  const HandleDefaultUpdateOptionSet = async (freeBuy) => {
    const selectedExcludeProducts = isValidArray(freeBuy?.freeProducts)
      ? freeBuy?.freeProducts.map((item) => {
          return {
            _id: item?._id,
            value: item?._id,
            label: item?.title,
          };
        })
      : [];

    setUpdateData((prev) => {
      return {
        ...prev,
        ...coupon,
        selectedFreeBuyProductOptions: selectedExcludeProducts,
      };
    });
  };

  const HandleDefaultCreateOptionSet = async () => {
    setUpdateData((prev) => {
      return {
        isActive: true,
        freeProducts: [],
        selectedFreeBuyProductOptions: [],
      };
    });
  };

  const changeHandler = (keys, e) => {
    setUpdateData({ ...updateData, [keys]: e?.target?.value });
  };
  return (
    <div className="group">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden"
      >
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-750 p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                🎁
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {freebie?._id ? "Edit Freebie" : "New Freebie"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {freebie?._id ? "Update existing freebie settings" : "Create a new promotional freebie"}
                </p>
              </div>
            </div>
            {freebie?._id && (
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                formData?.isActive 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
              }`}>
                {formData?.isActive ? "● Active" : "○ Inactive"}
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Freebie Products */}
          <div>
            <label
              className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-bold mb-3"
              htmlFor="freeProduct"
            >
              <span className="text-lg">📦</span>
              Select Freebie Products
            </label>
            <div className="w-full">
              <ProductsSelectInput
                keys="selectedFreeBuyProductOptions"
                searchOptions={searchResults || []}
                selectedOptions={updateData?.selectedFreeBuyProductOptions || []}
                onChange={selectProductOptions}
                onInputChange={onChangeDebounce}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Select products that will be given as freebies
            </p>
          </div>

          {/* Minimum Threshold */}
          <div>
            <label
              className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-bold mb-3"
              htmlFor="minimumThreshold"
            >
              <span className="text-lg">💰</span>
              Minimum Threshold
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all outline-none"
                id="minimumThreshold"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={parseFloat(formData?.minimumThreshold) || ""}
                name="minimumThreshold"
                onChange={handleChange}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Minimum order amount required to qualify for this freebie
            </p>
          </div>

          {/* Status Toggle */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <label
                  className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-bold mb-1"
                  htmlFor="isActive"
                >
                  <span className="text-lg">⚡</span>
                  Active Status
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enable or disable this freebie offer
                </p>
              </div>
              <Switch onChange={handleSwitch} checked={formData?.isActive} keys="isActive"/>
            </div>
          </div>

          {/* Site Selection */}
          <div>
            <label className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-bold mb-3">
              <span className="text-lg">🌐</span>
              Site Selection
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                htmlFor="hammer-radio"
                className={`
                  flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer
                  transition-all duration-200
                  ${formData?.site === "hb"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300"
                  }
                `}
              >
                <input
                  id="hammer-radio"
                  checked={formData?.site === "hb"}
                  type="radio"
                  value="hb"
                  name="site"
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Hammer & Bell</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Main store</div>
                </div>
              </label>

              <label
                htmlFor="auctropin-radio"
                className={`
                  flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer
                  transition-all duration-200
                  ${formData?.site === "auctropin"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300"
                  }
                `}
              >
                <input
                  checked={formData?.site === "auctropin"}
                  id="auctropin-radio"
                  type="radio"
                  value="auctropin"
                  name="site"
                  className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Auctropin</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Alternative store</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          {loading ? (
            <button
              disabled
              className="w-full bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold py-3 px-6 rounded-xl cursor-not-allowed opacity-75 flex items-center justify-center"
              type="button"
            >
              <Loader bg="transparent" />
              <span className="ml-2">Processing...</span>
            </button>
          ) : (
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              type="submit"
            >
              {freebie?._id ? "💾 Update Freebie" : "✨ Create Freebie"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Index;
