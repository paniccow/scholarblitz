import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { seconds }: { seconds: number } = await request.json();

    if (!seconds || seconds <= 0) {
      return NextResponse.json({ error: 'Invalid seconds value' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Get current profile
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('free_seconds_used, plan')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const newTotal = profile.free_seconds_used + seconds;

    // Update usage
    const { error: updateError } = await admin
      .from('profiles')
      .update({ free_seconds_used: newTotal })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update usage' }, { status: 500 });
    }

    return NextResponse.json({
      totalSecondsUsed: newTotal,
      plan: profile.plan,
    });
  } catch (error) {
    console.error('Usage track error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
