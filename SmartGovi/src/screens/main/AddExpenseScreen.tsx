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
  Image,
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
import * as ImagePicker from 'expo-image-picker';

type AddExpenseScreenNavigationProp = StackNavigationProp<MainStackParamList, 'AddExpense'>;

export const AddExpenseScreen = () => {
  const navigation = useNavigation<AddExpenseScreenNavigationProp>();
  const { user } = useAuthStore();
  const { addExpense, isLoading } = useTransactionStore();
  const { profile } = useFarmStore();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    category?: string;
    amount?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!Validators.isRequired(category)) {
      newErrors.category = 'Please select a category';
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

    const expenseData = {
      userId: user.id,
      date,
      category,
      amount: parseFloat(amount),
      notes: notes || undefined,
      receiptUrl: receiptImage || undefined,
    };

    const success = await addExpense(expenseData);

    if (success) {
      Alert.alert(
        'Success',
        'Expense added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permission to take receipt photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant gallery permission to select receipt photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
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
          <Text style={styles.title}>Add Expense</Text>
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
                {profile?.expenseCategories?.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
                ))}
              </Picker>
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
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
              placeholder="1250"
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
              placeholder="Bought from local supplier..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Receipt Attachment */}
          <View style={styles.field}>
            <Text style={styles.label}>Attach Receipt (Optional)</Text>
            
            {receiptImage && (
              <View style={styles.receiptPreview}>
                <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setReceiptImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.receiptButtons}>
              <TouchableOpacity style={styles.receiptButton} onPress={pickImage}>
                <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
                <Text style={styles.receiptButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.receiptButton} onPress={pickFromGallery}>
                <Ionicons name="images-outline" size={20} color={COLORS.primary} />
                <Text style={styles.receiptButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
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
  receiptPreview: {
    position: 'relative',
    marginBottom: 12,
  },
  receiptImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  receiptButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  receiptButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 14,
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