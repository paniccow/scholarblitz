import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const next = searchParams.get('next') ?? '/dashboard';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://scholarblitz.com';

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=auth_callback_failed`);
  }

  const storedState = request.cookies.get('oauth_state')?.value;
  const codeVerifier = request.cookies.get('oauth_code_verifier')?.value;

  // Detect direct Google PKCE flow by presence of state + verifier cookie
  const isDirectGoogle = state && storedState && codeVerifier;

  if (isDirectGoogle) {
    if (state !== storedState) {
      return NextResponse.redirect(`${appUrl}/login?error=auth_callback_failed`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${appUrl}/login?error=oauth_not_configured`);
    }

    // Exchange code for tokens with Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${appUrl}/callback`,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.id_token) {
      return NextResponse.redirect(`${appUrl}/login?error=auth_callback_failed`);
    }

    const redirectResponse = NextResponse.redirect(`${appUrl}${next}`);

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
              redirectResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokens.id_token,
    });

    if (error) {
      return NextResponse.redirect(`${appUrl}/login?error=auth_callback_failed`);
    }

    // Clear PKCE cookies
    redirectResponse.cookies.delete('oauth_code_verifier');
    redirectResponse.cookies.delete('oauth_state');

    return redirectResponse;
  }

  // Fallback: Supabase-managed OAuth code exchange
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

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${appUrl}/login?error=auth_callback_failed`);
  }

  return response;
}
