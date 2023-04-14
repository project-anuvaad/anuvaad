import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        
        case C.GET_ALL_SUPPORTED_LANG_LIST:
          const modifiedData = action.payload?.data?.languages.map((el,i)=>{
            if(el.active){
              return el
            }
          })

          modifiedData.sort((a, b) => {
            const labelA = a.label.toUpperCase(); // ignore upper and lowercase
            const labelB = b.label.toUpperCase(); // ignore upper and lowercase
            if (labelA < labelB) {
              return -1;
            }
            if (labelA > labelB) {
              return 1;
            }
          
            // names must be equal
            return 0;
          });

            return modifiedData;

        default:
            return state;
    }
}