import C from "../constants";

export function logOut(){
    return {
        type: C.LOGOUT,
        payload: {
        }
    }
}