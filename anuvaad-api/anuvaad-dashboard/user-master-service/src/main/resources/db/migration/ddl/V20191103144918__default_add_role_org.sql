INSERT INTO role_org(role_id, org_id)
value(2000,5000);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (148,'Get ALL Space By Org','Get ALL Space By Org','/master/store/getAllSpaceByOrg','user',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,148),
(2001,148);
