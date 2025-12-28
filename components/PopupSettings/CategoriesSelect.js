
import { useFullStage } from "@/hooks/useFullStage";
import { getPopupCategories } from "@/utils/instance";
import { useEffect } from "react";
import Select from "react-select";

const CategoriesSelect = ({onChange: onChanges,minHeight } = {}) => {
const {Popup} = useFullStage();
  const [popupCategories, setPopupCategories]  = Popup.PopupCategories;
  const [singlePopupDetails, setSinglePopupDetails] = Popup.PopupSingleDetails;
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
  const fetchPopupCategories = async () => {
      try {
      if(!popupCategories?.length){
        const res = await getPopupCategories();
        if (Array.isArray(res?.data?.data) && res.data?.data.length > 0) {
          const catItems = res.data?.data.map(itm => {
            return {
              id: itm?._id,
              label: itm?.name,
              value: itm?.slug
            };
          });
          setPopupCategories(catItems);
        }
      }
      } catch (error) { /* empty */ }
    
  };

  useEffect(() => {
    fetchPopupCategories();
  }, []);
  if (!(popupCategories?.length > 0)) return null;
  return (
    <div>
      <Select
        isMulti
        placeholder="Select Categories"
        onChange={onChanges}
        value={singlePopupDetails?.selectedCategoriesOptions
        }
        options={popupCategories}
        styles={customStyles}
        components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
      />
    </div>
  );
};

export default CategoriesSelect;
