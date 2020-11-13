INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (150,'Get Unmap Action','Get All UnMapped Action','/user/getUnmapActionToRole','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (151,'Get map Action','Get mapped Action','/user/getMapActionToRole','user',1,147,now(),NULL,NULL);


INSERT INTO role_actions(role_id, action_id)
values
(2000,150),
(2001,150),
(2000,151),
(2001,151);
