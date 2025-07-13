interface SupabaseWordPressUserReference {
    id: number;
    email: string;
}

interface SupabaseWordPressResponse<Data = unknown> {
    data?: Data;
    error?: Error;
}

interface SupabaseWordPressService {
    linkUser(email: string, supabaseId: string): Promise<SupabaseWordPressResponse<SupabaseWordPressUserReference>>;
    // @deprecated
    sync(email: string, supabaseId: string): Promise<SupabaseWordPressResponse<SupabaseWordPressUserReference>>;
}

export interface WithWordPressService {
    wordpress: SupabaseWordPressService;
}
