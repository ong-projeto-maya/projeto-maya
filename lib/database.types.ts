/**
 * TypeScript types for the Supabase database schema.
 * Run `supabase gen types typescript` to regenerate from your live schema.
 */

export type Database = {
  public: {
    Tables: {
      doadores: {
        Row: {
          id: string
          email: string
          nome: string
          telefone: string | null
          cpf: string | null
          total_doado: number
          contagem_doacoes: number
          primeira_doacao: string | null
          nivel: string
          animais_ajudados: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nome: string
          telefone?: string | null
          cpf?: string | null
          total_doado?: number
          contagem_doacoes?: number
          primeira_doacao?: string | null
          nivel?: string
          animais_ajudados?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          nome?: string
          telefone?: string | null
          cpf?: string | null
          total_doado?: number
          contagem_doacoes?: number
          primeira_doacao?: string | null
          nivel?: string
          animais_ajudados?: number
          updated_at?: string
        }
        Relationships: []
      }
      doacoes: {
        Row: {
          id: string
          doador_email: string
          pagbank_order_id: string
          pagbank_subscription_id: string | null
          valor: number
          tipo: 'single' | 'monthly'
          status: 'completed' | 'failed' | 'pending' | 'cancelled'
          campaign_id: string | null
          campaign_name: string | null
          proximo_pagamento: string | null
          created_at: string
        }
        Insert: {
          id?: string
          doador_email: string
          pagbank_order_id: string
          pagbank_subscription_id?: string | null
          valor: number
          tipo: 'single' | 'monthly'
          status: 'completed' | 'failed' | 'pending' | 'cancelled'
          campaign_id?: string | null
          campaign_name?: string | null
          proximo_pagamento?: string | null
          created_at?: string
        }
        Update: {
          status?: 'completed' | 'failed' | 'pending' | 'cancelled'
          proximo_pagamento?: string | null
          pagbank_subscription_id?: string | null
        }
        Relationships: []
      }
      assinaturas: {
        Row: {
          id: string
          doador_email: string
          pagbank_subscription_id: string
          valor: number
          status: 'active' | 'paused' | 'cancelled'
          proximo_pagamento: string | null
          data_inicio: string
          metodo_pagamento: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          doador_email: string
          pagbank_subscription_id: string
          valor: number
          status?: 'active' | 'paused' | 'cancelled'
          proximo_pagamento?: string | null
          data_inicio: string
          metodo_pagamento?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'active' | 'paused' | 'cancelled'
          proximo_pagamento?: string | null
          metodo_pagamento?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          username: string
          role: 'admin' | 'moderator' | string
          created_at: string
        }
        Insert: {
          id: string
          username: string
          role?: string
          created_at?: string
        }
        Update: {
          username?: string
          role?: string
        }
        Relationships: []
      }
      animais: {
        Row: {
          id: string
          name: string
          type: 'dog' | 'cat'
          age: string
          gender: 'male' | 'female'
          size: 'small' | 'medium' | 'large'
          temperament: string[]
          story: string
          image: string
          images: string[]
          is_adopted: boolean
          is_puppy: boolean
          is_rescued: boolean
          is_mixed: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'dog' | 'cat'
          age: string
          gender: 'male' | 'female'
          size: 'small' | 'medium' | 'large'
          temperament?: string[]
          story?: string
          image?: string
          images?: string[]
          is_adopted?: boolean
          is_puppy?: boolean
          is_rescued?: boolean
          is_mixed?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          type?: 'dog' | 'cat'
          age?: string
          gender?: 'male' | 'female'
          size?: 'small' | 'medium' | 'large'
          temperament?: string[]
          story?: string
          image?: string
          images?: string[]
          is_adopted?: boolean
          is_puppy?: boolean
          is_rescued?: boolean
          is_mixed?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      campanhas: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          long_description: string
          goal: number
          raised: number
          start_date: string
          end_date: string
          is_active: boolean
          image: string
          icon: string
          category: string
          urgency: string
          benefits: string[]
          impact_story: string
          allows_registration: boolean
          registration_description: string | null
          registration_spots: number
          registration_registered: number
          registration_requirements: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string
          long_description?: string
          goal?: number
          raised?: number
          start_date: string
          end_date: string
          is_active?: boolean
          image?: string
          icon?: string
          category?: string
          urgency?: string
          benefits?: string[]
          impact_story?: string
          allows_registration?: boolean
          registration_description?: string | null
          registration_spots?: number
          registration_registered?: number
          registration_requirements?: string[]
          created_at?: string
        }
        Update: {
          title?: string
          slug?: string
          description?: string
          long_description?: string
          goal?: number
          raised?: number
          start_date?: string
          end_date?: string
          is_active?: boolean
          image?: string
          icon?: string
          category?: string
          urgency?: string
          benefits?: string[]
          impact_story?: string
          allows_registration?: boolean
          registration_description?: string | null
          registration_spots?: number
          registration_registered?: number
          registration_requirements?: string[]
        }
        Relationships: []
      }
      eventos: {
        Row: {
          id: string
          title: string
          date: string
          time: string
          location: string
          description: string
          image: string | null
          type: 'adoption' | 'fundraising' | 'educational' | 'other'
          capacity: number | null
          registered: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          time?: string
          location?: string
          description?: string
          image?: string | null
          type?: 'adoption' | 'fundraising' | 'educational' | 'other'
          capacity?: number | null
          registered?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          date?: string
          time?: string
          location?: string
          description?: string
          image?: string | null
          type?: 'adoption' | 'fundraising' | 'educational' | 'other'
          capacity?: number | null
          registered?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          key: string
          value: number
          updated_at: string
        }
        Insert: {
          key: string
          value?: number
          updated_at?: string
        }
        Update: {
          value?: number
          updated_at?: string
        }
        Relationships: []
      }
      mensagens: {
        Row: {
          id: string
          nome: string
          email: string
          telefone: string | null
          assunto: string
          mensagem: string
          lida: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          telefone?: string | null
          assunto?: string
          mensagem: string
          lida?: boolean
          created_at?: string
        }
        Update: {
          lida?: boolean
        }
        Relationships: []
      }
      camp_registrations: {
        Row: {
          id: string
          campaign_id: string | null
          campaign_title: string
          nome: string
          email: string
          telefone: string
          cpf: string | null
          endereco: string | null
          nome_pet: string | null
          tipo_pet: string | null
          motivo: string
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          campaign_title: string
          nome: string
          email: string
          telefone: string
          cpf?: string | null
          endereco?: string | null
          nome_pet?: string | null
          tipo_pet?: string | null
          motivo: string
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          ativo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          ativo?: boolean
          created_at?: string
        }
        Update: {
          ativo?: boolean
        }
        Relationships: []
      }
      depoimentos: {
        Row: {
          id: string
          nome: string
          animal: string
          texto: string
          avaliacao: number
          aprovado: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          animal: string
          texto: string
          avaliacao?: number
          aprovado?: boolean
          created_at?: string
        }
        Update: {
          aprovado?: boolean
          avaliacao?: number
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
