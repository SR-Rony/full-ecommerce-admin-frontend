
const Switch = ({  keys,name,defaultChecked,disabled=false, checked, onChange: onChanges,width,height } ={}) => {
    return (
        <div className="flex gap-2 items-center">
             <span className="ms-3 text-sm font-medium text-gray-900 capitalize">
                
                {name}</span>
            <label className={`relative inline-flex items-center ${disabled?'cursor-not-allowed':'cursor-pointer'}`}>

                <input type="checkbox"disabled={disabled} value="" defaultChecked={defaultChecked}className="sr-only peer" checked={checked} onChange={(e) => {
                    onChanges(keys, e.target.checked);
                }} />
                <div className="w-11 h-6 bg-gray-200 rounded-full  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
   
            </label>

        </div>
    );
};

export default Switch;
