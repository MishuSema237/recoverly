import { WalletContextProvider } from '@/contexts/WalletContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingOverlay from '@/components/LoadingOverlay';
import ConditionalLayout from '@/components/ConditionalLayout';
import './globals.css';

export const metadata = {
  title: 'Tesla Capital - Investment Platform',
  description: 'Tesla Capital is a cutting-edge investment platform offering secure cryptocurrency and traditional investment opportunities with industry-leading returns.',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
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
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </ConditionalLayout>
              <LoadingOverlay />
            </WalletContextProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
