import { NextResponse } from 'next/server';
import { Template, TemplateFormData } from '@/types/template';

// In-memory storage for templates (replace with database in production)
let templates: Template[] = [];

export async function GET() {
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  try {
    const data: TemplateFormData = await request.json();
    const template: Template = {
      id: Math.random().toString(36).substring(7),
      ...data,
      thumbnail: '', // Add thumbnail generation logic
      content: '', // Add content generation logic
      metadata: {
        author: 'user', // Replace with actual user ID
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: data.isPublic,
        tags: data.tags,
      },
    };

    templates.push(template);
    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
} 