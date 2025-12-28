
import { useFullStage } from "@/hooks/useFullStage";
import { getProductCategories } from "@/utils/instance";
import { useEffect } from "react";
import Select from "react-select";

const CategoriesSelect = ({ defaultOptions, onChange: onChanges,minHeight } = {}) => {
const {Product} = useFullStage();
  const [productCategories, setProductCategories]  = Product.ProductCategories;
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight:minHeight|| '60px', // Set the height you desire
    }),
    input: (provided, state) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
  };
  const IndicatorComponent = (props) => {
    return <div />; // You can customize this to an empty div or any other element
  };
  const fetchProductCategories = async () => {
      try {
      if(!productCategories?.length){
        const res = await getProductCategories();
        if (Array.isArray(res?.data?.data) && res.data?.data.length > 0) {
          const catItems = res.data?.data.map(itm => {
            return {
              id: itm?._id,
              label: itm?.name,
              value: itm?.slug
            };
          });
          setProductCategories(catItems);
        }
      }
      } catch (error) { /* empty */ }
    
  };

  useEffect(() => {
    fetchProductCategories();
  }, []);
  if (!(productCategories?.length > 0)) return null;
  return (
    <div>
      <Select
        isMulti
        placeholder="Select Categories"
        onChange={onChanges}
        value={defaultOptions}
        options={productCategories}
        styles={customStyles}
        components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
      />
    </div>
  );
};

export default CategoriesSelect;
