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

    @JoinColumn(name = "full_name")
    private String fullName;

    @JoinColumn(name = "birth_date")
    private LocalDate dateOfBirth;

    private String position;

    @JoinColumn(name = "column_number")
    private Integer numberOfColumn;

    @JoinColumn(name = "personnel_number")
    private Integer personnelNumber;

    @JoinColumn(name = "long_personnel_number")
    private Integer long_personnelNumber;

    @JoinColumn(name = "traction_kind")
    private String tractionKind;

    @JoinColumn(name = "service_type")
    private String serviceType;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locomotive_depot_id")
    private LocomotiveDepot locomotiveDepot;
}
