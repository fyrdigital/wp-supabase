import { createClient } from 'https://esm.sh/@supabase/supabase-js';

export function createSupabaseClient(mixin) {
    const client = createClient(supabaseClientOptions.projectUrl, supabaseClientOptions.publicKey);

    Object.assign(client, mixin);

    return client;
}