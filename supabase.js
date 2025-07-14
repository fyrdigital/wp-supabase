import { createSupabaseClient } from './scripts/create-client.js';
import { SupabaseForm } from './scripts/supabase-form.js';
import * as wordpress from './scripts/wordpress-service.js';

window.supabase = createSupabaseClient({ wordpress });
window.customElements.define('supabase-form', SupabaseForm);

supabase.wordpress.hydrateSession().then(() => {
    window.dispatchEvent(new Event('supabase-ready'));
});

supabase.auth.onAuthStateChange((event, session) => {
    const query = new URLSearchParams(window.location.search);
    const login = query.get('login');

    if (event === 'SIGNED_IN' && login === 'pending') {
        supabase.wordpress.syncUser(
            session.user.email,
            session.user.id,
            session.user.identities.map(identity => identity.provider)
        ).then((response) => {
            if (response.error) {
                // TODO handle error...
            } else if (response.data) {
                window.location.href = response.data.redirect ?? '/?login=success';
            }
        });
    }
});
