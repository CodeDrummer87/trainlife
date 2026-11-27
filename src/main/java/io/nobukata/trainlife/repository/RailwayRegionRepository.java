package io.nobukata.trainlife.repository;

import io.nobukata.trainlife.entity.RailwayRegion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RailwayRegionRepository extends JpaRepository<RailwayRegion, Long> {

    List<RailwayRegion> findAllByRailwayId(Long id);
}
