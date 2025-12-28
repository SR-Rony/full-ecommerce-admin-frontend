import { createSlice } from '@reduxjs/toolkit';
const initialState ={
appInfo:{
},
};
const settingSlice = createSlice({
  name: '/settingSlice',
  initialState: initialState,
  reducers: {
    settingAppInfoAdd: (state,action) =>{
        state.appInfo = action.payload;
    },
  },
});
export const { settingAppInfoAdd} = settingSlice.actions;
export default settingSlice.reducer;

