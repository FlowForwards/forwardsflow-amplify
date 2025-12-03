import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Building2, Briefcase, Shield, TrendingUp, Globe, Users, 
  DollarSign, CheckCircle, ChevronRight, Star, Lock, Layers, RefreshCw,
  BarChart3, Banknote
} from 'lucide-react';
import { Logo } from '../common';
import Footer from '../common/Footer';

const HomePage = () => {
  // Feature narratives from spec
  const featureCategories = [
    {
      title: 'Curated',
      subtitle: 'Embedded due diligence',
      icon: Star,
      features: [
        'Domestic counterparty intelligence',
        "Moody's A+ rated beneficial counterparty banks",
        '18%+ BIS average capital adequacy ratios',
        '50% of statutory core capital funds absorption ceilings',
        "Moody's Baa3+ rated geographies",
        'Persistent geographical & counterparty ratings slippage monitoring & alerts',
      ],
    },
    {
      title: 'Risk Mitigated',
      subtitle: 'Embedded risk management',
      icon: Shield,
      features: [
        'Built-in exchange rate forwards hedges',
        'FDIC insured sweep network custodial bank',
        'Default fiduciary responsibility stand-in counterparty (Delaware)',
        'Built-in automatic capital repatriation',
        'Built-in fiscal & FATCA compliance',
      ],
    },
    {
      title: 'Bite Sized',
      subtitle: 'Accommodating ticket sizes',
      icon: Layers,
      features: [
        'Pooled fixed deposits: $1,000 minimum ticket, $10,000 minimum pool',
        'Proprietary fixed deposits: $10,000 minimum ticket',
        'Hedged sovereign debt: $10,000 minimum ticket',
      ],
    },
    {
      title: 'Liquidity Preserving',
      subtitle: 'Secondary money market',
      icon: RefreshCw,
      features: [
        'Competitive early asset cash-in terms',
        'Multiple bank liquid repurchase counterparties',
        'Renders assets amenable digital collateral',
        'Enables flexible response to market conditions',
        'Market driven FX, interest rate and forwards contract price discovery',
      ],
    },
    {
      title: 'Low-Correlating',
      subtitle: 'Diversify your portfolio',
      icon: BarChart3,
      features: [
        'Emerging economies exposure',
        'Frontier economies access',
        'Non-volatile returns',
        'High-yield opportunities',
        'Cash & near-cash, liquid assets',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
              <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900">Products</Link>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How it Works</a>
              <a href="#value-props" className="text-sm text-gray-600 hover:text-gray-900">Why ForwardsFlow</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Sign In</Link>
              <Link to="/register" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              Trusted by leading impact investors worldwide
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Frontier Economy Returns,<br />
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Advanced Economy Security</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Connect impact investors with frontier economy banks for high-yield deposit instruments and frictionless mobile lending market access.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register/investor" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5" /> Register as Investor
              </Link>
              <Link to="/register/bank" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5" /> Register as Partner Bank
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '$16.9M+', label: 'Capital Deployed' },
              { value: '4,200+', label: 'Active Loans' },
              { value: '31.2%', label: 'Average Yield' },
              { value: '8', label: 'Partner Banks' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">A Complete Investment Ecosystem</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">ForwardsFlow provides end-to-end infrastructure for impact investing in frontier markets</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'High-Yield Returns', description: 'Access frontier market returns with embedded FX hedging through forwards contracts.', color: 'text-blue-600 bg-blue-100' },
              { icon: Shield, title: 'Risk Mitigation', description: 'Advanced FX forwards hedging and diversified portfolio across multiple banks.', color: 'text-green-600 bg-green-100' },
              { icon: Globe, title: 'Mobile Lending Access', description: 'WhatsApp-based loan origination reaching the largest smartphone audience.', color: 'text-purple-600 bg-purple-100' },
              { icon: DollarSign, title: 'M2 Money Generation', description: 'Banks leverage prudential reserve ratios to generate lending capacity.', color: 'text-yellow-600 bg-yellow-100' },
              { icon: Users, title: 'Impact Measurement', description: 'Track real social impact with transparent reporting on borrowers reached.', color: 'text-pink-600 bg-pink-100' },
              { icon: CheckCircle, title: 'Regulatory Compliance', description: 'Built-in compliance tools for KYC/AML and regulatory reporting.', color: 'text-indigo-600 bg-indigo-100' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions - Feature Narratives */}
      <section id="value-props" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ForwardsFlow?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive risk management and institutional-grade infrastructure for frontier market investments</p>
          </div>
          
          <div className="space-y-8">
            {featureCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 h-24 flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{category.title}</h3>
                      <p className="text-white/80 text-sm">{category.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How ForwardsFlow Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">A seamless flow of capital from impact investors to mobile borrowers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Investors Deploy Capital', description: 'Impact investors provide low-cost Yen/CHF deposits to frontier banks through our platform.' },
              { step: '02', title: 'Banks Generate Lending Capacity', description: 'Banks leverage deposits with prudential reserve ratios to generate M2 money supply.' },
              { step: '03', title: 'Mobile Loans Reach Borrowers', description: 'WhatsApp-based loan origination provides frictionless access to underserved borrowers.' },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-primary-100 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {idx < 2 && <ChevronRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Institutional-Grade Security & Compliance</h2>
                <div className="space-y-4">
                  {[
                    { icon: Lock, text: 'FDIC insured sweep network custodial bank' },
                    { icon: Shield, text: 'Default fiduciary responsibility stand-in counterparty (Delaware)' },
                    { icon: Banknote, text: 'Built-in fiscal & FATCA compliance' },
                    { icon: RefreshCw, text: 'Automatic capital repatriation' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-gray-300">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary-400" />
                      </div>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "Moody's A+", label: 'Counterparty Banks' },
                  { value: '18%+', label: 'BIS Capital Adequacy' },
                  { value: "Baa3+", label: 'Geography Ratings' },
                  { value: '50%', label: 'Capital Absorption Ceiling' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/10 rounded-xl p-5 text-center backdrop-blur">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-brand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-white/80 mb-10">Join leading impact investors and frontier banks on ForwardsFlow today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register/investor" className="w-full sm:w-auto px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
              Start Investing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/register/bank" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 flex items-center justify-center gap-2">
              Partner with Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
