/*
  # Add Sample Escape Rooms

  1. Sample Data
    - Add 6 sample escape rooms with different themes and difficulties
    - Include realistic data for testing and demonstration
    - Ensure all required fields are populated

  2. Data Variety
    - Different themes: Horror, Mystery, Sci-Fi, Adventure, Fantasy, Thriller
    - Various difficulty levels from Beginner to Expert
    - Different locations and price points
    - Realistic descriptions and features
*/

-- Insert sample escape rooms
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
  'The Haunted Mansion',
  'Horror',
  'Hard',
  'Downtown',
  75,
  35.00,
  4.5,
  'Step into a Victorian mansion where the spirits of the past refuse to rest. Navigate through creaking hallways, solve supernatural puzzles, and uncover the dark secrets that bind the restless souls to this cursed estate.',
  '["Spine-chilling atmosphere", "Interactive ghost encounters", "Victorian-era puzzles", "Hidden passages", "Supernatural storyline"]',
  '[
    {"name": "Sarah M.", "rating": 5, "comment": "Absolutely terrifying in the best way! The actors were incredible and the puzzles were challenging but fair."},
    {"name": "Mike R.", "rating": 4, "comment": "Great atmosphere and production value. Some puzzles were quite difficult but very rewarding to solve."}
  ]',
  'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
  6
),
(
  'Detective''s Last Case',
  'Mystery',
  'Medium',
  'City Center',
  60,
  28.00,
  4.2,
  'The city''s greatest detective has vanished while investigating a high-profile murder case. Step into his office, examine the evidence, and follow the clues to solve both the original crime and discover what happened to the missing detective.',
  '["Crime scene investigation", "Evidence analysis", "Logical deduction puzzles", "1940s noir atmosphere", "Multiple plot twists"]',
  '[
    {"name": "Emma L.", "rating": 4, "comment": "Loved the detective theme! The puzzles were clever and the story kept us engaged throughout."},
    {"name": "James K.", "rating": 5, "comment": "Perfect difficulty level. Felt like real detectives solving a complex case."}
  ]',
  'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=800',
  5
),
(
  'Space Station Omega',
  'Sci-Fi',
  'Expert',
  'Tech District',
  90,
  45.00,
  4.7,
  'The year is 2087, and you''re aboard Space Station Omega when a critical system failure threatens all life support. Work together to repair the station''s AI, restore power, and escape before oxygen runs out in this high-tech adventure.',
  '["Futuristic technology puzzles", "Time pressure scenarios", "Team coordination required", "High-tech props and effects", "Multiple escape routes"]',
  '[
    {"name": "Alex T.", "rating": 5, "comment": "Mind-blowing experience! The technology and effects made it feel like we were really in space."},
    {"name": "Lisa P.", "rating": 4, "comment": "Challenging but amazing. The puzzles required real teamwork and communication."}
  ]',
  'https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=800',
  8
),
(
  'Pirate''s Treasure Hunt',
  'Adventure',
  'Easy',
  'Harbor District',
  45,
  22.00,
  4.0,
  'Ahoy matey! Captain Blackbeard''s legendary treasure is finally within reach. Navigate through his ship, solve nautical puzzles, and outsmart the booby traps to claim the greatest pirate treasure ever assembled.',
  '["Nautical-themed puzzles", "Physical challenges", "Treasure hunting", "Pirate ship setting", "Family-friendly adventure"]',
  '[
    {"name": "Tom W.", "rating": 4, "comment": "Great for families! Kids loved the pirate theme and adults enjoyed the puzzles."},
    {"name": "Maria S.", "rating": 4, "comment": "Fun and engaging without being too difficult. Perfect for beginners."}
  ]',
  'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800',
  6
),
(
  'The Wizard''s Tower',
  'Fantasy',
  'Medium',
  'Old Town',
  70,
  32.00,
  4.3,
  'Enter the mystical tower of the great wizard Merlin, where magic and logic intertwine. Brew potions, cast spells, and solve ancient riddles to prevent a dark curse from consuming the realm.',
  '["Magic-themed puzzles", "Potion brewing challenges", "Ancient riddles", "Mystical atmosphere", "Spell-casting mechanics"]',
  '[
    {"name": "Rachel D.", "rating": 5, "comment": "Magical experience! The theming was incredible and the puzzles were creative."},
    {"name": "David H.", "rating": 4, "comment": "Loved the fantasy setting. Some puzzles were tricky but the hints helped guide us."}
  ]',
  'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800',
  5
),
(
  'The Serial Killer''s Lair',
  'Thriller',
  'Advanced',
  'Industrial Zone',
  80,
  40.00,
  4.6,
  'You''ve been captured by the city''s most notorious serial killer. Locked in his twisted lair, you must solve his psychological puzzles, uncover his methods, and escape before you become his next victim.',
  '["Psychological thriller elements", "Dark atmosphere", "Complex puzzles", "Multiple rooms", "Intense storyline"]',
  '[
    {"name": "Chris B.", "rating": 5, "comment": "Incredibly intense and well-designed. Not for the faint of heart but absolutely brilliant."},
    {"name": "Amanda F.", "rating": 4, "comment": "Challenging and scary in all the right ways. The puzzles were complex but logical."}
  ]',
  'https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=800',
  4
)
ON CONFLICT DO NOTHING;