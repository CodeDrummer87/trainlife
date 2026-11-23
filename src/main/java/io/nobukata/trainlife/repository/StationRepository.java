package io.nobukata.trainlife.repository;

import io.nobukata.trainlife.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {

    List<Station> findAllByHasTurnoutPointIsTrue();
    List<Station> findAllByRailwayId(Long id);
}
