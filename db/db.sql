-- Database setup for Oliveritas - Consolidated Entity Model with Delivery Enhancements
-- Version: 3.0
-- FIX: Added Address Normalization, Delivery Zones/Fees/Scheduling/Tracking

DROP DATABASE IF EXISTS Oliveritas;
CREATE DATABASE Oliveritas;
USE Oliveritas;

-- Start a transaction to ensure all operations succeed or fail together
START TRANSACTION;

-- -----------------------------------------------------
-- Table `Roles` - Define all possible roles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Roles` (
  `RoleID` INT NOT NULL AUTO_INCREMENT,
  `RoleName` VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'Producer', 'Customer', 'Partner-Retail', 'Partner-Influencer', 'Lab', 'Mill', 'Driver'
  `Description` VARCHAR(255) NULL,
  PRIMARY KEY (`RoleID`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Addresses` - Normalized Address Storage
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Addresses` (
    `AddressID` INT NOT NULL AUTO_INCREMENT,
    `StreetLine1` VARCHAR(255) NOT NULL,
    `StreetLine2` VARCHAR(255) NULL,
    `City` VARCHAR(100) NOT NULL,
    `CountyProvince` VARCHAR(100) NULL, -- e.g., 'County Dublin', 'California'
    `PostalCode` VARCHAR(20) NULL, -- Nullable for areas without postal codes
    `CountryCode` VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2 (e.g., 'IE', 'US')
    `Latitude` DECIMAL(10, 8) NULL, -- For mapping/routing
    `Longitude` DECIMAL(11, 8) NULL, -- For mapping/routing
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`AddressID`),
    INDEX `idx_address_lookup` (`CountryCode` ASC, `PostalCode` ASC, `City` ASC) VISIBLE -- Index for lookups
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Entities` - Consolidated table for all actors
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Entities` (
  `EntityID` INT NOT NULL AUTO_INCREMENT,
  `EntityType` ENUM('Individual', 'Organization') NOT NULL,
  `EntityName` VARCHAR(255) NOT NULL,
  `FirstName` VARCHAR(255) NULL,
  `LastName` VARCHAR(255) NULL,
  `WalletAddress` VARCHAR(255) NULL UNIQUE,
  `PrimaryContactPerson` VARCHAR(255) NULL,
  `PrimaryEmail` VARCHAR(255) NULL UNIQUE,
  `PrimaryPhone` VARCHAR(255) NULL,
  `Website` VARCHAR(255) NULL,
  `RegistrationDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `DefaultPaymentMethodID` INT NULL, -- FK added after PaymentMethods table
  `PrimaryAddressID` INT NULL,    -- FK to Addresses table
  `BillingAddressID` INT NULL,    -- FK to Addresses table
  `ShippingAddressID` INT NULL,   -- FK to Addresses table (Default Shipping)
  `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`EntityID`),
  INDEX `fk_Entities_PrimaryAddress_idx` (`PrimaryAddressID` ASC) VISIBLE,
  INDEX `fk_Entities_BillingAddress_idx` (`BillingAddressID` ASC) VISIBLE,
  INDEX `fk_Entities_ShippingAddress_idx` (`ShippingAddressID` ASC) VISIBLE,
  CONSTRAINT `fk_Entities_PrimaryAddress`
    FOREIGN KEY (`PrimaryAddressID`)
    REFERENCES `Addresses` (`AddressID`)
    ON DELETE SET NULL ON UPDATE CASCADE, -- Allow nullifying if address deleted
  CONSTRAINT `fk_Entities_BillingAddress`
    FOREIGN KEY (`BillingAddressID`)
    REFERENCES `Addresses` (`AddressID`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_Entities_ShippingAddress`
    FOREIGN KEY (`ShippingAddressID`)
    REFERENCES `Addresses` (`AddressID`)
    ON DELETE SET NULL ON UPDATE CASCADE
  -- Note: FK for DefaultPaymentMethodID added after PaymentMethods table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `EntityRoles` - Links Entities to their Roles (Many-to-Many)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `EntityRoles` (
  `EntityID` INT NOT NULL,
  `RoleID` INT NOT NULL,
  PRIMARY KEY (`EntityID`, `RoleID`),
  INDEX `fk_EntityRoles_Roles1_idx` (`RoleID` ASC) VISIBLE,
  CONSTRAINT `fk_EntityRoles_Entities1`
    FOREIGN KEY (`EntityID`)
    REFERENCES `Entities` (`EntityID`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_EntityRoles_Roles1`
    FOREIGN KEY (`RoleID`)
    REFERENCES `Roles` (`RoleID`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `InfluencerDetails` - Role-specific data
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `InfluencerDetails` (
  `EntityID` INT NOT NULL,
  `FollowerCount` INT NULL,
  PRIMARY KEY (`EntityID`),
  CONSTRAINT `fk_InfluencerDetails_Entities1`
    FOREIGN KEY (`EntityID`)
    REFERENCES `Entities` (`EntityID`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Categories` (
  `CategoryID` INT NOT NULL AUTO_INCREMENT,
  `CategoryName` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Products` (
  `ProductID` INT NOT NULL AUTO_INCREMENT,
  `ProductName` VARCHAR(255) NOT NULL,
  `Description` TEXT NULL,
  `BatchID` INT NULL,
  `ProducerEntityID` INT NOT NULL,
  `CategoryID` INT NOT NULL,
  `CostPrice` DECIMAL(10, 2) NOT NULL,
  `SellingPrice` DECIMAL(10, 2) NOT NULL,
  `StockQuantity` INT NOT NULL,
  `ImageURL` VARCHAR(255) NULL,
   PRIMARY KEY (`ProductID`),
  INDEX `fk_Products_Entities_idx` (`ProducerEntityID` ASC) VISIBLE,
  INDEX `fk_Products_Categories1_idx` (`CategoryID` ASC) VISIBLE,
  CONSTRAINT `fk_Products_Entities`
    FOREIGN KEY (`ProducerEntityID`)
    REFERENCES `Entities` (`EntityID`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Products_Categories1`
    FOREIGN KEY (`CategoryID`)
    REFERENCES `Categories` (`CategoryID`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `PaymentMethods`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `PaymentMethods` (
  `PaymentMethodID` INT NOT NULL AUTO_INCREMENT,
  `CustomerEntityID` INT NOT NULL,
  `PaymentType` VARCHAR(45) NOT NULL,
  `PaymentToken` VARCHAR(255) NOT NULL,
  `LastFourDigits` VARCHAR(4) NULL,
  `ExpiryMonth` VARCHAR(2) NULL,
  `ExpiryYear` VARCHAR(4) NULL,
  `BillingAddressID` INT NULL, -- Link to specific Billing Address used for this method
  `IsDefault` BOOLEAN NOT NULL DEFAULT FALSE,
  `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PaymentMethodID`),
  INDEX `fk_PaymentMethods_Entities_idx` (`CustomerEntityID` ASC) VISIBLE,
  INDEX `fk_PaymentMethods_Address_idx` (`BillingAddressID` ASC) VISIBLE,
  CONSTRAINT `fk_PaymentMethods_Entities`
    FOREIGN KEY (`CustomerEntityID`)
    REFERENCES `Entities` (`EntityID`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_PaymentMethods_Address`
    FOREIGN KEY (`BillingAddressID`)
    REFERENCES `Addresses` (`AddressID`)
    ON DELETE SET NULL ON UPDATE CASCADE -- Allow nullifying if address deleted
) ENGINE = InnoDB;

-- Add FK from Entities to PaymentMethods
ALTER TABLE `Entities`
ADD CONSTRAINT `fk_Entities_PaymentMethods1`
  FOREIGN KEY (`DefaultPaymentMethodID`)
  REFERENCES `PaymentMethods` (`PaymentMethodID`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- -----------------------------------------------------
-- Table `DeliveryZones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DeliveryZones` (
    `ZoneID` INT NOT NULL AUTO_INCREMENT,
    `ZoneName` VARCHAR(100) NOT NULL UNIQUE,
    `Description` TEXT NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`ZoneID`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ZoneRules` - Defines criteria for zones (e.g., postal codes)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ZoneRules` (
    `RuleID` INT NOT NULL AUTO_INCREMENT,
    `ZoneID` INT NOT NULL,
    `CountryCode` VARCHAR(2) NOT NULL,
    `PostalCodePattern` VARCHAR(50) NULL, -- e.g., 'D01%', 'K%', '90%'
    `CityPattern` VARCHAR(100) NULL,
    `CountyPattern` VARCHAR(100) NULL,
    `Priority` INT NOT NULL DEFAULT 0, -- Higher number means higher priority if rules overlap
    PRIMARY KEY (`RuleID`),
    INDEX `fk_ZoneRules_Zones_idx` (`ZoneID` ASC) VISIBLE,
    INDEX `idx_zonerules_lookup` (`CountryCode` ASC, `CountyPattern` ASC, `CityPattern` ASC, `PostalCodePattern` ASC),
    CONSTRAINT `fk_ZoneRules_Zones`
        FOREIGN KEY (`ZoneID`)
        REFERENCES `DeliveryZones` (`ZoneID`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DeliveryFees` - Defines fees based on zones and potentially order value
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DeliveryFees` (
    `FeeID` INT NOT NULL AUTO_INCREMENT,
    `ZoneID` INT NOT NULL,
    `MinOrderAmount` DECIMAL(10, 2) NULL, -- Fee might only apply below this amount, NULL means always applies
    `FeeAmount` DECIMAL(10, 2) NOT NULL,
    `Description` VARCHAR(255) NULL, -- e.g., 'Standard County Dublin', 'Free Delivery Over €50'
    `IsActive` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`FeeID`),
    INDEX `fk_DeliveryFees_Zones_idx` (`ZoneID` ASC) VISIBLE,
    CONSTRAINT `fk_DeliveryFees_Zones`
        FOREIGN KEY (`ZoneID`)
        REFERENCES `DeliveryZones` (`ZoneID`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Carriers` - Delivery partners
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Carriers` (
    `CarrierID` INT NOT NULL AUTO_INCREMENT,
    `CarrierName` VARCHAR(100) NOT NULL UNIQUE,
    `TrackingURLTemplate` VARCHAR(255) NULL, -- e.g., 'https://track.anpost.ie?tracking_number={TRACKING_ID}'
    `ContactPhone` VARCHAR(50) NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`CarrierID`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Orders` - Enhanced for Delivery
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Orders` (
  `OrderID` INT NOT NULL AUTO_INCREMENT,
  `CustomerEntityID` INT NULL,
  `PartnerEntityID` INT NULL,
  `OrderDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TotalAmount` DECIMAL(10,2) NOT NULL, -- Subtotal before delivery fee? Or final total? Clarify logic. Assuming subtotal for now.
  `Status` VARCHAR(45) NOT NULL, -- e.g., 'Pending', 'Processing', 'Shipped', 'Delivered'
  -- Delivery Fields
  `ShippingAddressID` INT NOT NULL,          -- FK to Addresses table (Specific address for THIS order)
  `DeliveryInstructions` TEXT NULL,         -- Customer notes
  `DeliveryZoneID` INT NULL,                -- FK to DeliveryZones (Determined at checkout/processing)
  `DeliveryFeeAmount` DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Calculated fee
  `RequestedDeliveryDate` DATE NULL,
  `RequestedDeliveryTimeSlot` VARCHAR(100) NULL, -- e.g., 'AM', 'PM', '09:00-12:00'
  `ScheduledDeliveryDate` DATE NULL,        -- Assigned by logistics
  `ScheduledDeliveryTimeSlot` VARCHAR(100) NULL,
  `CarrierID` INT NULL,                     -- FK to Carriers
  `TrackingNumber` VARCHAR(100) NULL,
  `AssignedDriverEntityID` INT NULL,        -- FK to Entities (if using internal drivers with 'Driver' role)
  `ActualDeliveryTimestamp` DATETIME NULL,  -- When it was actually delivered

  PRIMARY KEY (`OrderID`),
  INDEX `fk_Orders_CustomerEntities_idx` (`CustomerEntityID` ASC) VISIBLE,
  INDEX `fk_Orders_PartnerEntities_idx` (`PartnerEntityID` ASC) VISIBLE,
  INDEX `fk_Orders_ShippingAddress_idx` (`ShippingAddressID` ASC) VISIBLE,
  INDEX `fk_Orders_DeliveryZone_idx` (`DeliveryZoneID` ASC) VISIBLE,
  INDEX `fk_Orders_Carrier_idx` (`CarrierID` ASC) VISIBLE,
  INDEX `fk_Orders_Driver_idx` (`AssignedDriverEntityID` ASC) VISIBLE,

  CONSTRAINT `fk_Orders_CustomerEntities`
    FOREIGN KEY (`CustomerEntityID`) REFERENCES `Entities` (`EntityID`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_Orders_PartnerEntities`
    FOREIGN KEY (`PartnerEntityID`) REFERENCES `Entities` (`EntityID`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_Orders_ShippingAddress`
    FOREIGN KEY (`ShippingAddressID`) REFERENCES `Addresses` (`AddressID`)
    ON DELETE RESTRICT ON UPDATE CASCADE, -- Prevent deleting address if tied to an order
  CONSTRAINT `fk_Orders_DeliveryZone`
    FOREIGN KEY (`DeliveryZoneID`) REFERENCES `DeliveryZones` (`ZoneID`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_Orders_Carrier`
    FOREIGN KEY (`CarrierID`) REFERENCES `Carriers` (`CarrierID`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_Orders_Driver`
    FOREIGN KEY (`AssignedDriverEntityID`) REFERENCES `Entities` (`EntityID`)
    -- Consider CHECK/Trigger: Entity must have 'Driver' role
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Triggers for Orders table (Keep the entity check)
DELIMITER //
CREATE TRIGGER trg_orders_check_entity_before_insert
BEFORE INSERT ON `Orders`
FOR EACH ROW
BEGIN
  IF NOT ((NEW.CustomerEntityID IS NOT NULL AND NEW.PartnerEntityID IS NULL) OR (NEW.CustomerEntityID IS NULL AND NEW.PartnerEntityID IS NOT NULL)) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order must have either a CustomerEntityID or a PartnerEntityID, but not both or neither.';
  END IF;
END//
CREATE TRIGGER trg_orders_check_entity_before_update
BEFORE UPDATE ON `Orders`
FOR EACH ROW
BEGIN
  IF NOT ((NEW.CustomerEntityID IS NOT NULL AND NEW.PartnerEntityID IS NULL) OR (NEW.CustomerEntityID IS NULL AND NEW.PartnerEntityID IS NOT NULL)) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order must have either a CustomerEntityID or a PartnerEntityID, but not both or neither.';
  END IF;
END//
DELIMITER ;


-- -----------------------------------------------------
-- Table `OrderItems`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `OrderItems` (
  `OrderItemID` INT NOT NULL AUTO_INCREMENT,
  `OrderID` INT NOT NULL,
  `ProductID` INT NOT NULL,
  `Quantity` INT NOT NULL,
  `PricePerUnit` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`OrderItemID`),
  INDEX `fk_OrderItems_Orders1_idx` (`OrderID` ASC) VISIBLE,
  INDEX `fk_OrderItems_Products1_idx` (`ProductID` ASC) VISIBLE,
  CONSTRAINT `fk_OrderItems_Orders1`
    FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_OrderItems_Products1`
    FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Transactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Transactions` (
  `TransactionID` INT NOT NULL AUTO_INCREMENT,
  `OrderID` INT NULL,
  `PaymentMethodID` INT NOT NULL,
  `TransactionType` VARCHAR(45) NOT NULL,
  `Amount` DECIMAL(10, 2) NOT NULL, -- Should this include delivery fee? Define logic.
  `TransactionStatus` VARCHAR(45) NOT NULL,
  `TransactionToken` VARCHAR(255) NOT NULL UNIQUE,
  `GatewayResponse` TEXT NULL,
  `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`TransactionID`),
  INDEX `fk_Transactions_Orders1_idx` (`OrderID` ASC) VISIBLE,
  INDEX `fk_Transactions_PaymentMethods1_idx` (`PaymentMethodID` ASC) VISIBLE,
  CONSTRAINT `fk_Transactions_Orders1`
    FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_Transactions_PaymentMethods1`
    FOREIGN KEY (`PaymentMethodID`) REFERENCES `PaymentMethods` (`PaymentMethodID`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Subscriptions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Subscriptions` (
  `SubscriptionID` INT NOT NULL AUTO_INCREMENT,
  `CustomerEntityID` INT NOT NULL,
  `PaymentMethodID` INT NOT NULL,
  `ProductID` INT NOT NULL,
  `PlanID` VARCHAR(45) NOT NULL,
  `Status` VARCHAR(45) NOT NULL,
  `StartDate` DATE NOT NULL,
  `EndDate` DATE NULL,
  `RenewalDate` DATE NOT NULL,
  `BillingCycle` VARCHAR(45) NOT NULL,
  `ShippingAddressID` INT NULL, -- Default shipping address for subscription orders
  `DeliveryInstructions` TEXT NULL, -- Default instructions for subscription orders
  `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SubscriptionID`),
  INDEX `fk_Subscriptions_Entities1_idx` (`CustomerEntityID` ASC) VISIBLE,
  INDEX `fk_Subscriptions_PaymentMethods1_idx` (`PaymentMethodID` ASC) VISIBLE,
  INDEX `fk_Subscriptions_Products1_idx` (`ProductID` ASC) VISIBLE,
  INDEX `fk_Subscriptions_Address_idx` (`ShippingAddressID` ASC) VISIBLE,
  CONSTRAINT `fk_Subscriptions_Entities1`
      FOREIGN KEY (`CustomerEntityID`) REFERENCES `Entities`(`EntityID`)
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Subscriptions_PaymentMethods1`
      FOREIGN KEY (`PaymentMethodID`) REFERENCES `PaymentMethods` (`PaymentMethodID`)
      ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Subscriptions_Products1`
    FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`)
      ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Subscriptions_Address`
    FOREIGN KEY (`ShippingAddressID`) REFERENCES `Addresses` (`AddressID`)
    ON DELETE SET NULL ON UPDATE CASCADE -- Allow nullifying default address if deleted
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `MarketingCampaigns`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MarketingCampaigns` (
  `CampaignID` INT NOT NULL AUTO_INCREMENT,
  `CampaignName` VARCHAR(255) NOT NULL,
  `StartDate` DATE NOT NULL,
  `EndDate` DATE NOT NULL,
  `Platform` VARCHAR(255) NOT NULL,
  `Budget` DECIMAL(10,2) NOT NULL,
  `Description` TEXT NULL,
  PRIMARY KEY (`CampaignID`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CampaignParticipants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CampaignParticipants` (
  `CampaignID` INT NOT NULL,
  `ParticipantEntityID` INT NOT NULL,
  `CollaborationDetails` TEXT NULL,
  PRIMARY KEY (`CampaignID`, `ParticipantEntityID`),
  INDEX `fk_CampaignParticipants_Entities1_idx` (`ParticipantEntityID` ASC) VISIBLE,
  CONSTRAINT `fk_CampaignParticipants_MarketingCampaigns1`
    FOREIGN KEY (`CampaignID`) REFERENCES `MarketingCampaigns` (`CampaignID`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_CampaignParticipants_Entities1`
    FOREIGN KEY (`ParticipantEntityID`) REFERENCES `Entities` (`EntityID`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `SocialMediaAccounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SocialMediaAccounts` (
  `SocialMediaAccountID` INT NOT NULL AUTO_INCREMENT,
  `EntityID` INT NOT NULL,
  `Platform` VARCHAR(45) NOT NULL,
  `Handle` VARCHAR(255) NOT NULL,
  `URL` VARCHAR(255) NULL,
  PRIMARY KEY (`SocialMediaAccountID`),
  UNIQUE INDEX `idx_entity_platform` (`EntityID`, `Platform`),
  CONSTRAINT `fk_SocialMediaAccounts_Entities1`
    FOREIGN KEY (`EntityID`) REFERENCES `Entities` (`EntityID`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Inserts Start
-- -----------------------------------------------------

-- Insert Roles (including Driver)
INSERT INTO `Roles` (`RoleName`, `Description`) VALUES
('Producer', 'Produces olive oil products'),
('Customer', 'Buys products or subscriptions'),
('Partner-Retail', 'Resells products in physical or online stores'),
('Partner-Market', 'Sells products at markets or events'),
('Partner-Influencer', 'Promotes products via social media or other channels'),
('Lab', 'Performs laboratory analysis'),
('Mill', 'Processes olives into oil'),
('Driver', 'Performs home deliveries'); -- New Role

SET @role_producer = (SELECT RoleID FROM Roles WHERE RoleName = 'Producer');
SET @role_customer = (SELECT RoleID FROM Roles WHERE RoleName = 'Customer');
SET @role_partner_retail = (SELECT RoleID FROM Roles WHERE RoleName = 'Partner-Retail');
SET @role_partner_market = (SELECT RoleID FROM Roles WHERE RoleName = 'Partner-Market');
SET @role_partner_influencer = (SELECT RoleID FROM Roles WHERE RoleName = 'Partner-Influencer');
SET @role_lab = (SELECT RoleID FROM Roles WHERE RoleName = 'Lab');
SET @role_mill = (SELECT RoleID FROM Roles WHERE RoleName = 'Mill');
SET @role_driver = (SELECT RoleID FROM Roles WHERE RoleName = 'Driver'); -- Capture Driver Role ID

-- Insert Sample Addresses & Capture IDs
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('123 Main St', 'Anytown', 'County Example', 'A01 B02', 'IE');
SET @addr_main_st = LAST_INSERT_ID();
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('456 Oak Ave', 'Someville', 'County Example', 'C03 D04', 'IE');
SET @addr_oak_ave = LAST_INSERT_ID();
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('79 Long Acre', 'London', 'Greater London', 'WC2E 9LZ', 'GB'); -- Example GB Address
SET @addr_long_acre = LAST_INSERT_ID();
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('123 Lab St', 'Scienceton', 'County Tech', 'L4B S5T', 'IE');
SET @addr_lab_st = LAST_INSERT_ID();
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('456 Mill Ave', 'Industryburg', 'County Work', 'M6L N7L', 'IE');
SET @addr_mill_ave = LAST_INSERT_ID();
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('999 Retail Rd', 'Shopsville', 'County Commerce', 'R9T L1G', 'IE');
SET @addr_retail_rd = LAST_INSERT_ID();
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('888 Small St', 'Marketon', 'County Trade', 'S8M L2S', 'IE');
SET @addr_small_st = LAST_INSERT_ID();
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('789 Pine Ln', 'Suburbia', 'County Res', 'P1N E7L', 'IE');
SET @addr_pine_ln = LAST_INSERT_ID();
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('1022 Cedar Dr', 'Mapleton', 'County Res', 'C3D R1K', 'IE');
SET @addr_cedar_billing = LAST_INSERT_ID(); -- Bob's Billing
INSERT INTO `Addresses` (`StreetLine1`, `City`, `CountyProvince`, `PostalCode`, `CountryCode`) VALUES
('1011 Cedar Dr', 'Mapleton', 'County Res', 'C3D R1J', 'IE'); -- Use distinct address for shipping example
SET @addr_cedar_shipping = LAST_INSERT_ID(); -- Bob's Default Shipping

-- Insert Categories
INSERT INTO `Categories` (`CategoryName`) VALUES ('Early Harvest'); SET @cat1_id = LAST_INSERT_ID();
INSERT INTO `Categories` (`CategoryName`) VALUES ('Organic Extra Virgin'); SET @cat2_id = LAST_INSERT_ID();
INSERT INTO `Categories` (`CategoryName`) VALUES ('Extra Virgin'); SET @cat3_id = LAST_INSERT_ID();

-- Insert Entities (using Address IDs) & Capture IDs
INSERT INTO `Entities` (`EntityType`, `EntityName`, `WalletAddress`, `PrimaryContactPerson`, `PrimaryEmail`, `PrimaryPhone`, `PrimaryAddressID`, `Website`) VALUES
('Organization', 'Solara', '0x8888...', 'John Smith', 'john.smith@solara.com', '555-1212', @addr_main_st, 'solara.com');
SET @entity_solara_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_solara_id, @role_producer);

INSERT INTO `Entities` (`EntityType`, `EntityName`, `WalletAddress`, `PrimaryContactPerson`, `PrimaryEmail`, `PrimaryPhone`, `PrimaryAddressID`, `Website`) VALUES
('Organization', 'Crest', '0x7777...', 'Jane Doe', 'jane.doe@crest.com', '555-3434', @addr_oak_ave, 'crest.com');
SET @entity_crest_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_crest_id, @role_producer);

INSERT INTO `Entities` (`EntityType`, `EntityName`, `WalletAddress`, `PrimaryContactPerson`, `PrimaryEmail`, `PrimaryPhone`, `PrimaryAddressID`, `Website`) VALUES
('Organization', 'Stonewall', '0x9999...', 'Robert Downy', 'robert.downy@stonewall.com', '555-4567', @addr_long_acre, NULL);
SET @entity_stonewall_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_stonewall_id, @role_producer);

INSERT INTO `Entities` (`EntityType`, `EntityName`, `WalletAddress`, `PrimaryContactPerson`, `PrimaryEmail`, `PrimaryPhone`, `PrimaryAddressID`, `Website`) VALUES
('Organization', 'Agrolab', '0xLAB1...', 'Eve Smith', 'eve.smith@agrolab.com', '555-1212', @addr_lab_st, NULL);
SET @entity_agrolab_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_agrolab_id, @role_lab);

INSERT INTO `Entities` (`EntityType`, `EntityName`, `WalletAddress`, `PrimaryContactPerson`, `PrimaryEmail`, `PrimaryPhone`, `PrimaryAddressID`, `Website`) VALUES
('Organization', 'The Mill', '0xMILL...', 'Louis Doe', 'louis.doe@themill.com', '555-3434', @addr_mill_ave, NULL);
SET @entity_themill_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_themill_id, @role_mill);

INSERT INTO `Entities` (`EntityType`, `EntityName`, `WalletAddress`, `PrimaryContactPerson`, `PrimaryEmail`, `PrimaryPhone`, `PrimaryAddressID`, `Website`) VALUES
('Organization', 'Retail Giant', '0xAAAA...', 'Peter Jones', 'pj@retailgiant.com', '555-1111', @addr_retail_rd, 'RetailGiant.com');
SET @entity_retailgiant_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_retailgiant_id, @role_partner_retail);

INSERT INTO `Entities` (`EntityType`, `EntityName`, `WalletAddress`, `PrimaryContactPerson`, `PrimaryEmail`, `PrimaryPhone`, `PrimaryAddressID`, `Website`) VALUES
('Organization', 'Shop Small', '0xBBBB...', 'Susan Lee', 'susan@shopsmall.com', '555-2222', @addr_small_st, NULL);
SET @entity_shopsmall_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_shopsmall_id, @role_partner_market);

-- Customer 1: Alice Johnson (Assign multiple addresses)
INSERT INTO `Entities` (`EntityType`, `FirstName`, `LastName`, `EntityName`, `WalletAddress`, `PrimaryEmail`, `PrimaryPhone`, `PrimaryAddressID`, `BillingAddressID`, `ShippingAddressID`, `RegistrationDate`) VALUES
('Individual', 'Alice', 'Johnson', 'Alice Johnson', NULL, 'alice.j@example.com', '555-5678', @addr_pine_ln, @addr_pine_ln, @addr_pine_ln, '2023-10-26 09:00:00');
SET @entity_alice_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_alice_id, @role_customer), (@entity_alice_id, @role_producer);

-- Customer 2: Bob Williams (Assign multiple addresses)
INSERT INTO `Entities` (`EntityType`, `FirstName`, `LastName`, `EntityName`, `WalletAddress`, `PrimaryEmail`, `PrimaryPhone`, `PrimaryAddressID`, `BillingAddressID`, `ShippingAddressID`, `RegistrationDate`) VALUES
('Individual', 'Bob', 'Williams', 'Bob Williams', '0x55555...', 'bob.w@example.com', '555-9012', @addr_cedar_billing, @addr_cedar_billing, @addr_cedar_shipping, '2023-10-27 10:00:00');
SET @entity_bob_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_bob_id, @role_customer);

-- Influencer 1: TomOil
INSERT INTO `Entities` (`EntityType`, `EntityName`, `PrimaryContactPerson`, `PrimaryEmail`) VALUES
('Individual', 'TomOil', 'Tom Oil', 'tom@tomoil.com');
SET @entity_tomoil_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_tomoil_id, @role_partner_influencer);
INSERT INTO `InfluencerDetails` (`EntityID`, `FollowerCount`) VALUES (@entity_tomoil_id, 100000);

-- Influencer 2: OilGuru
INSERT INTO `Entities` (`EntityType`, `EntityName`, `PrimaryContactPerson`, `PrimaryEmail`) VALUES
('Individual', 'OilGuru', 'Guru Master', 'guru@oilguru.com');
SET @entity_oilguru_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_oilguru_id, @role_partner_influencer);
INSERT INTO `InfluencerDetails` (`EntityID`, `FollowerCount`) VALUES (@entity_oilguru_id, 500000);

-- Example Driver Entity
INSERT INTO `Entities` (`EntityType`, `FirstName`, `LastName`, `EntityName`, `PrimaryEmail`, `PrimaryPhone`) VALUES
('Individual', 'Dave', 'Driver', 'Dave Driver', 'dave.d@oliveritas_delivers.com', '555-3787');
SET @entity_driver_dave_id = LAST_INSERT_ID();
INSERT INTO `EntityRoles` (`EntityID`, `RoleID`) VALUES (@entity_driver_dave_id, @role_driver);


-- Insert Products
INSERT INTO `Products` (`ProductName`, `Description`, `BatchID`, `ProducerEntityID`, `CategoryID`, `CostPrice`, `SellingPrice`, `StockQuantity`, `ImageURL`) VALUES
('Solara Grove', 'Liquid gold, kissed by the sun.', 1, @entity_solara_id, @cat1_id, 12.00, 15.00, 500, 'https://oliveritas.eu/Solara.jpg');
SET @product1_id = LAST_INSERT_ID();
INSERT INTO `Products` (`ProductName`, `Description`, `BatchID`, `ProducerEntityID`, `CategoryID`, `CostPrice`, `SellingPrice`, `StockQuantity`, `ImageURL`) VALUES
('Emerald Crest', 'Vibrant, rich, and intensely flavorful green oil.', 2, @entity_crest_id, @cat2_id, 30.00, 35.00, 200, 'https://oliveritas.eu/Emerald.jpg');
SET @product2_id = LAST_INSERT_ID();
INSERT INTO `Products` (`ProductName`, `Description`, `BatchID`, `ProducerEntityID`, `CategoryID`, `CostPrice`, `SellingPrice`, `StockQuantity`, `ImageURL`) VALUES
('Stonewall Orchard', 'Bold and robust, from ancient, strong trees.', 3, @entity_stonewall_id, @cat3_id, 8.00, 10.00, 34, 'https://oliveritas.eu/Stonewall.jpg');
SET @product3_id = LAST_INSERT_ID();


-- Insert PaymentMethods (using address IDs) & Capture IDs
INSERT INTO `PaymentMethods` (`CustomerEntityID`, `PaymentType`, `PaymentToken`, `LastFourDigits`, `ExpiryMonth`, `ExpiryYear`, `BillingAddressID`, `IsDefault`, `CreatedAt`, `UpdatedAt`) VALUES
(@entity_alice_id, 'CreditCard', 'braintree_token_123', '1234', '12', '2025', @addr_pine_ln, TRUE, '2023-10-26 10:00:00', '2023-10-26 10:00:00');
SET @payment_method1_id = LAST_INSERT_ID();
INSERT INTO `PaymentMethods` (`CustomerEntityID`, `PaymentType`, `PaymentToken`, `LastFourDigits`, `ExpiryMonth`, `ExpiryYear`, `BillingAddressID`, `IsDefault`, `CreatedAt`, `UpdatedAt`) VALUES
(@entity_alice_id, 'PayPal', 'paypal_token_456', NULL, NULL, NULL, @addr_pine_ln, FALSE, '2023-10-27 14:30:00', '2023-10-27 14:30:00');
SET @payment_method2_id = LAST_INSERT_ID();
INSERT INTO `PaymentMethods` (`CustomerEntityID`, `PaymentType`, `PaymentToken`, `LastFourDigits`, `ExpiryMonth`, `ExpiryYear`, `BillingAddressID`, `IsDefault`, `CreatedAt`, `UpdatedAt`) VALUES
(@entity_bob_id, 'CreditCard', 'braintree_token_789', '5678', '11', '2026', @addr_cedar_billing, TRUE, '2023-10-27 11:00:00', '2023-10-27 11:00:00');
SET @payment_method3_id = LAST_INSERT_ID();


-- Update Entities to set DefaultPaymentMethodID
UPDATE `Entities` SET `DefaultPaymentMethodID` = @payment_method1_id WHERE `EntityID` = @entity_alice_id;
UPDATE `Entities` SET `DefaultPaymentMethodID` = @payment_method3_id WHERE `EntityID` = @entity_bob_id;

-- Insert Sample Delivery Zones, Rules, Fees, Carriers
INSERT INTO `DeliveryZones` (`ZoneName`, `Description`, `IsActive`) VALUES
('Dublin City', 'Dublin Postal Districts D01-D12, D6W', TRUE),
('County Dublin', 'Rest of County Dublin', TRUE),
('Nationwide IE', 'Republic of Ireland excluding Dublin', TRUE),
('No Delivery Zone', 'Addresses we cannot deliver to', FALSE);
SET @zone_dub_city = 1; -- Assuming IDs 1, 2, 3, 4
SET @zone_co_dub = 2;
SET @zone_nation_ie = 3;
SET @zone_no_delivery = 4;

INSERT INTO `ZoneRules` (`ZoneID`, `CountryCode`, `PostalCodePattern`, `CountyPattern`, `Priority`) VALUES
(@zone_dub_city, 'IE', 'D01%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D02%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D03%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D04%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D05%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D06%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D07%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D08%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D09%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D10%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D11%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D12%', 'County Dublin', 10),
(@zone_dub_city, 'IE', 'D6W%', 'County Dublin', 10),
(@zone_co_dub, 'IE', NULL, 'County Dublin', 5), -- Matches rest of Co Dublin
(@zone_nation_ie, 'IE', NULL, NULL, 1); -- Matches rest of IE

INSERT INTO `DeliveryFees` (`ZoneID`, `MinOrderAmount`, `FeeAmount`, `Description`, `IsActive`) VALUES
(@zone_dub_city, 50.00, 0.00, 'Free Dublin City Delivery Over €50', TRUE),
(@zone_dub_city, NULL, 5.00, 'Standard Dublin City Delivery', TRUE),
(@zone_co_dub, 75.00, 0.00, 'Free County Dublin Delivery Over €75', TRUE),
(@zone_co_dub, NULL, 7.50, 'Standard County Dublin Delivery', TRUE),
(@zone_nation_ie, NULL, 10.00, 'Nationwide IE Delivery', TRUE);

INSERT INTO `Carriers` (`CarrierName`, `TrackingURLTemplate`, `IsActive`) VALUES
('Internal Fleet', NULL, TRUE),
('An Post', 'https://track.anpost.ie/TrackingResults.aspx?rtt=1&items={TRACKING_ID}', TRUE),
('DPD Ireland', 'https://tracking.dpd.ie/status/{TRACKING_ID}', TRUE);
SET @carrier_internal = 1; -- Assuming IDs 1, 2, 3
SET @carrier_anpost = 2;
SET @carrier_dpd = 3;

-- Insert Orders (using address IDs and adding delivery fields, initially mostly NULL)
-- Application logic would determine ZoneID and FeeAmount based on ShippingAddressID
INSERT INTO `Orders` (`CustomerEntityID`, `PartnerEntityID`, `OrderDate`, `TotalAmount`, `Status`, `ShippingAddressID`, `DeliveryInstructions`, `DeliveryZoneID`, `DeliveryFeeAmount`) VALUES
(@entity_alice_id, NULL, '2023-10-28 11:00:00', 30.00, 'Pending', @addr_pine_ln, 'Leave at front door if not in.', @zone_co_dub, 7.50); -- Example fee applied
SET @order1_id = LAST_INSERT_ID();

INSERT INTO `Orders` (`CustomerEntityID`, `PartnerEntityID`, `OrderDate`, `TotalAmount`, `Status`, `ShippingAddressID`, `DeliveryZoneID`, `DeliveryFeeAmount`) VALUES
(NULL, @entity_retailgiant_id, '2023-10-28 15:00:00', 105.00, 'Shipped', @addr_retail_rd, @zone_co_dub, 0.00); -- Example free delivery
SET @order2_id = LAST_INSERT_ID();
-- Simulate shipping info being added later via an UPDATE
UPDATE `Orders` SET `CarrierID` = @carrier_dpd, `TrackingNumber` = 'DPD123456789', `ScheduledDeliveryDate` = '2023-10-30' WHERE OrderID = @order2_id;

INSERT INTO `Orders` (`CustomerEntityID`, `PartnerEntityID`, `OrderDate`, `TotalAmount`, `Status`, `ShippingAddressID`, `DeliveryInstructions`, `DeliveryZoneID`, `DeliveryFeeAmount`) VALUES
(@entity_bob_id, NULL, '2023-10-29 09:30:00', 45.00, 'Processing', @addr_cedar_shipping, NULL, @zone_co_dub, 7.50); -- Bob using his specific shipping address
SET @order3_id = LAST_INSERT_ID();
-- Simulate assignment to internal driver
UPDATE `Orders` SET `CarrierID` = @carrier_internal, `ScheduledDeliveryDate` = '2023-10-31', `ScheduledDeliveryTimeSlot` = '14:00-18:00', `AssignedDriverEntityID` = @entity_driver_dave_id WHERE OrderID = @order3_id;


-- Insert OrderItems
INSERT INTO `OrderItems` (`OrderID`, `ProductID`, `Quantity`, `PricePerUnit`) VALUES
(@order1_id, @product1_id, 2, 15.00),
(@order2_id, @product2_id, 3, 35.00),
(@order3_id, @product3_id, 5, 9.00);


-- Insert Transactions
INSERT INTO `Transactions` (`OrderID`, `PaymentMethodID`, `TransactionType`, `Amount`, `TransactionStatus`, `TransactionToken`, `GatewayResponse`, `CreatedAt`) VALUES
(@order1_id, @payment_method1_id, 'Authorization', 37.50, 'Submitted', 'braintree_txn_abc', '{"status": "submitted", "other_details": "..."}', '2023-10-28 11:15:00'), -- Amount includes delivery
(@order1_id, @payment_method1_id, 'Capture', 37.50, 'Settled', 'braintree_txn_def', '{"status": "settled", "other_details": "..."}', '2023-10-28 12:00:00'),
(@order3_id, @payment_method3_id, 'Authorization', 52.50, 'Submitted', 'braintree_txn_xyz', '{"status": "submitted", "other_details": "..."}', '2023-10-29 10:00:00'); -- Amount includes delivery


-- Insert Subscriptions (Using Address ID and Instructions)
INSERT INTO `Subscriptions` (`CustomerEntityID`, `PaymentMethodID`, `ProductID`, `PlanID`, `Status`, `StartDate`, `EndDate`, `RenewalDate`, `BillingCycle`, `ShippingAddressID`, `DeliveryInstructions`) VALUES
(@entity_alice_id, @payment_method1_id, @product1_id, 'monthly_basic', 'Active', '2023-11-01', NULL, '2023-12-01', 'Monthly', @addr_pine_ln, 'Leave at front door if not in.'); -- Use default addr/instr


-- Insert MarketingCampaigns
INSERT INTO `MarketingCampaigns` (`CampaignName`, `StartDate`, `EndDate`, `Platform`, `Budget`,`Description`) VALUES
('Fall Launch', '2023-11-01', '2023-11-30', 'Youtube', 1000.00,'New producer joining');
SET @campaign1_id = LAST_INSERT_ID();
INSERT INTO `MarketingCampaigns` (`CampaignName`, `StartDate`, `EndDate`, `Platform`, `Budget`,`Description`) VALUES
('Taste another land', '2023-12-01', '2023-12-31', 'Instagram', 500.00,'Introduction of a producer new region');
SET @campaign2_id = LAST_INSERT_ID();


-- Insert CampaignParticipants
INSERT INTO `CampaignParticipants` (`CampaignID`, `ParticipantEntityID`, `CollaborationDetails`) VALUES
(@campaign1_id, @entity_tomoil_id, 'Promote product on Instagram'),
(@campaign2_id, @entity_oilguru_id, 'Review product on YouTube');


-- Insert SocialMediaAccounts
INSERT INTO `SocialMediaAccounts` (`EntityID`, `Platform`, `Handle`, `URL`) VALUES
(@entity_solara_id, 'Linkedin', 'solara', 'https://www.linkedin.com/company/solara'),
(@entity_solara_id, 'Tiktok', '@solara_official', 'https://tiktok.com/@solara_official'),
(@entity_alice_id, 'Instagram', 'alice_j', 'https://www.instagram.com/alice_j'),
(@entity_tomoil_id, 'Instagram', '@tomoil', 'https://www.instagram.com/tomoil'),
(@entity_tomoil_id, 'YouTube', 'TomOilChannel', 'https://www.youtube.com/channel/EXAMPLE'), -- Placeholder URL
(@entity_retailgiant_id, 'X', '@RetailGiant', 'https://x.com/RetailGiant');

-- Commit the transaction
COMMIT;