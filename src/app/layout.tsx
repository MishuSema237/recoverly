import { WalletContextProvider } from '@/contexts/WalletContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import ConditionalLayout from '@/components/ConditionalLayout';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'Tesla Capital - Investment Platform',
  description: 'Tesla Capital is a cutting-edge investment platform offering secure cryptocurrency and traditional investment opportunities with industry-leading returns.',
  keywords: ['investment', 'crypto', 'bitcoin', 'trading', 'financial', 'tesla capital', 'investment platform'],
  authors: [{ name: 'Tesla Capital' }],
  creator: 'Tesla Capital',
  publisher: 'Tesla Capital',
  metadataBase: new URL('https://tesla-capital.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tesla Capital - Premium Investment Platform',
    description: 'Join thousands of investors earning high returns on their investments. Tesla Capital offers secure, reliable investment opportunities with industry-leading returns.',
    url: 'https://tesla-capital.com',
    siteName: 'Tesla Capital',
    images: [
      {
        url: '/tesla-capital-logo.png',
        width: 1200,
        height: 630,
        alt: 'Tesla Capital - Investment Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tesla Capital - Premium Investment Platform',
    description: 'Join thousands of investors earning high returns on their investments.',
    images: ['/tesla-capital-logo.png'],
    creator: '@teslacapital',
    site: '@teslacapital',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <LoadingProvider>
          <AuthProvider>
            <WalletContextProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <LoadingOverlay />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </WalletContextProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
