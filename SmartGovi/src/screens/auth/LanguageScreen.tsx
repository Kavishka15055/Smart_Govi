import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useSettingsStore } from '../../store/settingsStore';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

type LanguageScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Language'>;

export const LanguageScreen = () => {
  const navigation = useNavigation<LanguageScreenNavigationProp>();
  const { setLanguage } = useSettingsStore();
  const [selectedLang, setSelectedLang] = useState<'en' | 'si'>('en');

  const handleContinue = () => {
    setLanguage(selectedLang);
    navigation.navigate('Login');
  };

  const handleComingSoon = () => {
    Alert.alert(
      'Coming Soon',
      'Sinhala language support will be available in the next update!',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Govi</Text>
        <Text style={styles.subtitle}>Welcome! ආයුබෝවන්!</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Choose your language</Text>
        <Text style={styles.sectionSubtitle}>ඔබේ කැමති භාෂාව තෝරන්න</Text>

        <TouchableOpacity
          style={[
            styles.languageCard,
            selectedLang === 'en' && styles.selectedCard,
          ]}
          onPress={() => setSelectedLang('en')}
        >
          <View style={styles.radioContainer}>
            <View style={[styles.radio, selectedLang === 'en' && styles.radioSelected]}>
              {selectedLang === 'en' && <View style={styles.radioInner} />}
            </View>
          </View>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>English</Text>
            <Text style={styles.languageDescription}>Continue in English</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageCard,
            selectedLang === 'si' && styles.selectedCard,
          ]}
          onPress={() => setSelectedLang('si')}
        >
          <View style={styles.radioContainer}>
            <View style={[styles.radio, selectedLang === 'si' && styles.radioSelected]}>
              {selectedLang === 'si' && <View style={styles.radioInner} />}
            </View>
          </View>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>සිංහල</Text>
            <Text style={styles.languageDescription}>සිංහලෙන් ඉදිරියට</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonTitle}>COMING SOON</Text>
          <TouchableOpacity style={styles.comingSoonCard} onPress={handleComingSoon}>
            <Text style={styles.comingSoonText}>தமிழ்</Text>
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  languageCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F7F0',
  },
  radioContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: COLORS.white,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  comingSoonContainer: {
    marginTop: 32,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 12,
  },
  comingSoonCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.6,
  },
  comingSoonText: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
});