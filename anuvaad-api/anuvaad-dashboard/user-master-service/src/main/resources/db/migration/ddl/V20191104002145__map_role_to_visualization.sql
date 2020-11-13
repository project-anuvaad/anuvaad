INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (175,'Map Visualization - Dashboard','Map Visualization - Dashboard','/dashboard/mapVisualizationToDashboard','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (176,'UnMap Visualization - Dashboard','UnMap Visualization - Dashboard','/dashboard/unmapVisualizationFromDashboard','user',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,175),
(2001,175),
(2000,176),
(2001,176);