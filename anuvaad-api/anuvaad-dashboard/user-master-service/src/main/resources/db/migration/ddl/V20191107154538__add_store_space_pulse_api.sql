
INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (188,'Update QR Code','Update QR Code','/master/updateQRCode','master',1,147,now(),NULL,NULL);

INSERT INTO actions(id,name,display_name, url, service_code, enabled, created_user, created_date, update_user, update_date)
value (189,'Get All Store Space Mapping','Get All Store Space Mapping','/master/updateQRCode','master',1,147,now(),NULL,NULL);

INSERT INTO role_actions(role_id, action_id)
values
(2000,188),
(2001,188),
(2000,188),
(2001,189);