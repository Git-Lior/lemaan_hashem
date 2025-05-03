import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GalleryVerticalEnd, Settings2, Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Hebraization of Surnames
        </h1>
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground text-center mb-12">
            Welcome to the Hebraization of Surnames exhibition management system.
            Please select your role to continue.
          </p>
          
          <div className="grid gap-6">
            <Link href="/designer/fonts" className="w-full">
              <Button
                variant="outline"
                className="w-full h-24 text-lg"
              >
                <GalleryVerticalEnd className="mr-4 h-6 w-6" />
                Font Management
              </Button>
            </Link>
            
            <Link href="/designer/animation" className="w-full">
              <Button
                variant="outline"
                className="w-full h-24 text-lg"
              >
                <Settings2 className="mr-4 h-6 w-6" />
                Animation Settings
              </Button>
            </Link>
            
            <Link href="/exhibition" className="w-full">
              <Button
                variant="default"
                className="w-full h-24 text-lg"
              >
                <Play className="mr-4 h-6 w-6" />
                Start Exhibition
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}