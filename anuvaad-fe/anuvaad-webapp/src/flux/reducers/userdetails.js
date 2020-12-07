import C from '../actions/constants';

const initialUserState = {
    result: []
};

export default function (state = initialUserState, action) {

    switch (action.type) {
        case C.FETCH_USERINFO:
            const users = [...action.payload];
            const data = users.map(user => {
                if (user.activated_time) {
                    var d = new Date(user.activated_time * 1000)
                    let dateStr = d.toISOString()
                    var myDate = new Date(dateStr);
                    var createdAt = (myDate.toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }))
                } return {
                    userID: user.userID, userName: user.userName, name: user.name, email_id: user.email, roles: user.roles.map(role => {
                        return role.roleCode
                    }).join(', '), registered_time: createdAt, is_verified: (user.is_verified ? true : false)
                }
            })
            return { ...state, data: data.reverse() }
        default:
            return state;
    }
}