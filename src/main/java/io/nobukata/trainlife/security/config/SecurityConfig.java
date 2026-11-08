package io.nobukata.trainlife.security.config;

import io.nobukata.trainlife.security.filter.JwtAuthenticationFilter;
import io.nobukata.trainlife.security.service.JwtService;
import jakarta.servlet.http.Cookie;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/login",
                                "/register",
                                "/error",
                                "/html/login.html",
                                "/html/register.html",
                                "/html/index.html").permitAll()
                        .requestMatchers("/css/**", "/js/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(
                                "/admin",
                                "/html/admin.html").hasRole("ADMIN")
                        .requestMatchers(
                                "/introduce",
                                "/account",
                                "/html/account.html").hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(e -> e
                        //.:: Error 401 - пользователь не представился (нет валидного JWT)
                        .authenticationEntryPoint((request, response, authException) ->{
                            log.debug("Неаутентифицированный вход {}: {}",
                                    request.getRequestURI(), authException.getMessage());
                            Cookie cookie = new Cookie("jwt-token", null);
                            cookie.setMaxAge(0);
                            cookie.setPath("/");
                            cookie.setHttpOnly(true);
                            response.addCookie(cookie);
                            response.sendRedirect("/login");
                        })
                        //.:: Error 403 - пользователь имеет JWT, но ему запрещён данный ресурс
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            log.warn("Доступ отклонён {}: {}",
                                    request.getRequestURI(), accessDeniedException.getMessage());
                            response.sendRedirect("/account");
                        })
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
