import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { source, videos } = body;

    if (!videos || !Array.isArray(videos)) {
      return new Response(
        JSON.stringify({ error: 'Videos array is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const videosToInsert = videos.map((video: any) => ({
      user_id: user.id,
      video_url: video.videoUrl,
      thumbnail_url: video.thumbnailUrl,
      description: video.description || '',
      hashtags: video.hashtags || [],
      source: source || 'scraped',
      source_url: video.sourceUrl || '',
    }));

    const { data, error } = await supabase
      .from('videos')
      .insert(videosToInsert)
      .select();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return Response.json({
      success: true,
      count: data.length,
      videos: data,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const url = new URL(request.url);
    const source = url.searchParams.get('source');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = supabase
      .from('videos')
      .select(`
        *,
        users (
          username,
          photo_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (source) {
      query = query.eq('source', source);
    }

    const { data, error } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return Response.json({
      success: true,
      count: data.length,
      videos: data,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
