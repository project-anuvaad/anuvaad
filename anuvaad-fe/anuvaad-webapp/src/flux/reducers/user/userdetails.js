import C from '../../actions/constants';

const initialUserState = {
    result: [],
    data: []
};

function getUserData(input) {
    const users = [...input];
    users.sort(function (x, y) {
        return  y.activated_time - x.activated_time;
    })
    const data = users.map(user => {
        if (user.activated_time) {
            var d = new Date(user.activated_time * 1000)
            let dateStr = d.toISOString()
            var myDate = new Date(dateStr);
            var createdAt = (myDate.toLocaleString(Date.UTC({ day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })))
        } return {
            userID: user.userID, orgId: user.orgID, userName: user.userName, models: user.models, name: user.name, email: user.email, roles: user.roles.map(role => {
                return role.roleCode
            }).join(', '), registered_time: createdAt, is_active: user.is_active
        }
    })

    return data;
}
export default function (state = initialUserState, action) {
    switch (action.type) {
        case C.FETCH_USERINFO:
            const newdata = getUserData(action.payload.data)
            return {
                ...state,
                data: newdata,
                count: action.payload.count
            }
        case C.FETCH_NEXT_USERDETAIL:
            const nextData = getUserData(action.payload.data);
            return {
                ...state,
                data: [...state.data, ...nextData]
            }
        case C.FETCH_CURRENT_USER_DETAIL:
            const currentData = getUserData(action.payload.data);
            const exisitingData = [...state.data];
            currentData.forEach(curruser => {
                exisitingData.forEach((existinguser, index) => {
                    if (existinguser.userID === curruser.userID) {
                        existinguser.is_active = curruser.is_active
                    }
                })
            })
            return {
                ...state,
                data: exisitingData
            }
        default:
            return state;
    }
}