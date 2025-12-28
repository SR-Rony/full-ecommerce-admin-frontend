import { isValidArray } from '@/utils/func';
import { getProducts } from '@/utils/instance';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import Select from 'react-select';

const ProductSearchDropdown = ({ onChange: onChanges, productSearchDropdown }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced function to fetch products
  const fetchProducts = useCallback(
    debounce(async (inputValue) => {
      if (inputValue) {
        setLoading(true);
        try {
          const response = await getProducts({ q: inputValue });
          const productOptions = isValidArray(response?.data?.data)
            ? response.data.data.map((product) => ({
                label: product?.title,
                value: product?._id,
              }))
            : [];
          setOptions(productOptions);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setOptions([]); // Clear options if inputValue is empty
      }
    }, 500),
    []
  );

  const handleInputChange = (inputValue) => {
    if (inputValue) {
      fetchProducts(inputValue);
    }
  };

  return (
    <Select
      isLoading={loading}
      options={options}
      onChange={onChanges}
      value={productSearchDropdown}
      onInputChange={handleInputChange}
      placeholder="Search for a product..."
      isClearable
    />
  );
};

export default ProductSearchDropdown;
