INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (181,'Unmap Chart From Visualization','Unmap Chart From Visualization','/dashboard/unmapChartToVisualization','dashboard',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (182,'Map Chart To Visualization','Map Chart To Visualization','/dashboard/mapChartToVisualization','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (183,'Get Chart','Get Chart','/meta/getChart','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (184,'Delete Chart','Delete Chart','/meta/deleteChart','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (185,'Update Chart','Update Chart','/meta/updateChart','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (186,'Update Organization','Update Organization','/master/updateOrg','user',1,147,now(),NULL,NULL);


INSERT INTO role_actions(role_id, action_id)
values
(2000,181),
(2001,181),
(2000,182),
(2001,182),
(2000,183),
(2001,183),
(2000,184),
(2001,184),
(2000,185),
(2001,185),
(2000,186),
(2001,186);