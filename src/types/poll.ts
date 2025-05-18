
import { Json } from "@/integrations/supabase/types";

export interface Poll {
  id: string;
  question: string;
  options: string[];
  votes?: Record<number, number>;
  createdAt: string;
  user_id?: string;
}

// This helper function converts Json from Supabase to string[]
export function parseOptions(options: Json): string[] {
  if (Array.isArray(options)) {
    return options as string[];
  }
  // Handle edge case where it might be a JSON string
  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse options:', e);
    }
  }
  return [];
}
