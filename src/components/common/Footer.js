import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Building2, Instagram, Linkedin, Youtube } from 'lucide-react';

// Custom icons for platforms not in Lucide
const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer = () => {
  const socialLinks = [
    { href: 'https://www.instagram.com/forwardsflow/', icon: Instagram, label: 'Instagram' },
    { href: 'https://www.linkedin.com/company/forwards-flow/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://www.tiktok.com/@forwardsflow', icon: TikTokIcon, label: 'TikTok' },
    { href: 'https://www.x.com/flowforwards', icon: XIcon, label: 'X' },
    { href: 'https://www.youtube.com/@forwardsflow', icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">FF</div>
              <span className="text-xl font-semibold text-white">ForwardsFlow</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              <span className="font-semibold text-white">Flow inc. ™</span>
            </p>
            <p className="text-sm text-gray-400 italic mb-6">
              Frontier economy returns, advanced economy security.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-primary-500" />
                <a href="tel:+254785654887" className="hover:text-white transition-colors">+254 785 654 887</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-primary-500" />
                <a href="mailto:info@forwardsflow.com" className="hover:text-white transition-colors">info@forwardsflow.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Building2 className="w-4 h-4 mt-0.5 text-primary-500" />
                <span>KOFISI Square, 104 Riverside Drive, Nairobi, Kenya</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-500" />
                <span>P.O. Box 309 Brookside Grove, 66323-00800, Westlands, Nairobi, KENYA</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/register/investor" className="hover:text-white transition-colors">Investor Registration</Link></li>
              <li><Link to="/register/bank" className="hover:text-white transition-colors">Partner Bank Registration</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Global Presence */}
          <div>
            <h3 className="text-white font-semibold mb-6">Global Presence</h3>
            <div className="flex flex-wrap gap-2">
              {['Dubai', 'London', 'Nairobi', 'New York', 'Singapore'].map((city) => (
                <span key={city} className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300">
                  {city}
                </span>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400">Headquarters</p>
              <p className="text-sm text-white mt-1">The Square, 104 Riverside Drive</p>
              <p className="text-sm text-gray-400">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Flow inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
