import { NextResponse } from 'next/server';
import { Template, TemplateFormData } from '@/types/template';

// In-memory storage for templates (replace with database in production)
let templates: Template[] = [];

export async function GET(
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
  return NextResponse.json(template);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data: Partial<TemplateFormData> = await request.json();
    const index = templates.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    templates[index] = {
      ...templates[index],
      ...data,
      metadata: {
        ...templates[index].metadata,
        updatedAt: new Date(),
      },
    };

    return NextResponse.json(templates[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = templates.findIndex((t) => t.id === params.id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  }

  templates.splice(index, 1);
  return NextResponse.json({ success: true });
} 