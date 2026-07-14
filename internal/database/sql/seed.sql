-- Clear existing data and reset ID counters back to 1
TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE menu_items RESTART IDENTITY CASCADE;

-- Fill the menu_items table with our QuickBite menu
INSERT INTO menu_items (name, description, price) VALUES 
-- Mains
('Double Bacon Cheeseburger', 'Two smash patties, crispy bacon, cheddar, house sauce.', 12.99),
('Spicy Chicken Sandwich', 'Crispy fried chicken breast, pepper jack, spicy mayo, pickles.', 10.50),
('The Truffle Mushroom Burger', 'Plant-based patty, sautéed wild mushrooms, swiss cheese, truffle aioli, arugula.', 13.50),

-- Sides & Starters
('Large Garlic Parmesan Fries', 'Thick cut fries tossed in garlic butter and fresh parmesan.', 5.99),
('Loaded Queso & Chips', 'Warm, creamy cheese dip with smoky chorizo, jalapenos, and house-fried tortilla chips.', 7.99),
('Crispy Onion Rings', 'Thick-cut, beer-battered onion rings served with a smoky barbecue dipping sauce.', 5.50),
('Classic Sea Salt Fries', 'Thick cut, golden brown fries tossed in sea salt.', 4.50),

-- Lighter
('Chop House Salad', 'Crisp romaine, cherry tomatoes, cucumbers, sharp cheddar, bacon bits, tossed in creamy ranch.', 9.00),

-- Desserts
('Deep-Fried Oreos', 'Four battered and fried Oreos dusted with powdered sugar, served with chocolate drizzle.', 6.50),
('Salted Caramel Milkshake', 'Creamy vanilla bean ice cream blended with rich sea salt caramel, topped with whipped cream.', 5.99),

-- Beverages
('Craft Fountain Soda', 'Choice of cane sugar cola, diet cola, root beer, or lemon-lime.', 2.99),
('Iced Sweet Peach Tea', 'House-brewed black tea infused with natural peach nectar.', 3.25);