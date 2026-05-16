package com.tonidev.backend;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PcswapsApplication {

    public static void main(String[] args) {
        SpringApplication.run(PcswapsApplication.class, args);

        System.out.println("======================================================");
        System.out.println("  🚀 PC-Swaps - Spring Boot iniciado");
        System.out.println("  API REST:    http://localhost:8080/api");
        System.out.println("  Swagger UI:  http://localhost:8080/swagger-ui.html");
        System.out.println("======================================================");
    }
}
