import React from 'react';
import { Redirect } from 'expo-router';
import { logger } from '@/utils/logger';

export default function AlertsRedirect() {
  logger.info('/alerts is deprecated. Redirecting to /security-settings', { component: 'AlertsRedirect', action: 'redirect' });
  return <Redirect href="/security-settings" />;
}
