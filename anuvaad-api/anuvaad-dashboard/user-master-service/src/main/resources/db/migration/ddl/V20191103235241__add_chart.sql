INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (158,'Add Chart','Add Chart','/meta/addChart','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (159,'Add Visualization','Add Visualization','/dashboard/addNewVisualization','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (160,'Add Dashboard','Add Dashboard','/dashboard/addNewDashboard','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (161,'Get Dashboard Detail','Get Dashboard Detail','/dashboard/getDashboardDetail','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (162,'Get Mapped Visualization','Get Mapped Visualization','/dashboard/getMappedVisualization','user',1,147,now(),NULL,NULL);


INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (163,'Get UnMapped Visualization','Get UnMapped Visualization','/dashboard/getUnmappedVisualization','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (164,'Get Role By Dashboard','Get Role By Dashboard','/dashboard/getRoleByDashboard','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (165,'Get Chart By Visualization','Get Chart By Visualization','/dashboard/getChartByVisualization','user',1,147,now(),NULL,NULL);


INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (166,'Get Visualization','Get Visualization','/dashboard/getVisualization','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (167,'Get Unmapped Visualization','Get Unmapped Visualization','/dashboard/getUnmappedChartToVisualization','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (168,'Get mapped Visualization','Get Unmapped Visualization','/dashboard/getUnmappedChartToVisualization','user',1,147,now(),NULL,NULL);


INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (169,'Get Role By Visualization','Get Role By Visualization','/dashboard/getRoleByVisualization','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (170,'Get Chart By Visualization','Get Chart By Visualization','/dashboard/getUnmappedChartToVisualization','user',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,158),
(2001,158),
(2000,159),
(2001,159),
(2000,160),
(2001,160),
(2000,161),
(2001,161),
(2000,162),
(2001,162),
(2000,163),
(2001,163),
(2000,164),
(2001,164),
(2000,165),
(2001,165),
(2000,166),
(2001,166),
(2000,167),
(2001,167),
(2000,168),
(2001,168),
(2000,169),
(2001,169),
(2000,170),
(2001,170);
