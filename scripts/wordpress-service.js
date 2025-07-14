export async function syncUser(email, supabase_id, providers = []) {
    try {
        const response = await fetch('/wp-json/supabase/v2/users/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                supabase_id,
                providers
            })
        });

        if (!response.ok) {
            return { error: new Error('Failed to link user with WordPress'), data: null };
        }

        return { error: null, data: await response.json() };
    } catch (error) {
        return { error, data: null };
    }
}

export async function hydrateSession() {
    const access_token = supabaseClientOptions.accessToken;
    const refresh_token = supabaseClientOptions.refreshToken;

    if (access_token || refresh_token) {
        return supabase.auth.setSession({
            access_token,
            refresh_token
        });
    } else {
        return {
            error: new Error('No session tokens found'),
            data: null
        }
    }
}