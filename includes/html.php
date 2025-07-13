<?php

function supabase_render_html_admin_style_override(): void { ?>
    <style>
        table.wp-list-table {
            table-layout: auto !important;

            *.column-name {
                width: auto !important;
            }
        }
    </style>
<?php }

function supabase_render_html_admin_notice(string $type, string $title, string $message): void { ?>
    <div class="notice notice-<?= esc_attr($type); ?>">
        <p>
            <strong><?= esc_html($title); ?></strong>
            <?= $message; ?>
        </p>
    </div>
<?php }

function supabase_render_html_options_form(string $section, string $group, string $title): void { ?>
    <div class="wrap">
        <h1><?php echo esc_html($title); ?></h1>
        <form action="options.php" method="post">
            <?php
                settings_fields($group);
                do_settings_sections($section);
                submit_button();
            ?>
        </form>
    </div>
<?php }

function supabase_render_html_paragraph(string $content, string $class = ''): void {
    echo sprintf('<p class="%s">%s</p>', esc_attr($class), $content);
}

function supabase_render_html_input(string $name, mixed $value, string $type = 'text'): void {
    echo sprintf('<input type="%s" name="%s" value="%s" class="regular-text" />', esc_attr($type), esc_attr($name), esc_attr($value));
}

function supabase_render_html_linked_icon(): void { ?>
    <span class="dashicons dashicons-yes-alt" style="color: #00a32a"></span>
<?php }