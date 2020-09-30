import C from "../actions/constants";

export default function(state = {}, action) {
  switch (action.type) {
      
    case C.CONFIGUPLOAD:
        
          return {...state, [action.payload.name]:action.payload.data.filepath};

            // action.payload.name === "csvFile"


      //return [...state, action.payload];
    default:
      return state;
  }
}
