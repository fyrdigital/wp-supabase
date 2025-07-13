export async function sync(email, supabase_id) {
    return new Promise((resolve) => {
        fetch('/wp-json/supabase/v2/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                supabase_id,
            })
        }).then((response) => {
            if (!response.ok) {
                resolve({
                    error: new Error('Failed to sync with WordPress'),
                    data: null
                })
            } else {
                return response.json();
            }
        }).then((data) => {
            resolve({
                error: null,
                data
            })
        }).catch((error) => {
            if (error instanceof Error) {
                resolve({ error, data: null });
            } else {
                resolve(error);
            }
        });
    });
}

export async function linkUser(email, supabase_id) {
    try {
        const response = await fetch('/wp-json/supabase/v2/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                supabase_id,
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