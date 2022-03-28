package com.tarento.retail.util.sql;

public interface UserSQL {

    interface InsertQuery{
        final String ADD_USER = "INSERT INTO user(username,password,age) VALUES (?,?,?)";
        final String ADD_USER_AUTHENTICATION = "INSERT INTO user_authentication(user_id,auth_token) VALUES (?,?)";

    }

    interface UpdateQuery{
        final String UPDATE_USER = "UPDATE user SET (username,password,age) VALUES (?,?,?)";

    }

    interface FindQuery{
        final String FIND_USER = "SELECT * FROM user";
        final String FIND_USER_AUTHENTICATION = "SELECT * FROM user_authentication";
        final String FIND_USER_ROLE = "SELECT * FROM musti_user_role";
        final String FIND_ROLE = "SELECT * FROM musti_role";
        final String FIND_ROLE_ACTION = "SELECT * FROM musti_role_actions";
        final String FIND_ACTION = "SELECT * FROM musti_actions";

    }

    interface Conditions{
        final String byId = " id=?";
        final String byPhoneNo = " phone_no=?";
        final String byUserName = " username=?";
        final String byUserId = " user_id=?";
        final String byRoleId = " role_id=?";

    }

}
