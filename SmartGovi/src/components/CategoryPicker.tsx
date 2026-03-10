import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
}

interface CategoryPickerProps {
  visible: boolean;
  categories: Category[];
  selectedCategory: string;
  onSelect: (category: Category) => void;
  onClose: () => void;
  onAddNew?: () => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  visible,
  categories,
  selectedCategory,
  onSelect,
  onClose,
  onAddNew,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Category</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item.name && styles.selectedItem,
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[
                  styles.categoryName,
                  selectedCategory === item.name && styles.selectedText,
                ]}>
                  {item.name}
                </Text>
                {selectedCategory === item.name && (
                  <Ionicons name="checkmark" size={20} color={COLORS.white} />
                )}
              </TouchableOpacity>
            )}
          />

          {onAddNew && (
            <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.addButtonText}>Add New Category</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedItem: {
    backgroundColor: COLORS.primary,
  },
  categoryName: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  selectedText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 8,
  },
});