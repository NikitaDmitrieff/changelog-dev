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
        is_pinned: boolean
        published_at: string | null
        scheduled_for: string | null
        notified_at: string | null
        view_count: number
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
        is_pinned?: boolean
        published_at?: string | null
        scheduled_for?: string | null
        notified_at?: string | null
        view_count?: number
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
        is_pinned?: boolean
        published_at?: string | null
        scheduled_for?: string | null
        notified_at?: string | null
        view_count?: number
        created_at?: string
        updated_at?: string
      }
      Relationships: []
    }
    notification_failures: {
      Row: {
        id: string
        entry_id: string
        subscriber_id: string
        changelog_id: string
        error_message: string | null
        attempt_count: number
        last_attempted_at: string
        next_retry_at: string
        resolved: boolean
        created_at: string
      }
      Insert: {
        id?: string
        entry_id: string
        subscriber_id: string
        changelog_id: string
        error_message?: string | null
        attempt_count?: number
        last_attempted_at?: string
        next_retry_at?: string
        resolved?: boolean
        created_at?: string
      }
      Update: {
        id?: string
        entry_id?: string
        subscriber_id?: string
        changelog_id?: string
        error_message?: string | null
        attempt_count?: number
        last_attempted_at?: string
        next_retry_at?: string
        resolved?: boolean
        created_at?: string
      }
      Relationships: []
    }
    webhook_events: {
      Row: {
        id: string
        event_id: string
        event_type: string
        status: string
        summary: Record<string, unknown>
        error_message: string | null
        created_at: string
      }
      Insert: {
        id?: string
        event_id: string
        event_type: string
        status?: string
        summary?: Record<string, unknown>
        error_message?: string | null
        created_at?: string
      }
      Update: {
        id?: string
        event_id?: string
        event_type?: string
        status?: string
        summary?: Record<string, unknown>
        error_message?: string | null
        created_at?: string
      }
      Relationships: []
    }
    api_keys: {
      Row: {
        id: string
        changelog_id: string
        owner_id: string
        name: string
        key_hash: string
        key_prefix: string
        last_used_at: string | null
        created_at: string
        revoked_at: string | null
      }
      Insert: {
        id?: string
        changelog_id: string
        owner_id: string
        name?: string
        key_hash: string
        key_prefix: string
        last_used_at?: string | null
        created_at?: string
        revoked_at?: string | null
      }
      Update: {
        id?: string
        changelog_id?: string
        owner_id?: string
        name?: string
        key_hash?: string
        key_prefix?: string
        last_used_at?: string | null
        created_at?: string
        revoked_at?: string | null
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
        unsubscribe_token: string | null
        subscribed_at: string
      }
      Insert: {
        id?: string
        changelog_id: string
        email: string
        confirmed?: boolean
        confirmation_token?: string | null
        unsubscribe_token?: string | null
        subscribed_at?: string
      }
      Update: {
        id?: string
        changelog_id?: string
        email?: string
        confirmed?: boolean
        confirmation_token?: string | null
        unsubscribe_token?: string | null
        subscribed_at?: string
      }
      Relationships: []
    }
  }
  Views: Record<string, never>
  Functions: {
    increment_view_count: {
      Args: { entry_id: string }
      Returns: undefined
    }
  }
}

export interface Database {
  public: ChangelogDevSchema
}

export type Changelog = ChangelogDevSchema['Tables']['changelogs']['Row']
export type Entry = ChangelogDevSchema['Tables']['entries']['Row']
export type Subscriber = ChangelogDevSchema['Tables']['subscribers']['Row']
export type NotificationFailure = ChangelogDevSchema['Tables']['notification_failures']['Row']
export type WebhookEvent = ChangelogDevSchema['Tables']['webhook_events']['Row']
export type ApiKey = ChangelogDevSchema['Tables']['api_keys']['Row']
