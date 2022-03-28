CREATE TABLE `address` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `street` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `pincode` bigint(20) NOT NULL,
  `address_loc` varchar(100) DEFAULT NULL,
  `country_code` varchar(50) DEFAULT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1100 DEFAULT CHARSET=latin1;


CREATE TABLE `country` (
  `id` bigint(3) NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `currency` varchar(45) DEFAULT NULL,
  `phone_code` varchar(45) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `org_id` int  NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `user` (
  `id` bigint(20)  AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `phone_no` varchar(45) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_deleted` tinyint(1) DEFAULT '0',
  `org_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=latin1;


CREATE TABLE `country_user` (
  `user_id` bigint(20) NOT NULL,
  `country_id` bigint(3) NOT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
  KEY `fk_country_user_userid_idx` (`user_id`),
  KEY `fk_country_user_countryid_idx` (`country_id`),
  CONSTRAINT `fk_country_user_countryid` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_country_user_userid` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `actions` (
   `id` bigint(20) NOT NULL AUTO_INCREMENT,
   `name` varchar(255) DEFAULT NULL,
   `display_name` varchar(255) NOT NULL,
   `url` varchar(500) NOT NULL,
   `service_code` varchar(100) NOT NULL,
   `menu_group_code` varchar(45) NOT NULL,
   `menu_group_name` varchar(255) DEFAULT NULL,
   `colour_code` varchar(45) NOT NULL,
   `enabled` tinyint(4) NOT NULL,
   `created_user` bigint(20) NOT NULL,
   `created_date` datetime DEFAULT NULL,
   `update_user` bigint(20) DEFAULT NULL,
   `update_date` datetime DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1 ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=latin1;


CREATE TABLE `role` (
   `id` bigint(20) NOT NULL AUTO_INCREMENT,
   `role_name` varchar(255) NOT NULL,
   `code` varchar(125) NOT NULL,
   `description` varchar(255) DEFAULT NULL,
   `is_super_admin` bit(1) DEFAULT NULL,
   `is_org_admin` bit(1) DEFAULT NULL,
    PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=2000 DEFAULT CHARSET=latin1;


 CREATE TABLE `role_org`(
      `role_id` bigint(20) NOT NULL,
      `org_id` bigint(20) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=latin1;
 

CREATE TABLE `role_actions` (
   `role_id` bigint(20) NOT NULL,
   `action_id` bigint(20) NOT NULL,
   KEY `role_id` (`role_id`),
   KEY `action_id` (`action_id`),
   CONSTRAINT `role_actions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
   CONSTRAINT `role_actions_ibfk_2` FOREIGN KEY (`action_id`) REFERENCES `actions` (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 

 CREATE TABLE `user_role` (
   `user_id` bigint(20) DEFAULT NULL,
   `role_id` bigint(20) DEFAULT NULL,
   `org_id`  bigint(20) DEFAULT NULL,
   KEY `fk_user_role_userId` (`user_id`),
   KEY `fk_user_role_roleId` (`role_id`),
   CONSTRAINT `fk_user_role_userId` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
   CONSTRAINT `fk_user_role_roleId` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
 )ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=latin1; ;

CREATE TABLE `user_profile` (
  `id` bigint(5)  AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `avatar_url` varchar(200) DEFAULT NULL,
  `user_profilecol` varchar(45) DEFAULT NULL,
  `work_start_date` datetime DEFAULT NULL,
  `work_end_date` datetime DEFAULT NULL,
  `salary` bigint(20) DEFAULT NULL,
  `email_id` varchar(100) DEFAULT NULL,
  `country` varchar(200) DEFAULT NULL,
  `registration_date` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint(20) DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` bigint(20) DEFAULT NULL,
  `employment_type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_profile_user_idx` (`user_id`),
  KEY `fk_user_profile_created_by_idx` (`created_by`),
  KEY `fk_user_profile_updated_by_idx` (`updated_by`),
  CONSTRAINT `fk_user_profile_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_profile_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_profile_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=latin1;

CREATE TABLE `user_device` (
  `id` bigint(20)  AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `device_token` varchar(200) DEFAULT NULL,
  `created_date` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_device_user_id_idx` (`user_id`),
  CONSTRAINT `fk_user_device_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=latin1;


CREATE TABLE `user_authentication` (
  `id` bigint(20) AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `auth_token` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3005 DEFAULT CHARSET=latin1;


CREATE TABLE org_domain_role(
   org_domain varchar(20) NOT NULL,
   role_id bigint(20) NOT NULL
);





