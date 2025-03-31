import { TemplatePreview } from '@/components/templates/template-preview';

interface TemplatePageProps {
  params: {
    id: string;
  };
}

export default function TemplatePage({ params }: TemplatePageProps) {
  return (
    <div className="container mx-auto py-6">
      <TemplatePreview templateId={params.id} />
    </div>
  );
} 