import { NextResponse } from 'next/server';
import { Template } from '@/types/template';

// In-memory storage for templates (replace with database in production)
let templates: Template[] = [];

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const template = templates.find((t) => t.id === params.id);
  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  }

  const duplicatedTemplate: Template = {
    ...template,
    id: Math.random().toString(36).substring(7),
    name: `${template.name} (Copy)`,
    metadata: {
      ...template.metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  templates.push(duplicatedTemplate);
  return NextResponse.json(duplicatedTemplate);
} 