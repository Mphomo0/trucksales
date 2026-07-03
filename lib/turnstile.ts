// Server-side Cloudflare Turnstile verification.
// Requires TURNSTILE_SECRET_KEY (server) and NEXT_PUBLIC_TURNSTILE_SITE_KEY (client).

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string,
): Promise<{ valid: boolean; message: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // Keys not configured yet — don't hard-fail the forms, but make it loud.
    console.warn('TURNSTILE_SECRET_KEY is not set; skipping CAPTCHA verification')
    return { valid: true, message: '' }
  }

  if (!token) {
    return { valid: false, message: 'Please complete the security check' }
  }

  try {
    const params = new URLSearchParams({ secret, response: token })
    if (remoteIp && remoteIp !== 'unknown') params.set('remoteip', remoteIp)

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body: params,
      signal: AbortSignal.timeout(5000),
    })
    const data = (await res.json()) as { success: boolean }

    if (!data.success) {
      return {
        valid: false,
        message: 'Security check failed. Please try again.',
      }
    }
    return { valid: true, message: '' }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return {
      valid: false,
      message: 'Could not verify security check. Please try again.',
    }
  }
}
