/*
  # Create escape_rooms table

  1. New Tables
    - `escape_rooms`
      - `id` (bigint, primary key)
      - `title` (text, escape room name)
      - `theme` (text, theme category)
      - `difficulty` (text, difficulty level)
      - `location` (text, location area)
      - `duration` (integer, duration in minutes)
      - `price_per_person` (decimal, price per person)
      - `rating` (decimal, average rating)
      - `description` (text, detailed description)
      - `what_to_expect` (jsonb, array of expectations)
      - `recent_reviews` (jsonb, array of recent reviews)
      - `image_url` (text, image URL for room)
      - `max_players` (integer, maximum players allowed)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `escape_rooms` table
    - Add policy for public read access
    - Add policy for authenticated users to insert/update (for future admin features)
*/

-- Drop the existing events table since we're replacing it with escape_rooms
DROP TABLE IF EXISTS events;

-- Create the escape_rooms table
CREATE TABLE IF NOT EXISTS escape_rooms (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  theme text NOT NULL,
  difficulty text NOT NULL,
  location text NOT NULL,
  duration integer NOT NULL,
  price_per_person decimal(10,2) NOT NULL DEFAULT 0.00,
  rating decimal(3,2) NOT NULL DEFAULT 0.00,
  description text NOT NULL,
  what_to_expect jsonb NOT NULL DEFAULT '[]'::jsonb,
  recent_reviews jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_url text NOT NULL,
  max_players integer NOT NULL DEFAULT 6,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE escape_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read escape rooms"
  ON escape_rooms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert escape rooms"
  ON escape_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update escape rooms"
  ON escape_rooms
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert all the escape room data
INSERT INTO escape_rooms (title, theme, difficulty, location, duration, price_per_person, rating, description, what_to_expect, recent_reviews, image_url, max_players) VALUES
('The Asylum', 'Horror', 'Advanced', 'Downtown', 60, 35.00, 4.5, 'Step into the abandoned Blackwood Asylum where the line between reality and nightmare blurs. This psychological horror experience will test your sanity as you uncover the dark secrets hidden within these cursed walls. Navigate through dimly lit corridors, solve disturbing puzzles, and escape before you become another permanent resident.', 
'["Intense psychological horror elements", "Dark atmospheric lighting", "Complex puzzles requiring teamwork", "Jump scares and supernatural encounters", "Immersive backstory and character development"]'::jsonb,
'[{"name": "Sarah M.", "rating": 5, "comment": "Absolutely terrifying! The atmosphere was incredible and the puzzles were challenging."}, {"name": "Mike R.", "rating": 4, "comment": "Great scares but some puzzles were quite difficult. Loved the storyline!"}]'::jsonb,
'https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg', 6),

('Mystery Mansion', 'Mystery', 'Intermediate', 'Uptown', 45, 28.00, 4.0, 'Welcome to Ravenshollow Manor, where a wealthy industrialist has mysteriously vanished on the eve of reading his will. As private investigators, you must search through opulent rooms, decode cryptic clues, and unravel family secrets. Every portrait hides a story, every locked drawer contains evidence, and time is running out before the truth is buried forever.', 
'["Victorian-era mansion setting", "Detective work and evidence gathering", "Multiple suspects with motives", "Hidden passages and secret rooms", "Logical deduction puzzles"]'::jsonb,
'[{"name": "Emma L.", "rating": 4, "comment": "Loved the Victorian setting and the mystery was well-crafted with multiple suspects."}, {"name": "David K.", "rating": 4, "comment": "Great for beginners but experienced players might find some clues obvious."}]'::jsonb,
'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg', 8),

('Cyber Lab', 'Sci-Fi', 'Expert', 'Tech District', 75, 45.00, 4.5, 'In the year 2087, you are elite cyber-security specialists infiltrating the most advanced AI research facility on Earth. The artificial intelligence NEXUS has gone rogue and threatens to launch a global cyber attack. Navigate through holographic interfaces, hack quantum computers, and outsmart an AI that learns from your every move. The future of humanity depends on your success.', 
'["Cutting-edge technology and holographic displays", "AI opponent that adapts to your strategies", "Complex hacking mini-games", "Futuristic laboratory environment", "Multiple possible endings based on choices"]'::jsonb,
'[{"name": "Alex T.", "rating": 5, "comment": "Mind-blowing technology! The AI interactions felt incredibly real."}, {"name": "Jordan P.", "rating": 4, "comment": "Challenging but fair. The tech elements were amazing."}]'::jsonb,
'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg', 4),

('Prison Break', 'Adventure', 'Advanced', 'Historic Quarter', 50, 32.00, 4.2, 'Wrongfully convicted and sentenced to life in the notorious Irongate Penitentiary, you have one chance at freedom. Your cellmate has spent years planning the perfect escape, but he was transferred before he could execute it. Now its up to you to follow his cryptic notes, avoid the guards, and break out before the morning headcount. Freedom has never felt so close, yet so dangerous.', 
'["Authentic prison cell environment", "Stealth-based gameplay elements", "Time pressure with guard patrols", "Improvised tools and creative solutions", "Multiple escape routes to discover"]'::jsonb,
'[{"name": "Chris B.", "rating": 4, "comment": "Felt like a real prison break! The tension was incredible."}, {"name": "Lisa H.", "rating": 5, "comment": "Amazing attention to detail. Every element felt authentic."}]'::jsonb,
'https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg', 6),

('Pirate''s Treasure', 'Adventure', 'Intermediate', 'Marina', 55, 30.00, 4.3, 'Ahoy, matey! Captain Blackbeard''s legendary treasure ship, The Crimson Revenge, has been discovered after 300 years beneath the waves. As treasure hunters, you must navigate the barnacle-encrusted corridors, solve nautical puzzles, and claim the greatest pirate hoard in history. But beware - Blackbeard''s ghost still guards his precious treasure, and he doesn''t take kindly to thieves.', 
'["Authentic pirate ship replica", "Nautical puzzles and maritime challenges", "Treasure hunting with maps and clues", "Supernatural pirate encounters", "Immersive ocean sounds and ship movements"]'::jsonb,
'[{"name": "Tom S.", "rating": 4, "comment": "Great pirate atmosphere! Kids loved the treasure hunting aspect."}, {"name": "Maria G.", "rating": 5, "comment": "Felt like we were really on a pirate ship. Amazing details!"}]'::jsonb,
'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg', 8),

('Ancient Temple', 'Adventure', 'Advanced', 'Museum District', 65, 38.00, 4.4, 'Deep in the Amazon rainforest lies the lost Temple of Kukulkan, untouched for over a thousand years. As archaeologists, you''ve finally located this legendary Mayan sanctuary, but ancient guardians still protect its secrets. Navigate deadly traps, decipher hieroglyphic puzzles, and claim the Golden Serpent artifact before the temple seals itself forever. History awaits those brave enough to claim it.', 
'["Authentic Mayan temple architecture", "Ancient trap mechanisms and puzzles", "Archaeological discovery elements", "Hieroglyphic decoding challenges", "Immersive jungle atmosphere with sounds"]'::jsonb,
'[{"name": "Dr. Rodriguez", "rating": 5, "comment": "As an archaeologist, I was impressed by the historical accuracy!"}, {"name": "Jake M.", "rating": 4, "comment": "Challenging puzzles that really made us think like explorers."}]'::jsonb,
'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg', 6),

('Zombie Outbreak', 'Horror', 'Beginner', 'Downtown', 40, 25.00, 3.8, 'The zombie apocalypse has begun, and you''re trapped in the downtown medical research facility where it all started. Work together to find the antidote, barricade doors, and escape before the undead break through your defenses. This beginner-friendly horror experience focuses on teamwork and problem-solving rather than intense scares, making it perfect for first-time players or younger adventurers.', 
'["Zombie apocalypse theme with moderate scares", "Team-based survival challenges", "Medical facility setting", "Antidote creation puzzles", "Beginner-friendly horror elements"]'::jsonb,
'[{"name": "Amy K.", "rating": 4, "comment": "Perfect introduction to horror escape rooms! Not too scary but still exciting."}, {"name": "Ben L.", "rating": 3, "comment": "Good for beginners but experienced players might find it too easy."}]'::jsonb,
'https://images.pexels.com/photos/4254557/pexels-photo-4254557.jpeg', 8),

('Detective''s Office', 'Mystery', 'Beginner', 'Downtown', 35, 22.00, 3.9, 'Step into the shoes of Detective Harrison''s assistant in 1940s Chicago. A prominent businessman has been murdered, and you have exactly 35 minutes to examine the crime scene, interview suspects, and solve the case before the killer strikes again. This classic whodunit features straightforward clues and logical deduction, making it ideal for mystery lovers new to escape rooms.', 
'["1940s detective noir atmosphere", "Classic murder mystery setup", "Straightforward clue progression", "Character interviews and alibis", "Beginner-friendly logical puzzles"]'::jsonb,
'[{"name": "Helen W.", "rating": 4, "comment": "Loved the 1940s setting! Clues were clear and logical."}, {"name": "Robert T.", "rating": 4, "comment": "Great introduction to mystery escape rooms. Well-designed for beginners."}]'::jsonb,
'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg', 6),

('Space Station Alpha', 'Sci-Fi', 'Beginner', 'Tech District', 40, 26.00, 4.1, 'Welcome aboard Space Station Alpha, humanity''s first deep space research outpost. When a solar storm damages critical systems, you must work as a crew to restore power, repair life support, and navigate back to Earth. This space adventure emphasizes teamwork and basic problem-solving in a stunning futuristic environment, perfect for sci-fi fans taking their first step into escape rooms.', 
'["Futuristic space station environment", "Teamwork-focused challenges", "Basic technical puzzles", "Stunning visual effects and lighting", "Beginner-friendly sci-fi adventure"]'::jsonb,
'[{"name": "NASA_Fan_2023", "rating": 4, "comment": "Amazing space station replica! Felt like being in a real spacecraft."}, {"name": "Sophie R.", "rating": 4, "comment": "Great for beginners. The space theme was incredibly immersive."}]'::jsonb,
'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg', 6),

('Jungle Expedition', 'Adventure', 'Beginner', 'Historic Quarter', 35, 24.00, 4.0, 'Join renowned explorer Dr. Adventure on an expedition deep into the Amazon rainforest to discover a lost civilization. When your guide disappears, you must use his field notes to navigate through the jungle, solve ancient puzzles, and find your way back to civilization. This family-friendly adventure combines education with excitement, featuring real jungle facts and beginner-level challenges.', 
'["Educational jungle expedition theme", "Family-friendly adventure elements", "Nature-based puzzles and challenges", "Explorer tools and field equipment", "Beginner-level difficulty with learning opportunities"]'::jsonb,
'[{"name": "Teacher_Mike", "rating": 4, "comment": "Perfect for school groups! Educational and fun."}, {"name": "Family_Adventures", "rating": 4, "comment": "Kids loved learning about the jungle while solving puzzles."}]'::jsonb,
'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg', 8),

('Pharaoh''s Tomb', 'Adventure', 'Beginner', 'Museum District', 40, 27.00, 4.2, 'Discover the tomb of Pharaoh Ankh-ef-en-Sekhmet, hidden beneath the Egyptian desert for over 3,000 years. As junior archaeologists, you must navigate the burial chambers, solve hieroglyphic puzzles, and claim the pharaoh''s golden scarab before ancient curses awaken. This educational adventure teaches real Egyptian history while providing an exciting introduction to escape room adventures.', 
'["Authentic Egyptian tomb replica", "Educational historical elements", "Hieroglyphic puzzle solving", "Ancient Egyptian artifacts and treasures", "Family-friendly archaeological adventure"]'::jsonb,
'[{"name": "History_Buff", "rating": 4, "comment": "Loved learning about Egyptian history! Great for families."}, {"name": "Cairo_Explorer", "rating": 5, "comment": "Incredibly detailed Egyptian setting. Felt like a real archaeological dig!"}]'::jsonb,
'https://images.pexels.com/photos/3290075/pexels-photo-3290075.jpeg', 6),

('Alien Invasion', 'Sci-Fi', 'Intermediate', 'Downtown', 55, 33.00, 4.1, 'Earth''s first contact with alien life isn''t going as planned. Extraterrestrial forces have invaded downtown, and you''re part of the resistance movement fighting back. Infiltrate their command center, decode alien technology, and disable their invasion fleet before they can call for reinforcements. This sci-fi thriller combines alien encounters with high-tech puzzles and strategic thinking.', 
'["Alien invasion scenario with extraterrestrial technology", "High-tech alien puzzles and interfaces", "Resistance movement storyline", "Strategic planning and execution", "Intermediate-level sci-fi challenges"]'::jsonb,
'[{"name": "SciFi_Lover", "rating": 4, "comment": "Amazing alien technology! The invasion storyline was thrilling."}, {"name": "Resistance_Fighter", "rating": 4, "comment": "Great balance of action and puzzles. Felt like saving the world!"}]'::jsonb,
'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg', 6),

('Quick Heist', 'Adventure', 'Intermediate', 'Uptown', 30, 20.00, 3.7, 'You''re master thieves planning the heist of the century - stealing the famous Midnight Diamond from the ultra-secure Pinnacle Gallery. With only 30 minutes before the security system resets, you must disable alarms, crack safes, and escape with the prize. This fast-paced adventure tests your ability to work under extreme pressure while executing the perfect crime.', 
'["High-stakes heist scenario", "Fast-paced 30-minute challenge", "Security system puzzles", "Teamwork under pressure", "Ocean''s Eleven style adventure"]'::jsonb,
'[{"name": "Heist_Master", "rating": 4, "comment": "Perfect for a quick thrill! Loved the pressure and teamwork required."}, {"name": "Diamond_Thief", "rating": 3, "comment": "Fun but wished it was longer. Great for time-pressed groups."}]'::jsonb,
'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', 4),

('Medieval Castle', 'Adventure', 'Intermediate', 'Historic Quarter', 50, 31.00, 4.3, 'You are knights of the Round Table, summoned to rescue Princess Guinevere from the dark sorcerer Morgrim''s fortress. Navigate through the castle''s treacherous halls, solve medieval riddles, and overcome magical obstacles to reach the tower where the princess is held. This fantasy adventure combines Arthurian legend with challenging puzzles and medieval atmosphere.', 
'["Medieval castle setting with authentic details", "Arthurian legend storyline", "Knights of the Round Table theme", "Medieval puzzles and riddles", "Fantasy adventure with magical elements"]'::jsonb,
'[{"name": "Knight_Errant", "rating": 4, "comment": "Felt like being in a real medieval castle! Great Arthurian atmosphere."}, {"name": "Princess_Saver", "rating": 5, "comment": "Amazing medieval details and challenging but fair puzzles."}]'::jsonb,
'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg', 6),

('Corporate Espionage', 'Mystery', 'Advanced', 'Downtown', 60, 36.00, 4.0, 'Infiltrate Nexus Corporation as undercover agents to uncover evidence of illegal activities. Navigate through corporate offices, hack computer systems, and gather intelligence while avoiding security. This modern mystery combines corporate intrigue with high-tech espionage, requiring advanced problem-solving skills and strategic thinking to expose the conspiracy.', 
'["Modern corporate espionage theme", "High-tech hacking challenges", "Undercover agent storyline", "Office infiltration scenario", "Advanced mystery and investigation elements"]'::jsonb,
'[{"name": "Agent_007", "rating": 4, "comment": "Great corporate espionage theme! Felt like a real spy mission."}, {"name": "Hacker_Elite", "rating": 4, "comment": "Loved the tech challenges and corporate setting. Very immersive."}]'::jsonb,
'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg', 5),

('Haunted Mansion', 'Horror', 'Expert', 'Uptown', 80, 42.00, 4.6, 'Enter Blackwood Manor, where the Blackwood family met their tragic end 100 years ago. As paranormal investigators, you must uncover the truth behind their deaths while surviving encounters with vengeful spirits. This expert-level horror experience features intense supernatural encounters, complex puzzles, and psychological challenges that will test even the most experienced escape room veterans.', 
'["Intense supernatural horror experience", "Complex multi-layered puzzles", "Paranormal investigation theme", "Expert-level psychological challenges", "Immersive haunted mansion atmosphere"]'::jsonb,
'[{"name": "Ghost_Hunter", "rating": 5, "comment": "Absolutely terrifying and brilliantly designed! Best horror room I''ve experienced."}, {"name": "Paranormal_Expert", "rating": 4, "comment": "Incredibly challenging but fair. The supernatural elements were amazing."}]'::jsonb,
'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg', 4),

('Cold Case Files', 'Mystery', 'Expert', 'Tech District', 70, 40.00, 4.4, 'You''re elite detectives reopening the city''s most challenging unsolved cases. Using advanced forensic technology and criminal psychology, you must analyze evidence, interview suspects, and solve crimes that have stumped investigators for years. This expert mystery experience requires advanced deductive reasoning and attention to detail to crack cases that seemed impossible to solve.', 
'["Advanced forensic investigation", "Multiple cold cases to solve", "Criminal psychology elements", "Expert-level deductive reasoning", "High-tech crime lab setting"]'::jsonb,
'[{"name": "Detective_Holmes", "rating": 5, "comment": "Incredibly complex and rewarding! Felt like a real criminal investigation."}, {"name": "Forensic_Expert", "rating": 4, "comment": "Challenging puzzles that required real detective work. Loved the forensic elements."}]'::jsonb,
'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg', 4),

('Submarine Escape', 'Adventure', 'Expert', 'Marina', 85, 48.00, 4.7, 'You''re aboard the USS Leviathan, a nuclear submarine that has suffered catastrophic damage in enemy waters. With oxygen running low and water flooding the compartments, you must repair critical systems, navigate through damaged sections, and surface before the submarine becomes your tomb. This expert maritime adventure requires advanced problem-solving and teamwork under extreme pressure.', 
'["Authentic submarine environment", "High-pressure survival scenario", "Advanced maritime puzzles", "Expert-level teamwork challenges", "Immersive underwater atmosphere"]'::jsonb,
'[{"name": "Navy_Veteran", "rating": 5, "comment": "Incredibly realistic submarine experience! Felt like being in a real naval emergency."}, {"name": "Deep_Sea_Explorer", "rating": 5, "comment": "Most challenging and immersive escape room I''ve ever experienced. Absolutely brilliant!"}]'::jsonb,
'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg', 6);