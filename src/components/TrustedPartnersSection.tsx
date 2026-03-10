'use client';

import React from 'react';
import LogoLoop from './LogoLoop.jsx';

import AgBankChinaLogo from '@/assets/parnersLogo/Agricultural_Bank_of_China_logo.png';
import BNPParibasLogo from '@/assets/parnersLogo/BNP_Paribas_logo.png';
import BankOfAmericaLogo from '@/assets/parnersLogo/Bank_of_America_logo_(1998–2018).png';
import ChaseLogo from '@/assets/parnersLogo/Chase_logo_2007.png';
import HSBCLogo from '@/assets/parnersLogo/HSBC.png';
import ICBCLogo from '@/assets/parnersLogo/ICBC_China_logo.png';
import MastercardLogo from '@/assets/parnersLogo/MasterCard_1979_logo.png';
import MUFGLogo from '@/assets/parnersLogo/Mitsubishi_UFJ_Financial_Group.png';
import PCBCLogo from '@/assets/parnersLogo/People_Construction_Bank_of_China_logo.png';
import VisaLogo from '@/assets/parnersLogo/Visa_Inc._logo.png';

const TrustedPartnersSection = () => {
  // Global financial network partners - using local assets
  const partnerLogos = [
    {
      src: BankOfAmericaLogo,
      alt: 'Bank of America',
      title: 'Bank of America Corp.',
      href: 'https://www.bankofamerica.com'
    },
    {
      src: ChaseLogo,
      alt: 'JPMorgan Chase',
      title: 'JPMorgan Chase & Co.',
      href: 'https://www.jpmorganchase.com'
    },
    {
      src: HSBCLogo,
      alt: 'HSBC',
      title: 'HSBC Holdings plc',
      href: 'https://www.hsbc.com'
    },
    {
      src: BNPParibasLogo,
      alt: 'BNP Paribas',
      title: 'BNP Paribas S.A.',
      href: 'https://group.bnpparibas'
    },
    {
      src: MUFGLogo,
      alt: 'MUFG',
      title: 'Mitsubishi UFJ Financial Group',
      href: 'https://www.mufg.jp'
    },
    {
      src: ICBCLogo,
      alt: 'ICBC',
      title: 'Industrial and Commercial Bank of China',
      href: 'https://www.icbc.com.cn'
    },
    {
      src: AgBankChinaLogo,
      alt: 'AgBank of China',
      title: 'Agricultural Bank of China',
      href: 'https://www.abchina.com'
    },
    {
      src: PCBCLogo,
      alt: 'China Construction Bank',
      title: 'China Construction Bank Corp.',
      href: 'http://www.ccb.com'
    },
    {
      src: VisaLogo,
      alt: 'Visa',
      title: 'Visa Inc.',
      href: 'https://www.visa.com'
    },
    {
      src: MastercardLogo,
      alt: 'Mastercard',
      title: 'Mastercard Inc.',
      href: 'https://www.mastercard.com'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Global Financial Network
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Recoverly collaborates with the world&apos;s leading financial institutions and corporations
            to ensure secure asset management and efficient recovery processes. Our network provides
            the stable foundation for all your banking and recovery needs.
          </p>
        </div>

        <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {React.createElement(LogoLoop as any, {
            logos: partnerLogos,
            speed: 120,
            direction: 'left',
            logoHeight: 48,
            gap: 40,
            pauseOnHover: true,
            scaleOnHover: true,
            fadeOut: true,
            fadeOutColor: '#ffffff',
            ariaLabel: 'Our Global Financial Network - trusted banks and corporations'
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            <strong>How it works:</strong> Recoverly manages your funds through secure banking
            operations and leverages our global network for advanced asset reclamation. Our expert
            team monitors financial trends and identifies the best pathways for asset recovery.
            All you do is choose the plan that fits your needs and watch your account balance
            grow through our automated banking and recovery systems - we handle all the complex work!
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartnersSection;

