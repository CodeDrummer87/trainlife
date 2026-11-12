package io.nobukata.trainlife.repository;

import io.nobukata.trainlife.entity.Railway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RailwayRepository extends JpaRepository<Railway, Long> {

    List<Railway> findAllByIsActiveTrue();
}
