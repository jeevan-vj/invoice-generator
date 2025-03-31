import { Theme } from './invoice';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  content: string;
  metadata: TemplateMetadata;
  theme: TemplateTheme;
}

export interface TemplateMetadata {
  author: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface TemplateTheme extends Theme {
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    padding: string;
    margin: string;
  };
}

export interface TemplateFormData {
  name: string;
  description: string;
  category: string;
  isPublic: boolean;
  tags: string[];
  theme: TemplateTheme;
} 