/*
  # Add More Escape Room Samples

  1. New Tables
    - Adding 12 new diverse escape room samples with themed photos
    
  2. Features
    - Horror, Mystery, Sci-Fi, Adventure, Fantasy, and Thriller themes
    - Realistic pricing, durations, and difficulty levels
    - Themed photos that match each room's concept
    - Detailed descriptions and "what to expect" lists
    - Authentic user reviews for each room
*/

-- Insert new escape room samples
INSERT INTO escape_rooms (
  title,
  theme,
  difficulty,
  location,
  duration,
  price_per_person,
  rating,
  description,
  what_to_expect,
  recent_reviews,
  image_url,
  max_players
) VALUES 
(
  'Zombie Apocalypse: Safe House',
  'Horror',
  'Hard',
  'Industrial District',
  75,
  45.00,
  4.6,
  'The zombie outbreak has begun and you''ve found refuge in an abandoned safe house. But supplies are running low and the undead are closing in. Work together to find weapons, secure the perimeter, and discover the cure before you become their next meal.',
  '["Live zombie actors", "Realistic special effects", "Multiple escape routes", "Team-based survival challenges", "Immersive post-apocalyptic setting"]',
  '[
    {"name": "SurvivalMike", "rating": 5, "comment": "Absolutely terrifying! The zombie actors were so realistic I forgot it was just a game."},
    {"name": "ZombieHunter23", "rating": 4, "comment": "Great teamwork required. The special effects were incredible!"}
  ]',
  'https://images.pexels.com/photos/8828786/pexels-photo-8828786.jpeg?auto=compress&cs=tinysrgb&w=800',
  8
),
(
  'The Haunted Mansion',
  'Horror',
  'Medium',
  'Historic Quarter',
  60,
  38.00,
  4.3,
  'Enter the Victorian mansion where the Blackwood family met their tragic end. Strange occurrences plague anyone who dares to enter. Uncover the dark secrets hidden within these walls and help the restless spirits find peace before you join them forever.',
  '["Victorian-era setting", "Supernatural puzzles", "Ghost story narrative", "Atmospheric lighting", "Hidden passages"]',
  '[
    {"name": "GhostWhisperer", "rating": 4, "comment": "Beautifully designed Victorian setting. The ghost story was compelling!"},
    {"name": "ParanormalFan", "rating": 5, "comment": "Perfect balance of scary and solvable. Loved the hidden passages!"}
  ]',
  'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
  6
),
(
  'Detective''s Office: The Missing Heiress',
  'Mystery',
  'Hard',
  'Downtown',
  90,
  52.00,
  4.7,
  'Step into 1940s film noir as private detective Sam Spade. The wealthy heiress Victoria Sterling has vanished, and you''re the only one who can crack the case. Search through evidence, interrogate suspects, and follow the clues through the seedy underbelly of the city.',
  '["1940s film noir atmosphere", "Detective work and clues", "Multiple suspects to investigate", "Period-accurate props", "Complex mystery storyline"]',
  '[
    {"name": "DetectiveFan", "rating": 5, "comment": "Felt like I was in a real film noir! The mystery was complex and satisfying."},
    {"name": "NoirLover", "rating": 4, "comment": "Great attention to period detail. The suspects were all believable!"}
  ]',
  'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800',
  5
),
(
  'Murder at the Masquerade Ball',
  'Mystery',
  'Medium',
  'Grand Hotel',
  75,
  48.00,
  4.4,
  'The annual masquerade ball has taken a deadly turn. Behind the elegant masks and flowing gowns, a murderer lurks. As guests at this exclusive event, you must identify the killer before they strike again. Everyone is a suspect in this deadly game of deception.',
  '["Elegant ballroom setting", "Murder mystery investigation", "Costume and mask elements", "Multiple suspects", "Social deduction gameplay"]',
  '[
    {"name": "MysteryLover", "rating": 4, "comment": "Loved the elegant setting! The costumes added to the atmosphere."},
    {"name": "BallroomDetective", "rating": 5, "comment": "Perfect murder mystery. Everyone really felt like a suspect!"}
  ]',
  'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=800',
  8
),
(
  'Space Station Omega: System Failure',
  'Sci-Fi',
  'Expert',
  'Tech Center',
  90,
  58.00,
  4.8,
  'The year is 2087 and you''re aboard Space Station Omega when a critical system failure occurs. With oxygen running low and the station''s AI malfunctioning, you must repair the systems and restore life support before the station becomes your tomb in the void of space.',
  '["Futuristic space setting", "High-tech puzzles", "Time pressure elements", "AI interaction", "Scientific problem solving"]',
  '[
    {"name": "SpaceExplorer", "rating": 5, "comment": "Most immersive sci-fi experience ever! The technology felt real."},
    {"name": "AstronautWannabe", "rating": 5, "comment": "Challenging puzzles that actually felt scientific. Loved the AI character!"}
  ]',
  'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800',
  6
),
(
  'The Time Machine: Victorian London',
  'Sci-Fi',
  'Hard',
  'Museum District',
  80,
  50.00,
  4.5,
  'Professor Wells'' time machine has malfunctioned, stranding you in Victorian London. Navigate the gaslit streets, avoid changing history, and repair the temporal device before you''re stuck in the past forever. But beware - someone doesn''t want you to return to your own time.',
  '["Time travel storyline", "Victorian London setting", "Historical accuracy", "Temporal puzzles", "Steampunk elements"]',
  '[
    {"name": "TimeTraveler", "rating": 4, "comment": "Amazing historical detail! Felt like I was really in Victorian London."},
    {"name": "SteampunkFan", "rating": 5, "comment": "Perfect blend of history and sci-fi. The time puzzles were brilliant!"}
  ]',
  'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
  7
),
(
  'Pirate''s Treasure: The Lost Galleon',
  'Adventure',
  'Medium',
  'Harbor District',
  70,
  42.00,
  4.2,
  'Ahoy matey! Captain Blackbeard''s legendary treasure ship has been discovered, but it''s rigged with deadly traps. Navigate the creaking decks, solve nautical puzzles, and claim the greatest pirate treasure ever assembled. But hurry - rival pirates are closing in!',
  '["Authentic pirate ship setting", "Nautical puzzles", "Treasure hunting", "Pirate lore and history", "Adventure storyline"]',
  '[
    {"name": "PirateCaptain", "rating": 4, "comment": "Arrr! Felt like a real pirate adventure. The ship setting was incredible!"},
    {"name": "TreasureHunter", "rating": 4, "comment": "Great nautical puzzles. The treasure hunt was exciting!"}
  ]',
  'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800',
  8
),
(
  'The Lost Temple of Anubis',
  'Adventure',
  'Hard',
  'Archaeological Park',
  85,
  55.00,
  4.6,
  'Deep in the Egyptian desert, you''ve discovered the lost temple of Anubis, god of the afterlife. Ancient traps guard priceless artifacts, and hieroglyphic puzzles hold the key to the pharaoh''s greatest secret. Can you claim the treasure and escape before the temple seals forever?',
  '["Ancient Egyptian setting", "Archaeological puzzles", "Hieroglyphic challenges", "Ancient traps and mechanisms", "Historical artifacts"]',
  '[
    {"name": "Archaeologist", "rating": 5, "comment": "Incredible attention to Egyptian history! The hieroglyphic puzzles were authentic."},
    {"name": "AdventureSeeker", "rating": 4, "comment": "Felt like a real archaeological expedition. The traps were cleverly designed!"}
  ]',
  'https://images.pexels.com/photos/4350057/pexels-photo-4350057.jpeg?auto=compress&cs=tinysrgb&w=800',
  6
),
(
  'The Wizard''s Tower: Arcane Mysteries',
  'Fantasy',
  'Medium',
  'Fantasy District',
  75,
  46.00,
  4.4,
  'The great wizard Merlin has vanished, leaving his tower filled with magical puzzles and arcane mysteries. As his apprentices, you must master the elements, brew potions, and solve enchanted riddles to discover what happened to your master and save the realm from darkness.',
  '["Medieval fantasy setting", "Magic-themed puzzles", "Potion brewing challenges", "Elemental magic", "Wizard lore and spells"]',
  '[
    {"name": "WizardApprentice", "rating": 4, "comment": "Magical atmosphere was perfect! The potion brewing was so much fun."},
    {"name": "FantasyFan", "rating": 5, "comment": "Felt like I was in a real fantasy world. The magic puzzles were creative!"}
  ]',
  'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800',
  7
),
(
  'Dragon''s Lair: The Sleeping Beast',
  'Fantasy',
  'Expert',
  'Castle Grounds',
  90,
  58.00,
  4.7,
  'The ancient dragon has slumbered for centuries, guarding its hoard in the deepest cavern. You are brave knights on a quest to claim the legendary treasure, but one wrong move will awaken the beast. Use cunning, courage, and teamwork to succeed where countless others have failed.',
  '["Epic dragon encounter", "Medieval knight theme", "Treasure quest", "Fantasy combat elements", "Legendary storyline"]',
  '[
    {"name": "DragonSlayer", "rating": 5, "comment": "Epic fantasy adventure! The dragon animatronics were incredible."},
    {"name": "KnightErrant", "rating": 4, "comment": "Challenging quest that required real teamwork. Felt like a legend!"}
  ]',
  'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800',
  6
),
(
  'Prison Break: Alcatraz Redux',
  'Thriller',
  'Hard',
  'Security Complex',
  80,
  48.00,
  4.5,
  'You''ve been wrongfully imprisoned in the world''s most secure facility. With the help of fellow inmates, you have one chance to execute the perfect escape plan. Avoid the guards, hack the security systems, and make it to freedom before the morning headcount reveals your absence.',
  '["High-security prison setting", "Stealth and strategy", "Security system hacking", "Team coordination", "Escape planning"]',
  '[
    {"name": "EscapeArtist", "rating": 5, "comment": "Intense thriller experience! The security systems felt real."},
    {"name": "PrisonBreaker", "rating": 4, "comment": "Great teamwork required. The escape plan was brilliant!"}
  ]',
  'https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&w=800',
  8
),
(
  'Bank Heist: The Perfect Score',
  'Thriller',
  'Expert',
  'Financial District',
  90,
  55.00,
  4.8,
  'You''re professional thieves planning the heist of the century. The First National Bank''s vault contains millions, but it''s protected by state-of-the-art security. Disable alarms, crack safes, and execute your plan flawlessly. One mistake and you''ll spend life behind bars.',
  '["Professional heist theme", "High-tech security systems", "Safe cracking", "Precision timing", "Criminal mastermind strategy"]',
  '[
    {"name": "MasterThief", "rating": 5, "comment": "Most realistic heist experience ever! The security was incredibly challenging."},
    {"name": "CriminalMind", "rating": 5, "comment": "Perfect blend of strategy and action. Felt like a real professional!"}
  ]',
  'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
  6
);