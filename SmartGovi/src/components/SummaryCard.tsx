import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import { Formatters } from '../utils/formatters';

interface SummaryCardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  totalIncome,
  totalExpense,
  balance,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SUMMARY</Text>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Income</Text>
          <Text style={[styles.value, styles.incomeText]}>
            {Formatters.formatCurrency(totalIncome)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <Text style={styles.label}>Expense</Text>
          <Text style={[styles.value, styles.expenseText]}>
            {Formatters.formatCurrency(totalExpense)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <Text style={styles.label}>Balance</Text>
          <Text style={[
            styles.value,
            balance >= 0 ? styles.incomeText : styles.expenseText
          ]}>
            {Formatters.formatCurrency(balance)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeText: {
    color: COLORS.income,
  },
  expenseText: {
    color: COLORS.expense,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
});