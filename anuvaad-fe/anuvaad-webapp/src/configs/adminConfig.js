const adminConfig = {
    roles: [
        {

            "roleCode": "TRANSLATOR",
            "roleDesc": "Has access to translation related resources"
        },

        {

            "roleCode": "ADMIN",
            "roleDesc": "Has access to manage the users"

        },
        {

            "roleCode": "ANNOTATOR",
            "roleDesc": "Access to evaluate our model"

        },
        {
            "roleCode": "SCHOLAR",
            "roleDesc": "Has access to translation or test models"

        }

    ],
    orgID: ["ANUVAAD"]
}

export default adminConfig;