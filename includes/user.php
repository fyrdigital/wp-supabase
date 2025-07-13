<?php

function supabase_create_user(string $email, string $password, array $user_metadata = []): WP_Error | array {
    $api_url = supabase_project_url() . '/auth/v1/admin/users';
    $api_key = supabase_service_key();

    if (!$api_key) {
        return new WP_Error('supabase_error', 'Supabase service key is not set.');
    }

    $user_data = [
        'email' => $email,
        'password' => $password,
        'user_metadata' => $user_metadata,
    ];

    $response = wp_remote_post($api_url, [
        'headers' => [
            'apikey'        => $api_key,
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type'  => 'application/json',
        ],
        'body' => wp_json_encode($user_data),
    ]);

    if (is_wp_error($response)) {
        return $response;
    }

    if (wp_remote_retrieve_response_code($response) !== 201) {
        return new WP_Error('supabase_error', 'Failed to create user: ' . wp_remote_retrieve_body($response));
    }

    return json_decode(wp_remote_retrieve_body($response), true);
}

function supabase_update_user(string $id, array $user_data): WP_Error | bool {
    $api_url = supabase_project_url() . '/auth/v1/admin/users/' . $id;
    $api_key = supabase_service_key();

    if (!$api_key) {
        return new WP_Error('supabase_error', 'Supabase service key is not set.');
    }

    $response = wp_remote_request($api_url, [
        'method' => 'PUT',
        'headers' => [
            'apikey'        => $api_key,
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type'  => 'application/json',
        ],
        'body' => wp_json_encode($user_data),
    ]);

    return is_wp_error($response) ? $response : wp_remote_retrieve_response_code($response) === 200;
}