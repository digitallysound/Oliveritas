-- Useful Queries for the Oliveritas Database (Enhanced Schema)

-- -------------------------------------
-- Customer Management Queries
-- -------------------------------------

-- 1. Find Customer Details and Default Addresses by Email
-- Useful for customer service lookups.
SELECT
    e.EntityID,
    e.FirstName,
    e.LastName,
    e.PrimaryEmail,
    e.PrimaryPhone,
    e.RegistrationDate,
    a_bill.StreetLine1 AS BillingStreet1,
    a_bill.City AS BillingCity,
    a_bill.PostalCode AS BillingPostalCode,
    a_ship.StreetLine1 AS ShippingStreet1,
    a_ship.City AS ShippingCity,
    a_ship.PostalCode AS ShippingPostalCode
FROM Entities e
JOIN EntityRoles er ON e.EntityID = er.EntityID
JOIN Roles r ON er.RoleID = r.RoleID AND r.RoleName = 'Customer'
LEFT JOIN Addresses a_bill ON e.BillingAddressID = a_bill.AddressID
LEFT JOIN Addresses a_ship ON e.ShippingAddressID = a_ship.AddressID
WHERE e.PrimaryEmail = 'alice.j@example.com'; -- <<< Replace with specific email

-- 2. List Customers Registered in the Last 30 Days
-- Useful for welcome emails or onboarding checks.
SELECT
    e.EntityID,
    e.FirstName,
    e.LastName,
    e.PrimaryEmail,
    e.RegistrationDate
FROM Entities e
JOIN EntityRoles er ON e.EntityID = er.EntityID
JOIN Roles r ON er.RoleID = r.RoleID AND r.RoleName = 'Customer'
WHERE e.RegistrationDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY e.RegistrationDate DESC;

-- 3. Get Order History for a Specific Customer
-- Useful for viewing past purchases.
SELECT
    o.OrderID,
    o.OrderDate,
    o.TotalAmount,
    o.DeliveryFeeAmount,
    (o.TotalAmount + o.DeliveryFeeAmount) AS GrandTotal, -- Example calculation
    o.Status
FROM Orders o
WHERE o.CustomerEntityID = (SELECT EntityID FROM Entities WHERE PrimaryEmail = 'alice.j@example.com' LIMIT 1) -- <<< Replace email or use ID
ORDER BY o.OrderDate DESC;


-- -------------------------------------
-- Order Management & Fulfillment Queries
-- -------------------------------------

-- 4. List Orders Needing Shipment (e.g., Status 'Processing') with Details
-- Useful for the warehouse/fulfillment team.
SELECT
    o.OrderID,
    o.OrderDate,
    e.EntityName AS CustomerName,
    e.PrimaryPhone AS CustomerPhone,
    a.StreetLine1,
    a.StreetLine2,
    a.City,
    a.PostalCode,
    a.CountryCode,
    o.DeliveryInstructions
FROM Orders o
JOIN Entities e ON o.CustomerEntityID = e.EntityID -- Assumes Customer Orders
JOIN Addresses a ON o.ShippingAddressID = a.AddressID
WHERE o.Status = 'Processing' -- <<< Adjust status as needed
ORDER BY o.OrderDate ASC;

-- 5. Get Full Order Details for a Specific Order ID
-- Useful for viewing a complete order snapshot.
SELECT
    o.OrderID,
    o.OrderDate,
    o.Status,
    e.EntityName AS CustomerName,
    e.PrimaryEmail AS CustomerEmail,
    -- Shipping Address
    a_ship.StreetLine1 AS Shipping_Street1, a_ship.StreetLine2 AS Shipping_Street2,
    a_ship.City AS Shipping_City, a_ship.PostalCode AS Shipping_PostalCode, a_ship.CountryCode AS Shipping_Country,
    o.DeliveryInstructions,
    -- Items
    p.ProductID,
    p.ProductName,
    oi.Quantity,
    oi.PricePerUnit,
    (oi.Quantity * oi.PricePerUnit) AS ItemTotal,
    -- Totals & Fees
    o.TotalAmount AS ItemsSubtotal, -- Assuming TotalAmount is subtotal
    o.DeliveryFeeAmount,
    (o.TotalAmount + o.DeliveryFeeAmount) AS GrandTotal,
    -- Delivery Info
    c.CarrierName,
    o.TrackingNumber,
    driver.EntityName AS AssignedDriver
FROM Orders o
JOIN Entities e ON o.CustomerEntityID = e.EntityID -- Assumes Customer Orders
JOIN Addresses a_ship ON o.ShippingAddressID = a_ship.AddressID
LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
LEFT JOIN Products p ON oi.ProductID = p.ProductID
LEFT JOIN Carriers c ON o.CarrierID = c.CarrierID
LEFT JOIN Entities driver ON o.AssignedDriverEntityID = driver.EntityID
WHERE o.OrderID = 1; -- <<< Replace with specific OrderID

-- 6. List Orders Placed Today
SELECT
    o.OrderID,
    IFNULL(cust.EntityName, part.EntityName) AS PlacedBy, -- Show Customer or Partner Name
    o.OrderDate,
    (o.TotalAmount + o.DeliveryFeeAmount) AS GrandTotal,
    o.Status
FROM Orders o
LEFT JOIN Entities cust ON o.CustomerEntityID = cust.EntityID
LEFT JOIN Entities part ON o.PartnerEntityID = part.EntityID
WHERE DATE(o.OrderDate) = CURDATE()
ORDER BY o.OrderDate DESC;


-- -------------------------------------
-- Product & Inventory Queries
-- -------------------------------------

-- 7. List Products Low on Stock (Stock < 10)
-- Useful for reordering alerts.
SELECT
    p.ProductID,
    p.ProductName,
    p.StockQuantity,
    e.EntityName AS ProducerName
FROM Products p
JOIN Entities e ON p.ProducerEntityID = e.EntityID
WHERE p.StockQuantity < 10
ORDER BY p.StockQuantity ASC;

-- 8. List Products by Category
SELECT
    p.ProductID,
    p.ProductName,
    p.SellingPrice,
    p.StockQuantity,
    e.EntityName AS ProducerName
FROM Products p
JOIN Categories c ON p.CategoryID = c.CategoryID
JOIN Entities e ON p.ProducerEntityID = e.EntityID
WHERE c.CategoryName = 'Organic Extra Virgin' -- <<< Replace with desired CategoryName
ORDER BY p.ProductName;


-- -------------------------------------
-- Delivery Logistics Queries
-- -------------------------------------

-- 9. List Orders Scheduled for Delivery Today (Assigned to any driver/carrier)
SELECT
    o.OrderID,
    o.ScheduledDeliveryTimeSlot,
    a.StreetLine1,
    a.City,
    a.PostalCode,
    e_cust.EntityName AS CustomerName,
    o.DeliveryInstructions,
    c.CarrierName,
    o.TrackingNumber,
    e_driver.EntityName AS AssignedDriver
FROM Orders o
JOIN Addresses a ON o.ShippingAddressID = a.AddressID
LEFT JOIN Entities e_cust ON o.CustomerEntityID = e_cust.EntityID
LEFT JOIN Carriers c ON o.CarrierID = c.CarrierID
LEFT JOIN Entities e_driver ON o.AssignedDriverEntityID = e_driver.EntityID
WHERE o.ScheduledDeliveryDate = CURDATE()
AND o.Status NOT IN ('Delivered', 'Cancelled', 'Failed Delivery') -- Exclude completed/failed
ORDER BY o.ScheduledDeliveryTimeSlot, a.PostalCode;


-- 10. List Orders assigned to a Specific Internal Driver for Today
SELECT
    o.OrderID,
    o.ScheduledDeliveryTimeSlot,
    a.StreetLine1, a.City, a.PostalCode,
    o.DeliveryInstructions
FROM Orders o
JOIN Addresses a ON o.ShippingAddressID = a.AddressID
WHERE o.ScheduledDeliveryDate = CURDATE()
AND o.AssignedDriverEntityID = (SELECT EntityID FROM Entities WHERE PrimaryEmail = 'dave.d@oliveritas_delivers.com' LIMIT 1) -- <<< Replace driver email/ID
AND o.Status NOT IN ('Delivered', 'Cancelled', 'Failed Delivery')
ORDER BY o.ScheduledDeliveryTimeSlot;

-- 11. Find Orders shipping to a specific Postal Code Area (e.g., Dublin 1)
SELECT
    o.OrderID,
    o.OrderDate,
    a.StreetLine1, a.City, a.PostalCode,
    o.Status
FROM Orders o
JOIN Addresses a ON o.ShippingAddressID = a.AddressID
WHERE a.PostalCode LIKE 'D01%' -- <<< Adjust pattern as needed
AND a.CountryCode = 'IE'
ORDER BY o.OrderDate DESC;


-- -------------------------------------
-- Sales & Reporting Queries
-- -------------------------------------

-- 12. Calculate Gross Sales Value (Items + Delivery) for Completed Orders This Month
SELECT
    SUM(o.TotalAmount + o.DeliveryFeeAmount) AS TotalGrossSales
FROM Orders o
WHERE o.Status IN ('Delivered', 'Completed') -- Define your completed statuses
AND o.OrderDate >= DATE_FORMAT(CURDATE(), '%Y-%m-01') -- First day of current month
AND o.OrderDate < DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH); -- First day of next month


-- 13. Top 5 Selling Products by Quantity in the Last 90 Days
SELECT
    p.ProductName,
    SUM(oi.Quantity) AS TotalQuantitySold
FROM OrderItems oi
JOIN Orders o ON oi.OrderID = o.OrderID
JOIN Products p ON oi.ProductID = p.ProductID
WHERE o.OrderDate >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
AND o.Status NOT IN ('Cancelled', 'Failed Payment') -- Exclude non-sales orders
GROUP BY p.ProductID, p.ProductName
ORDER BY TotalQuantitySold DESC
LIMIT 5;


-- -------------------------------------
-- Marketing & Partner Queries
-- -------------------------------------

-- 14. List Active Influencers and Follower Count
SELECT
    e.EntityName,
    e.PrimaryEmail,
    id.FollowerCount
FROM Entities e
JOIN EntityRoles er ON e.EntityID = er.EntityID
JOIN Roles r ON er.RoleID = r.RoleID AND r.RoleName = 'Partner-Influencer'
LEFT JOIN InfluencerDetails id ON e.EntityID = id.EntityID
-- Optional: Add a filter if Entities have an IsActive flag
ORDER BY id.FollowerCount DESC;

-- 15. Find Participants for a Specific Marketing Campaign
SELECT
    mc.CampaignName,
    e.EntityName AS ParticipantName,
    r.RoleName AS ParticipantPrimaryRole -- Shows one role, could have more
FROM CampaignParticipants cp
JOIN MarketingCampaigns mc ON cp.CampaignID = mc.CampaignID
JOIN Entities e ON cp.ParticipantEntityID = e.EntityID
LEFT JOIN EntityRoles er ON e.EntityID = er.EntityID -- To get role
LEFT JOIN Roles r ON er.RoleID = r.RoleID -- Assuming one primary role matters here
WHERE mc.CampaignID = 1 -- <<< Replace with specific CampaignID
-- Add logic here if you need to filter by specific roles only (e.g. where r.RoleName = 'Partner-Influencer')
;

-- -------------------------------------
-- Entity & Role Queries
-- -------------------------------------

-- 16. Find Entities that are BOTH Customers AND Producers
SELECT
    e.EntityID,
    e.EntityName,
    e.PrimaryEmail
FROM Entities e
JOIN EntityRoles er1 ON e.EntityID = er1.EntityID
JOIN Roles r1 ON er1.RoleID = r1.RoleID AND r1.RoleName = 'Customer'
JOIN EntityRoles er2 ON e.EntityID = er2.EntityID
JOIN Roles r2 ON er2.RoleID = r2.RoleID AND r2.RoleName = 'Producer';

-- Alternative using GROUP BY / HAVING for multiple roles
SELECT
    e.EntityID,
    e.EntityName,
    e.PrimaryEmail,
    COUNT(DISTINCT er.RoleID) AS NumberOfRoles,
    GROUP_CONCAT(r.RoleName ORDER BY r.RoleName SEPARATOR ', ') AS Roles
FROM Entities e
JOIN EntityRoles er ON e.EntityID = er.EntityID
JOIN Roles r ON er.RoleID = r.RoleID
WHERE r.RoleName IN ('Customer', 'Producer') -- Check involvement in roles of interest
GROUP BY e.EntityID, e.EntityName, e.PrimaryEmail
HAVING COUNT(DISTINCT er.RoleID) = 2; -- Ensure they have exactly these two roles