'use client';

import { Template } from '@/types/template';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { templateService } from '@/lib/services/template-service';
import Link from 'next/link';
import Image from 'next/image';

interface TemplateCardProps {
  template: Template;
  onDelete: () => void;
}

export function TemplateCard({ template, onDelete }: TemplateCardProps) {
  const handleDelete = async () => {
    try {
      await templateService.deleteTemplate(template.id);
      onDelete();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleDuplicate = async () => {
    try {
      await templateService.duplicateTemplate(template.id);
      onDelete();
    } catch (error) {
      console.error('Failed to duplicate template:', error);
    }
  };

  return (
    <Card className="group">
      <CardHeader className="relative p-0">
        <div className="aspect-video relative">
          {template.thumbnail ? (
            <Image
              src={template.thumbnail}
              alt={template.name}
              fill
              className="object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No preview</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Link href={`/dashboard/templates/${template.id}`}>
              <Button variant="secondary">Preview</Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/dashboard/templates/${template.id}/edit`}>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {template.metadata.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
          <span>{template.category}</span>
          <span>
            {new Date(template.metadata.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
} 