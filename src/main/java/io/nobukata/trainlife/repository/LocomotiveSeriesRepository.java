package io.nobukata.trainlife.repository;

import io.nobukata.trainlife.entity.LocomotiveSeries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocomotiveSeriesRepository extends JpaRepository<LocomotiveSeries, Long> {
}
