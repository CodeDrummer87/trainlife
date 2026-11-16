package io.nobukata.trainlife.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "stations")
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "railway_id")
    private Railway railway;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "has_turnout_point")
    private Boolean hasTurnoutPoint;

    @Column(name = "is_observed")
    private Boolean isObserved;
}
