import Select from 'react-select';
import countryList from 'react-select-country-list';

import CountryFlag from '@/shared/Country/CountryFlag';
import { useMemo } from 'react';

function SelectCountryList({ onChange: onChanges,setCreateShippingCountriesData, selectedOptions }) {
    const options = useMemo(() => countryList().getData(), []);
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
  return (
    <Select
      options={options}
      value={selectedOptions}
      onChange={(value) =>{
        setCreateShippingCountriesData(value);
      }}
      components={{ Option: customOption }}
    />
  );
}

export default SelectCountryList;
