package com.webappboilerplate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.webappboilerplate.entity.UserAudit;

import java.util.UUID;

public interface UserAuditRepository extends JpaRepository<UserAudit, UUID> {
}
