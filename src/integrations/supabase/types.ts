export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      compatibility_analyses: {
        Row: {
          analysis_data: Json | null
          asc_score: number | null
          created_at: string
          cross_score: number | null
          id: string
          moon_score: number | null
          overall_score: number
          profile_id: string
          sun_score: number | null
          user_id: string
        }
        Insert: {
          analysis_data?: Json | null
          asc_score?: number | null
          created_at?: string
          cross_score?: number | null
          id?: string
          moon_score?: number | null
          overall_score: number
          profile_id: string
          sun_score?: number | null
          user_id: string
        }
        Update: {
          analysis_data?: Json | null
          asc_score?: number | null
          created_at?: string
          cross_score?: number | null
          id?: string
          moon_score?: number | null
          overall_score?: number
          profile_id?: string
          sun_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compatibility_analyses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "compatibility_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compatibility_profiles: {
        Row: {
          ascendant_sign: string | null
          birth_date: string
          birth_place: string | null
          birth_time: string | null
          created_at: string
          id: string
          last_viewed: string | null
          moon_sign: string | null
          name: string
          photo_url: string | null
          relationship_type: string
          sun_sign: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ascendant_sign?: string | null
          birth_date: string
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          id?: string
          last_viewed?: string | null
          moon_sign?: string | null
          name: string
          photo_url?: string | null
          relationship_type?: string
          sun_sign?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ascendant_sign?: string | null
          birth_date?: string
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          id?: string
          last_viewed?: string | null
          moon_sign?: string | null
          name?: string
          photo_url?: string | null
          relationship_type?: string
          sun_sign?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          created_at: string
          dream_ai_analysis: string | null
          dream_description: string | null
          dream_emotions: string[] | null
          dream_symbols: string[] | null
          dream_title: string | null
          emotional_scale: number | null
          energy_level: string | null
          entry_date: string
          entry_types: string[]
          gratitude_1: string | null
          gratitude_2: string | null
          gratitude_3: string | null
          id: string
          insight_text: string | null
          is_private: boolean
          manifestation_actions: string | null
          manifestation_intention: string | null
          manifestation_signs: string | null
          manifestation_status: string | null
          manifestation_what: string | null
          moon_illumination: number | null
          moon_phase: string | null
          moon_sign: string | null
          personal_text: string | null
          spiritual_practice: string | null
          sync_connections: string | null
          sync_description: string | null
          sync_feeling: string | null
          sync_symbols: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dream_ai_analysis?: string | null
          dream_description?: string | null
          dream_emotions?: string[] | null
          dream_symbols?: string[] | null
          dream_title?: string | null
          emotional_scale?: number | null
          energy_level?: string | null
          entry_date: string
          entry_types?: string[]
          gratitude_1?: string | null
          gratitude_2?: string | null
          gratitude_3?: string | null
          id?: string
          insight_text?: string | null
          is_private?: boolean
          manifestation_actions?: string | null
          manifestation_intention?: string | null
          manifestation_signs?: string | null
          manifestation_status?: string | null
          manifestation_what?: string | null
          moon_illumination?: number | null
          moon_phase?: string | null
          moon_sign?: string | null
          personal_text?: string | null
          spiritual_practice?: string | null
          sync_connections?: string | null
          sync_description?: string | null
          sync_feeling?: string | null
          sync_symbols?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dream_ai_analysis?: string | null
          dream_description?: string | null
          dream_emotions?: string[] | null
          dream_symbols?: string[] | null
          dream_title?: string | null
          emotional_scale?: number | null
          energy_level?: string | null
          entry_date?: string
          entry_types?: string[]
          gratitude_1?: string | null
          gratitude_2?: string | null
          gratitude_3?: string | null
          id?: string
          insight_text?: string | null
          is_private?: boolean
          manifestation_actions?: string | null
          manifestation_intention?: string | null
          manifestation_signs?: string | null
          manifestation_status?: string | null
          manifestation_what?: string | null
          moon_illumination?: number | null
          moon_phase?: string | null
          moon_sign?: string | null
          personal_text?: string | null
          spiritual_practice?: string | null
          sync_connections?: string | null
          sync_description?: string | null
          sync_feeling?: string | null
          sync_symbols?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          note: string | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_history: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          event_type: string
          id: string
          metadata: Json | null
          payment_id: string | null
          provider: string | null
          provider_event_id: string | null
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          provider?: string | null
          provider_event_id?: string | null
          status: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          provider?: string | null
          provider_event_id?: string | null
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          mp_payment_id: string | null
          plan_id: string | null
          provider: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          mp_payment_id?: string | null
          plan_id?: string | null
          provider?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          mp_payment_id?: string | null
          plan_id?: string | null
          provider?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_country: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          cpf: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          phone_country_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_country?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          cpf?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          phone_country_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_country?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          cpf?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          phone_country_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_items: {
        Row: {
          created_at: string
          id: string
          is_reversed: boolean | null
          item_data: Json | null
          item_name: string
          item_position: string | null
          item_type: string
          session_id: string
          sort_order: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_reversed?: boolean | null
          item_data?: Json | null
          item_name: string
          item_position?: string | null
          item_type: string
          session_id: string
          sort_order?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_reversed?: boolean | null
          item_data?: Json | null
          item_name?: string
          item_position?: string | null
          item_type?: string
          session_id?: string
          sort_order?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          billing_period: string
          created_at: string
          credits_included: number | null
          currency: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          billing_period?: string
          created_at?: string
          credits_included?: number | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          credits_included?: number | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          mp_preapproval_id: string | null
          mp_subscription_id: string | null
          plan_id: string | null
          plan_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          mp_preapproval_id?: string | null
          mp_subscription_id?: string | null
          plan_id?: string | null
          plan_type?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          mp_preapproval_id?: string | null
          mp_subscription_id?: string | null
          plan_id?: string | null
          plan_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string
          credits_remaining: number
          id: string
          total_credits_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_remaining?: number
          id?: string
          total_credits_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_remaining?: number
          id?: string
          total_credits_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_lunar_profiles: {
        Row: {
          birth_city: string
          birth_date: string
          birth_moon_phase: string | null
          birth_state: string | null
          birth_time: string | null
          created_at: string
          full_name: string
          id: string
          lunar_house: string | null
          lunar_node: string | null
          lunar_sign: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_city?: string
          birth_date: string
          birth_moon_phase?: string | null
          birth_state?: string | null
          birth_time?: string | null
          created_at?: string
          full_name?: string
          id?: string
          lunar_house?: string | null
          lunar_node?: string | null
          lunar_sign?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_city?: string
          birth_date?: string
          birth_moon_phase?: string | null
          birth_state?: string | null
          birth_time?: string | null
          created_at?: string
          full_name?: string
          id?: string
          lunar_house?: string | null
          lunar_node?: string | null
          lunar_sign?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          interpretation: string | null
          question: string | null
          session_data: Json | null
          session_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interpretation?: string | null
          question?: string | null
          session_data?: Json | null
          session_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interpretation?: string | null
          question?: string | null
          session_data?: Json | null
          session_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          language: string | null
          notifications_enabled: boolean | null
          preferred_reading_type: string | null
          spiritual_preferences: Json | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          preferred_reading_type?: string | null
          spiritual_preferences?: Json | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          preferred_reading_type?: string | null
          spiritual_preferences?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
