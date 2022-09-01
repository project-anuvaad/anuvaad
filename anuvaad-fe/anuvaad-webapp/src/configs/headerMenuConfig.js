import { translate } from "../assets/localisation";
import history from "../web.history";

const userRoles = ["TRANSLATOR", "ANNOTATOR", "ADMIN", "SUPERADMIN"];
const menuTypes = ["USER", "SETTINGS", "MAIN"];

const headerMenuConfig = [
    {
        id : "profile",
        title: translate('header.page.heading.MyProfile'),
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/profile`),
        rolesAllowed : userRoles,
        menuType : menuTypes[0],
    },
    {
        id : "my-glossary",
        title: "My Glossary",
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/my-glossary`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[1]
    },
    {
        id : "assign-nmt-model",
        title: "Assign NMT models",
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/assign-nmt-model`),
        rolesAllowed : [userRoles[0], userRoles[2]],
        menuType : menuTypes[1]
    },
    {
        id : "instant-translate",
        title: translate('dashboard.page.heading.title'),
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/instant-translate`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[2]
    },
    {
        id : "user-details",
        title: "User Details",
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/user-details`),
        rolesAllowed : [userRoles[2], userRoles[3]],
        menuType : menuTypes[2]
    },
    {
        id : "glossary-upload",
        title: "Glossary Upload",
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/glossary-upload`),
        rolesAllowed : [userRoles[2], userRoles[3]],
        menuType : menuTypes[2]
    },
    {
        id : "organization-list",
        title: "Organization List",
        onclick : ()=>history.push(`${process.env.PUBLIC_URL}/organization-list`),
        rolesAllowed : [userRoles[3]],
        menuType : menuTypes[2]
    },
    {
        id : "suggestion-list",
        title: "Suggestion List",
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/suggestion-list/${assignedOrgId}`),
        rolesAllowed : [userRoles[2]],
        menuType : menuTypes[2]
    },
    {
        id : "my-suggestions",
        title: "My Glossary Suggestions",
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/my-suggestions/${assignedOrgId}`),
        rolesAllowed : [userRoles[0]],
        menuType : menuTypes[2]
    },
    {
        id : "organization-glossary",
        title: "Glossary List",
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/organization-glossary/${assignedOrgId}`),
        rolesAllowed : [userRoles[2]],
        menuType : menuTypes[2]
    },
    {
        id : "view-scheduled-jobs",
        title: "View Jobs",
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/view-scheduled-jobs`),
        rolesAllowed : [userRoles[2], userRoles[3]],
        menuType : menuTypes[2]
    },
    {
        id : "view-document",
        title: "Translate document",
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/view-document`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[2]
    },
    {
        id : "document-digitization",
        title: "Digitize Document",
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/document-digitization`),
        rolesAllowed : [userRoles[0], userRoles[1]],
        menuType : menuTypes[2]
    },
    {
        id : "view-annotation-job",
        title: "View Annotation Job",
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/view-annotation-job`),
        rolesAllowed : [userRoles[1]],
        menuType : menuTypes[2]
    },
    {
        id : "logout",
        title: translate('header.page.heading.logout'),
        onclick : (assignedOrgId)=>history.push(`${process.env.PUBLIC_URL}/logout`),
        rolesAllowed : userRoles,
        menuType : menuTypes[0]
    },
]

export default headerMenuConfig;