package io.nobukata.trainlife.security.service;

import io.nobukata.trainlife.entity.User;
import io.nobukata.trainlife.security.entity.Account;
import io.nobukata.trainlife.security.entity.Role;
import io.nobukata.trainlife.security.repository.AccountRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AccountService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(AccountService.class);

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.debug("Аккаунт не найден для пользователя: {}", username);
                    return new UsernameNotFoundException(".:: Пользователь " + username + " не существует");
                });
    }

    @Transactional
    public void register(String username, String password) {
        if (accountRepository.existsByUsername(username)) {
            log.warn("Попытка регистрации с уже занятым логином: {}", username);
            throw new IllegalArgumentException(".:: Логин уже занят");
        }

        Account account = new Account();
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(password));
        account.setRole(Role.USER); // ★87

        User user = new User();
        user.setAccount(account);

        account.setUser(user);

        accountRepository.save(account);
        log.info("Зарегистрирован новый пользователь: {}", username);
    }
}
