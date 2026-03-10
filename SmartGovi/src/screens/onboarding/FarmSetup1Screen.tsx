import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { COLORS, FARM_TYPES, FARM_TYPE_ICONS } from '../../utils/constants';

type FarmSetup1ScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'FarmSetup1'>;

export const FarmSetup1Screen = () => {
  const navigation = useNavigation<FarmSetup1ScreenNavigationProp>();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleFarmType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleNext = () => {
    if (selectedTypes.length > 0) {
      navigation.navigate('FarmSetup2', { selectedFarmTypes: selectedTypes });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Farm Setup (1/3)</Text>
        <Text style={styles.question}>What do you farm?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {FARM_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.farmTypeCard,
              selectedTypes.includes(type) && styles.selectedCard,
            ]}
            onPress={() => toggleFarmType(type)}
          >
            <Text style={styles.farmTypeIcon}>{FARM_TYPE_ICONS[type]}</Text>
            <Text style={styles.farmTypeName}>{type}</Text>
            <View style={styles.checkbox}>
              {selectedTypes.includes(type) && (
                <View style={styles.checkboxChecked} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedTypes.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedTypes.length === 0}
        >
          <Text style={styles.nextButtonText}>Next →</Text>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stepIndicator: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    padding: 16,
  },
  farmTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  farmTypeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  farmTypeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
});