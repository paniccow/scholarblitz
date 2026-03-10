import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://scholarblitz.com';

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=auth_callback_failed`);
  }

  const response = NextResponse.redirect(`${appUrl}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${appUrl}/login?error=auth_callback_failed`);
  }

  // Sync Google display name to profile
  const googleName =
    data.user?.user_metadata?.full_name ??
    data.user?.user_metadata?.name;
  if (data.user && googleName) {
    await supabase
      .from('profiles')
      .update({ display_name: googleName })
      .eq('id', data.user.id);
  }

  return response;
}
