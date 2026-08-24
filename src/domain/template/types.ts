import type { TemplateFieldDefinition } from '../element/types';

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: TemplateFieldDefinition[];
  defaultPages: number;
}
