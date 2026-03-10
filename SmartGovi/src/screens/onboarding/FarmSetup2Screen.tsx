import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { COLORS, DEFAULT_MUSHROOM_INCOME_CATEGORIES } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

type FarmSetup2ScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'FarmSetup2'>;
type FarmSetup2ScreenRouteProp = RouteProp<OnboardingStackParamList, 'FarmSetup2'>;

interface IncomeCategory {
  id: string;
  name: string;
  defaultUnit: string;
  isActive: boolean;
}

export const FarmSetup2Screen = () => {
  const navigation = useNavigation<FarmSetup2ScreenNavigationProp>();
  const route = useRoute<FarmSetup2ScreenRouteProp>();
  const { selectedFarmTypes } = route.params;

  const [categories, setCategories] = useState<IncomeCategory[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryUnit, setNewCategoryUnit] = useState('kg');

  useEffect(() => {
    // Load default categories based on farm types
    let defaultCats: IncomeCategory[] = [];
    
    if (selectedFarmTypes.includes('Mushrooms')) {
      defaultCats = [...DEFAULT_MUSHROOM_INCOME_CATEGORIES];
    }
    
    // Add more default categories for other farm types here
    
    setCategories(defaultCats);
  }, [selectedFarmTypes]);

  const toggleCategory = (id: string) => {
    setCategories(
      categories.map(cat =>
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  const addNewCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const newCategory: IncomeCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      defaultUnit: newCategoryUnit,
      isActive: true,
    };

    setCategories([...categories, newCategory]);
    setModalVisible(false);
    setNewCategoryName('');
    setNewCategoryUnit('kg');
  };

  const handleNext = () => {
    const activeCategories = categories.filter(cat => cat.isActive);
    navigation.navigate('FarmSetup3', {
      selectedFarmTypes,
      incomeCategories: activeCategories,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>Farm Setup (2/3)</Text>
        <Text style={styles.question}>Your Income Sources</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {selectedFarmTypes.map(type => (
          <View key={type} style={styles.typeSection}>
            <Text style={styles.typeTitle}>{type.toUpperCase()}</Text>
            
            {categories
              .filter(cat => cat.isActive)
              .map(category => (
                <View key={category.id} style={styles.categoryItem}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleCategory(category.id)}
                  >
                    <View style={[styles.checkbox, category.isActive && styles.checkboxChecked]}>
                      {category.isActive && (
                        <Ionicons name="checkmark" size={16} color={COLORS.white} />
                      )}
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add to list</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ))}

        <TouchableOpacity
          style={styles.addNewButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.addNewButtonText}>Add New Income Source</Text>
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
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Income Source</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Category Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Oyster Mushroom"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <Text style={styles.modalLabel}>Default Unit</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newCategoryUnit}
                onValueChange={(itemValue) => setNewCategoryUnit(itemValue)}
              >
                <Picker.Item label="Kilogram (kg)" value="kg" />
                <Picker.Item label="Gram (g)" value="g" />
                <Picker.Item label="Dozen" value="dozen" />
                <Picker.Item label="Piece" value="piece" />
                <Picker.Item label="Liter" value="liter" />
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={addNewCategory}
            >
              <Text style={styles.modalButtonText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  typeSection: {
    marginBottom: 24,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  categoryName: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    fontSize: 12,
    color: COLORS.primary,
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
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});