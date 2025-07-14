<?php
/**
 * Plugin Name: Supabase
 * Version:     2.0.0
 * Plugin URI:  https://github.com/fyrdigital/wp-supabase
 * Description: Integrates Supabase with WordPress.
 * Author:      FYR
 * Author URI:  https://fyr.digital/
 * Text Domain: supabase
 * Domain Path: /languages/
 * License:     MIT
 * Requires at least: 6.6
 * Requires PHP: 8.2
 */

const SUPABASE = 'supabase';
const SUPABASE_ID = 'supabase_id';
const SUPABASE_USER = 'supabase_user';
const SUPABASE_PROVIDERS = 'supabase_providers';
const SUPABASE_PROJECT_URL = 'supabase_project_url';
const SUPABASE_PUBLIC_KEY = 'supabase_anon_public_key';
const SUPABASE_SERVICE_KEY = 'supabase_service_key';
const SUPABASE_SETTINGS = 'supabase_settings';

function supabase(): string {
    return '2.0.0';
}

function supabase_project_url(): string {
    return get_option(SUPABASE_PROJECT_URL);
}

function supabase_public_key(): string {
    return get_option(SUPABASE_PUBLIC_KEY);
}

function supabase_service_key(): string {
    return get_option(SUPABASE_SERVICE_KEY);
}

function supabase_is_pending(): bool {
    return isset($_GET['login']) && $_GET['login'] === 'pending';
}

function supabase_is_error(): bool {
    return isset($_GET['login']) && $_GET['login'] === 'error';
}

function supabase_is_success(): bool {
    return isset($_GET['login']) && $_GET['login'] === 'success';
}

require_once plugin_dir_path( __FILE__ ) . 'includes/auth.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/html.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/user.php';
require_once plugin_dir_path( __FILE__ ) . 'includes/util.php';

function supabase_when_init(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function supabase_when_admin_init(): void {
    register_setting(SUPABASE_SETTINGS, SUPABASE_PROJECT_URL, [
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => '',
    ]);
    register_setting(SUPABASE_SETTINGS, SUPABASE_PUBLIC_KEY, [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '',
    ]);
    register_setting(SUPABASE_SETTINGS, SUPABASE_SERVICE_KEY, [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '',
    ]);
    add_settings_section(
        'supabase_main_section',
        'Supabase Configuration',
        function() {
            supabase_render_html_paragraph('Enter your Supabase credentials below:');
        },
        SUPABASE
    );
    add_settings_field(
        SUPABASE_PROJECT_URL,
        'Project URL',
        function () {
            supabase_render_html_input(SUPABASE_PROJECT_URL, supabase_project_url(), 'url');
        },
        SUPABASE,
        'supabase_main_section'
    );
    add_settings_field(
        SUPABASE_PUBLIC_KEY,
        'Public Key',
        function () {
            supabase_render_html_input(SUPABASE_PUBLIC_KEY, supabase_public_key(), 'password');
            supabase_render_html_paragraph('This is your Supabase anon/public API key.', 'description');
            supabase_render_html_paragraph('WARNING! DO NOT put your service key here, it will be exposed to the public.', 'description');
        },
        SUPABASE,
        'supabase_main_section'
    );
    add_settings_field(
        SUPABASE_SERVICE_KEY,
        'Service Key',
        function () {
            supabase_render_html_input(SUPABASE_SERVICE_KEY, supabase_service_key(), 'password');
            supabase_render_html_paragraph('This is your Supabase service API key.', 'description');
        },
        SUPABASE,
        'supabase_main_section'
    );
}

function supabase_when_admin_menu(): void {
    add_options_page(
        'Supabase Settings',
        'Supabase',
        'manage_options',
        SUPABASE,
        function() {
            supabase_render_html_options_form(SUPABASE, SUPABASE_SETTINGS, 'Supabase Settings');
        }
    );
}

function supabase_when_enqueue_scripts(): void {
    wp_enqueue_script('supabase-client', plugin_dir_url(__FILE__) . 'supabase.js');
    wp_script_add_data('supabase-client', 'type', 'module');

    wp_register_script('supabase-client', plugin_dir_url(__FILE__) . 'supabase.js');
    wp_enqueue_script('supabase-client');

    add_filter('script_loader_tag', function($tag, $handle) {
        if ($handle === 'supabase-client') {
            return str_replace('<script ', '<script type="module" ', $tag);
        }
        return $tag;
    }, 10, 2);

    wp_localize_script('supabase-client', 'supabaseClientOptions', [
        'accessToken' => $_SESSION['supabase']['access_token'] ?? '',
        'refreshToken' => $_SESSION['supabase']['refresh_token'] ?? '',
        'projectUrl' => supabase_project_url(),
        'publicKey' => supabase_public_key(),
    ]);
}

function supabase_when_rest_api_init(): void {
    register_rest_route('supabase/v2', '/users/sync', [
        'methods'  => 'POST',
        'callback' => function(WP_REST_Request $request) {
            $email = sanitize_email($request->get_param('email'));
            $supabase_id = sanitize_text_field($request->get_param(SUPABASE_ID));
            $providers = $request->get_param('providers') ?: [];
            $first_name = sanitize_text_field($request->get_param('first_name') ?? '');
            $last_name = sanitize_text_field($request->get_param('last_name') ?? '');
            $name = sanitize_text_field($request->get_param('name') ?? '');
            $phone = sanitize_text_field($request->get_param('phone') ?? '');

            if (!$email || !$supabase_id) {
                return new WP_REST_Response(['error' => 'Missing required fields.'], 400);
            }

            $user = get_user_by('email', $email);

            if (!$user) {
                $user_id = wp_create_user($email, wp_generate_password(), $email);

                if (is_wp_error($user_id)) {
                    return new WP_REST_Response(['error' => 'Could not create user.'], 500);
                }

                $user = get_user_by('id', $user_id);

                $user->set_role('customer');
            }

            update_user_meta($user->ID, SUPABASE_ID, $supabase_id);
            update_user_meta($user->ID, SUPABASE_PROVIDERS, $providers);

            if ($first_name) {
                update_user_meta($user->ID, 'first_name', $first_name);
            }

            if ($last_name) {
                update_user_meta($user->ID, 'last_name', $last_name);
            }

            if ($name) {
                update_user_meta($user->ID, 'nickname', $name);
            }

            if ($phone) {
                update_user_meta($user->ID, 'phone', $phone);
            }

            wp_set_current_user($user->ID);
            wp_set_auth_cookie($user->ID, true);

            return new WP_REST_Response([
                'id' => $user->ID,
                'email'   => $user->user_email,
            ]);
        },
        'permission_callback' => '__return_true'
    ]);
}

function supabase_when_profile_update(int $user_id): void {
    $supabase_id = get_user_meta($user_id, SUPABASE_ID, true);

    if (!$supabase_id) {
        return;
    }

    $email = get_user_meta($user_id, 'email', true);
    $phone = get_user_meta($user_id, 'phone', true);
    $first = get_user_meta($user_id, 'first_name', true);
    $last  = get_user_meta($user_id, 'last_name', true);

    $result = supabase_update_user($supabase_id, [
        'email' => $email,
        'phone' => $phone,
        'user_metadata' => [
            'first_name' => $first,
            'last_name'  => $last,
        ]
    ]);

    if (is_wp_error($result)) {
        error_log('Supabase profile update failed: ' . $result->get_error_message());
    }
}

function supabase_when_admin_head_users(): void {
    supabase_render_html_admin_style_override();
}

function supabase_when_admin_notices(): void {
    $screen = get_current_screen();

    if (!$screen || $screen->id !== 'user-edit') {
        return;
    }

    $user_id = isset($_GET['user_id']) ? absint($_GET['user_id']) : 0;

    if (!$user_id) {
        return;
    }

    $supabase_id = get_user_meta($user_id, SUPABASE_ID, true);

    if ($supabase_id) {
        supabase_render_html_admin_notice('success', 'Supabase Linked!', 'This user is linked to Supabase (ID: <code>' . esc_html($supabase_id) . '</code>).');
    }
}

function supabase_when_show_user_profile(WP_User $user): void {
    $supabase_id = get_user_meta($user->ID, SUPABASE_ID, true);

    if ($supabase_id) {
        supabase_render_html_admin_notice('success', 'Supabase Linked!', 'This user is linked to Supabase (ID: <code>' . esc_html($supabase_id) . '</code>).');
    }
}

function supabase_when_form_submit(): void {
    $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
    $password = isset($_POST['password']) ? sanitize_text_field($_POST['password']) : '';

    if (empty($email) || empty($password)) {
        wp_redirect(wp_get_referer() . '?error=' . urlencode('Email and password are required.'));
        return;
    }

    try {
        $supabase_session = supabase_login($email, $password);
        $wp_user = get_user_by('email', $email);

        wp_set_current_user($wp_user->ID);
        wp_set_auth_cookie($wp_user->ID, true);

        $_SESSION['supabase'] = [
            'access_token' => $supabase_session->access_token,
            'refresh_token' => $supabase_session->refresh_token,
        ];

        wp_redirect(home_url() . '?action=authenticate');
    } catch (Error $error) {
        wp_redirect(wp_get_referer() . '?error=' . urlencode($error->getMessage()));
    }
}

function supabase_reduce_user_contact_methods(array $methods): array {
    $methods['phone'] = __('Phone Number', SUPABASE);
    return $methods;
}

function supabase_reduce_manage_users_columns(array $columns): array {
    $columns[SUPABASE_USER] = 'Supabase user?';
    return $columns;
}

function supabase_reduce_manage_users_custom_column(string $output, string $column_name, int $user_id): string {
    if ($column_name === SUPABASE_USER) {
        $supabase_id = get_user_meta($user_id, SUPABASE_ID, true);

        if ($supabase_id) {
            return supabase_capture_output(fn() => supabase_render_html_linked_icon());
        } else {
            return '-';
        }
    } else {
        return $output;
    }
}

add_action('init', 'supabase_when_init');
add_action('admin_init', 'supabase_when_admin_init');
add_action('admin_menu', 'supabase_when_admin_menu');
add_action('admin_notices', 'supabase_when_admin_notices');
add_action('admin_head-users.php', 'supabase_when_admin_head_users');
add_action('profile_update', 'supabase_when_profile_update');
add_action('show_user_profile', 'supabase_when_show_user_profile');
add_action('rest_api_init', 'supabase_when_rest_api_init');
add_action('wp_enqueue_scripts', 'supabase_when_enqueue_scripts');
add_action('admin_post_supabase_form_submit', 'supabase_when_form_submit');
add_action('admin_post_nopriv_supabase_form_submit', 'supabase_when_form_submit');

add_filter('user_contactmethods', 'supabase_reduce_user_contact_methods');
add_filter('manage_users_columns', 'supabase_reduce_manage_users_columns');
add_filter('manage_users_custom_column', 'supabase_reduce_manage_users_custom_column', 10, 3);
