const adminConfig = {
    roles: [
        {

            "roleCode": "TRANSLATOR",
            "roleDesc": "Has access to translation related resources"
        },
        {

            "roleCode": "ANNOTATOR",
            "roleDesc": "Access to evaluate our model"

        },
    ],
    orgID: ["ANUVAAD"]
}

const superAdminConfig = {
    roles: [
        {

            "roleCode": "TRANSLATOR",
            "roleDesc": "Has access to translation related resources"
        },
        {

            "roleCode": "ANNOTATOR",
            "roleDesc": "Access to evaluate our model"

        },
        {

            "roleCode": "ADMIN",
            "roleDesc": "Has access to manage the users"

        }

    ],
    orgID: ["ANUVAAD"]
}

const ObjToExport = localStorage.getItem("roles") == "SUPERADMIN" ? superAdminConfig : adminConfig

export default ObjToExport;