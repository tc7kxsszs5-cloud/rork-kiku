import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Phone, Video, Users } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { OnlineStatus } from '@/components/OnlineStatus';
import * as Contacts from 'expo-contacts';
import { HapticFeedback } from '@/constants/haptics';

interface Contact {
  id: string;
  name: string;
  phoneNumbers?: string[];
  imageUri?: string | null;
  isAppUser?: boolean;
}

export default function ContactsScreen() {
  const router = useRouter();
  const { theme } = useThemeMode();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  const styles = createStyles(theme);

  useEffect(() => {
    requestContactsPermission();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount-only: request contacts permission once

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.phoneNumbers?.some((phone) => phone.includes(searchQuery))
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        loadContacts();
      }
    } catch (error) {
      console.error('[ContactsScreen] Permission error:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
      });

      const formattedContacts: Contact[] = data
        .filter((contact) => contact.name && contact.phoneNumbers && contact.phoneNumbers.length > 0)
        .map((contact) => ({
          id: contact.id,
          name: contact.name || 'Без имени',
          phoneNumbers: contact.phoneNumbers?.map((p) => p.number).filter((num): num is string => num !== undefined),
          imageUri: contact.image?.uri ?? undefined,
          isAppUser: false,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setContacts(formattedContacts);
      setFilteredContacts(formattedContacts);
    } catch (error) {
      console.error('[ContactsScreen] Load contacts error:', error);
    }
  };

  const handleCall = (contact: Contact) => {
    HapticFeedback.medium();
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      router.push({
        pathname: '/call',
        params: {
          contactName: contact.name,
          phoneNumber: contact.phoneNumbers[0],
          type: 'audio',
        },
      } as any);
    }
  };

  const handleVideoCall = (contact: Contact) => {
    HapticFeedback.medium();
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      router.push({
        pathname: '/call',
        params: {
          contactName: contact.name,
          phoneNumber: contact.phoneNumbers[0],
          type: 'video',
        },
      } as any);
    }
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.contactItem} activeOpacity={0.7}>
      <View style={styles.contactAvatar}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: (theme.interactive?.primary || theme.accentPrimary) + '20' }]}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        {item.isAppUser && (
          <View style={styles.onlineBadge}>
            <OnlineStatus size="small" />
          </View>
        )}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.phoneNumbers && item.phoneNumbers.length > 0 && (
          <Text style={styles.contactPhone}>{item.phoneNumbers[0]}</Text>
        )}
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            handleCall(item);
          }}
        >
          <Phone size={20} color={theme.interactive?.primary || theme.accentPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            handleVideoCall(item);
          }}
        >
          <Video size={20} color={theme.interactive?.primary || theme.accentPrimary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Users size={64} color={theme.textSecondary} />
          <Text style={styles.emptyText}>Доступ к контактам</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestContactsPermission}>
            <Text style={styles.permissionButtonText}>Предоставить доступ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск контактов..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Users size={64} color={theme.textSecondary} />
          <Text style={styles.emptyText}>
            {searchQuery ? 'Контакты не найдены' : 'Нет контактов'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.textPrimary,
  },
  clearButton: {
    fontSize: 18,
    color: theme.textSecondary,
    padding: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  contactAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.interactive?.primary || theme.accentPrimary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.backgroundPrimary || '#fff',
    borderRadius: 10,
    padding: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: (theme.interactive?.primary || theme.accentPrimary) + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionButton: {
    backgroundColor: theme.interactive?.primary || theme.accentPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
