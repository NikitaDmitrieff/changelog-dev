import { createClient } from '@/lib/supabase/server'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.changelogdev.com'

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
      url: `${baseUrl}/blog/how-to-write-release-notes`,
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
    {
      url: `${baseUrl}/blog/saas-product-updates`,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/changelog-best-practices`,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/complete-guide-saas-changelogs`,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/open-source-changelog-widget`,
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/why-web-components-over-react`,
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/keep-a-changelog-guide`,
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...changelogUrls,
  ]
}
