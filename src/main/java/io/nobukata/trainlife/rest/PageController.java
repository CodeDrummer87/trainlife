package io.nobukata.trainlife.rest;

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
    public String register() {
        return "forward:/html/register.html";
    }

    @GetMapping("/introduce")
    public String introduce() {
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

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }
}

