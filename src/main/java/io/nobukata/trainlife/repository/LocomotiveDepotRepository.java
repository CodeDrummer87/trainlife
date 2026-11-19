package io.nobukata.trainlife.repository;

import io.nobukata.trainlife.entity.LocomotiveDepot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocomotiveDepotRepository extends JpaRepository<LocomotiveDepot, Long> {

    List<LocomotiveDepot> findByRailwayIdAndIsActiveTrue(Long id);

    @Query(value =
            "SELECT * " +
            "FROM locomotive_depots " +
            "ORDER BY split_part(short_title, ' ', 2)",
            nativeQuery = true)
    List<LocomotiveDepot> findAllOrderByShortTitle();
}
