package com.healthcare.provider.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "authorization_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorizationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private String insuranceId;

    private String diagnosisCode;

    private String procedureCode;

    @Column(length = 3000)
    private String clinicalNotes;

    private String status;

    @Column(length = 3000)
    private String aiRecommendation;
}