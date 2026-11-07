package io.nobukata.trainlife.entity;

import io.nobukata.trainlife.security.entity.Account;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @OneToOne(fetch = FetchType.LAZY,
            optional = false)   //.:: декларация уровня JPA => User не может сущестовать без Account
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    private String nickname;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position;

    @Column(name = "number_of_column")
    private Integer numberOfColumn;

    @Column(name = "personnel_number")
    private Integer personnelNumber;

    @Column(name = "long_personnel_number")
    private Integer longPersonnelNumber;

    @Column(name = "traction_kind")
    private String tractionKind;

    @Column(name = "service_type")
    private String serviceType;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locomotive_depot_id")
    private LocomotiveDepot locomotiveDepot;


    public void setDepotId(Long depotId) {
        this.locomotiveDepot.setId(depotId);
    }
}
