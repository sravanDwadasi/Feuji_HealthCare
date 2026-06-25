package com.healthcare.ai.controller;

import com.healthcare.ai.dto.AiReviewResponse;
import com.healthcare.ai.dto.AuthorizationReviewRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {

    @PostMapping("/review")
    public AiReviewResponse review(@RequestBody AuthorizationReviewRequest request) {

        StringBuilder recommendation = new StringBuilder();

        if(request.getInsuranceId() == null || request.getInsuranceId().isBlank()) {

            recommendation.append("Insurance ID is missing. ");
        }

        if(request.getDiagnosisCode() == null || request.getDiagnosisCode().isBlank()) {

            recommendation.append("Diagnosis Code is missing. ");
        }

        if(request.getProcedureCode() == null || request.getProcedureCode().isBlank()) {

            recommendation.append("Procedure Code is missing. ");
        }

        if(request.getClinicalNotes() == null || request.getClinicalNotes().length() < 20) {

            recommendation.append("Clinical notes are too short. ");
        }

        if(recommendation.isEmpty()) {

            recommendation.append("Request looks good. Ready for submission.");
        }

        return new AiReviewResponse(recommendation.toString());
    }
}