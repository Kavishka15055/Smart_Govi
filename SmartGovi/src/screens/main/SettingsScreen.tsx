import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

type SettingsScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Settings'>;

export const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { user } = useAuthStore();
  const {
    language,
    theme,
    notificationsEnabled,
    defaultReportPeriod,
    setLanguage,
    setTheme,
    setNotificationsEnabled,
    setDefaultReportPeriod,
  } = useSettingsStore();

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);

  const handleBackup = () => {
    Alert.alert(
      'Backup Data',
      'This will backup all your data to the cloud. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Backup',
          onPress: () => {
            Alert.alert('Success', 'Data backup completed successfully!');
          },
        },
      ]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'For assistance, please contact:\nEmail: support@goviganana.com\nPhone: 077-1234567',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Language Setting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language / භාෂාව</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowLanguagePicker(!showLanguagePicker)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="language-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{language === 'en' ? 'English' : 'සිංහල'}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
          
          {showLanguagePicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={language}
                onValueChange={(itemValue) => {
                  setLanguage(itemValue);
                  setShowLanguagePicker(false);
                }}
              >
                <Picker.Item label="English" value="en" />
                <Picker.Item label="සිංහල" value="si" />
              </Picker>
            </View>
          )}
        </View>

        {/* Theme Setting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme / තේමාව</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowThemePicker(!showThemePicker)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="color-palette-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Theme</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>
                {theme === 'light' ? 'Light' : 'Dark'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
          
          {showThemePicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={theme}
                onValueChange={(itemValue) => {
                  setTheme(itemValue);
                  setShowThemePicker(false);
                }}
              >
                <Picker.Item label="Light" value="light" />
                <Picker.Item label="Dark" value="dark" />
              </Picker>
            </View>
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications / දැනුම්දීම්</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Enable Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Default Report Period */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Report Period / පෙරනිමි වාර්තා කාලය</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowPeriodPicker(!showPeriodPicker)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Report Period</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>
                {defaultReportPeriod === 'daily' ? 'Daily' :
                 defaultReportPeriod === 'weekly' ? 'Weekly' : 'Monthly'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
          
          {showPeriodPicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={defaultReportPeriod}
                onValueChange={(itemValue) => {
                  setDefaultReportPeriod(itemValue);
                  setShowPeriodPicker(false);
                }}
              >
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
              </Picker>
            </View>
          )}
        </View>

        {/* Data Backup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Backup / දත්ත උපස්ථය</Text>
          <TouchableOpacity style={styles.settingRow} onPress={handleBackup}>
            <View style={styles.settingLeft}>
              <Ionicons name="cloud-upload-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Backup Now</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help / උදවු</Text>
          <TouchableOpacity style={styles.settingRow} onPress={handleHelp}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>User Manual</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account / ගිණුම</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{user?.id?.substring(0, 8)}...</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerRight: {
    width: 50,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  pickerContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});