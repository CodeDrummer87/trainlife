package io.nobukata.trainlife.repository;

import io.nobukata.trainlife.entity.TrafficLight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficLightRepository extends JpaRepository<TrafficLight, Long> {

    List<TrafficLight> findAllByStationId(Long stationId);
}
