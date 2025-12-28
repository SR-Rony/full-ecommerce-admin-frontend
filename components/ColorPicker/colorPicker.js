import { ChromePicker } from 'react-color';

const ColorPicker = ({color,handleChange,keys}) => {

  return (
    <div>
   
      <ChromePicker color={color} onChange={(e) =>handleChange(keys,e)}   />
    </div>
  );
};

export default ColorPicker;
