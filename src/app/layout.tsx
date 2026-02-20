import { WalletContextProvider } from '@/contexts/WalletContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import ConditionalLayout from '@/components/ConditionalLayout';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'Recoverly - Trust Bank | Asset Recovery & Secure Banking',
  description: 'Recoverly is your bridge between financial loss and legal recovery. We offer specialized asset recovery services and secure legal banking to protect your wealth.',
  keywords: ['asset recovery', 'scam recovery', 'secure banking', 'legal banking', 'recoverly', 'trust bank', 'fraud protection'],
  authors: [{ name: 'Recoverly Trust Bank' }],
  creator: 'Recoverly Trust Bank',
  publisher: 'Recoverly Trust Bank',
  metadataBase: new URL('https://recoverly.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://recoverly.com',
    siteName: 'Recoverly Trust Bank',
    title: 'Recoverly - We Fight For Your Money Back',
    description: 'Scammed? Overcharged? We use the law to get your money back. Join the bank that fights for you.',
    images: [
      {
        url: '/recoverly-og.png',
        width: 1200,
        height: 630,
        alt: 'Recoverly - Asset Recovery & Banking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recoverly - We Fight For Your Money Back',
    description: 'Scammed? Overcharged? We use the law to get your money back.',
    images: ['/recoverly-og.png'],
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
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
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
