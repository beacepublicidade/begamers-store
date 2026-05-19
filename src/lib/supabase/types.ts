export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          image_url: string | null
          description: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          brand: string | null
          category_id: string | null
          price: number
          price_old: number | null
          pix_discount: number
          installments: number
          stock: number
          sku: string | null
          weight: number | null
          is_active: boolean
          is_featured: boolean
          tags: string[]
          accent_color: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          sort_order: number
          is_primary: boolean
        }
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          value: string
          price_modifier: number
          stock: number
          sku: string | null
        }
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
      }
      customers: {
        Row: {
          id: string
          full_name: string | null
          cpf: string | null
          phone: string | null
          birth_date: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'created_at'> & { created_at?: string }
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      addresses: {
        Row: {
          id: string
          customer_id: string
          label: string
          recipient: string
          cep: string
          street: string
          number: string
          complement: string | null
          district: string
          city: string
          state: string
          is_default: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['addresses']['Insert']>
      }
      carts: {
        Row: {
          id: string
          customer_id: string | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['carts']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['carts']['Insert']>
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          price: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          address_id: string | null
          status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_method: string | null
          payment_status: string
          infinitepay_id: string | null
          subtotal: number
          discount: number
          shipping: number
          total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'order_number' | 'created_at' | 'updated_at'> & { id?: string; order_number?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          name: string
          sku: string | null
          quantity: number
          price: number
          total: number
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          customer_id: string | null
          rating: number
          title: string | null
          body: string | null
          is_verified: boolean
          is_approved: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      wishlists: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wishlists']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['wishlists']['Insert']>
      }
      coupons: {
        Row: {
          id: string
          code: string
          type: 'percent' | 'fixed'
          value: number
          min_order: number
          max_uses: number | null
          used_count: number
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['coupons']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>
      }
      newsletter: {
        Row: {
          id: string
          email: string
          subscribed_at: string
        }
        Insert: Omit<Database['public']['Tables']['newsletter']['Row'], 'id' | 'subscribed_at'> & { id?: string; subscribed_at?: string }
        Update: Partial<Database['public']['Tables']['newsletter']['Insert']>
      }
      admin_users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'super_admin' | 'admin' | 'editor'
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>
      }
      settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'updated_at'> & { updated_at?: string }
        Update: Partial<Database['public']['Tables']['settings']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
