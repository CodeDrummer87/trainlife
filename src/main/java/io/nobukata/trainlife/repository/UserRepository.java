package io.nobukata.trainlife.repository;

import io.nobukata.trainlife.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByAccountUsername(String username);

    @EntityGraph(attributePaths = {
            "position",
            "tractionKind",
            "serviceType",
            "locomotiveDepot"})
    @Query("select u from User u where u.account.username = :username")
    Optional<User> findWithDetailsByAccountUsername(@Param("username") String username);
}
