package io.nobukata.trainlife.repository;

import io.nobukata.trainlife.entity.TractionKind;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TractionKindRepository extends JpaRepository<TractionKind, Long> {
}
