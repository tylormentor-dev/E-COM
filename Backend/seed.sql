USE mechanic_connect;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE order_items;
TRUNCATE payments;
TRUNCATE notifications;
TRUNCATE reviews;
TRUNCATE bookings;
TRUNCATE services;
TRUNCATE mechanics;
TRUNCATE car_images;
TRUNCATE car_listing;
TRUNCATE car_parts;
TRUNCATE orders;
TRUNCATE users;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `users`
(`fullname`, `email`, `phone`, `address`, `id_number`, `password_hash`, `profile_image`, `dob`, `role`)
VALUES
('Alice Carter','alice.carter@example.com','+1-512-555-0101','1201 Maple St, Austin, TX','ID-1001', 'hash_alice_2026','https://picsum.photos/seed/u1/200/200','1995-04-12','customer'),
('Brian Johnson','brian.johnson@example.com','+1-512-555-0102','4500 Burnet Rd, Austin, TX','ID-1002', 'hash_brian_2026','https://picsum.photos/seed/u2/200/200','1988-08-21','mechanic'),
('Chloe Rivera','chloe.rivera@example.com','+1-713-555-0103','980 Westheimer Rd, Houston, TX','ID-1003', 'hash_chloe_2026','https://picsum.photos/seed/u3/200/200','1990-01-30','mechanic'),
('Daniel Lee','daniel.lee@example.com','+1-214-555-0104','88 Ross Ave, Dallas, TX','ID-1004', 'hash_daniel_2026','https://picsum.photos/seed/u4/200/200','1993-11-05','customer'),
('Emma Wilson','emma.wilson@example.com','+1-469-555-0105','17 Lakeview Dr, Plano, TX','ID-1005', 'hash_emma_2026','https://picsum.photos/seed/u5/200/200','1997-06-18','customer'),
('Farah Ahmed','farah.ahmed@example.com','+1-972-555-0106','9 Admin Park, Irving, TX','ID-1006', 'hash_farah_2026','https://picsum.photos/seed/u6/200/200','1986-02-14','admin'),
('George Patel','george.patel@example.com','+1-281-555-0107','77 Main St, Sugar Land, TX','ID-1007', 'hash_george_2026','https://picsum.photos/seed/u7/200/200','1989-09-09','mechanic'),
('Hannah Kim','hannah.kim@example.com','+1-832-555-0108','310 Pine St, Houston, TX','ID-1008', 'hash_hannah_2026','https://picsum.photos/seed/u8/200/200','1998-12-03','customer'),
('Isaac Brown','isaac.brown@example.com','+1-346-555-0109','200 Oak St, Katy, TX','ID-1009', 'hash_isaac_2026','https://picsum.photos/seed/u9/200/200','1992-07-27','customer'),
('Julia Thompson','julia.thompson@example.com','+1-945-555-0110','15 Hill Rd, Frisco, TX','ID-1010', 'hash_julia_2026','https://picsum.photos/seed/u10/200/200','1994-03-11','customer'),
('Kevin Zhang','kevin.zhang@example.com', '+1-512-555-0111','2300 Guadalupe St, Austin, TX', 'ID-1011','hash_kevin_2026','https://picsum.photos/seed/u11/200/200','1991-05-22','customer'),
('Linda Martinez','linda.martinez@example.com','+1-713-555-0112', '4500 Bissonnet St, Bellaire, TX','ID-1012', 'hash_linda_2026','https://picsum.photos/seed/u12/200/200', '1987-09-14', 'mechanic'),
('Mike O''Brien','mike.obrien@example.com','+1-214-555-0113','1201 Elm St, Dallas, TX','ID-1013','hash_mike_2026', 'https://picsum.photos/seed/u13/200/200', '1993-12-01', 'customer'),
('Nina Patel','nina.patel@example.com','+1-281-555-0114', '3300 Kirby Dr, Houston, TX','ID-1014','hash_nina_2026','https://picsum.photos/seed/u14/200/200', '1990-07-30', 'customer'),
('Oscar Lee','oscar.lee@example.com','+1-469-555-0115','2100 Collin Creek Mall, Plano, TX','ID-1015','hash_oscar_2026','https://picsum.photos/seed/u15/200/200', '1985-03-18', 'mechanic');

INSERT INTO `mechanics`
(`user_id`, `location`, `bio`, `years_experience`, `rating`, `availability`, `notes_on_pricing`)
VALUES
(2, 'Austin, TX','ASE-certified mechanic focused on preventive maintenance.', 8, 4.70, 1,'Labor billed hourly; parts billed separately.'),
(3, 'Houston, TX','Brake and suspension specialist with dealership background.', 10, 4.60, 1,'Flat-rate diagnostics, quote before repair.'),
(7, 'Sugar Land, TX','Electrical diagnostics and AC repair expert.', 7, 4.20, 1,'Weekend bookings may include surcharge.'),
(12,'Bellaire, TX','Transmission specialist and fleet maintenance expert.', 12, 4.80, 1,'Fleet discounts available; call for quote.'),
(15,'Plano, TX','Hybrid and electric vehicle certified technician.', 6, 4.50, 1,'Diagnostic fee waived with repair.');

INSERT INTO `services`
(`name`, `description`, `duration`, `price`, `mechanic_id`)
VALUES
('Oil Change','Engine oil and filter replacement with safety check.','00:45:00', 49.99, 1),
('Brake Pad Replacement','Front or rear brake pad replacement.','01:30:00', 149.00, 1),
('Engine Diagnostic','OBD scan and troubleshooting for warning lights.','01:00:00', 89.00, 1),
('Tire Rotation','Rotate tires and check tread wear pattern.','00:40:00',  39.99, 2),
('Battery Replacement','Battery replacement and charging system check.','00:35:00', 109.00, 2),
('AC Service','AC pressure check, refill, and leak inspection.','01:20:00', 220.00, 2),
('Wheel Alignment','4-wheel alignment and steering angle correction.','01:10:00',  79.00, 3),
('Starter Motor Repair','Starter motor test and replacement.','02:00:00', 280.00, 3),
('Suspension Check','Suspension inspection and road-test report.','01:00:00', 159.00, 3),
('Transmission Flush','Complete transmission fluid exchange and filter replacement.','02:00:00', 199.99, 4),
('Clutch Replacement','Clutch kit replacement for manual transmissions.','04:30:00', 850.00, 4),
('EV Battery Health Check','Diagnostic scan and capacity test for hybrid/EV batteries.','01:15:00', 129.00, 5),
('Coolant System Flush','Radiator flush and coolant refill.','01:00:00',  89.99, 5);

INSERT INTO `bookings`
(`mechanic_id`, `service_id`, `user_id`, `booking_date`, `status`, `car_model`, `total_price`, `payment_method`, `confirmed_at`)
VALUES
(1, 1, 2,'2026-03-01 09:00:00', 'accepted','2018 Toyota Corolla', 49.99, 'card', '2026-02-28 18:10:00'),
(1, 2, 4,'2026-03-01 11:00:00', 'pending','2017 Honda Civic', 149.00, 'cash', NULL),
(1, 3, 5,'2026-03-02 10:30:00', 'completed','2016 Ford Focus', 89.00, 'card', '2026-03-01 16:00:00'),
(2, 4, 8,'2026-03-01 09:30:00', 'accepted','2019 Hyundai Elantra', 39.99, 'wallet', '2026-02-28 17:40:00'),
(2, 5, 9,'2026-03-03 14:00:00', 'pending','2020 Mazda 3', 109.00, 'card', NULL),
(2, 6, 10,'2026-03-04 15:00:00', 'rejected','2015 Nissan Altima', 220.00, 'eft', NULL),
(3, 7, 1,'2026-03-02 08:30:00', 'completed','2018 Toyota Corolla', 79.00, 'cash', '2026-03-01 19:20:00'),
(3, 9, 4,'2026-03-05 13:30:00', 'cancelled','2017 Honda Civic', 159.00, 'card', NULL),
(4, 10, 11,'2026-03-10 08:30:00', 'pending','2014 Ford F-150', 199.99, 'card', NULL),
(4, 11, 13,'2026-03-12 14:00:00', 'accepted','2016 Honda Accord', 850.00, 'eft', '2026-03-09 10:15:00'),
(5, 12, 14,'2026-03-11 09:00:00', 'completed','2021 Tesla Model 3', 129.00, 'wallet', '2026-03-10 16:30:00'),
(5, 13,  1,'2026-03-13 11:30:00', 'accepted','2018 Toyota Corolla', 89.99, 'cash','2026-03-12 09:00:00'),
(1, 1, 12,'2026-03-14 10:00:00', 'pending','2020 Chevrolet Malibu', 49.99, 'card', NULL);


INSERT INTO `car_listing`
(`seller_id`, `name`, `model`, `year`, `km_driven`, `price`, `color`, `transmission`, `fuel_capacity`, `description`, `document_proof`)
VALUES
(1, 'Toyota', 'Corolla', 2017, 92000, 11800.00, 'Silver', 'Automatic', 50.00, 'Single owner, regular maintenance history.','docs/cars/corolla_2017.pdf'),
(4, 'Honda', 'Civic', 2019, 68000, 15400.00, 'White', 'Automatic', 47.00, 'Clean interior, recently serviced brakes.', 'docs/cars/civic_2019.pdf'),
(5, 'Ford', 'Focus', 2016, 104000,  8700.00, 'Blue', 'Manual', 55.00, 'Great commuter vehicle, minor paint scratches.', 'docs/cars/focus_2016.pdf'),
(8, 'Hyundai', 'Elantra', 2018, 85000,  9900.00, 'Black', 'Automatic', 50.00, 'Fuel efficient and smooth ride.','docs/cars/elantra_2018.pdf'),
(9, 'Mazda', '3', 2020,  53000, 12600.00, 'Red', 'Automatic', 51.00, 'Well maintained, no accident history.','docs/cars/mazda3_2020.pdf'),
(11, 'Ford', 'F-150', 2014, 145000, 18900.00, 'Gray', 'Automatic', 87.00, 'Work truck, towing package included.','docs/cars/f150_2014.pdf'),
(13, 'Honda','Accord', 2016, 98000, 14900.00, 'Silver', 'CVT', 56.00, 'Excellent condition, new tires.','docs/cars/accord_2016.pdf'),
(14, 'Tesla','Model 3', 2021, 42000, 38900.00, 'White', 'Automatic', 75.00, 'Long Range, autopilot, clean title.','docs/cars/tesla_2021.pdf'),
( 1, 'Chevrolet','Malibu', 2020, 61000, 17200.00, 'Blue', 'Automatic', 62.00, 'One owner, dealer maintained.', 'docs/cars/malibu_2020.pdf');

INSERT INTO `car_images`
(`car_id`, `image_url`)
VALUES
(1, 'https://picsum.photos/seed/car1a/800/600'),
(1, 'https://picsum.photos/seed/car1b/800/600'),
(2, 'https://picsum.photos/seed/car2a/800/600'),
(2, 'https://picsum.photos/seed/car2b/800/600'),
(3, 'https://picsum.photos/seed/car3a/800/600'),
(3, 'https://picsum.photos/seed/car3b/800/600'),
(4, 'https://picsum.photos/seed/car4a/800/600'),
(4, 'https://picsum.photos/seed/car4b/800/600'),
(5, 'https://picsum.photos/seed/car5a/800/600'),
(5, 'https://picsum.photos/seed/car5b/800/600'),
(6, 'https://picsum.photos/seed/car6a/800/600'),
(6, 'https://picsum.photos/seed/car6b/800/600'),
(7, 'https://picsum.photos/seed/car7a/800/600'),
(7, 'https://picsum.photos/seed/car7b/800/600'),
(8, 'https://picsum.photos/seed/car8a/800/600'),
(8, 'https://picsum.photos/seed/car8b/800/600'),
(9, 'https://picsum.photos/seed/car9a/800/600'),
(9, 'https://picsum.photos/seed/car9b/800/600');

INSERT INTO `car_parts`
(`name`, `category`, `size`, `capacity`, `price`, `stock`, `image`)
VALUES
('Brake Pad Set', 'external', 'Standard', NULL, 79.99, 80, 'images/parts/brake_pads.jpg'),
('Engine Oil 5W-30', 'engine', NULL,'5L', 45.00, 120, 'images/parts/engine_oil_5w30.jpg'),
('Spark Plug (4-pack)', 'engine', NULL, NULL, 29.99, 200, 'images/parts/spark_plug_pack.jpg'),
('Cabin Air Filter', 'internal', 'OEM Fit',  NULL, 33.00, 150, 'images/parts/cabin_filter.jpg'),
('Alternator', 'electronics', NULL, '12V', 249.99,  35, 'images/parts/alternator.jpg'),
('Wiper Blade Set', 'external', '24/18', NULL, 53.00, 90, 'images/parts/wiper_blades.jpg'),
('Car Battery 12V', 'electronics', NULL, '60Ah',129.00, 60, 'images/parts/car_battery.jpg'),
('Radiator Fan Motor', 'engine', NULL, NULL, 77.00,  45, 'images/parts/radiator_fan_motor.jpg'),
('Headlight Assembly', 'external', 'Universal', NULL, 189.00,  25, 'images/parts/headlight.jpg'),
('Oxygen Sensor', 'engine','Standard', '4-wire', 78.50,  60, 'images/parts/o2_sensor.jpg'),
('Fuel Pump', 'engine', NULL, 'Electric',219.99,  30, 'images/parts/fuel_pump.jpg'),
('Starter Relay', 'electronics', '12V', NULL, 22.00, 150, 'images/parts/starter_relay.jpg');

INSERT INTO `mechanic_connect`.`orders`
(`user_id`, `total_price`, `status`, `delivery_address`, `payment_method`)
VALUES
(1, 82.99, 'paid', '1201 Maple St, Austin, TX', 'card'),
(4, 15400.00, 'pending', '88 Ross Ave, Dallas, TX', NULL),
(5, 359.99, 'delivered', '17 Lakeview Dr, Plano, TX', 'card'),
(8, 9900.00, 'paid', '310 Pine St, Houston, TX', 'eft'),
(9, 78.00, 'shipped', '200 Oak St, Katy, TX', 'wallet'),
(10, 12600.00, 'cancelled', '15 Hill Rd, Frisco, TX', 'cash'),
(11, 18900.00, 'pending', '2300 Guadalupe St, Austin, TX', NULL),
(12, 267.50, 'paid', '4500 Bissonnet St, Bellaire, TX', 'card'),
(13, 14900.00, 'shipped', '1201 Elm St, Dallas, TX', 'eft'),
(14, 219.99, 'delivered', '3300 Kirby Dr, Houston, TX', 'wallet');

INSERT INTO `mechanic_connect`.`order_items`
(`order_id`, `car_id`, `part_id`, `quantity`, `price`)
VALUES
(1, NULL, 3, 2, 29.99),
(1, NULL, 6, 1, 53.00),
(2, 2, NULL, 1, 15400.00),
(3, NULL, 5, 1, 249.99),
(3, NULL, 4, 1, 33.00),
(3, NULL, 8, 1, 77.00),
(4, 4, NULL, 1, 9900.00),
(5, NULL, 2, 1, 45.00),
(5, NULL, 4, 1, 33.00),
(6, 5, NULL, 1, 12600.00),
(7, 6, NULL, 1, 18900.00),
(8, NULL, 9, 1, 189.00),
(8, NULL, 10, 1, 78.50),
(9, 7, NULL, 1, 14900.00),
(10, NULL, 11, 1, 219.99);


INSERT INTO `reviews`
(`user_id`, `mechanic_id`, `rating`, `comment`)
VALUES
(4,  1, 4, 'Good quality work, a bit pricey.'),
(5,  2, 5, 'Very professional and on time.'),
(8,  2, 4, 'Clear communication and fair quote.'),
(9,  3, 5, 'Solved an electrical issue quickly.'),
(10, 3, 3, 'Issue fixed after a follow-up visit.'),
(11, 4, 5, 'Transmission flush made my truck shift like new!'),
(13, 4, 4, 'Clutch replacement took a bit long, but quality is great.'),
(14, 5, 5, 'Very knowledgeable about EVs. Explained everything clearly.'),
( 1, 5, 4, 'Coolant flush was quick and fair price.'),
(12, 1, 3, 'The Mechanic did a good job on the oil change');


INSERT INTO `notifications`
(`user_id`, `message`, `is_read`, `type`)
VALUES
(1,  'Your booking #1 was accepted.', 0, 'booking'),
(4,  'Your booking #2 is pending mechanic confirmation.', 0, 'booking'),
(5,  'Payment for order #3 was successful.', 1, 'payment'),
(8,  'Order #4 is being prepared for shipment.', 0, 'system'),
(9,  'Order #5 has been shipped.', 0, 'payment'),
(10, 'Your booking request #6 was rejected.', 0, 'booking'),
(2,  'New booking request received for March 1 at 11:00.', 0, 'booking'),
(3,  'You have a new customer review.', 0, 'system'),
(7,  'Customer sent you a message about service #9.', 0, 'chat'),
(6,  'Daily admin summary is ready.', 1, 'system'),
(11, 'Your order #7 for a 2014 Ford F-150 is being processed.', 0, 'payment'),
(12, 'Your order #8 has been paid and is being prepared.', 0, 'system'),
(13, 'Your order #9 has shipped.', 1, 'payment'),
(14, 'Your order #10 has been delivered.', 0, 'system'),
(4,  'New booking request received for March 10 at 8:30 AM.', 0, 'booking'),
(5,  'You have a new 5-star review from user 14.', 0, 'system');

INSERT INTO `payments`
(`user_id`, `order_id`, `amount`, `method`, `status`, `transaction_ref`)
VALUES
(1,  1,  112.98, 'card',   'success', 'MC-20260220-0001'),
(4,  2, 15400.00, 'eft',   'pending', 'MC-20260220-0002'),
(5,  3,  359.99, 'card',   'success', 'MC-20260220-0003'),
(8,  4, 9900.00, 'eft',    'success', 'MC-20260220-0004'),
(9,  5,   78.00, 'wallet', 'success', 'MC-20260220-0005'),
(10, 6, 12600.00, 'cash',  'failed',  'MC-20260220-0006'),
(11, 7, 18900.00, 'eft',   'pending', 'MC-20260305-0007'),
(12, 8,   267.50, 'card',  'success', 'MC-20260305-0008'),
(13, 9, 14900.00, 'eft',   'success', 'MC-20260305-0009'),
(14,10,   219.99, 'wallet','success', 'MC-20260305-0010');

UPDATE `mechanic_connect`.`payments`
SET `amount` = 82.99
WHERE `order_id` = 1 AND `transaction_ref` = 'MC-20260220-0001';