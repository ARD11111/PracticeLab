import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

export default function Settings() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reviewReminder, setReviewReminder] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await userAPI.getSettings();
        const userData = res.data;
        setName(userData.name);
        if (userData.settings) {
          setDailyReminder(userData.settings.dailyReminder ?? true);
          setReviewReminder(userData.settings.reviewReminder ?? true);
          setWeeklyProgress(userData.settings.weeklyProgress ?? false);
          setReminderTime(userData.settings.reminderTime || '09:00');
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await userAPI.updateSettings({
        name,
        settings: {
          dailyReminder,
          reviewReminder,
          weeklyProgress,
          reminderTime
        }
      });
      setUser({ ...user, name: res.data.user.name, settings: res.data.user.settings });
      setMessage('Settings updated successfully!');
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings & Preferences</h1>
          <p className="page-subtitle">Manage your profile and email notification schedules</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '650px', marginBottom: '24px' }}>
        {message && (
          <div style={{ padding: '10px 12px', backgroundColor: 'var(--accent-blue-subtle)', border: '1px solid var(--accent-blue-border)', borderRadius: '6px', fontSize: '12px', marginBottom: '16px', color: '#60a5fa' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'var(--text-primary)' }}>
            User Profile
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '24px 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'var(--text-primary)' }}>
            Email Notifications & Reminders
          </h3>

          <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={dailyReminder}
                onChange={(e) => setDailyReminder(e.target.checked)}
              />
              Daily Practice Reminder
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={reviewReminder}
                onChange={(e) => setReviewReminder(e.target.checked)}
              />
              Spaced Repetition Review Queue Alerts
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={weeklyProgress}
                onChange={(e) => setWeeklyProgress(e.target.checked)}
              />
              Weekly Pattern Mastery Report
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Daily Reminder Time</label>
            <input
              type="time"
              className="form-control"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
