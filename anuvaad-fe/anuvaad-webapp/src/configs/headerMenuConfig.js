import { translate } from "../assets/localisation";
import history from "../web.history";

const userRoles = ["TRANSLATOR", "ANNOTATOR", "ADMIN", "SUPERADMIN", "REVIEWER"];
const menuTypes = ["USER", "SETTINGS", "MAIN", "DASHBOARD"];

const headerMenuConfig = [
    {
        id : "profile",
        title: translate('header.page.heading.MyProfile'),
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/profile`),
        rolesAllowed : userRoles,
        menuType : menuTypes[0],
    },
    {
        id : "review-documents",
        title: "Review Documents",
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/review-documents`),
        rolesAllowed : [userRoles[2], userRoles[4] ],
        menuType : menuTypes[2],
    },
    {
        id : "my-glossary",
        title: "My Glossary List",
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/my-glossary`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[1]
    },
    {
        id : "assign-nmt-model",
        title: "Assign NMT models",
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/assign-nmt-model`),
        rolesAllowed : [userRoles[0], userRoles[2]],
        menuType : menuTypes[1]
    },
    {
        id : "view-document",
        title: "Translations",
        followOrg : false,
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/view-document`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[3]
    },
    {
        id : "document-digitization",
        title: "Digitization",
        followOrg : false,
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/document-digitization`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[3]
    },
    {
        id : "data-collection",
        title: "Data Collection",
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/data-collection`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[1]
    },
    {
        id : "digitize-document-upload",
        title: "Digitize Document",
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/digitize-document-upload`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[2]
    },
    {
        id : "document-upload",
        title: "Translate Document",
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/document-upload`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[2]
    },
    {
        id : "instant-translate",
        title: translate('dashboard.page.heading.title'),
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/instant-translate`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[1]
    },
    {
        id : "user-details",
        title: "User Details",
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/user-details`),
        rolesAllowed : [userRoles[2], userRoles[3]],
        menuType : menuTypes[2]
    },
    {
        id : "glossary-upload",
        title: "Glossary Upload",
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/glossary-upload`),
        rolesAllowed : [userRoles[3]],
        menuType : menuTypes[2]
    },
    {
        id : "organization-list",
        title: "Organization List",
        followOrg : false,
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/organization-list`),
        rolesAllowed : [userRoles[3]],
        menuType : menuTypes[2]
    },
    {
        id : "suggestion-list",
        title: "Suggestion List",
        followOrg : true,
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/suggestion-list/${assignedOrgId}`),
        rolesAllowed : [userRoles[2]],
        menuType : menuTypes[2]
    },
    {
        id : "my-suggestions",
        title: "My Glossary Suggestions",
        followOrg : true,
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/my-suggestions/${assignedOrgId}`),
        rolesAllowed : [userRoles[0]],
        menuType : menuTypes[1]
    },
    {
        id : "organization-glossary",
        title: "Glossary List",
        followOrg : true,
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/organization-glossary/${assignedOrgId}`),
        rolesAllowed : [userRoles[2]],
        menuType : menuTypes[2]
    },
    // {
    //     id : "view-scheduled-jobs",
    //     title: "View Jobs",
    //     onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/view-scheduled-jobs`),
    //     rolesAllowed : [userRoles[2], userRoles[3]],
    //     menuType : menuTypes[2]
    // },
    // {
    //     id : "view-annotation-job",
    //     title: "View Annotation Job",
    //     onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/view-annotation-job`),
    //     rolesAllowed : [userRoles[1]],
    //     menuType : menuTypes[2]
    // },
    // {
    //     id : "analytics",
    //     title: "Analytics",
    //     onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/analytics`),
    //     rolesAllowed : userRoles,
    //     menuType : menuTypes[2]
    // },
    {
        id : "logout",
        title: translate('header.page.heading.logout'),
        followOrg : false,
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/logout`),
        rolesAllowed : userRoles,
        menuType : menuTypes[0]
    },
]

export default headerMenuConfig;