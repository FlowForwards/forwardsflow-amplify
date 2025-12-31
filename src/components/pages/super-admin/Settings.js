// Settings.js - Super Admin Settings Page
import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, DollarSign, Users, Globe, Database, Key, Save, RefreshCw, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, Info, MessageSquare, Smartphone } from 'lucide-react';

const SETTINGS_SECTIONS = {
  platform: {
    platformName: 'ForwardsFlow',
    supportEmail: 'support@forwardsflow.com',
    defaultCurrency: 'JPY',
    timezone: 'Africa/Nairobi',
    maintenanceMode: false,
    debugMode: false
  },
  fees: {
    platformFee: 0.20,
    hedgingFee: 0.25,
    minimumDeposit: 5000000,
    maximumDeposit: 200000000
  },
  compliance: {
    kycRequired: true,
    amlScreening: true,
    sanctionChecks: true,
    pepScreening: true,
    documentRetention: 7,
    autoEscalation: true,
    escalationThreshold: 24
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    digestFrequency: 'daily',
    alertEmails: 'alerts@forwardsflow.com'
  },
  integrations: {
    amazonQ: { enabled: true, region: 'us-east-1' },
    twilioWhatsapp: { enabled: true, number: '+1234567890' },
    mpesa: { enabled: true, shortcode: '174379' }
  }
};

const Toggle = ({ enabled, onChange }) => (
  <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SettingsCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-600" />
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Settings = () => {
  const [settings, setSettings] = useState(SETTINGS_SECTIONS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1><p className="text-gray-600 mt-1">Configure platform-wide settings and preferences</p></div>
          <div className="flex items-center gap-3">
            {saved && <span className="flex items-center gap-2 text-green-600"><CheckCircle className="w-4 h-4" />Saved</span>}
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsCard title="Platform Configuration" icon={SettingsIcon}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label><input type="text" value={settings.platform.platformName} onChange={(e) => updateSetting('platform', 'platformName', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label><input type="email" value={settings.platform.supportEmail} onChange={(e) => updateSetting('platform', 'supportEmail', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label><select value={settings.platform.defaultCurrency} onChange={(e) => updateSetting('platform', 'defaultCurrency', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option value="JPY">JPY (Japanese Yen)</option><option value="CHF">CHF (Swiss Franc)</option><option value="USD">USD (US Dollar)</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label><select value={settings.platform.timezone} onChange={(e) => updateSetting('platform', 'timezone', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option value="Africa/Nairobi">Africa/Nairobi (EAT)</option><option value="UTC">UTC</option><option value="Europe/London">Europe/London</option></select></div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div><p className="font-medium text-gray-900">Maintenance Mode</p><p className="text-sm text-gray-500">Temporarily disable platform access</p></div>
              <Toggle enabled={settings.platform.maintenanceMode} onChange={() => updateSetting('platform', 'maintenanceMode', !settings.platform.maintenanceMode)} />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Fee Configuration" icon={DollarSign}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label><input type="number" step="0.01" value={settings.fees.platformFee} onChange={(e) => updateSetting('fees', 'platformFee', parseFloat(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Hedging Fee (%)</label><input type="number" step="0.01" value={settings.fees.hedgingFee} onChange={(e) => updateSetting('fees', 'hedgingFee', parseFloat(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Deposit (¥)</label><input type="number" value={settings.fees.minimumDeposit} onChange={(e) => updateSetting('fees', 'minimumDeposit', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Deposit (¥)</label><input type="number" value={settings.fees.maximumDeposit} onChange={(e) => updateSetting('fees', 'maximumDeposit', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2"><Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" /><p className="text-sm text-blue-700">Fee changes apply to new transactions only</p></div>
          </div>
        </SettingsCard>

        <SettingsCard title="Compliance Settings" icon={Shield}>
          <div className="space-y-4">
            {[{ key: 'kycRequired', label: 'KYC Required', desc: 'Require KYC verification for all transactions' }, { key: 'amlScreening', label: 'AML Screening', desc: 'Enable anti-money laundering checks' }, { key: 'sanctionChecks', label: 'Sanction Checks', desc: 'Screen against global sanction lists' }, { key: 'pepScreening', label: 'PEP Screening', desc: 'Check for politically exposed persons' }, { key: 'autoEscalation', label: 'Auto-Escalation', desc: 'Automatically escalate pending reviews' }].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div><p className="font-medium text-gray-900">{item.label}</p><p className="text-sm text-gray-500">{item.desc}</p></div>
                <Toggle enabled={settings.compliance[item.key]} onChange={() => updateSetting('compliance', item.key, !settings.compliance[item.key])} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Document Retention (years)</label><input type="number" value={settings.compliance.documentRetention} onChange={(e) => updateSetting('compliance', 'documentRetention', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Escalation Threshold (hours)</label><input type="number" value={settings.compliance.escalationThreshold} onChange={(e) => updateSetting('compliance', 'escalationThreshold', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Notification Settings" icon={Bell}>
          <div className="space-y-4">
            {[{ key: 'emailNotifications', label: 'Email Notifications', desc: 'Send notifications via email' }, { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send critical alerts via SMS' }, { key: 'pushNotifications', label: 'Push Notifications', desc: 'Enable browser push notifications' }].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div><p className="font-medium text-gray-900">{item.label}</p><p className="text-sm text-gray-500">{item.desc}</p></div>
                <Toggle enabled={settings.notifications[item.key]} onChange={() => updateSetting('notifications', item.key, !settings.notifications[item.key])} />
              </div>
            ))}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Digest Frequency</label><select value={settings.notifications.digestFrequency} onChange={(e) => updateSetting('notifications', 'digestFrequency', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option value="realtime">Real-time</option><option value="hourly">Hourly</option><option value="daily">Daily</option><option value="weekly">Weekly</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Alert Email Address</label><input type="email" value={settings.notifications.alertEmails} onChange={(e) => updateSetting('notifications', 'alertEmails', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
          </div>
        </SettingsCard>

        <SettingsCard title="Premium Integrations" icon={Key}>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-purple-600" /><div><p className="font-medium text-gray-900">Amazon Q AI Assistant</p><p className="text-sm text-gray-500">AI-powered chatbot for user support</p></div></div>
                <Toggle enabled={settings.integrations.amazonQ.enabled} onChange={() => updateSetting('integrations', 'amazonQ', { ...settings.integrations.amazonQ, enabled: !settings.integrations.amazonQ.enabled })} />
              </div>
              {settings.integrations.amazonQ.enabled && <div><label className="block text-sm font-medium text-gray-700 mb-1">AWS Region</label><input type="text" value={settings.integrations.amazonQ.region} onChange={(e) => updateSetting('integrations', 'amazonQ', { ...settings.integrations.amazonQ, region: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>}
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-green-600" /><div><p className="font-medium text-gray-900">Twilio WhatsApp</p><p className="text-sm text-gray-500">WhatsApp messaging integration</p></div></div>
                <Toggle enabled={settings.integrations.twilioWhatsapp.enabled} onChange={() => updateSetting('integrations', 'twilioWhatsapp', { ...settings.integrations.twilioWhatsapp, enabled: !settings.integrations.twilioWhatsapp.enabled })} />
              </div>
              {settings.integrations.twilioWhatsapp.enabled && <div><label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label><input type="text" value={settings.integrations.twilioWhatsapp.number} onChange={(e) => updateSetting('integrations', 'twilioWhatsapp', { ...settings.integrations.twilioWhatsapp, number: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>}
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-emerald-600" /><div><p className="font-medium text-gray-900">M-Pesa Integration</p><p className="text-sm text-gray-500">Mobile money payments</p></div></div>
                <Toggle enabled={settings.integrations.mpesa.enabled} onChange={() => updateSetting('integrations', 'mpesa', { ...settings.integrations.mpesa, enabled: !settings.integrations.mpesa.enabled })} />
              </div>
              {settings.integrations.mpesa.enabled && <div><label className="block text-sm font-medium text-gray-700 mb-1">Shortcode</label><input type="text" value={settings.integrations.mpesa.shortcode} onChange={(e) => updateSetting('integrations', 'mpesa', { ...settings.integrations.mpesa, shortcode: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>}
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Danger Zone" icon={AlertTriangle}>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-800 mb-2">Reset Platform Data</h4>
              <p className="text-sm text-red-600 mb-3">This will clear all sample data. This action cannot be undone.</p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reset Data</button>
            </div>
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-800 mb-2">Export All Data</h4>
              <p className="text-sm text-red-600 mb-3">Download a complete backup of all platform data.</p>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Export Data</button>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default Settings;
