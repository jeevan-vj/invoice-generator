# Invoice Generator

A modern web application for generating and managing invoices.

## Features

### Business Profile Management
The business profile feature allows users to manage their company information, including:

- Basic company information (name, email, phone, website)
- Business address
- Tax information
- Company logo

#### Components
- `BusinessPreviewCard`: Displays current business profile information
- `BusinessInfoForm`: Form for editing basic company information
- `BusinessAddressForm`: Form for managing business address
- `BusinessTaxForm`: Form for managing tax information
- `BusinessLogoUpload`: Component for uploading and managing company logo

#### API Endpoints
```typescript
GET    /api/business/profile    // Get business profile
PUT    /api/business/profile    // Update business profile
POST   /api/business/logo      // Upload company logo
DELETE /api/business/logo      // Delete company logo
```

#### Form Validation
- Company name: Required
- Email: Valid email format
- Phone: Minimum 10 digits
- Website: Valid URL format (optional)
- Address: All fields required
- Tax information: Required fields with appropriate validation

#### File Upload Requirements
- Logo: Image files only
- Maximum file size: 5MB
- Recommended dimensions: 200x200px

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod (form validation)

## Project Structure

```
/app
  /api
    /mocks
      business-profile.ts    # Mock API and types
  /components
    /dashboard
      /business
        business-preview-card.tsx
        business-info-form.tsx
        business-address-form.tsx
        business-tax-form.tsx
        business-logo-upload.tsx
  /dashboard
    /business
      /profile
        page.tsx            # Main business profile page
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.