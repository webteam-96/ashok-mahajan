'use client';

import { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

interface SettingsForm {
  site_title: string;
  site_description: string;
  phone: string;
  email: string;
  address: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  footer_text: string;
}

const DEFAULT_SETTINGS: SettingsForm = {
  site_title: 'Ashok Mahajan',
  site_description: '',
  phone: '',
  email: '',
  address: '',
  facebook_url: '',
  twitter_url: '',
  linkedin_url: '',
  footer_text: '',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsForm>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) return;
        const data = await res.json();
        const merged: Partial<SettingsForm> = {};
        if (Array.isArray(data)) {
          for (const item of data as { key: string; value: string }[]) {
            if (item.key in DEFAULT_SETTINGS) {
              merged[item.key as keyof SettingsForm] = item.value;
            }
          }
        } else if (data && typeof data === 'object') {
          for (const [key, value] of Object.entries(data)) {
            if (key in DEFAULT_SETTINGS) {
              merged[key as keyof SettingsForm] = value as string;
            }
          }
        }
        setSettings({ ...DEFAULT_SETTINGS, ...merged });
      } catch {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const savePromises = Object.entries(settings).map(([key, value]) =>
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      );
      const results = await Promise.all(savePromises);
      const allOk = results.every((r) => r.ok);
      if (allOk) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError('Some settings failed to save. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-[800px] space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[800px]">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={22} className="text-slate-400" />
        <div>
          <div className="text-2xl font-bold text-heading">Site Settings</div>
          <p className="text-slate-500 text-sm mt-0.5">
            Configure your website&apos;s global settings
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <Card>
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="text-sm font-semibold text-heading">General Information</div>
          </div>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="site_title">Site Title</Label>
                <Input
                  id="site_title"
                  name="site_title"
                  value={settings.site_title}
                  onChange={handleChange}
                  placeholder="Ashok Mahajan"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  name="site_description"
                  value={settings.site_description}
                  onChange={handleChange}
                  placeholder="Brief description of the website..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  placeholder="New Delhi, India"
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="text-sm font-semibold text-heading">Social Media</div>
          </div>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  type="url"
                  value={settings.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="twitter_url">Twitter / X URL</Label>
                <Input
                  id="twitter_url"
                  name="twitter_url"
                  type="url"
                  value={settings.twitter_url}
                  onChange={handleChange}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  value={settings.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="text-sm font-semibold text-heading">Footer</div>
          </div>
          <CardContent className="pt-5">
            <div className="space-y-1.5">
              <Label htmlFor="footer_text">Footer Text</Label>
              <Textarea
                id="footer_text"
                name="footer_text"
                value={settings.footer_text}
                onChange={handleChange}
                placeholder="© 2024 Ashok Mahajan. All rights reserved."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving} className="px-6">
          <Save size={15} />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
