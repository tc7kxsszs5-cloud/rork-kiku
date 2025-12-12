import React from 'react';
import { Redirect } from 'expo-router';

export default function AlertsRedirect() {
  console.log('[AlertsRedirect] /alerts is deprecated. Redirecting to /security-settings');
  return <Redirect href="/security-settings" />;
}
