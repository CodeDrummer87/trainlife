package io.nobukata.trainlife.repository;

import io.nobukata.trainlife.entity.LocomotiveDepot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocomotiveDepotRepository extends JpaRepository<LocomotiveDepot, Long> {

    List<LocomotiveDepot> findByRailwayId(Long id);
}
