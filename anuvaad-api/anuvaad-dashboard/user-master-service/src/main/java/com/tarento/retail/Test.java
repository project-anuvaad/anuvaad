package com.tarento.retail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


public class Test {
	
		
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String pass= "admin@123";
		BCryptPasswordEncoder encoder =new BCryptPasswordEncoder();
		String val =encoder.encode(pass);
		
		System.out.println(val);

	}

}
