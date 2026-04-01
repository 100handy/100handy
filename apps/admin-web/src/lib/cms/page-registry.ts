export type FieldType = 'text' | 'rich_text' | 'image_url'

export interface FieldDefinition {
  type: FieldType
  label: string
  placeholder?: string
}

export interface SectionDefinition {
  label: string
  fields: Record<string, FieldDefinition>
}

export interface PageDefinition {
  label: string
  slug: string
  sections: Record<string, SectionDefinition>
}

export const pageRegistry: Record<string, PageDefinition> = {
  'about-us': {
    label: 'About Us',
    slug: '/about-us',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'About Us' },
        },
      },
      content: {
        label: 'Main Content',
        fields: {
          heading: { type: 'text', label: 'Heading', placeholder: 'Making life simpler, one neighborhood at a time.' },
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: 'We believe that the best help is local...' },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: 'We know that for every overwhelming to-do list...' },
        },
      },
      leadership: {
        label: 'Leadership Team',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Leadership Team' },
        },
      },
    },
  },
  contact: {
    label: 'Contact Us',
    slug: '/contact',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          breadcrumb: { type: 'text', label: 'Breadcrumb Text', placeholder: '100Handy Support / Submit a request' },
          title: { type: 'text', label: 'Page Title', placeholder: 'Contact Us' },
        },
      },
      cards: {
        label: 'Contact Cards',
        fields: {
          card_1_title: { type: 'text', label: 'Card 1 Title', placeholder: 'Message us' },
          card_1_text: { type: 'text', label: 'Card 1 Text', placeholder: 'Click here to reach out!' },
          card_2_title: { type: 'text', label: 'Card 2 Title', placeholder: 'Send us an email' },
          card_2_text: { type: 'text', label: 'Card 2 Text', placeholder: 'Available every day' },
          card_3_title: { type: 'text', label: 'Card 3 Title', placeholder: 'Give us a call' },
          card_3_text: { type: 'text', label: 'Card 3 Text', placeholder: 'Toll free for US and Canada' },
        },
      },
      form: {
        label: 'Email Form',
        fields: {
          title: { type: 'text', label: 'Form Title', placeholder: 'Send us an email' },
          subtitle: { type: 'text', label: 'Form Subtitle', placeholder: 'Please provide detailed information below...' },
        },
      },
    },
  },
}

/** Get all page keys */
export function getPageKeys(): string[] {
  return Object.keys(pageRegistry)
}

/** Get a flat list of all field keys for a page (e.g. "hero.title") */
export function getPageFieldKeys(pageKey: string): string[] {
  const page = pageRegistry[pageKey]
  if (!page) return []
  const keys: string[] = []
  for (const [sectionKey, section] of Object.entries(page.sections)) {
    for (const fieldKey of Object.keys(section.fields)) {
      keys.push(`${sectionKey}.${fieldKey}`)
    }
  }
  return keys
}
