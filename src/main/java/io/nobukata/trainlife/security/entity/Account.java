package io.nobukata.trainlife.security.entity;

import io.nobukata.trainlife.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "accounts")
public class Account implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "was_introduced", nullable = false)
    private Boolean wasIntroduced = false;

    @OneToOne(mappedBy = "account",     //.:: класс Account не управляет внешним ключом: это делает User
            cascade = CascadeType.ALL,  //.:: одним вызовом accountRepository.save() сохранится и Account, и User
            orphanRemoval = true,   //.:: работает в паре с Cascade: отвяжешь User от Account - Hibernate удалит User
            fetch = FetchType.LAZY) //.:: стратегия загрузки: не загружай User из БД, пока я явно к нему не обращусь
    private User user;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getUsername() { return username; }
    @Override public @Nullable String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
