import type { Movie } from './index';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string;
          id: string;
          movie_data: Movie;
          movie_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_data: Movie | Record<string, any>;
          movie_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_data?: Movie | Record<string, any>;
          movie_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
