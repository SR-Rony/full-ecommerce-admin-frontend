import Switch from "@/components/Admins/Switch";
import ProductsSelectInput from "@/components/Coupons/ProductsSelectInput";
import OrderSiteStatus from "@/components/Shared/OrderSiteStatus";
import Loader from "@/shared/Loader/Loader";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { isValidArray } from "@/utils/func";
import {
  createLargeDiscountProduct,
  fetchLargeDiscountProducts,
  getProducts,
  updateLargeDiscountProduct,
} from "@/utils/instance";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";

const Index = () => {
  const [largeDiscountOpenData, setLargeDiscountOpenData] = useState({});
  const [query, setQuery] = useState({
    site: {
      label: "Hammer & Bell",
      value: "hb",
    },
  });

  const [largeDiscounts, setLargeDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newLargeDiscount, setNewLargeDiscount] = useState();

  async function fetchLargeDiscounts(val = {}) {
    try {
      setIsLoading(true);
      setLargeDiscounts([]);
      const { data, error } = await fetchLargeDiscountProducts({ ...query, ...val });
      if (error) throw new Error(error);
      setLargeDiscounts(data?.data || []);
    } catch (error) {
      console.error('Error fetching large discounts:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to fetch large discounts',
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLargeDiscounts();
  }, []);

  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });
    try {
      fetchLargeDiscounts({ ...query, site });
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };

  return (
    <Contentlayout>
      <div className="mt-[20px] lg:mt-[60px] h-screen">
        <div className="flex justify-between items-center mb-3 flex-wrap">
          <div>
            <p className="text-xl font-bold">Large Discount Products</p>
          </div>

          <div className="flex gap-4">
            <OrderSiteStatus
              align={"left"}
              data={largeDiscountOpenData}
              setData={setLargeDiscountOpenData}
              query={query}
              noAllSite={true}
              onChanges={onChangeSiteType}
            />
            <button
              onClick={() => {
                if (newLargeDiscount) {
                  setNewLargeDiscount(null);
                } else {
                  setNewLargeDiscount({
                    largeDiscountProducts: [],
                  });
                }
              }}
              className={
                "bg-blue-400 rounded-md px-2 py-2 border " +
                (newLargeDiscount ? "bg-slate-200 text-slate-700" : "text-white")
              }
            >
              {newLargeDiscount ? "Cancel" : "+ Add New Large Discount Products"}
            </button>
          </div>
        </div>

        {newLargeDiscount && (
          <LargeDiscountCard
            key="new"
            largeDiscount={newLargeDiscount}
            refresh={() => {
              fetchLargeDiscounts();
              setNewLargeDiscount(null);
            }}
          />
        )}

        <div className="h-[1px] bg-gray-400 w-100 my-2" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {largeDiscounts.map((e) => (
            <LargeDiscountCard
              key={e._id}
              largeDiscount={e}
              refresh={() => {
                fetchLargeDiscounts();
              }}
            />
          ))}
        </div>
      </div>
    </Contentlayout>
  );
};

const LargeDiscountCard = ({ largeDiscount, refresh }) => {
  const [formData, setFormData] = useState(largeDiscount);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResult] = useState([]);

  const [updateData, setUpdateData] = useState({
    ...largeDiscount,
    selectedLargeDiscountProductOptions: (largeDiscount.largeDiscountProducts || []).map((e) => ({
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
      // Exclude bundle and cycle products by default
      const { data, error } = await getProducts({ 
        isSoldOut: false, 
        q: q, 
        isActive: true,
        onlySearchGeneral:true 
      });
      if (error) throw new Error(error);
      
      const searchOptions = isValidArray(data?.data)
        ? data.data.map((item) => ({
            _id: item?._id,
            value: item?._id,
            label: item?.title ? `${item.title} | ${item.site?.toUpperCase()}` : 'Unknown Product',
          }))
        : [];
      setSearchResult(searchOptions);
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to fetch products',
        icon: 'error',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchLargeDiscount = async () => {
    if (!largeDiscount?._id) return;

    try {
      setLoading(true);
      const { data, error } = await fetchLargeDiscountProducts();
      if (error) throw new Error(error);
      
      setFormData((prev) => ({
        ...prev,
        ...data.data,
        largeDiscountProduct: data?.data?.largeDiscountProduct?._id,
        title: data?.data?.largeDiscountProduct?.title,
      }));
    } catch (error) {
      console.error("Error fetching large discount:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to fetch large discount details',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle saving the large discount
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const productIds = updateData.selectedLargeDiscountProductOptions?.map(p => p.id || p._id) || [];
      if (productIds.length === 0) {
        throw new Error('Please select at least one product');
      }
      
      const dataToSave = {
        ...formData,
        largeDiscountProducts: productIds,
        isActive: formData.isActive || false // Ensure isActive is always included
      };

      const { data, error } = formData._id
        ? await updateLargeDiscountProduct({ 
            ...dataToSave, 
            _id: formData._id,
            isActive: formData.isActive === true // Ensure boolean value is sent
          })
        : await createLargeDiscountProduct({
            ...dataToSave,
            isActive: formData.isActive === true // Ensure boolean value is sent
          });
      
      if (error) throw new Error(error);

      Swal.fire({
        title: 'Success!',
        text: data?.message || 'Large discount saved successfully',
        icon: 'success',
      });
      refresh();
    } catch (error) {
      console.error('Error saving large discount:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to save large discount',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle product selection change
  const handleProductChange = (keys, value) => {
    setUpdateData(prev => ({
      ...prev,
      [keys]: value || []
    }));
    setSearchTerm('');
    setSearchResult([]);
  };

  // Handle debounced search
  function handleDebounceFn(val) {
    if (val) {
      fetchProducts(val);
    } else {
      setSearchResult([]);
    }
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  // Handle search input change
  function handleSearchChange(value) {
    setSearchTerm(value);
    debounceFn(value);
  }

  // Toggle active status
  const handleToggleActive = (key, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [key]: isChecked
    }));
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-sm mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {formData._id ? 'Edit Large Discount' : 'New Large Discount'}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Active</span>
          <Switch
            checked={formData?.isActive}
            onChange={(e) => handleToggleActive('isActive', !formData?.isActive)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Products
          </label>
          <ProductsSelectInput
            keys="selectedLargeDiscountProductOptions"
            searchOptions={searchResults}
            selectedOptions={updateData.selectedLargeDiscountProductOptions || []}
            onChange={handleProductChange}
            onInputChange={handleSearchChange}
            isLoading={searchLoading}
            placeholder="Search and select products..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {updateData.selectedLargeDiscountProductOptions?.length || 0} products selected
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={() => refresh()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !updateData.selectedLargeDiscountProductOptions?.length}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading || !updateData.selectedLargeDiscountProductOptions?.length
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
