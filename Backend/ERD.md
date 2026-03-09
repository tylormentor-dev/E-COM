# ERD for `mechanic_connect` Database



## 1. Users
**PK:** id  
**Attributes:** fullname, email, phone, address, id_number, password_hash, profile_image, dob, role, created_at, updated_at  
**Relationships:**  
- 1–1 with **mechanics** (a user can be a mechanic)  
- 1–M with **bookings** (as customer)  
- 1–M with **car_listing** (as seller)  
- 1–M with **orders**  
- 1–M with **reviews** (as reviewer)  
- 1–M with **notifications**  
- 1–M with **payments**  


## 2. Mechanics
**PK:** id  
**FK:** user_id → users.id  
**Attributes:** location, bio, years_experience, rating, availability, notes_on_pricing, updated_at  
**Relationships:**  
- 1–M with **services**  
- 1–M with **bookings**  
- 1–M with **reviews**  


## 3. Services
**PK:** id  
**FK:** mechanic_id → mechanics.id  
**Attributes:** name, description, duration, price, created_at, updated_at  
**Relationships:**  
- M–1 with **mechanics**  
- 1–M with **bookings**  


## 4. Bookings
**PK:** id  
**FKs:**  
- mechanic_id → mechanics.id  
- service_id → services.id  
- user_id → users.id  
**Attributes:** booking_date, status, car_model, total_price, payment_method, created_at, confirmed_at, updated_at  


## 5. Car Listing
**PK:** id  
**FK:** seller_id → users.id  
**Attributes:** name, model, year, km_driven, price, color, transmission, fuel_capacity, category, vehicle_type, description, document_proof, created_at, updated_at  
**Relationships:**  
- 1–M with **car_images**  
- 1–M with **order_items** (as car)  


## 6. Car Images
**PK:** id  
**FK:** car_id → car_listing.id  
**Attributes:** image_url, updated_at  


## 7. Car Parts
**PK:** id  
**Attributes:** name, category, size, capacity, price, stock, image, created_at, updated_at  
**Relationships:**  
- 1–M with **order_items** (as part)  



## 8. Orders
**PK:** id  
**FK:** user_id → users.id  
**Attributes:** total_price, status, delivery_address, payment_method, created_at, updated_at  
**Relationships:**  
- 1–M with **order_items**  
- 1–M with **payments**  


## 9. Order Items
**PK:** id  
**FKs:**  
- order_id → orders.id  
- car_id → car_listing.id (nullable)  
- part_id → car_parts.id (nullable)  
**Attributes:** quantity, price  
**Check Constraint:** only one of car_id or part_id can be not null  


## 10. Reviews
**PK:** id  
**FKs:**  
- user_id → users.id  
- mechanic_id → mechanics.id  
**Attributes:** rating, comment, created_at, updated_at  
**Unique Constraint:** (user_id, mechanic_id)  


## 11. Notifications
**PK:** id  
**FK:** user_id → users.id  
**Attributes:** message, is_read, type, created_at, updated_at  


## 12. Payments
**PK:** id  
**FKs:**  
- user_id → users.id  
- order_id → orders.id (nullable, SET NULL on delete)  
**Attributes:** amount, method, status, transaction_ref, created_at, updated_at  
**Unique Constraint:** transaction_ref  