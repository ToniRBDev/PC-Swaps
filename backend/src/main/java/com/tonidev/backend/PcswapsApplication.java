package com.tonidev.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PcswapsApplication {

	public static void main(String[] args) {
		SpringApplication.run(PcswapsApplication.class, args);
	}

}
