INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (177,'Add Store Manager','Add Store Manager','/master/store/addStoreManager','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (178,'Add SalesArea Manager','Add SalesArea Manager','/master/salesArea/addSalesAreaManager','user',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (179,'Add Country Manager','Add Country Manager','/master/addCountryManager','user',1,147,now(),NULL,NULL);


INSERT INTO role_actions(role_id, action_id)
values
(2000,177),
(2001,177),
(2000,178),
(2001,178),
(2000,179),
(2001,179);