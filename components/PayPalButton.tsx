import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Heart, CreditCard } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';

const PAYPAL_URL = 'https://paypal.me/kikustore';

interface PayPalButtonProps {
  amount?: number;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export function PayPalButton({
  amount,
  label = 'Поддержать проект',
  variant = 'primary',
  size = 'medium',
}: PayPalButtonProps) {
  const { theme } = useThemeMode();

  const handlePress = async () => {
    const url = amount ? `${PAYPAL_URL}/${amount}` : PAYPAL_URL;
    
    try {
      // Проверяем можно ли открыть URL
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // На веб используем window.open
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          console.error('[PayPalButton] Cannot open URL:', url);
        }
      }
    } catch (error) {
      console.error('[PayPalButton] Failed to open PayPal:', error);
      // Fallback для веб
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

    const buttonStyles = [
      styles.button,
      styles[`button_${variant}`],
      styles[`button_${size}`],
      {
        backgroundColor: variant === 'primary' ? '#0070BA' : variant === 'secondary' ? theme.interactive.secondary : 'transparent',
        borderColor: variant === 'outline' ? '#0070BA' : 'transparent',
      },
    ];

  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    {
      color: variant === 'outline' ? '#0070BA' : '#FFFFFF',
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <View style={styles.content}>
        <CreditCard size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} color={variant === 'outline' ? '#0070BA' : '#FFFFFF'} />
        <Text style={textStyles}>{label}</Text>
        {amount && (
          <Text style={[textStyles, styles.amount]}>
            ${amount}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// Компонент для быстрого доступа к PayPal
export function QuickDonateButton() {
  const { theme } = useThemeMode();

  const amounts = [5, 10, 25, 50];

  return (
    <View style={styles.quickDonateContainer}>
      <Text style={[styles.quickDonateTitle, { color: theme.text.primary }]}>
        Быстрая поддержка
      </Text>
      <View style={styles.amountsRow}>
        {amounts.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.quickButton, { borderColor: theme.borderSoft }]}
            onPress={async () => {
              const url = `${PAYPAL_URL}/${amount}`;
              try {
                const canOpen = await Linking.canOpenURL(url);
                if (canOpen) {
                  await Linking.openURL(url);
                } else if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.open(url, '_blank', 'noopener,noreferrer');
                }
              } catch (error) {
                console.error('[QuickDonateButton] Failed to open:', error);
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.open(url, '_blank', 'noopener,noreferrer');
                }
              }
            }}
          >
            <Text style={[styles.quickButtonText, { color: theme.text.primary }]}>
              ${amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <PayPalButton label="Другая сумма" variant="outline" size="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button_primary: {
    backgroundColor: '#0070BA',
  },
  button_secondary: {
    backgroundColor: '#6C757D',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  amount: {
    marginLeft: 4,
    opacity: 0.9,
  },
  quickDonateContainer: {
    marginTop: 16,
    gap: 12,
  },
  quickDonateTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  amountsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
