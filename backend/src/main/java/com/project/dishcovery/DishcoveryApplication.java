package com.project.dishcovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DishcoveryApplication {

	public static void main(String[] args) {
		SpringApplication.run(DishcoveryApplication.class, args);
	}

}
