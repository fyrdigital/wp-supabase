<?php

function supabase_capture_output($callback) {
    ob_start();
    call_user_func($callback);
    return ob_get_clean();
}