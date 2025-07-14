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
        const providers = session.user.identities.map(identity => identity.provider);
        const metadata = {
            first_name: session.user.user_metadata.first_name,
            last_name: session.user.user_metadata.last_name,
            name: session.user.user_metadata.name,
            phone: session.user.user_metadata.phone ?? session.user.phone
        };

        supabase.wordpress.syncUser(session.user.email, session.user.id, providers, metadata).then((response) => {
            if (response.error) {
                // TODO handle error...
            } else if (response.data) {
                window.location.href = response.data.redirect ?? '/?login=success';
            }
        });
    }
});
