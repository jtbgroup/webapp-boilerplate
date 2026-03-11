package com.productgen.dto;

public final class AuthDtos {

    private AuthDtos() {}

    public record LoginRequest(String username, String password) {}

    public record UserResponse(String username, String role) {}
}
