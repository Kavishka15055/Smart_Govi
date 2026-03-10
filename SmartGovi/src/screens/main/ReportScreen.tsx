import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useAuthStore } from '../../store/authStore';
import { useTransactionStore } from '../../store/transactionStore';
import { DateHelpers } from '../../utils/dateHelpers';
import { Formatters } from '../../utils/formatters';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

type ReportScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Report'>;
type ReportScreenRouteProp = RouteProp<MainStackParamList, 'Report'>;

export const ReportScreen = () => {
  const navigation = useNavigation<ReportScreenNavigationProp>();
  const route = useRoute<ReportScreenRouteProp>();
  const { user } = useAuthStore();
  const { summary, currentFilter } = useTransactionStore();

  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });

  useEffect(() => {
    // Get date range based on filter
    const range = DateHelpers.getDateRange(
      currentFilter.period,
      currentFilter.customRange?.startDate,
      currentFilter.customRange?.endDate
    );
    setDateRange(range);
  }, [currentFilter]);

  const handleShare = async () => {
    try {
      const reportText = `
Report: Last 3 Months
${DateHelpers.formatDateRange({ startDate: dateRange.start, endDate: dateRange.end })}

SUMMARY
Total Income: ${Formatters.formatCurrency(summary.totalIncome)}
Total Expense: ${Formatters.formatCurrency(summary.totalExpense)}
Balance: ${Formatters.formatCurrency(summary.balance)}

INCOME BREAKDOWN
${Object.entries(summary.incomeByCategory)
  .map(([cat, amount]) => `${cat}: ${Formatters.formatCurrency(amount)} (${Formatters.formatPercentage(amount, summary.totalIncome)})`)
  .join('\n')}

EXPENSE BREAKDOWN
${Object.entries(summary.expenseByCategory)
  .map(([cat, amount]) => `${cat}: ${Formatters.formatCurrency(amount)}`)
  .join('\n')}
      `;

      await Share.share({
        message: reportText,
        title: 'Farm Report',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share report');
    }
  };

  const getFilterDisplay = () => {
    switch (currentFilter.period) {
      case 'Today':
        return 'Today';
      case 'This Week':
        return 'This Week';
      case 'This Month':
        return 'This Month';
      case 'Last 3 Months':
        return 'Last 3 Months';
      case 'Custom':
        return 'Custom Range';
      default:
        return 'Last 3 Months';
    }
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
        <Text style={styles.title}>Report</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>{getFilterDisplay()}</Text>
          <Text style={styles.reportDate}>
            {DateHelpers.formatDateRange({ startDate: dateRange.start, endDate: dateRange.end })}
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>SUMMARY</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, styles.incomeText]}>
              {Formatters.formatCurrency(summary.totalIncome)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={[styles.summaryValue, styles.expenseText]}>
              {Formatters.formatCurrency(summary.totalExpense)}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={[
              styles.balanceValue,
              summary.balance >= 0 ? styles.incomeText : styles.expenseText
            ]}>
              {Formatters.formatCurrency(summary.balance)}
            </Text>
          </View>
        </View>

        {/* Income Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>INCOME BREAKDOWN</Text>
          
          {Object.entries(summary.incomeByCategory).length > 0 ? (
            Object.entries(summary.incomeByCategory).map(([category, amount]) => (
              <View key={category} style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownCategory}>{category}</Text>
                  <Text style={styles.breakdownPercentage}>
                    {Formatters.formatPercentage(amount, summary.totalIncome)}
                  </Text>
                </View>
                <Text style={styles.breakdownAmount}>
                  {Formatters.formatCurrency(amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No income recorded</Text>
          )}
        </View>

        {/* Expense Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>EXPENSE BREAKDOWN</Text>
          
          {Object.entries(summary.expenseByCategory).length > 0 ? (
            Object.entries(summary.expenseByCategory).map(([category, amount]) => (
              <View key={category} style={styles.breakdownRow}>
                <Text style={styles.breakdownCategory}>{category}</Text>
                <Text style={styles.breakdownAmount}>
                  {Formatters.formatCurrency(amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No expenses recorded</Text>
          )}
        </View>
      </ScrollView>

      {/* Share Button at Bottom (for better visibility) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerShareButton} onPress={handleShare}>
          <Ionicons name="share-social" size={20} color={COLORS.white} />
          <Text style={styles.footerShareText}>Share Report</Text>
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
  shareButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  reportHeader: {
    marginBottom: 24,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  incomeText: {
    color: COLORS.income,
  },
  expenseText: {
    color: COLORS.expense,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  breakdownCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownCategory: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  breakdownPercentage: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerShareButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  footerShareText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});