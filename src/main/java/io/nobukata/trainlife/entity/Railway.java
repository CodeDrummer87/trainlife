package io.nobukata.trainlife.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "railways")
public class Railway {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "full_title", nullable = false)
    private String fullTitle;
    private String abbreviation;
    private String code;
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
