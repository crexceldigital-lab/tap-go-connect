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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      card_events: {
        Row: {
          card_id: string
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          event_type: string
          id: string
          visitor_id: string | null
        }
        Insert: {
          card_id: string
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_type: string
          id?: string
          visitor_id?: string | null
        }
        Update: {
          card_id?: string
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_events_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          avatar_url: string | null
          background_style: string
          button_fill: string
          button_shadow: boolean
          button_style: string
          card_layout: string
          card_name: string
          card_theme: string
          color_theme: string
          company_name: string | null
          created_at: string
          email: string | null
          font_style: string
          full_name: string | null
          id: string
          instagram: string | null
          is_published: boolean
          job_title: string | null
          leads_count: number
          linkedin: string | null
          logo_position: string
          logo_url: string | null
          phone: string | null
          primary_color: string
          profile_image_border: boolean
          profile_image_style: string
          secondary_color: string
          share_count: number
          show_book_appointment: boolean
          show_call: boolean
          show_email: boolean
          show_navigate: boolean
          show_save_contact: boolean
          show_whatsapp: boolean
          slug: string | null
          taps_count: number
          twitter: string | null
          updated_at: string
          user_id: string
          views_count: number
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          background_style?: string
          button_fill?: string
          button_shadow?: boolean
          button_style?: string
          card_layout?: string
          card_name?: string
          card_theme?: string
          color_theme?: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          font_style?: string
          full_name?: string | null
          id?: string
          instagram?: string | null
          is_published?: boolean
          job_title?: string | null
          leads_count?: number
          linkedin?: string | null
          logo_position?: string
          logo_url?: string | null
          phone?: string | null
          primary_color?: string
          profile_image_border?: boolean
          profile_image_style?: string
          secondary_color?: string
          share_count?: number
          show_book_appointment?: boolean
          show_call?: boolean
          show_email?: boolean
          show_navigate?: boolean
          show_save_contact?: boolean
          show_whatsapp?: boolean
          slug?: string | null
          taps_count?: number
          twitter?: string | null
          updated_at?: string
          user_id: string
          views_count?: number
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          background_style?: string
          button_fill?: string
          button_shadow?: boolean
          button_style?: string
          card_layout?: string
          card_name?: string
          card_theme?: string
          color_theme?: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          font_style?: string
          full_name?: string | null
          id?: string
          instagram?: string | null
          is_published?: boolean
          job_title?: string | null
          leads_count?: number
          linkedin?: string | null
          logo_position?: string
          logo_url?: string | null
          phone?: string | null
          primary_color?: string
          profile_image_border?: boolean
          profile_image_style?: string
          secondary_color?: string
          share_count?: number
          show_book_appointment?: boolean
          show_call?: boolean
          show_email?: boolean
          show_navigate?: boolean
          show_save_contact?: boolean
          show_whatsapp?: boolean
          slug?: string | null
          taps_count?: number
          twitter?: string | null
          updated_at?: string
          user_id?: string
          views_count?: number
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          card_id: string
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string
          source: string
        }
        Insert: {
          card_id: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone: string
          source?: string
        }
        Update: {
          card_id?: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          instagram: string | null
          job_title: string | null
          linkedin: string | null
          onboarding_completed: boolean
          phone: string | null
          twitter: string | null
          updated_at: string
          user_id: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          instagram?: string | null
          job_title?: string | null
          linkedin?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          twitter?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          instagram?: string | null
          job_title?: string | null
          linkedin?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          twitter?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          whatsapp?: string | null
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
