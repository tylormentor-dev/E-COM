-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: mechanic_connect
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mechanic_id` int NOT NULL,
  `service_id` int NOT NULL,
  `user_id` int NOT NULL,
  `booking_date` datetime NOT NULL,
  `status` enum('pending','accepted','rejected','completed','cancelled') NOT NULL DEFAULT 'pending',
  `car_model` varchar(100) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_booking` (`mechanic_id`,`booking_date`),
  KEY `mechanic_id_idx` (`mechanic_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `service_id_idx` (`service_id`),
  CONSTRAINT `fk_bookings_mechanic` FOREIGN KEY (`mechanic_id`) REFERENCES `mechanics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,2,'2026-03-01 09:00:00','accepted','2018 Toyota Corolla',49.99,'card','2026-02-23 10:04:58','2026-02-28 18:10:00','2026-02-23 10:04:58'),(2,1,2,4,'2026-03-01 11:00:00','pending','2017 Honda Civic',149.00,'cash','2026-02-23 10:04:58',NULL,'2026-02-23 10:04:58'),(3,1,3,5,'2026-03-02 10:30:00','completed','2016 Ford Focus',89.00,'card','2026-02-23 10:04:58','2026-03-01 16:00:00','2026-02-23 10:04:58'),(4,2,4,8,'2026-03-01 09:30:00','accepted','2019 Hyundai Elantra',39.99,'wallet','2026-02-23 10:04:58','2026-02-28 17:40:00','2026-02-23 10:04:58'),(5,2,5,9,'2026-03-03 14:00:00','pending','2020 Mazda 3',109.00,'card','2026-02-23 10:04:58',NULL,'2026-02-23 10:04:58'),(6,2,6,10,'2026-03-04 15:00:00','rejected','2015 Nissan Altima',220.00,'eft','2026-02-23 10:04:58',NULL,'2026-02-23 10:04:58'),(7,3,7,1,'2026-03-02 08:30:00','completed','2018 Toyota Corolla',79.00,'cash','2026-02-23 10:04:58','2026-03-01 19:20:00','2026-02-23 10:04:58'),(8,3,9,4,'2026-03-05 13:30:00','cancelled','2017 Honda Civic',159.00,'card','2026-02-23 10:04:58',NULL,'2026-02-23 10:04:58'),(9,4,10,11,'2026-03-10 08:30:00','pending','2014 Ford F-150',199.99,'card','2026-02-23 10:04:58',NULL,'2026-02-23 10:04:58'),(10,4,11,13,'2026-03-12 14:00:00','accepted','2016 Honda Accord',850.00,'eft','2026-02-23 10:04:58','2026-03-09 10:15:00','2026-02-23 10:04:58'),(11,5,12,14,'2026-03-11 09:00:00','completed','2021 Tesla Model 3',129.00,'wallet','2026-02-23 10:04:58','2026-03-10 16:30:00','2026-02-23 10:04:58'),(12,5,13,1,'2026-03-13 11:30:00','accepted','2018 Toyota Corolla',89.99,'cash','2026-02-23 10:04:58','2026-03-12 09:00:00','2026-02-23 10:04:58'),(13,1,1,12,'2026-03-14 10:00:00','pending','2020 Chevrolet Malibu',49.99,'card','2026-02-23 10:04:58',NULL,'2026-02-23 10:04:58');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_images`
--

DROP TABLE IF EXISTS `car_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `car_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_car_id_idx` (`car_id`),
  CONSTRAINT `fk_car_id` FOREIGN KEY (`car_id`) REFERENCES `car_listing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_images`
--

LOCK TABLES `car_images` WRITE;
/*!40000 ALTER TABLE `car_images` DISABLE KEYS */;
INSERT INTO `car_images` VALUES (1,1,'https://picsum.photos/seed/car1a/800/600','2026-02-23 10:04:58'),(2,1,'https://picsum.photos/seed/car1b/800/600','2026-02-23 10:04:58'),(3,2,'https://picsum.photos/seed/car2a/800/600','2026-02-23 10:04:58'),(4,2,'https://picsum.photos/seed/car2b/800/600','2026-02-23 10:04:58'),(5,3,'https://picsum.photos/seed/car3a/800/600','2026-02-23 10:04:58'),(6,3,'https://picsum.photos/seed/car3b/800/600','2026-02-23 10:04:58'),(7,4,'https://picsum.photos/seed/car4a/800/600','2026-02-23 10:04:58'),(8,4,'https://picsum.photos/seed/car4b/800/600','2026-02-23 10:04:58'),(9,5,'https://picsum.photos/seed/car5a/800/600','2026-02-23 10:04:58'),(10,5,'https://picsum.photos/seed/car5b/800/600','2026-02-23 10:04:58'),(11,6,'https://picsum.photos/seed/car6a/800/600','2026-02-23 10:04:58'),(12,6,'https://picsum.photos/seed/car6b/800/600','2026-02-23 10:04:58'),(13,7,'https://picsum.photos/seed/car7a/800/600','2026-02-23 10:04:58'),(14,7,'https://picsum.photos/seed/car7b/800/600','2026-02-23 10:04:58'),(15,8,'https://picsum.photos/seed/car8a/800/600','2026-02-23 10:04:58'),(16,8,'https://picsum.photos/seed/car8b/800/600','2026-02-23 10:04:58'),(17,9,'https://picsum.photos/seed/car9a/800/600','2026-02-23 10:04:58'),(18,9,'https://picsum.photos/seed/car9b/800/600','2026-02-23 10:04:58');
/*!40000 ALTER TABLE `car_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_listing`
--

DROP TABLE IF EXISTS `car_listing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_listing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seller_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int NOT NULL,
  `km_driven` int NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `color` varchar(50) NOT NULL,
  `transmission` varchar(50) NOT NULL,
  `fuel_capacity` decimal(5,2) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `vehicle_type` varchar(50) DEFAULT NULL,
  `description` text,
  `document_proof` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_carlisting_idx` (`seller_id`),
  CONSTRAINT `fk_carlisting` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_listing`
--

LOCK TABLES `car_listing` WRITE;
/*!40000 ALTER TABLE `car_listing` DISABLE KEYS */;
INSERT INTO `car_listing` VALUES (1,1,'Toyota','Corolla',2017,92000,11800.00,'Silver','Automatic',50.00,'Sedan','Petrol','Single owner, regular maintenance history.','docs/cars/corolla_2017.pdf','2026-02-23 10:04:58','2026-02-25 10:27:01'),(2,4,'Honda','Civic',2019,68000,15400.00,'White','Automatic',47.00,'Sedan','Petrol','Clean interior, recently serviced brakes.','docs/cars/civic_2019.pdf','2026-02-23 10:04:58','2026-02-25 10:27:01'),(3,5,'Ford','Focus',2016,104000,8700.00,'Blue','Manual',55.00,'Sedan','Petrol','Great commuter vehicle, minor paint scratches.','docs/cars/focus_2016.pdf','2026-02-23 10:04:58','2026-02-25 10:27:01'),(4,8,'Hyundai','Elantra',2018,85000,9900.00,'Black','Automatic',50.00,'Sedan','Petrol','Fuel efficient and smooth ride.','docs/cars/elantra_2018.pdf','2026-02-23 10:04:58','2026-02-25 10:27:01'),(5,9,'Mazda','3',2020,53000,12600.00,'Red','Automatic',51.00,'Sedan','Petrol','Well maintained, no accident history.','docs/cars/mazda3_2020.pdf','2026-02-23 10:04:58','2026-02-25 10:27:01'),(6,11,'Ford','F-150',2014,145000,18900.00,'Gray','Automatic',87.00,'Truck','Petrol','Work truck, towing package included.','docs/cars/f150_2014.pdf','2026-02-23 10:04:58','2026-02-25 10:26:57'),(7,13,'Honda','Accord',2016,98000,14900.00,'Silver','CVT',56.00,'Sedan','Petrol','Excellent condition, new tires.','docs/cars/accord_2016.pdf','2026-02-23 10:04:58','2026-02-25 10:27:01'),(8,14,'Tesla','Model 3',2021,42000,38900.00,'White','Automatic',75.00,'Sedan','Electric','Long Range, autopilot, clean title.','docs/cars/tesla_2021.pdf','2026-02-23 10:04:58','2026-02-25 10:26:11'),(9,1,'Chevrolet','Malibu',2020,61000,17200.00,'Blue','Automatic',62.00,'Sedan','Petrol','One owner, dealer maintained.','docs/cars/malibu_2020.pdf','2026-02-23 10:04:58','2026-02-25 10:27:01');
/*!40000 ALTER TABLE `car_listing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_parts`
--

DROP TABLE IF EXISTS `car_parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_parts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` enum('internal','external','engine','electronics') NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `capacity` varchar(45) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_parts`
--

LOCK TABLES `car_parts` WRITE;
/*!40000 ALTER TABLE `car_parts` DISABLE KEYS */;
INSERT INTO `car_parts` VALUES (1,'Brake Pad Set','external','Standard',NULL,79.99,80,'images/parts/brake_pads.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(2,'Engine Oil 5W-30','engine',NULL,'5L',45.00,120,'images/parts/engine_oil_5w30.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(3,'Spark Plug (4-pack)','engine',NULL,NULL,29.99,200,'images/parts/spark_plug_pack.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(4,'Cabin Air Filter','internal','OEM Fit',NULL,33.00,150,'images/parts/cabin_filter.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(5,'Alternator','electronics',NULL,'12V',249.99,35,'images/parts/alternator.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(6,'Wiper Blade Set','external','24/18',NULL,53.00,90,'images/parts/wiper_blades.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(7,'Car Battery 12V','electronics',NULL,'60Ah',129.00,60,'images/parts/car_battery.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(8,'Radiator Fan Motor','engine',NULL,NULL,77.00,45,'images/parts/radiator_fan_motor.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(9,'Headlight Assembly','external','Universal',NULL,189.00,25,'images/parts/headlight.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(10,'Oxygen Sensor','engine','Standard','4-wire',78.50,60,'images/parts/o2_sensor.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(11,'Fuel Pump','engine',NULL,'Electric',219.99,30,'images/parts/fuel_pump.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58'),(12,'Starter Relay','electronics','12V',NULL,22.00,150,'images/parts/starter_relay.jpg','2026-02-23 10:04:58','2026-02-23 10:04:58');
/*!40000 ALTER TABLE `car_parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanics`
--

DROP TABLE IF EXISTS `mechanics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `bio` text,
  `years_experience` int DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `availability` tinyint(1) NOT NULL DEFAULT '1',
  `notes_on_pricing` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `fk_mechanics_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanics`
--

LOCK TABLES `mechanics` WRITE;
/*!40000 ALTER TABLE `mechanics` DISABLE KEYS */;
INSERT INTO `mechanics` VALUES (1,2,'Austin, TX','ASE-certified mechanic focused on preventive maintenance.',8,4.70,1,'Labor billed hourly; parts billed separately.','2026-02-23 10:04:58'),(2,3,'Houston, TX','Brake and suspension specialist with dealership background.',10,4.60,1,'Flat-rate diagnostics, quote before repair.','2026-02-23 10:04:58'),(3,7,'Sugar Land, TX','Electrical diagnostics and AC repair expert.',7,4.20,1,'Weekend bookings may include surcharge.','2026-02-23 10:04:58'),(4,12,'Bellaire, TX','Transmission specialist and fleet maintenance expert.',12,4.80,1,'Fleet discounts available; call for quote.','2026-02-23 10:04:58'),(5,15,'Plano, TX','Hybrid and electric vehicle certified technician.',6,4.50,1,'Diagnostic fee waived with repair.','2026-02-23 10:04:58');
/*!40000 ALTER TABLE `mechanics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `type` enum('booking','payment','system','chat') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notification_user_idx` (`user_id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'Your booking #1 was accepted.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','booking'),(2,4,'Your booking #2 is pending mechanic confirmation.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','booking'),(3,5,'Payment for order #3 was successful.',1,'2026-02-23 10:04:58','2026-02-23 10:04:58','payment'),(4,8,'Order #4 is being prepared for shipment.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','system'),(5,9,'Order #5 has been shipped.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','payment'),(6,10,'Your booking request #6 was rejected.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','booking'),(7,2,'New booking request received for March 1 at 11:00.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','booking'),(8,3,'You have a new customer review.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','system'),(9,7,'Customer sent you a message about service #9.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','chat'),(10,6,'Daily admin summary is ready.',1,'2026-02-23 10:04:58','2026-02-23 10:04:58','system'),(11,11,'Your order #7 for a 2014 Ford F-150 is being processed.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','payment'),(12,12,'Your order #8 has been paid and is being prepared.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','system'),(13,13,'Your order #9 has shipped.',1,'2026-02-23 10:04:58','2026-02-23 10:04:58','payment'),(14,14,'Your order #10 has been delivered.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','system'),(15,4,'New booking request received for March 10 at 8:30 AM.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','booking'),(16,5,'You have a new 5-star review from user 14.',0,'2026-02-23 10:04:58','2026-02-23 10:04:58','system');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `car_id` int DEFAULT NULL,
  `part_id` int DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_id_idx` (`order_id`),
  KEY `fk_orderitem_car` (`car_id`),
  KEY `fk_orderitem_part` (`part_id`),
  CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitem_car` FOREIGN KEY (`car_id`) REFERENCES `car_listing` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitem_part` FOREIGN KEY (`part_id`) REFERENCES `car_parts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_product` CHECK ((((`car_id` is not null) and (`part_id` is null)) or ((`car_id` is null) and (`part_id` is not null))))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,NULL,3,2,29.99),(2,1,NULL,6,1,53.00),(3,2,2,NULL,1,15400.00),(4,3,NULL,5,1,249.99),(5,3,NULL,4,1,33.00),(6,3,NULL,8,1,77.00),(7,4,4,NULL,1,9900.00),(8,5,NULL,2,1,45.00),(9,5,NULL,4,1,33.00),(10,6,5,NULL,1,12600.00),(11,7,6,NULL,1,18900.00),(12,8,NULL,9,1,189.00),(13,8,NULL,10,1,78.50),(14,9,7,NULL,1,14900.00),(15,10,NULL,11,1,219.99);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `delivery_address` text,
  `payment_method` enum('card','cash','eft','wallet') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_user_idx` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,82.99,'paid','1201 Maple St, Austin, TX','card','2026-02-23 10:04:58','2026-02-23 10:04:58'),(2,4,15400.00,'pending','88 Ross Ave, Dallas, TX',NULL,'2026-02-23 10:04:58','2026-02-23 10:04:58'),(3,5,359.99,'delivered','17 Lakeview Dr, Plano, TX','card','2026-02-23 10:04:58','2026-02-23 10:04:58'),(4,8,9900.00,'paid','310 Pine St, Houston, TX','eft','2026-02-23 10:04:58','2026-02-23 10:04:58'),(5,9,78.00,'shipped','200 Oak St, Katy, TX','wallet','2026-02-23 10:04:58','2026-02-23 10:04:58'),(6,10,12600.00,'cancelled','15 Hill Rd, Frisco, TX','cash','2026-02-23 10:04:58','2026-02-23 10:04:58'),(7,11,18900.00,'pending','2300 Guadalupe St, Austin, TX',NULL,'2026-02-23 10:04:58','2026-02-23 10:04:58'),(8,12,267.50,'paid','4500 Bissonnet St, Bellaire, TX','card','2026-02-23 10:04:58','2026-02-23 10:04:58'),(9,13,14900.00,'shipped','1201 Elm St, Dallas, TX','eft','2026-02-23 10:04:58','2026-02-23 10:04:58'),(10,14,219.99,'delivered','3300 Kirby Dr, Houston, TX','wallet','2026-02-23 10:04:58','2026-02-23 10:04:58');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` varchar(50) NOT NULL,
  `status` enum('pending','success','failed') NOT NULL DEFAULT 'pending',
  `transaction_ref` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_ref_UNIQUE` (`transaction_ref`),
  KEY `fk_payment_id_idx` (`user_id`),
  KEY `fk_payment_order_idx` (`order_id`),
  CONSTRAINT `fk_payment_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,1,82.99,'card','success','MC-20260220-0001','2026-02-23 10:04:58','2026-02-23 10:04:58'),(2,4,2,15400.00,'eft','pending','MC-20260220-0002','2026-02-23 10:04:58','2026-02-23 10:04:58'),(3,5,3,359.99,'card','success','MC-20260220-0003','2026-02-23 10:04:58','2026-02-23 10:04:58'),(4,8,4,9900.00,'eft','success','MC-20260220-0004','2026-02-23 10:04:58','2026-02-23 10:04:58'),(5,9,5,78.00,'wallet','success','MC-20260220-0005','2026-02-23 10:04:58','2026-02-23 10:04:58'),(6,10,6,12600.00,'cash','failed','MC-20260220-0006','2026-02-23 10:04:58','2026-02-23 10:04:58'),(7,11,7,18900.00,'eft','pending','MC-20260305-0007','2026-02-23 10:04:58','2026-02-23 10:04:58'),(8,12,8,267.50,'card','success','MC-20260305-0008','2026-02-23 10:04:58','2026-02-23 10:04:58'),(9,13,9,14900.00,'eft','success','MC-20260305-0009','2026-02-23 10:04:58','2026-02-23 10:04:58'),(10,14,10,219.99,'wallet','success','MC-20260305-0010','2026-02-23 10:04:58','2026-02-23 10:04:58');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `mechanic_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_review` (`user_id`,`mechanic_id`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `fk_mechanic_id_idx` (`mechanic_id`),
  CONSTRAINT `fk_mechanic_id` FOREIGN KEY (`mechanic_id`) REFERENCES `mechanics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_rating` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,4,1,4,'Good quality work, a bit pricey.','2026-02-23 10:04:58','2026-02-23 10:04:58'),(2,5,2,5,'Very professional and on time.','2026-02-23 10:04:58','2026-02-23 10:04:58'),(3,8,2,4,'Clear communication and fair quote.','2026-02-23 10:04:58','2026-02-23 10:04:58'),(4,9,3,5,'Solved an electrical issue quickly.','2026-02-23 10:04:58','2026-02-23 10:04:58'),(5,10,3,3,'Issue fixed after a follow-up visit.','2026-02-23 10:04:58','2026-02-23 10:04:58'),(6,11,4,5,'Transmission flush made my truck shift like new!','2026-02-23 10:04:58','2026-02-23 10:04:58'),(7,13,4,4,'Clutch replacement took a bit long, but quality is great.','2026-02-23 10:04:58','2026-02-23 10:04:58'),(8,14,5,5,'Very knowledgeable about EVs. Explained everything clearly.','2026-02-23 10:04:58','2026-02-23 10:04:58'),(9,1,5,4,'Coolant flush was quick and fair price.','2026-02-23 10:04:58','2026-02-23 10:04:58'),(10,12,1,3,'The Mechanic did a good job on the oil change','2026-02-23 10:04:58','2026-02-23 10:04:58');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `duration` time DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mechanic_id` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_mechanic_services_idx` (`mechanic_id`),
  CONSTRAINT `fk_mechanic_services` FOREIGN KEY (`mechanic_id`) REFERENCES `mechanics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Oil Change','Engine oil and filter replacement with safety check.','00:45:00',49.99,'2026-02-23 10:04:58',1,'2026-02-23 10:04:58'),(2,'Brake Pad Replacement','Front or rear brake pad replacement.','01:30:00',149.00,'2026-02-23 10:04:58',1,'2026-02-23 10:04:58'),(3,'Engine Diagnostic','OBD scan and troubleshooting for warning lights.','01:00:00',89.00,'2026-02-23 10:04:58',1,'2026-02-23 10:04:58'),(4,'Tire Rotation','Rotate tires and check tread wear pattern.','00:40:00',39.99,'2026-02-23 10:04:58',2,'2026-02-23 10:04:58'),(5,'Battery Replacement','Battery replacement and charging system check.','00:35:00',109.00,'2026-02-23 10:04:58',2,'2026-02-23 10:04:58'),(6,'AC Service','AC pressure check, refill, and leak inspection.','01:20:00',220.00,'2026-02-23 10:04:58',2,'2026-02-23 10:04:58'),(7,'Wheel Alignment','4-wheel alignment and steering angle correction.','01:10:00',79.00,'2026-02-23 10:04:58',3,'2026-02-23 10:04:58'),(8,'Starter Motor Repair','Starter motor test and replacement.','02:00:00',280.00,'2026-02-23 10:04:58',3,'2026-02-23 10:04:58'),(9,'Suspension Check','Suspension inspection and road-test report.','01:00:00',159.00,'2026-02-23 10:04:58',3,'2026-02-23 10:04:58'),(10,'Transmission Flush','Complete transmission fluid exchange and filter replacement.','02:00:00',199.99,'2026-02-23 10:04:58',4,'2026-02-23 10:04:58'),(11,'Clutch Replacement','Clutch kit replacement for manual transmissions.','04:30:00',850.00,'2026-02-23 10:04:58',4,'2026-02-23 10:04:58'),(12,'EV Battery Health Check','Diagnostic scan and capacity test for hybrid/EV batteries.','01:15:00',129.00,'2026-02-23 10:04:58',5,'2026-02-23 10:04:58'),(13,'Coolant System Flush','Radiator flush and coolant refill.','01:00:00',89.99,'2026-02-23 10:04:58',5,'2026-02-23 10:04:58');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address` text,
  `id_number` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `role` enum('customer','mechanic','admin') NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Alice Carter','alice.carter@example.com','+1-512-555-0101','1201 Maple St, Austin, TX','ID-1001','hash_alice_2026','https://picsum.photos/seed/u1/200/200','1995-04-12','customer','2026-02-23 10:04:58','2026-02-23 10:04:58'),(2,'Brian Johnson','brian.johnson@example.com','+1-512-555-0102','4500 Burnet Rd, Austin, TX','ID-1002','hash_brian_2026','https://picsum.photos/seed/u2/200/200','1988-08-21','mechanic','2026-02-23 10:04:58','2026-02-23 10:04:58'),(3,'Chloe Rivera','chloe.rivera@example.com','+1-713-555-0103','980 Westheimer Rd, Houston, TX','ID-1003','hash_chloe_2026','https://picsum.photos/seed/u3/200/200','1990-01-30','mechanic','2026-02-23 10:04:58','2026-02-23 10:04:58'),(4,'Daniel Lee','daniel.lee@example.com','+1-214-555-0104','88 Ross Ave, Dallas, TX','ID-1004','hash_daniel_2026','https://picsum.photos/seed/u4/200/200','1993-11-05','customer','2026-02-23 10:04:58','2026-02-23 10:04:58'),(5,'Emma Wilson','emma.wilson@example.com','+1-469-555-0105','17 Lakeview Dr, Plano, TX','ID-1005','hash_emma_2026','https://picsum.photos/seed/u5/200/200','1997-06-18','customer','2026-02-23 10:04:58','2026-02-23 10:04:58'),(6,'Farah Ahmed','farah.ahmed@example.com','+1-972-555-0106','9 Admin Park, Irving, TX','ID-1006','hash_farah_2026','https://picsum.photos/seed/u6/200/200','1986-02-14','admin','2026-02-23 10:04:58','2026-02-23 10:04:58'),(7,'George Patel','george.patel@example.com','+1-281-555-0107','77 Main St, Sugar Land, TX','ID-1007','hash_george_2026','https://picsum.photos/seed/u7/200/200','1989-09-09','mechanic','2026-02-23 10:04:58','2026-02-23 10:04:58'),(8,'Hannah Kim','hannah.kim@example.com','+1-832-555-0108','310 Pine St, Houston, TX','ID-1008','hash_hannah_2026','https://picsum.photos/seed/u8/200/200','1998-12-03','customer','2026-02-23 10:04:58','2026-02-23 10:04:58'),(9,'Isaac Brown','isaac.brown@example.com','+1-346-555-0109','200 Oak St, Katy, TX','ID-1009','hash_isaac_2026','https://picsum.photos/seed/u9/200/200','1992-07-27','customer','2026-02-23 10:04:58','2026-02-23 10:04:58'),(10,'Julia Thompson','julia.thompson@example.com','+1-945-555-0110','15 Hill Rd, Frisco, TX','ID-1010','hash_julia_2026','https://picsum.photos/seed/u10/200/200','1994-03-11','customer','2026-02-23 10:04:58','2026-02-23 10:04:58'),(11,'Kevin Zhang','kevin.zhang@example.com','+1-512-555-0111','2300 Guadalupe St, Austin, TX','ID-1011','hash_kevin_2026','https://picsum.photos/seed/u11/200/200','1991-05-22','customer','2026-02-23 10:04:58','2026-02-23 10:04:58'),(12,'Linda Martinez','linda.martinez@example.com','+1-713-555-0112','4500 Bissonnet St, Bellaire, TX','ID-1012','hash_linda_2026','https://picsum.photos/seed/u12/200/200','1987-09-14','mechanic','2026-02-23 10:04:58','2026-02-23 10:04:58'),(13,'Mike O\'Brien','mike.obrien@example.com','+1-214-555-0113','1201 Elm St, Dallas, TX','ID-1013','hash_mike_2026','https://picsum.photos/seed/u13/200/200','1993-12-01','customer','2026-02-23 10:04:58','2026-02-23 10:04:58'),(14,'Nina Patel','nina.patel@example.com','+1-281-555-0114','3300 Kirby Dr, Houston, TX','ID-1014','hash_nina_2026','https://picsum.photos/seed/u14/200/200','1990-07-30','customer','2026-02-23 10:04:58','2026-02-23 10:04:58'),(15,'Oscar Lee','oscar.lee@example.com','+1-469-555-0115','2100 Collin Creek Mall, Plano, TX','ID-1015','hash_oscar_2026','https://picsum.photos/seed/u15/200/200','1985-03-18','mechanic','2026-02-23 10:04:58','2026-02-23 10:04:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-25 12:37:57
