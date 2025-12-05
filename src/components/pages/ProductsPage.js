import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Briefcase, ArrowRight, CheckCircle, TrendingUp, 
  Globe, Shield, DollarSign, Users, 
  BarChart3, RefreshCw
} from 'lucide-react';
import { Logo } from '../common';
import Footer from '../common/Footer';

// Unified gradient for all headers
const HEADER_GRADIENT = 'from-blue-500 to-indigo-600';
const HEADER_HEIGHT = 'h-24'; // Consistent header height

// Product Card Component with fixed height
const ProductCard = ({ product }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
    <div className={`bg-gradient-to-r ${HEADER_GRADIENT} px-6 ${HEADER_HEIGHT} flex items-center justify-between`}>
      <div>
        <h3 className="text-xl font-bold text-white">{product.title}</h3>
        <p className="text-white/80 text-sm mt-1">{product.subtitle}</p>
      </div>
      {product.apr && (
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{product.apr}</p>
          <p className="text-white/70 text-xs">APR (USD)</p>
        </div>
      )}
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <p className="text-gray-600 mb-6">{product.description}</p>
      
      {product.specs && (
        <div className="space-y-3 mb-6">
          {product.specs.map((spec, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <spec.icon className="w-4 h-4 text-primary-600" />
              </div>
              <span className="text-sm text-gray-700">{spec.text}</span>
            </div>
          ))}
        </div>
      )}

      {product.features && (
        <div className="space-y-2 mb-6">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Spacer to push content to bottom */}
      <div className="flex-grow"></div>

      {product.bestFor && (
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Best For</p>
          <p className="text-sm font-medium text-gray-900">{product.bestFor}</p>
        </div>
      )}

      <Link 
        to={product.ctaLink || '/register'} 
        className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors group-hover:shadow-lg"
      >
        {product.ctaText || 'Get Started'} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

// Bank Deal Flow Card with fixed height
const BankDealCard = ({ deal }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
    <div className={`bg-gradient-to-r ${HEADER_GRADIENT} px-6 ${HEADER_HEIGHT} flex items-center`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <deal.icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{deal.title}</h3>
          <p className="text-white/80 text-sm">{deal.subtitle}</p>
        </div>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <p className="text-gray-600 mb-6">{deal.description}</p>
      <div className="space-y-3 flex-grow">
        {deal.benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Section Header Component
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className={`bg-gradient-to-r ${HEADER_GRADIENT} px-6 ${HEADER_HEIGHT} flex items-center`}>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>
    </div>
  </div>
);

// Stat Card for Lender section
const MarketStatCard = ({ stat }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
    <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${stat.iconBg}`}>
      <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
    <p className="text-sm text-gray-500">{stat.label}</p>
  </div>
);

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState('investors');

  const tabs = [
    { id: 'investors', label: 'For Investors', icon: Briefcase },
    { id: 'banks', label: 'For Banks', icon: Building2 },
  ];

  // Investor Products
  const investorProducts = [
    {
      title: 'Pooled Fixed Deposits',
      subtitle: 'Earn the same high interest rates as big ticket depositors',
      apr: '8.00%+',
      description: 'Access institutional-grade returns with accessible minimum investments. Pool your capital with other investors to unlock premium deposit rates.',
      specs: [
        { icon: DollarSign, text: '$1,000 minimum & multiples thereof ticket size' },
        { icon: Users, text: '$10,000 minimum pool size' },
        { icon: TrendingUp, text: '8.00%+ APR (USD denominated)' },
      ],
      features: [
        'Pre-maturity liquidation secondary marketplace',
        'Diversified across multiple partner banks',
        'Embedded FX hedging',
        'Quarterly interest payments',
      ],
      bestFor: 'Ordinary and medium net worth individuals',
      ctaLink: '/register/investor',
      ctaText: 'Start Investing',
    },
    {
      title: 'Proprietary Fixed Deposits',
      subtitle: 'Earn uncorrelated & adventurous private sector bank interest rates',
      apr: '10.00%+',
      description: 'Direct deposit relationships with carefully vetted frontier economy banks. Higher yields with comprehensive risk mitigation.',
      specs: [
        { icon: DollarSign, text: '$10,000 & multiples thereof ticket size' },
        { icon: TrendingUp, text: '10.00%+ APR (USD denominated)' },
        { icon: Shield, text: 'Built-in risk mitigation and compliance' },
      ],
      features: [
        'Pre-maturity liquidation secondary marketplace',
        'Direct counterparty relationship',
        'Moody\'s rated partner banks',
        'Automatic capital repatriation',
      ],
      bestFor: 'High-net-worth individuals',
      ctaLink: '/register/investor',
      ctaText: 'Start Investing',
    },
    {
      title: 'Hedged Sovereign Debt',
      subtitle: 'Earn uncorrelated & adventurous central bank interest rates',
      apr: '9.00%+',
      description: 'Access frontier economy government securities with embedded currency hedging. Sovereign-backed returns with institutional-grade risk management.',
      specs: [
        { icon: DollarSign, text: '$10,000 & multiples thereof ticket size' },
        { icon: TrendingUp, text: '9.00%+ APR (USD denominated)' },
        { icon: Shield, text: 'Built-in risk mitigation and compliance' },
      ],
      features: [
        'Pre-maturity liquidation secondary marketplace',
        'Government-backed securities',
        'FX forwards hedging included',
        'Baa3+ rated geographies',
      ],
      bestFor: 'Single-family offices',
      ctaLink: '/register/investor',
      ctaText: 'Start Investing',
    },
    {
      title: 'Hedged Private Credit',
      subtitle: 'Earn uncorrelated & ultra-high yield 30-day commercial paper rates',
      apr: '108.00%+',
      description: 'Access the mobile lending market through carefully structured private credit instruments. Ultra-high yields backed by diversified loan portfolios.',
      specs: [
        { icon: DollarSign, text: '$10,000 and multiples thereof experimental ticket sizes' },
        { icon: TrendingUp, text: '108.00%+ APR (USD denominated)' },
        { icon: Shield, text: 'Built-in counterparty due diligence' },
      ],
      features: [
        'Pre-maturity liquidation secondary marketplace',
        '30-day rolling commercial paper',
        'Diversified mobile loan portfolio backing',
        'Real-time portfolio monitoring',
      ],
      bestFor: 'Risk & growth oriented funds',
      ctaLink: '/register/investor',
      ctaText: 'Start Investing',
    },
  ];

  // Bank Deal Flows
  const bankDeals = [
    {
      title: 'Forex Deal Flow',
      subtitle: 'Grow foreign exchange transaction deal flow',
      icon: Globe,
      description: 'Access a steady stream of foreign exchange transactions from international impact investors seeking frontier market exposure.',
      benefits: [
        'Direct access to international investor capital',
        'Competitive FX spread opportunities',
        'Automated transaction settlement',
        'Real-time rate discovery and execution',
        'Compliance-ready documentation',
      ],
    },
    {
      title: 'Forex Fixed Deposits',
      subtitle: 'Grow foreign exchange denominated fixed deposits',
      icon: Banknote,
      description: 'Attract stable, long-term foreign currency deposits from institutional and retail impact investors worldwide.',
      benefits: [
        'Low-cost foreign currency funding',
        'Diversified depositor base',
        'Flexible tenor options (3-36 months)',
        'Automated interest calculations',
        'Investor relationship management tools',
      ],
    },
    {
      title: 'Forwards Deal Flow',
      subtitle: 'Grow foreign exchange rate forwards contract deal flow',
      icon: TrendingUp,
      description: 'Generate additional revenue through FX forwards contracts that hedge investor currency exposure.',
      benefits: [
        'Premium income from forwards contracts',
        'Natural hedge for your FX book',
        'Automated contract management',
        'Mark-to-market reporting',
        'Risk limit monitoring',
      ],
    },
    {
      title: 'Secondary Deal Flow',
      subtitle: 'Grow secondary-market pre-maturity liquidity deal flow',
      icon: RefreshCw,
      description: 'Participate in the secondary market for deposit instruments, providing liquidity and earning spreads.',
      benefits: [
        'Secondary market trading revenue',
        'Liquidity provision opportunities',
        'Portfolio optimization tools',
        'Competitive bidding platform',
        'Settlement automation',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/"><Logo /></Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/products" className="text-sm text-primary-600 font-medium">Products</Link>
              <a href="/#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
              <a href="/#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How it Works</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Sign In</Link>
              <Link to="/register" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Products</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Comprehensive financial solutions for investors, banks, and lenders in frontier markets
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Investors Tab */}
        {activeTab === 'investors' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Investment Products</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Access frontier market returns with institutional-grade risk management and compliance
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {investorProducts.map((product, idx) => (
                <ProductCard key={idx} product={product} />
              ))}
            </div>

            {/* Comparison Table */}
            <div className="mt-16 bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <SectionHeader 
                icon={BarChart3} 
                title="Product Comparison" 
                subtitle="Choose the right product for your investment goals" 
              />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Pooled</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Proprietary</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Sovereign</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Private Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">Min. Investment</td>
                      <td className="px-6 py-4 text-center text-sm font-medium">$1,000</td>
                      <td className="px-6 py-4 text-center text-sm font-medium">$10,000</td>
                      <td className="px-6 py-4 text-center text-sm font-medium">$10,000</td>
                      <td className="px-6 py-4 text-center text-sm font-medium">$10,000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">Target APR</td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-green-600">8.00%+</td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-green-600">10.00%+</td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-green-600">9.00%+</td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-green-600">108.00%+</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">Risk Level</td>
                      <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Low</span></td>
                      <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Medium</span></td>
                      <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Low</span></td>
                      <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">High</span></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">Secondary Market</td>
                      <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">FX Hedging</td>
                      <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Banks Tab */}
        {activeTab === 'banks' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Bank Solutions</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Grow your foreign exchange and deposit business with access to international impact investors
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {bankDeals.map((deal, idx) => (
                <BankDealCard key={idx} deal={deal} />
              ))}
            </div>

            {/* Bank CTA */}
            <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Grow Your Bank's Deal Flow?</h3>
                  <p className="text-gray-300 mb-6">
                    Join ForwardsFlow's network of partner banks and access a steady stream of foreign currency deposits from international impact investors.
                  </p>
                  <Link to="/register/bank" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100">
                    Register Your Bank <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-5 text-center">
                    <p className="text-3xl font-bold text-white">$16.9M+</p>
                    <p className="text-sm text-gray-400">Capital Deployed</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-5 text-center">
                    <p className="text-3xl font-bold text-white">8+</p>
                    <p className="text-sm text-gray-400">Partner Banks</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-5 text-center">
                    <p className="text-3xl font-bold text-white">31.2%</p>
                    <p className="text-sm text-gray-400">Average Yield</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-5 text-center">
                    <p className="text-3xl font-bold text-white">5</p>
                    <p className="text-sm text-gray-400">Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductsPage;
