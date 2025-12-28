import { isValidArray } from "@/utils/func";
import { getProducts } from "@/utils/instance";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import Select from "react-select";

const ProductIncludes = ({ productData, setProductData, EndRef } = {}) => {

    const handleProductIncludesRemove = (removeIndex, array) => {
        setProductData((prev) => {
            let copy = array;
            if (Array.isArray(copy) && copy?.length > 0) {
                const filters = copy.filter((_, i) => i !== removeIndex);
                return {
                    ...prev,
                    ['details.includes']: filters
                };
            }
            return prev;
        });

    };

    const handleProductIncludesUpdate = (updateIndex, data = {}, array) => {
        let copy = array;

        if (Array.isArray(copy) && copy?.length > 0) {
            const filters = copy.map((_item, i) => {
                if (i == updateIndex) {
                    return {
                        ..._item,
                        ...data,
                    };
                } else {
                    return _item;
                }
            });
            setProductData({
                ...productData,
                ['details.includes']: filters
            });

        }
    };
    let optionsInclude = productData && productData.hasOwnProperty('details.includes') ? productData['details.includes'] : productData?.details?.includes;
    console.log(optionsInclude, 'optionsInclude');

    if (isValidArray(optionsInclude)) {
        optionsInclude = optionsInclude.map(item => ({
            name: item?.name || null,
            quantity: item?.quantity,
            dosage: item?.dosage,
            selectIncludeProduct: {
                label: item?.selectIncludeProduct?.label || item?.product?.title || "",
                value: item?.selectIncludeProduct?.value || item?.product?._id || null,
                site: item?.selectIncludeProduct?.site || item?.product?.site ||  null,
                price:item?.selectIncludeProduct?.price || item?.product?.price || {regular:0,sale:0}
            },
            product: item?.selectIncludeProduct?.value || item?.product?._id || item?.product || null
        }));
    }

    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Function to fetch data from API
    const fetchDefaultOptions = async (inputValue, site) => {
        if (productData['cycle.isCycle'] || (productData?.cycle?.isCycle) == true) {
            setIsLoading(true);
            try {
                const response = await getProducts({ q: inputValue, page: 1, limit: 100,isProductIncludeSearch:true });
                // Format data to match the structure react-select expects
                const formattedOptions = isValidArray(response?.data?.data) ? response?.data?.data.map((item) => ({
                    label: item.title,
                    value: item._id,
                    site: item?.site,
                    price:item?.price||{regular:0,sale:0}
                })) : [];
                setOptions(formattedOptions);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    const fetchOptions = async (inputValue, site) => {
        if (!inputValue) return;
        if ((productData['cycle.isCycle'] || productData?.cycle?.isCycle == true)) {
            setIsLoading(true);
            try {
                const response = await getProducts({ q: inputValue, page: 1, limit: 100,isProductIncludeSearch:true });
                // Format data to match the structure react-select expects
                const formattedOptions = isValidArray(response?.data?.data) ? response?.data?.data.map((item) => ({
                    label: item.title,
                    value: item._id,
                    site: item?.site,
                    price:item?.price ||{regular:0,sale:0}
                })) : [];
                setOptions(formattedOptions);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchDefaultOptions("");
    }, []);
    // Debounce the fetchOptions function to delay the API call
    const debouncedFetch = useCallback(debounce(fetchOptions, 500), []);

    // Handle input change in the select component
    const handleInputChange = (inputValue) => {
        debouncedFetch(inputValue, { value: productData?.site });
    };
    return (
        <div className=""><div className="w-full shadow-lg">
            {
                Array.isArray(optionsInclude) && optionsInclude?.length > 0 && optionsInclude.map((item, i) => (
                    <div key={i} className="border p-4 my-4 rounded-md" ref={EndRef}>
                        <div className="">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex gap-4">
                                    <h2 className="mb-3">Includes {i + 1}</h2> |
                                    <h2 className="mb-1">Site:{item?.selectIncludeProduct?.site} </h2>
                                </div>

                                <CiCircleRemove size={18} color="black" className="cursor-pointer" onClick={() => handleProductIncludesRemove(i, optionsInclude)} /></div>

                        </div>

                        <div className="md:flex items-center gap-2">

                            <div className="mt-2 w-full md:w-[60%]">
                                <label htmlFor="name" className="block text-sm mb-2 dark:text-white capitalize"> Product</label>
                                <div className="relative">

                                    <Select
                                        options={options}
                                        isLoading={isLoading}
                                        value={item?.selectIncludeProduct}
                                        onInputChange={handleInputChange}
                                        onChange={(value) => {
                                            console.log(value,'value');
                                            handleProductIncludesUpdate(i, { product: value?.value, selectIncludeProduct: value }, optionsInclude);
                                        }}
                                        placeholder="Product search or write a name..."
                                        isMulti={false}
                                    />
                                    {/* <input type="text" name="name" onChange={(e) => handleProductIncludesUpdate(i, { name: e.target.value }, options)} value={item?.name || ""}
                                        className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                        required /> */}

                                </div>
                            </div>
                            <div className="mt-2  w-full md:w-[25%]">
                                <label htmlFor="quantity" className="block text-sm mb-2 dark:text-white capitalize"> quantity</label>
                                <div className="relative">
                                    <input type="number" min={1} name="quantity" onChange={(e) => handleProductIncludesUpdate(i, { quantity: e.target.value }, optionsInclude)} value={item?.quantity || ""}
                                        className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                        required />
                                </div>
                            </div>
                            <div className="mt-2 w-full md:w-[25%]">
                                <label htmlFor="dosage" className="block text-sm mb-2 dark:text-white capitalize"> dosage</label>
                                <div className="relative">
                                    <input type="text" name="dosage" onChange={(e) => handleProductIncludesUpdate(i, { dosage: e.target.value }, optionsInclude)} value={item?.dosage || ""}
                                        className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                        required />
                                </div>
                            </div>

                        </div>
                    </div>
                ))

            }
        </div>
        </div>
    );
};

export default ProductIncludes;
