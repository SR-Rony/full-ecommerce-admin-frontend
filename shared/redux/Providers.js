import { getAppInfoSetting } from "@/utils/instance";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { settingAppInfoAdd } from "./slices/setting.slice";
const Providers = ({ children }) => {
    const dispatch = useDispatch();
    const fetchSettingAppInfo = async () => {
        try {
            const res = await getAppInfoSetting();
            if (res.data.success) {
                dispatch(settingAppInfoAdd(res.data.data));
            }

        } catch (error) {
        
            //console.log(error?.response?.data?.message);
        }
    };
    useEffect(() =>{
        fetchSettingAppInfo();
    },[]);
    return (
        <>
            {children}
          
        </>
    );
};

export default Providers;
