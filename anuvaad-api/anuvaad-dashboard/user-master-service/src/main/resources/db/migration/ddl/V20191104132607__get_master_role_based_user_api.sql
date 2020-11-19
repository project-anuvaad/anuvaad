
INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (180,'Get Default Role Based User','Get Default Role Based User','/user/getUsersByMasterRole','user',1,147,now(),NULL,NULL);


INSERT INTO role_actions(role_id, action_id)
values
(2000,180),
(2001,180);