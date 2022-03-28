INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (190,'Enable Or Disable Age Group','Enable Or Disable Age Group','/master/enableAgeGroup','master',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,190),
(2001,190);