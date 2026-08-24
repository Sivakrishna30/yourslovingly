import type { TemplateDefinition } from './types';

export const SYSTEM_TEMPLATE_DEFINITIONS: Record<string, TemplateDefinition> = {
  'wedding-standard': {
    id: 'wedding-standard',
    name: 'Standard Wedding Invite',
    description: 'A traditional multi-page wedding invitation.',
    category: 'wedding',
    defaultPages: 3,
    fields: [
      { role: 'groom_name', type: 'text', label: 'Groom Name', required: true },
      { role: 'bride_name', type: 'text', label: 'Bride Name', required: true },
      { role: 'event_date', type: 'date', label: 'Event Date', required: true },
      { role: 'venue_name', type: 'text', label: 'Venue Name', required: true },
      { role: 'venue_address', type: 'location', label: 'Venue Address', required: false },
      { role: 'welcome_message', type: 'text', label: 'Welcome Message', required: false },
    ]
  },
  'birthday-standard': {
    id: 'birthday-standard',
    name: 'Standard Birthday Invite',
    description: 'A fun, single-page birthday invitation.',
    category: 'birthday',
    defaultPages: 1,
    fields: [
      { role: 'celebrant_name', type: 'text', label: 'Celebrant Name', required: true },
      { role: 'age', type: 'text', label: 'Age', required: false },
      { role: 'event_date', type: 'date', label: 'Event Date', required: true },
      { role: 'venue_name', type: 'text', label: 'Venue Name', required: true },
    ]
  }
};
