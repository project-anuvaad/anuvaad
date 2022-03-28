INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (171,'Map Role to Visualization','Map Role to Visualization','/dashboard/mapRoleToVisualization','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (172,'Map Role to Dashboard','Map Role to Dashboard','/dashboard/mapRoleToDashboard','user',1,147,now(),NULL,NULL);


INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (173,'Update Dashboard','Update Dashboard','/dashboard/updateDashboard','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (174,'Update Visualization','Update Visualization','/dashboard/updateVisualization','user',1,147,now(),NULL,NULL);


INSERT INTO role_actions(role_id, action_id)
values
(2000,171),
(2001,171),
(2000,172),
(2001,172),
(2000,173),
(2001,173),
(2000,174),
(2001,174);