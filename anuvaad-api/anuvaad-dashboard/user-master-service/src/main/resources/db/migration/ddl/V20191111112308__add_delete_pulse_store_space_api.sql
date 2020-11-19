INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (191,'Delete Pulse Store Space Api','Delete Store Space Config Api','/master/deletePulseConfigToStoreSpace','master',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,191),
(2001,191);