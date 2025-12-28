import { isValidArray } from '@/utils/func';
import { getShippingCountriesApi } from '@/utils/instance';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import CountryFlag from './CountryFlag';

function CountrySelector({ onChange: onChanges, selectedOptions }) {
 const [shippingCountries,setShippingCountries] = useState([]); 
const fetchCountries =async () =>{
  try {
    const res = await getShippingCountriesApi({isActive:true});
    // console.log(res.data.data,'shipping?countries');
    if(isValidArray(res?.data?.data)){
      const modifiedData = res.data.data.map((item => {
        return {
          _id:item?._id,
          ...item.country,
        };
      }));
     
      setShippingCountries(modifiedData);
    }
    
  } catch (error) {
    // console.log(error);
  }
};
  useEffect(() =>{
    fetchCountries();
  },[]);

  // console.log(shippingCountries,'countries');
  const customOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px', // Adjust the padding as needed
      }}
    >
      <div  style={{ marginLeft: '10px' }}>
      <CountryFlag country={data} />
      </div>
      <span style={{ marginLeft: '8px' }}>{label}</span>
    </div>
  );

  // console.log(shippingCountries);
  return (
    <Select
      options={shippingCountries}
      value={selectedOptions}
      onChange={onChanges}
      components={{ Option: customOption }}
    />
  );
}

export default CountrySelector;
