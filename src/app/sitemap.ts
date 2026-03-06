import { createClient } from '@/lib/supabase/server'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://changelog-dev-production.up.railway.app'

  const supabase = await createClient()
  const { data: changelogs } = await supabase
    .from('changelogs')
    .select('slug, created_at')

  const changelogUrls: MetadataRoute.Sitemap = (changelogs ?? []).map((c) => ({
    url: `${baseUrl}/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/why-your-saas-needs-a-changelog`,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/best-changelog-tools-compared`,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...changelogUrls,
  ]
}
