package io.nobukata.trainlife.rest;

import io.nobukata.trainlife.security.entity.Account;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String root() {
        return "forward:/html/index.html";
    }

    @GetMapping("/login")
    public String login(Authentication authentication) {
        if (isAuthenticated(authentication)) {
            return "redirect:/account";
        }
        return "forward:/html/login.html";
    }

    @GetMapping("/register")
    public String register(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof Account currentAccount)) {
            return "forward:/html/register.html";
        }

        if (Boolean.TRUE.equals(currentAccount.getWasIntroduced())) {
            return "redirect:/account";
        }

        return "forward:/html/register.html";
    }

    @GetMapping("/introduce")
    public String introduce(Authentication auth) {
        if (auth.getPrincipal() instanceof Account currentAccount && currentAccount.getWasIntroduced()) {
            return "redirect:/account";
        }

        return "forward:/html/introduce.html";
    }

    @GetMapping("/account")
    public String account() {
        return "forward:/html/account.html";
    }

    @GetMapping("/admin")
    public String admin() {
        return "forward:/html/admin.html";
    }

    @GetMapping("/new-trip")
    public String newTrip() {
        return "forward:/html/new-trip.html";
    }

    private boolean isAuthenticated(Authentication auth) {
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }
}
