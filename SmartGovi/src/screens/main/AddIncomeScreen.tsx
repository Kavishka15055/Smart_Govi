import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useAuthStore } from '../../store/authStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useFarmStore } from '../../store/farmStore';
import { COLORS } from '../../utils/constants';
import { DateHelpers } from '../../utils/dateHelpers';
import { Validators } from '../../utils/validators';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

type AddIncomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'AddIncome'>;

export const AddIncomeScreen = () => {
  const navigation = useNavigation<AddIncomeScreenNavigationProp>();
  const { user } = useAuthStore();
  const { addIncome, isLoading } = useTransactionStore();
  const { profile } = useFarmStore();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{
    category?: string;
    quantity?: string;
    amount?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!Validators.isRequired(category)) {
      newErrors.category = 'Please select a category';
    }

    if (!Validators.isRequired(quantity)) {
      newErrors.quantity = 'Quantity is required';
    } else if (!Validators.isValidQuantity(parseFloat(quantity))) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!Validators.isRequired(amount)) {
      newErrors.amount = 'Amount is required';
    } else if (!Validators.isValidAmount(parseFloat(amount))) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const incomeData = {
      userId: user.id,
      date,
      category,
      quantity: parseFloat(quantity),
      unit,
      amount: parseFloat(amount),
      notes: notes || undefined,
    };

    const success = await addIncome(incomeData);

    if (success) {
      Alert.alert(
        'Success',
        'Income added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to add income. Please try again.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Income</Text>
        </View>

        <View style={styles.form}>
          {/* Date */}
          <View style={styles.field}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{DateHelpers.formatDateForInput(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <View style={[styles.pickerContainer, errors.category && styles.fieldError]}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => {
                  setCategory(itemValue);
                  if (errors.category) {
                    setErrors({ ...errors, category: undefined });
                  }
                }}
              >
                <Picker.Item label="Select category..." value="" />
                {profile?.incomeCategories?.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
                ))}
              </Picker>
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* Quantity and Unit */}
          <View style={styles.row}>
            <View style={[styles.field, styles.quantityField]}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={[styles.input, errors.quantity && styles.fieldError]}
                value={quantity}
                onChangeText={(text) => {
                  setQuantity(text);
                  if (errors.quantity) {
                    setErrors({ ...errors, quantity: undefined });
                  }
                }}
                keyboardType="numeric"
                placeholder="10"
              />
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
            </View>

            <View style={[styles.field, styles.unitField]}>
              <Text style={styles.label}>Unit</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={unit}
                  onValueChange={(itemValue) => setUnit(itemValue)}
                >
                  <Picker.Item label="kg" value="kg" />
                  <Picker.Item label="g" value="g" />
                  <Picker.Item label="dozen" value="dozen" />
                  <Picker.Item label="piece" value="piece" />
                  <Picker.Item label="liter" value="liter" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.field}>
            <Text style={styles.label}>Amount (LKR)</Text>
            <TextInput
              style={[styles.input, errors.amount && styles.fieldError]}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                if (errors.amount) {
                  setErrors({ ...errors, amount: undefined });
                }
              }}
              keyboardType="numeric"
              placeholder="2500"
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>

          {/* Notes */}
          <View style={styles.field}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Sold at Colombo market..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
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
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
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
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  field: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityField: {
    flex: 2,
    marginRight: 8,
  },
  unitField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  fieldError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
});