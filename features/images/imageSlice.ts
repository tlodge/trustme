import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AppThunk } from '../../app/store'
import { fetchGuess } from './imageAPI'

export interface ImageState {
  images: string[][]
  paths: string[][]
}

const initialState: ImageState = {
    images: [
        ["/","/","/"],
        ["/","/","/"],
        ["/","/","/"],
        ["/","/","/"],
        ["/","/","/"],
        ["/","/","/"],
        ["/","/","/"],
        ["/","/","/"],
    ],

    paths: [
        ["","",""],
        ["","",""],
        ["","",""],
        ["","",""],
        ["","",""],
        ["","",""],
        ["","",""],
        ["","",""],
    ]
}

export const imageSlice = createSlice({
  name: 'images',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    
    setImages: (state, action:PayloadAction<string[][]>)=>{
        state.images = action.payload;
    },

    setPaths: (state, action:PayloadAction<string[][]>)=>{
        state.paths = action.payload;
    }
  }
})

export const { setImages, setPaths } = imageSlice.actions
export const selectImages = (state: AppState) => state.images.images

export const guessShape =
  (chapter, dimension, key, path): AppThunk =>
  
  async (dispatch, getState) => {
    
    let _paths  = getState().images.paths;
    let _images = getState().images.images;

    if (_paths[chapter][dimension] != key){

        console.log("have key", key , " and ", _paths[chapter][dimension]);
        const url = await fetchGuess(path);
        
        dispatch(setPaths(_paths.map((row,i)=>{
            if (i == chapter){
                return row.map((_d, j)=>{
                    if (j===dimension){
                        return key;
                    }
                    return _d;
                })
            }
            return row;
        })));
        dispatch(setImages(_images.map((row,i)=>{
            if (i == chapter){
                return row.map((_url, j)=>{
                    if (j===dimension){
                        return url;
                    }
                    return _url;
                })
            }
            return row;
        })));
    }   
}

export default imageSlice.reducer