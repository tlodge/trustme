import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../../app/store'


export interface ShapeState {
  style: Object
}

const colours = {
  "d1":"#bb2929",
  "d2":"#e19c38",
  "d3":"#61b359"
}

const initialState: ShapeState = {
  style:{
    d1:true,
    d2:true,
    d3:true, 
    grid: false,
    autodraw:false,
    fill:true,
    rotate:true,
    opacity:1,
    fillopacity:0.3, 
    strokeopacity:1, 
    strokewidth:1,
    d1stroke:"black",
    d2stroke:"black",
    d3stroke:"black",
    d1fill:colours["d1"],
    d2fill:colours["d2"],
    d3fill:colours["d3"],
  }
}

export const shapeSlice = createSlice({
  name: 'shapes',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: { 
    setStyle: (state, action:PayloadAction<Object>)=>{
        state.style = action.payload;
    },
  }
})

export const setOptions = (attr,value): AppThunk => async (dispatch, getState) => {  
  const style = getState().shapes.style;
  dispatch(setStyle({...style, [attr]:value}));
} 

export const toggleOption = (attr): AppThunk => async (dispatch, getState) => {  
  const style = getState().shapes.style;  
  dispatch(setStyle({...style, [attr] : style[attr] ? false : true}));
}   

export const {setStyle} = shapeSlice.actions
export const selectStyles = (state: AppState) => state.shapes.style

export default shapeSlice.reducer