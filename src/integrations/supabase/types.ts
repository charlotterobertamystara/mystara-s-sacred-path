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
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          mp_payment_id: string | null
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
          status?: string
          user_id?: string
        }
        Relationships: []
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
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          mp_preapproval_id: string | null
          mp_subscription_id: string | null
          plan_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          mp_preapproval_id?: string | null
          mp_subscription_id?: string | null
          plan_type?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          mp_preapproval_id?: string | null
          mp_subscription_id?: string | null
          plan_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
