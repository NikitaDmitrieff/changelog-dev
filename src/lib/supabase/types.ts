export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type ChangelogDevSchema = {
  Tables: {
    changelogs: {
      Row: {
        id: string
        owner_id: string
        name: string
        slug: string
        description: string | null
        logo_url: string | null
        website_url: string | null
        github_repo: string | null
        accent_color: string | null
        custom_domain: string | null
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        owner_id: string
        name: string
        slug: string
        description?: string | null
        logo_url?: string | null
        website_url?: string | null
        github_repo?: string | null
        accent_color?: string | null
        custom_domain?: string | null
        created_at?: string
        updated_at?: string
      }
      Update: {
        id?: string
        owner_id?: string
        name?: string
        slug?: string
        description?: string | null
        logo_url?: string | null
        website_url?: string | null
        github_repo?: string | null
        accent_color?: string | null
        custom_domain?: string | null
        created_at?: string
        updated_at?: string
      }
      Relationships: []
    }
    entries: {
      Row: {
        id: string
        changelog_id: string
        title: string
        content: string
        version: string | null
        tags: string[] | null
        is_published: boolean
        published_at: string | null
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        changelog_id: string
        title: string
        content: string
        version?: string | null
        tags?: string[] | null
        is_published?: boolean
        published_at?: string | null
        created_at?: string
        updated_at?: string
      }
      Update: {
        id?: string
        changelog_id?: string
        title?: string
        content?: string
        version?: string | null
        tags?: string[] | null
        is_published?: boolean
        published_at?: string | null
        created_at?: string
        updated_at?: string
      }
      Relationships: []
    }
    subscribers: {
      Row: {
        id: string
        changelog_id: string
        email: string
        confirmed: boolean
        confirmation_token: string | null
        subscribed_at: string
      }
      Insert: {
        id?: string
        changelog_id: string
        email: string
        confirmed?: boolean
        confirmation_token?: string | null
        subscribed_at?: string
      }
      Update: {
        id?: string
        changelog_id?: string
        email?: string
        confirmed?: boolean
        confirmation_token?: string | null
        subscribed_at?: string
      }
      Relationships: []
    }
  }
  Views: Record<string, never>
  Functions: Record<string, never>
}

export interface Database {
  public: ChangelogDevSchema
}

export type Changelog = ChangelogDevSchema['Tables']['changelogs']['Row']
export type Entry = ChangelogDevSchema['Tables']['entries']['Row']
export type Subscriber = ChangelogDevSchema['Tables']['subscribers']['Row']
