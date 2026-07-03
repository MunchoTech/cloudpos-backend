package com.cloudpos.cloudpos_backend.controller;

import com.cloudpos.cloudpos_backend.dto.ApiResponse;
import com.cloudpos.cloudpos_backend.dto.SaleRequest;
import com.cloudpos.cloudpos_backend.model.Sale;
import com.cloudpos.cloudpos_backend.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @PostMapping
    public ResponseEntity<?> processSale(@RequestBody SaleRequest request) {
        try {
            Sale sale = saleService.processSale(request);
            return ResponseEntity.ok(new ApiResponse(true, "Sale processed successfully", sale));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSales() {
        try {
            List<Sale> sales = saleService.getAllSales();
            return ResponseEntity.ok(new ApiResponse(true, "Sales retrieved", sales));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSaleById(@PathVariable Long id) {
        try {
            Sale sale = saleService.getSaleById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Sale retrieved", sale));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodaySales() {
        try {
            List<Sale> sales = saleService.getTodaySales();
            return ResponseEntity.ok(new ApiResponse(true, "Today's sales", sales));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}