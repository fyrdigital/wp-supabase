interface SupabaseWordPressUserReference {
    id: number;
    email: string;
    redirect?: string;
}

interface SupabaseWordPressResponse<Data = unknown> {
    data?: Data;
    error?: Error;
}

interface SupabaseWordPressService {
    hydrateSession(): Promise<SupabaseWordPressResponse>;
    syncUser(email: string, supabaseId: string, providers?: string[]): Promise<SupabaseWordPressResponse<SupabaseWordPressUserReference>>;
}

export interface WithWordPressService {
    wordpress: SupabaseWordPressService;
}
