import { TemplateForm } from '@/components/templates/template-form';

export default function NewTemplatePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Template</h1>
        <TemplateForm mode="create" />
      </div>
    </div>
  );
} 