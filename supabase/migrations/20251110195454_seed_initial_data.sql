/*
  # Seed Initial Data

  1. Sample Data
    - Create demo users
    - Create sample videos from various sources
    - This provides initial content for the app
*/

-- Insert demo users
INSERT INTO users (id, username, email, display_name, photo_url, bio, followers, following) VALUES
  ('d1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a', 'techcreator', 'tech@example.com', 'Tech Creator', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', 'Technology enthusiast sharing the latest tech trends', 15000, 245),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'dancepro', 'dance@example.com', 'Dance Pro', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', 'Professional dancer and choreographer', 28000, 432),
  ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'foodie_chef', 'food@example.com', 'Foodie Chef', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400', 'Cooking delicious meals and sharing recipes', 42000, 567),
  ('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'travel_explorer', 'travel@example.com', 'Travel Explorer', 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=400', 'Exploring the world one destination at a time', 55000, 876),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'fitness_coach', 'fitness@example.com', 'Fitness Coach', 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400', 'Certified fitness trainer helping you achieve your goals', 38000, 321)
ON CONFLICT (id) DO NOTHING;

-- Insert sample videos
INSERT INTO videos (user_id, video_url, thumbnail_url, description, hashtags, likes, comments_count, shares, source, source_url) VALUES
  (
    'd1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a',
    'https://videos.pexels.com/video-files/3196372/3196372-uhd_2560_1440_25fps.mp4',
    'https://images.pexels.com/videos/3196372/free-video-3196372.jpg?auto=compress&cs=tinysrgb&w=400',
    'Amazing technology showcase! The future is here',
    ARRAY['tech', 'innovation', 'future', 'technology'],
    4200,
    234,
    89,
    'pexels',
    'https://www.pexels.com/video/3196372'
  ),
  (
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'https://videos.pexels.com/video-files/3195379/3195379-uhd_2560_1440_25fps.mp4',
    'https://images.pexels.com/videos/3195379/free-video-3195379.jpg?auto=compress&cs=tinysrgb&w=400',
    'New dance routine! Who wants to learn this?',
    ARRAY['dance', 'choreography', 'music', 'trending'],
    8900,
    456,
    234,
    'pexels',
    'https://www.pexels.com/video/3195379'
  ),
  (
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    'https://videos.pexels.com/video-files/3297379/3297379-uhd_2560_1440_25fps.mp4',
    'https://images.pexels.com/videos/3297379/free-video-3297379.jpg?auto=compress&cs=tinysrgb&w=400',
    'Delicious pasta recipe you need to try!',
    ARRAY['food', 'cooking', 'recipe', 'italian', 'pasta'],
    12500,
    678,
    445,
    'pexels',
    'https://www.pexels.com/video/3297379'
  ),
  (
    'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    'https://videos.pexels.com/video-files/4992142/4992142-uhd_2560_1440_25fps.mp4',
    'https://images.pexels.com/videos/4992142/free-video-4992142.jpg?auto=compress&cs=tinysrgb&w=400',
    'Breathtaking sunset at the beach paradise',
    ARRAY['travel', 'beach', 'sunset', 'nature', 'beautiful'],
    18700,
    892,
    567,
    'pexels',
    'https://www.pexels.com/video/4992142'
  ),
  (
    'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    'https://videos.pexels.com/video-files/4662356/4662356-uhd_2560_1440_25fps.mp4',
    'https://images.pexels.com/videos/4662356/free-video-4662356.jpg?auto=compress&cs=tinysrgb&w=400',
    'Full body workout routine - 20 minutes',
    ARRAY['fitness', 'workout', 'health', 'exercise', 'motivation'],
    14200,
    534,
    398,
    'pexels',
    'https://www.pexels.com/video/4662356'
  ),
  (
    'd1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a',
    'https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_25fps.mp4',
    'https://images.pexels.com/videos/3130284/free-video-3130284.jpg?auto=compress&cs=tinysrgb&w=400',
    'Latest smartphone review is live!',
    ARRAY['tech', 'smartphone', 'review', 'gadgets'],
    9800,
    345,
    178,
    'pexels',
    'https://www.pexels.com/video/3130284'
  ),
  (
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'https://videos.pexels.com/video-files/3044127/3044127-uhd_2560_1440_25fps.mp4',
    'https://images.pexels.com/videos/3044127/free-video-3044127.jpg?auto=compress&cs=tinysrgb&w=400',
    'Hip hop dance battle compilation',
    ARRAY['dance', 'hiphop', 'battle', 'competition'],
    22100,
    987,
    654,
    'pexels',
    'https://www.pexels.com/video/3044127'
  ),
  (
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    'https://videos.pexels.com/video-files/3298869/3298869-uhd_2560_1440_25fps.mp4',
    'https://images.pexels.com/videos/3298869/free-video-3298869.jpg?auto=compress&cs=tinysrgb&w=400',
    'Making the perfect chocolate cake',
    ARRAY['baking', 'dessert', 'chocolate', 'cake', 'sweet'],
    16700,
    723,
    412,
    'pexels',
    'https://www.pexels.com/video/3298869'
  ),
  (
    'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
    'https://images.pexels.com/videos/3571264/free-video-3571264.jpg?auto=compress&cs=tinysrgb&w=400',
    'Mountain hiking adventure in the Alps',
    ARRAY['travel', 'hiking', 'mountains', 'adventure', 'nature'],
    19500,
    845,
    523,
    'pexels',
    'https://www.pexels.com/video/3571264'
  ),
  (
    'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    'https://videos.pexels.com/video-files/4662344/4662344-uhd_2560_1440_25fps.mp4',
    'https://images.pexels.com/videos/4662344/free-video-4662344.jpg?auto=compress&cs=tinysrgb&w=400',
    'Yoga flow for beginners - Morning routine',
    ARRAY['fitness', 'yoga', 'wellness', 'meditation', 'morning'],
    11300,
    456,
    287,
    'pexels',
    'https://www.pexels.com/video/4662344'
  );
