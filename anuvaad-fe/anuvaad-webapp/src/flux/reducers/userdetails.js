import C from '../actions/constants';

const initialUserState = {
    result: []
};

export default function (state = initialUserState, action) {

    switch (action.type) {
        case C.FETCH_USERINFO:
            const users = Object.assign([], action.payload);
            const data = users.map(user => {
                return {
                    name: user.name, email_id: user.email, roles: user.roles.map(role => {
                        return role.roleCode
                    }).join(', '), is_verified: (user.is_verified ? true : false)
                }
            })
            return { ...state, data: data.reverse() }
        default:
            return state;
    }
}