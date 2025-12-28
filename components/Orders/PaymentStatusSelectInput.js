import { isValidArray } from "@/utils/func";
import { useRouter } from "next/router";
import Select from "react-select";

const PaymentStatusSelectInput = ({ value = [], keys,placeholder, setQuery,minHeight } = {}) => {
  const router = useRouter();
    const orderStatus =router?.pathname=='/admin/orders/pending' ?[
      {label:'Waiting',value:'waiting'},
      {label:'Partially Paid',value:'partially_paid'},
      {label:'Failed',value:'failed'},
      {label:'Expired',value:'expired'},
  ]: [
        {label:'Sending',value:'Sending'},
        {label:'Confirming',value:'confirming'},
        {label:'Confirmed',value:'confirmed'},
        {label:'Finished',value:'finished'},
        {label:'Refunded',value:'refunded'},
       
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
    return (
        <div>
           <Select
        isMulti
        placeholder={placeholder||""}
        onChange={(val) =>onChange(keys,val)}
        value={options }
        options={orderStatus}
        styles={customStyles}
        components={{ IndicatorSeparator: () => null, DropdownIndicator: IndicatorComponent }}
      />
        </div>
    );
};

export default PaymentStatusSelectInput;
