import Switch from "@/components/Admins/Switch";
import ProductsSelectInput from "@/components/Coupons/ProductsSelectInput";
import Loader from "@/shared/Loader/Loader";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { isValidArray } from "@/utils/func";
import { getFreeBuy, getProducts, updateFreeBuy } from "@/utils/instance";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
const index = () => {
    const [formData, setFormData] = useState({ freeProduct: '', minimumThreshold: '', title: '', isActive: true });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResult] = useState([]);

    const [updateData, setUpdateData] = useState({});

    const fetchProducts = async (q) => {
        try {
            setSearchLoading(true);
            const res = await getProducts({ isSoldOut: false, q: q, isActive: true });
            setSearchLoading(false);
            if (res?.data?.success) {
                const searchOptions = isValidArray(res?.data?.data) ? res.data.data.map(item => {
                    return {
                      _id: item?._id,
                      value: item?._id,
                      label: item?.title
                    };
                  }) : [];
            
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
            const res = await updateFreeBuy(formData);
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
                    icon: "success"
                });

            }
        } catch (error) {

            setLoading(false);
            Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error"
            });
            console.log(error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'minimumThreshold' ? parseFloat(value) || 0 : value
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
    };

    const handleSwitch = (keys, value) => {
        setUpdateData((prev) => {
            return {
                ...prev,
                isActive: value.target.checked
            };
        });
    };

    useEffect(() => {
        // fetchFreeBuy();
    }, []);

    const selectProductOptions = (keys, value) => {
        setUpdateData({ ...updateData, [keys]: value });

    };

  const HandleDefaultUpdateOptionSet = async (freeBuy) => {
    const selectedExcludeProducts = isValidArray(freeBuy?.freeProducts) ? freeBuy?.freeProducts.map(item => {
      return {
        _id: item?._id,
        value: item?._id,
        label: item?.title
      };
    }) : [];

    setUpdateData((prev) => {
      return {
        ...prev,
        ...coupon,
        selectedFreeBuyProductOptions: selectedExcludeProducts
      };
    });
  };

  const HandleDefaultCreateOptionSet = async () => {
    setUpdateData((prev) => {
      return {
        isActive: true,
        freeProducts: [],
        selectedFreeBuyProductOptions:[]
      };
    });
  };

  const changeHandler = (keys, e) => {
    setUpdateData({ ...updateData, [keys]: e?.target?.value });
};
    return (
        <div>
            <Contentlayout>
                <div className="mt-[100px] h-screen">

                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full ">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="freeProduct">
                              Select Freebie Products
                            </label>
                            <div className="w-full h-full">

                                <ProductsSelectInput keys="selectedFreeBuyProductOptions" searchOptions={searchResults || []} selectedOptions={updateData?.selectedFreeBuyProductOptions || []} onChange={selectProductOptions} onInputChange={onChangeDebounce} />
                            </div>

                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minimumThreshold">
                                Minimum Threshold
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="minimumThreshold"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter Minimum Threshold Amount"
                                value={parseFloat(formData?.minimumThreshold) || ""}
                                name="minimumThreshold"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isActive">
                                Is Active
                            </label>
                            <Switch onChange={handleSwitch} checked={formData?.isActive} />
                        </div>
                        <div className="flex items-center justify-center">
                            {loading ? <button
                                className="bg-blue-500 cursor-not-allowed hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                type="submit"
                            >
                                <Loader bg="transparent" />
                            </button> : <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                type="submit"
                            >
                                Submit
                            </button>}
                        </div>
                    </form>
                </div>
            </Contentlayout>
        </div>
    );
};

export default index;
