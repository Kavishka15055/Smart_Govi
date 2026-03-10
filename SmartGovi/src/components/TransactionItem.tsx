import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../utils/constants';
import { DateHelpers } from '../utils/dateHelpers';
import { Formatters } from '../utils/formatters';
import { Ionicons } from '@expo/vector-icons';

interface TransactionItemProps {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date;
  quantity?: number;
  unit?: string;
  notes?: string;
  onPress: (id: string, type: 'income' | 'expense') => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  id,
  type,
  category,
  amount,
  date,
  quantity,
  unit,
  notes,
  onPress,
}) => {
  const isIncome = type === 'income';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(id, type)}
    >
      <View style={styles.leftContent}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: isIncome ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Ionicons
            name={isIncome ? 'arrow-up' : 'arrow-down'}
            size={16}
            color={isIncome ? COLORS.income : COLORS.expense}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.date}>{DateHelpers.getRelativeDayName(date)}</Text>
          {quantity && (
            <Text style={styles.detail}>
              {Formatters.formatQuantity(quantity, unit || 'kg')}
            </Text>
          )}
          {notes && <Text style={styles.note} numberOfLines={1}>{notes}</Text>}
        </View>
      </View>
      <Text style={[
        styles.amount,
        { color: isIncome ? COLORS.income : COLORS.expense }
      ]}>
        {isIncome ? '+' : '-'}{Formatters.formatCurrency(amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  detail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  note: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
});