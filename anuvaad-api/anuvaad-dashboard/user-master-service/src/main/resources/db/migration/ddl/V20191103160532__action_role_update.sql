INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (149,'Get All Role By OrgDomain','Get All Role By OrgDomain','/user/domainRole','user',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,149),
(2001,149);
