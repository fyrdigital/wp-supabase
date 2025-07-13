import { createSupabaseClient } from './scripts/create-client.js';
import { SupabaseForm } from './scripts/supabase-form.js';
import * as wordpress from './scripts/wordpress-service.js';

window.supabase = createSupabaseClient({ wordpress });
window.customElements.define('supabase-form', SupabaseForm);
window.dispatchEvent(new Event('supabase-ready'));
