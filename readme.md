# WordPress + Supabase Plugin

Allows you to connect your WordPress site with Supabase, enabling you to use Supabase's powerful backend services like 
authentication, realtime, and storage.

## Features

### Authentication

### Supabase Form
Render a fully integrated abd customizable authentication form using the `<supabase-form>` web component.

```php
<supabase-form with-styles></supabase-form>
```

Example with custom styles and logo:
```php
<supabase-form
    with-styles
    width="512" 
    padding="60" 
    provider-columns="3" 
    button-color="var(--theme-color-primary)" 
    button-text-color="black">
    <div slot="logo">
        <?= file_get_contents('path/to/logo.svg') ?>
    </div>
</supabase-form>
```

