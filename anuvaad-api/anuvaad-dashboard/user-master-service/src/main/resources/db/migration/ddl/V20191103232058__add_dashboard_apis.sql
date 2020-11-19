INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (154,'Get Service Api','Get Service Api','/meta/getAllServiceApi','user',1,147,now(),NULL,NULL);


INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (155,'Get All Charts','Get All Charts','/meta/getAllChart','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (156,'Get All Visualizations','Get All Visualizations','/dashboard/getAllVisualizations','user',1,147,now(),NULL,NULL);


INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (157,'Get All Dashboards','Get All Dashboards','/dashboard/getAllDashboard','user',1,147,now(),NULL,NULL);


INSERT INTO role_actions(role_id, action_id)
values
(2000,154),
(2001,154),
(2000,155),
(2001,155),
(2000,156),
(2001,156),
(2000,157),
(2001,157);
