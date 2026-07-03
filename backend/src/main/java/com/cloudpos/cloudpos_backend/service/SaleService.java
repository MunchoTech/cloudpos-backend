package com.cloudpos.cloudpos_backend.service;

import com.cloudpos.cloudpos_backend.dto.SaleRequest;
import com.cloudpos.cloudpos_backend.model.*;
import com.cloudpos.cloudpos_backend.repository.ProductRepository;
import com.cloudpos.cloudpos_backend.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Sale processSale(SaleRequest request) {
        Sale sale = new Sale();
        sale.setPaymentMethod(request.getPaymentMethod());
        sale.setDiscountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO);
        sale.setTaxAmount(request.getTaxAmount() != null ? request.getTaxAmount() : BigDecimal.ZERO);

        List<SaleItem> saleItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (var itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            SaleItem saleItem = new SaleItem();
            saleItem.setSale(sale);
            saleItem.setProduct(product);
            saleItem.setQuantity(itemReq.getQuantity());
            saleItem.setUnitPrice(product.getPrice());
            saleItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));

            subtotal = subtotal.add(saleItem.getSubtotal());
            saleItems.add(saleItem);
        }

        sale.setSubtotal(subtotal);
        sale.setTotal(subtotal.add(sale.getTaxAmount()).subtract(sale.getDiscountAmount()));
        sale.setItems(saleItems);

        return saleRepository.save(sale);
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found: " + id));
    }

    public List<Sale> getTodaySales() {
        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        return saleRepository.findByCreatedAtBetween(start, end);
    }

    public BigDecimal getTodayTotal() {
        return getTodaySales().stream()
                .map(Sale::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}