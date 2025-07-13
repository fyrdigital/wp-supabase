<?php

class Supabase_Auth_Session {
    public string $id;
    public string $email;
    public string $access_token;
    public ?string $refresh_token;

    public function __construct(string $id, string $email, string $access_token, ?string $refresh_token = null) {
        $this->id = $id;
        $this->email = $email;
        $this->access_token = $access_token;
        $this->refresh_token = $refresh_token;
    }

    public function to_array(): array {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'access_token' => $this->access_token,
            'refresh_token' => $this->refresh_token,
        ];
    }
}

function supabase_login(string $email, string $password): Supabase_Auth_Session {
    $url = supabase_project_url() . '/auth/v1/token?grant_type=password';
    $data = [
        'email' => $email,
        'password' => $password,
    ];

    $response = wp_remote_post($url, [
        'headers' => [
            'Content-Type' => 'application/json',
            'apikey' => supabase_public_key(),
        ],
        'body' => json_encode($data),
    ]);

    if (is_wp_error($response)) {
        throw new Error('Login request failed: ' . $response->get_error_message());
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (isset($body['error'])) {
        throw new Error('Login failed: ' . $body['error']);
    }

    return new Supabase_Auth_Session(
        $body['user']['id'],
        $body['user']['email'],
        $body['access_token'],
        $body['refresh_token'] ?? null
    );
}