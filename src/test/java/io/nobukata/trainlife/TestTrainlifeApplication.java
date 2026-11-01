package io.nobukata.trainlife;

import org.springframework.boot.SpringApplication;

public class TestTrainlifeApplication {

	public static void main(String[] args) {
		SpringApplication.from(TrainlifeApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
