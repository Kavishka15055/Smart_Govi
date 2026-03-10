import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTransactionStore } from '../../store/transactionStore';
import { DateHelpers } from '../../utils/dateHelpers';
import { COLORS, FILTER_PERIODS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

type FilterModalNavigationProp = StackNavigationProp<MainStackParamList, 'Filter'>;

export const FilterModal = () => {
  const navigation = useNavigation<FilterModalNavigationProp>();
  const { currentFilter, setFilter } = useTransactionStore();

  const [selectedPeriod, setSelectedPeriod] = useState(currentFilter.period);
  const [startDate, setStartDate] = useState(currentFilter.customRange?.startDate || new Date());
  const [endDate, setEndDate] = useState(currentFilter.customRange?.endDate || new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleApply = () => {
    if (selectedPeriod === 'Custom') {
      setFilter(selectedPeriod, { startDate, endDate });
    } else {
      setFilter(selectedPeriod);
    }
    navigation.goBack();
  };

  const handleClear = () => {
    setSelectedPeriod('This Month');
    setStartDate(new Date());
    setEndDate(new Date());
    setFilter('This Month');
    navigation.goBack();
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter / පෙරහන</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Preset Periods */}
        <Text style={styles.sectionTitle}>⚡ Preset Periods / පෙරනිමි කාල සීමා</Text>
        <View style={styles.presetContainer}>
          {FILTER_PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.presetItem,
                selectedPeriod === period && styles.presetItemSelected,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.presetText,
                selectedPeriod === period && styles.presetTextSelected,
              ]}>
                {period}
              </Text>
              {selectedPeriod === period && (
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Range */}
        {selectedPeriod === 'Custom' && (
          <View style={styles.customContainer}>
            <Text style={styles.sectionTitle}>📅 Custom Range / අභිරුචි පරාසය</Text>
            
            {/* Start Date */}
            <Text style={styles.dateLabel}>Start Date / ආරම්භක දිනය</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateText}>{DateHelpers.formatDateForInput(startDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
              />
            )}

            {/* End Date */}
            <Text style={styles.dateLabel}>End Date / අවසන් දිනය</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateText}>{DateHelpers.formatDateForInput(endDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
              />
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear / ඉවතලන්න</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply / යොදන්න</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  presetContainer: {
    marginBottom: 24,
  },
  presetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  presetTextSelected: {
    color: COLORS.white,
    fontWeight: '500',
  },
  customContainer: {
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.background,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
});