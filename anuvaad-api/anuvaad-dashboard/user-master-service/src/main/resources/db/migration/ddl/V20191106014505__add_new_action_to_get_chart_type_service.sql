
INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (187,'Get Chart Type By Api','Get Chart By Api','/master/getChartTypeByApi','master',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,187),
(2001,187);