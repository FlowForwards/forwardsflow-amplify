import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Briefcase, Shield, TrendingUp, Globe, Users, DollarSign, CheckCircle, ChevronRight } from 'lucide-react';
import { Logo } from '../common';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How it Works</a>
              <a href="#impact" className="text-sm text-gray-600 hover:text-gray-900">Impact</a>
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

      {/* Features */}
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

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
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
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">FF</div>
              <span className="text-white font-semibold text-xl">ForwardsFlow</span>
            </div>
            <div className="flex items-center gap-8 text-gray-400 text-sm">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
            <p className="text-gray-500 text-sm">© 2024 ForwardsFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
