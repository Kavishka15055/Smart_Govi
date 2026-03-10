import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useAuthStore } from '../../store/authStore';
import { useFarmStore } from '../../store/farmStore';
import { COLORS, DEFAULT_MUSHROOM_EXPENSE_CATEGORIES } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

type FarmSetup3ScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'FarmSetup3'>;
type FarmSetup3ScreenRouteProp = RouteProp<OnboardingStackParamList, 'FarmSetup3'>;

interface ExpenseCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export const FarmSetup3Screen = () => {
  const navigation = useNavigation<FarmSetup3ScreenNavigationProp>();
  const route = useRoute<FarmSetup3ScreenRouteProp>();
  const { selectedFarmTypes, incomeCategories } = route.params;
  const { user } = useAuthStore();
  const { createProfile } = useFarmStore();

  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    // Load default expense categories
    let defaultCats: ExpenseCategory[] = [];
    
    if (selectedFarmTypes.includes('Mushrooms')) {
      defaultCats = DEFAULT_MUSHROOM_EXPENSE_CATEGORIES.map(cat => ({
        ...cat,
        isActive: true,
      }));
    }
    
    setCategories(defaultCats);
  }, [selectedFarmTypes]);

  const toggleCategory = (id: string) => {
    setCategories(
      categories.map(cat =>
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  const handleFinish = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    const activeExpenseCategories = categories.filter(cat => cat.isActive);
    
    const success = await createProfile(
      user.id,
      selectedFarmTypes,
      incomeCategories,
      activeExpenseCategories,
      ['kg', 'dozen', 'piece'] // Default units
    );

    if (success) {
      Alert.alert(
        'Success',
        'Farm setup complete! You can now start tracking your finances.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Error', 'Failed to save farm profile. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Farm Setup (3/3)</Text>
        <Text style={styles.question}>Your Expense Categories</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedTitle}>Selected for {selectedFarmTypes.join(', ')}</Text>
        </View>

        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              category.isActive && styles.categoryCardActive,
            ]}
            onPress={() => toggleCategory(category.id)}
          >
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={[styles.checkbox, category.isActive && styles.checkboxChecked]}>
              {category.isActive && (
                <Ionicons name="checkmark" size={16} color={COLORS.white} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addNewButton}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.addNewButtonText}>Add Custom Expense</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinish}
          >
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
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
  selectedInfo: {
    marginBottom: 16,
  },
  selectedTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F7F0',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addNewButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});