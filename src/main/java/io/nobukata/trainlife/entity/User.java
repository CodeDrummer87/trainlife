package io.nobukata.trainlife.entity;

import io.nobukata.trainlife.security.entity.Account;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
}
