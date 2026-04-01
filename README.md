## 🚀 Phase 2: Inventory Management (Completed ✅)

### Product Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create a new product |
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get product by ID |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product (soft delete) |
| GET | `/api/products/search?name={name}` | Search products by name |
| GET | `/api/products/low-stock` | Get products with low stock |
| PATCH | `/api/products/{id}/stock?quantity={qty}` | Update stock quantity |

### Category Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/categories` | Create a new category |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/{id}` | Get category by ID |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |
| GET | `/api/categories/search?name={name}` | Search categories |
| GET | `/api/categories/{id}/products` | Get products in category |

### 📦 Example: Creating a Product with Category

```bash
# First, create a category
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Electronics", "description": "Electronic devices"}'

# Then create a product in that category
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "description": "Latest smartphone",
    "price": 699.99,
    "stockQuantity": 50,
    "sku": "PHONE-001",
    "categoryId": 1
  }'
