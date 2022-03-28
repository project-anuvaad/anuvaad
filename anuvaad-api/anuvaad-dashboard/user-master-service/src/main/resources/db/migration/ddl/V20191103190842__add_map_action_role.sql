INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (152,'Map Action Role','Map Action Role','/user/mapActionToRole','user',1,147,now(),NULL,NULL);


INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (153,'UnMap Action Role','UnMap Action Role','/user/unmapActionToRole','user',1,147,now(),NULL,NULL);


INSERT INTO role_actions(role_id, action_id)
values
(2000,152),
(2001,152),
(2000,152),
(2001,153);

