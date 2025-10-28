import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const referralCode = params.code;

  return {
    title: 'Join Tesla Capital - Premium Investment Platform',
    description: `Start investing with Tesla Capital using referral code ${referralCode}. Earn high returns on your investments with secure, reliable opportunities.`,
    openGraph: {
      type: 'website',
      url: `https://tesla-capital.com/ref/${referralCode}`,
      siteName: 'Tesla Capital',
      title: 'Join Tesla Capital - Start Your Investment Journey',
      description: `Join Tesla Capital and start earning with referral code ${referralCode}. Secure investment opportunities with industry-leading returns.`,
      images: [
        {
          url: '/tesla-capital-logo.png',
          width: 1200,
          height: 630,
          alt: 'Tesla Capital - Investment Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Join Tesla Capital - Start Your Investment Journey',
      description: `Join Tesla Capital with referral code ${referralCode} and start earning high returns.`,
      images: ['/tesla-capital-logo.png'],
    },
  };
}

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

