export interface EntryTemplate {
  id: string
  name: string
  description: string
  title: string
  content: string
  tags: string
  version: string
}

export const entryTemplates: EntryTemplate[] = [
  {
    id: 'release-notes',
    name: 'Release Notes',
    description: 'For version releases',
    title: 'v{version} Release Notes',
    content: `## Highlights

A brief summary of the most important changes in this release.

## New Features

-

## Improvements

-

## Bug Fixes

-

## Breaking Changes

- `,
    tags: 'release',
    version: '',
  },
  {
    id: 'feature-announcement',
    name: 'Feature Announcement',
    description: 'For new feature launches',
    title: 'Introducing {Feature Name}',
    content: `## What's New

Describe the new feature and why it matters.

## How It Works

Explain how users can use this feature step by step.

## Getting Started

Instructions for getting started with the new feature.`,
    tags: 'feature',
    version: '',
  },
  {
    id: 'bug-fix-update',
    name: 'Bug Fix Update',
    description: 'For bug fix batches',
    title: 'Bug Fix Update',
    content: `## Issues Fixed

-

## Details

Provide additional context on the fixes and their impact.

## Notes

Any caveats, workarounds, or follow-up items to be aware of.`,
    tags: 'bugfix',
    version: '',
  },
]
