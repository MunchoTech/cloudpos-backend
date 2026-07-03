package com.cloudpos.cloudpos_backend.controller;

import com.cloudpos.cloudpos_backend.dto.ApiResponse;
import com.cloudpos.cloudpos_backend.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    @Autowired
    private SaleService saleService;

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        try {
            Map<String, Object> summary = new HashMap<>();
            summary.put("todayTotal", saleService.getTodayTotal());
            summary.put("todaySalesCount", saleService.getTodaySales().size());
            summary.put("totalSales", saleService.getAllSales().size());
            return ResponseEntity.ok(new ApiResponse(true, "Summary retrieved", summary));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/daily")
    public ResponseEntity<?> getDailyReport(@RequestParam String date) {
        try {
            Map<String, Object> report = new HashMap<>();
            report.put("sales", saleService.getTodaySales());
            report.put("total", saleService.getTodayTotal());
            return ResponseEntity.ok(new ApiResponse(true, "Daily report", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}