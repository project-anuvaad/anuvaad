INSERT INTO role(id,role_name, code, description, is_super_admin, is_org_admin)
values(2000,'Super Admin', 'SUPER_ADMIN', 'Super Admin Role', true, false),
(2001,'Organization Admin', 'ORG_ADMIN', 'Organization Admin Role', false, true),
(2002,'Country Manager', 'COUNTRY_MANAGER', 'Country Manager Role', false, false),
(2003, 'Sales Area Manager', 'SALESAREA_MANAGER', 'Sales Area Manager Role', false, false),
(2004, 'Store Manager', 'STORE_MANAGER', 'Store Manager Role', false, false);


INSERT INTO org_domain_role(org_domain, role_id)
values('RL',2001),
('RL',2002),
('RL',2003),
('RL',2004);