package com.healthcare.provider.dto;

import lombok.Data;

@Data
public class PayerRequestDto {

    private Long providerRequestId;

    private String patientName;

    private String diagnosisCode;

    private String procedureCode;
}