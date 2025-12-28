import { createSlice } from '@reduxjs/toolkit';
const initialState ={
user:{

},
};
const authSlice = createSlice({
  name: '/authSlice',
  initialState: initialState,
  reducers: {
    authLogin: (state,action) =>{
        state.user = action.payload;
    },
  },
});
export const { authLogin} = authSlice.actions;
export default authSlice.reducer;

