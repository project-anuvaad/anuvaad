INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (192,'Get Sales Area Api','Get Sales Area Api','/master/salesArea/getSalesAreas','master',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,192),
(2001,192);


INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (193,'Update Sales Area Api','Update Sales Area Api','/master/salesArea/update','master',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,193),
(2001,193);



INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (194,'Get Store Api','Get Store Api','/master/store/get','master',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,194),
(2001,194);