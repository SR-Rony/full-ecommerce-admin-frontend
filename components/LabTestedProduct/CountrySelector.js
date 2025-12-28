import { useFullStage } from '@/hooks/useFullStage';
import CountryFlag from '@/shared/Country/CountryFlag';
import { isValidArray } from '@/utils/func';
import { getShippingCountriesApi } from '@/utils/instance';
import { useEffect } from 'react';
import Select from 'react-select';

function CountrySelector({ onChange: onChanges,minHeight=80, selectedOptions }) {
    const {Countries} = useFullStage();
    const [countries, setCountries] = Countries.Countries;
    const [defaultCountriesData, setDefaultCountriesData] =
      Countries.DefaultCountriesData;
    const fetchCountries = async () => {
        try {
            const res = await getShippingCountriesApi({ isActive: true });
            // console.log(res.data.data,'shipping?countries');
            if (isValidArray(res?.data?.data)) {
                const modifiedData = res.data.data.map((item => {
                    return {
                        _id: item?._id,
                        ...item.country,
                    };
                }));
                const defaultCountriesData = res.data.data.find((item => {
                 if(item?.value =="US"){
                    return true;
                 }else{
                    return false;
                 }
                }));
                setDefaultCountriesData(defaultCountriesData);
                setCountries([...modifiedData]);
            }

        } catch (error) {
            // console.log(error);
        }
    };
    useEffect(() => {
        if(!countries?.length){
            fetchCountries();
        }
    }, []);

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
            <div style={{ marginLeft: '10px' }}>
                <CountryFlag country={data} />
            </div>
            <span style={{ marginLeft: '8px' }}>{label}</span>
        </div>
    );
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
    // console.log(shippingCountries);
    return (
        <Select

            isMulti
            placeholder="Select Countries"
            styles={customStyles}
            options={countries}
            value={selectedOptions}
            defaultValue={defaultCountriesData}
            onChange={onChanges}
            components={{ Option: customOption }}
        />
    );
}

export default CountrySelector;
