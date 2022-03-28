
INSERT INTO user(id,password,username,email_id, phone_no,is_active, is_deleted,org_id)
value(147,'$2a$10$fGCOo1khhaxJWRQJ0EsmbODPtvn.cQq/wX7RZ6GMnjypSBzSPHDw6','satishkumar.nirmalkar@tarento.com', 'satishkumar.nirmalkar@tarento.com', null, true,false,5000);

INSERT INTO user_role(user_id, role_id, org_id)
value(147,2000,5000);

 INSERT INTO country(id,code,name,currency,phone_code, url,org_id)
 value(1,'IND','India','INR','91','https://restcountries.eu/data/ind.svg',5000);
 
 INSERT INTO country_user(user_id, country_id)
 value(147,1);
