/*
  # Create Helper Functions

  1. Functions
    - `increment_video_likes` - Increment likes count for a video
    - `increment_video_comments` - Increment comments count for a video
*/

CREATE OR REPLACE FUNCTION increment_video_likes(video_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET likes = likes + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_video_comments(video_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET comments_count = comments_count + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
