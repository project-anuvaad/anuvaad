const adminConfig = {
    roles: [
        {

            "roleCode": "TRANSLATOR",
            "roleDesc": "Has access to translation related resources"
        },
        // {

        //     "roleCode": "ANNOTATOR",
        //     "roleDesc": "Access to evaluate our model"

        // },
    ],
    orgID: ["ANUVAAD"]
}

const superAdminConfig = {
    roles: [
        {

            "roleCode": "TRANSLATOR",
            "roleDesc": "Has access to translation related resources"
        },
        // {

        //     "roleCode": "ANNOTATOR",
        //     "roleDesc": "Access to evaluate our model"

        // },
        {

            "roleCode": "ADMIN",
            "roleDesc": "Has access to user management related resources for a org"

        }

    ],
    orgID: ["ANUVAAD"]
}

export default {adminConfig, superAdminConfig};