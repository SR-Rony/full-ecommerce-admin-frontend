import { isValidArray } from "@/utils/func";
import { useRouter } from "next/router";
import Select from "react-select";

const AdminStatusSelectInput = ({ value = [], keys,placeholder, setQuery,minHeight } = {}) => {
  const  router =useRouter();
    let orderStatus = [
        {label:'PENDING',value:'PENDING'},
        {label:'PACKED',value:'PACKED'},
        {label:'SHIPPED',value:'SHIPPED'},
    ];
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
    const onChange =(keys,e) =>{
        if(keys){
         setQuery((prev) => {
             return {
                 ...prev,
                 [keys]: isValidArray( [e].flat(Infinity)) ? [e].flat(Infinity).map(item => {
                     const  val =typeof item === 'object'?item.value ||item:item;
                     return val;
                 }).filter(Boolean):[]
             };
         });
        }
     };

    let options = isValidArray(value)?value.flat(Infinity).map(item => {
        const  val =typeof item === 'object'?item.value ||item:item;
        return {
            value:val,
            label:val,
        };
    }).filter(Boolean):[];

    options =  router?.pathname=='/admin/orders/pending'? orderStatus[0]: options;
    return (
        <div>
           <Select
        isMulti
        placeholder={placeholder||""}
        onChange={(val) =>{
          if(router?.pathname!=='/admin/orders/pending'){
            onChange(keys,val);
          }
        }}
        value={options }
        options={orderStatus}
        styles={customStyles}
        components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
      />
        </div>
    );
};

export default AdminStatusSelectInput;
