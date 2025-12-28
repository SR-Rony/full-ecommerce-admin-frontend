import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
const PhoneNumberInput = ({ onChanges, phoneNum }) => {

  return (
    <PhoneInput
      className='border p-2 focus:outline-none input-phone-number rounded-md'
      placeholder="Enter phone number"
      value={phoneNum}
      defaultCountry='US'
      countries={['US']}
      addInternationalOption={false}
      onChange={onChanges}  />

  );
};

export default PhoneNumberInput;
