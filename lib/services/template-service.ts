import { Template, TemplateFormData } from '@/types/template';

class TemplateService {
  private static instance: TemplateService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = '/api/templates';
  }

  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  async getTemplates(): Promise<Template[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }
    return response.json();
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch template');
    }
    return response.json();
  }

  async createTemplate(data: TemplateFormData): Promise<Template> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create template');
    }
    return response.json();
  }

  async updateTemplate(id: string, data: Partial<TemplateFormData>): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update template');
    }
    return response.json();
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete template');
    }
  }

  async duplicateTemplate(id: string): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/${id}/duplicate`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to duplicate template');
    }
    return response.json();
  }
}

export const templateService = TemplateService.getInstance(); 