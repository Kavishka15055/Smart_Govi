import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useAuthStore } from '../../store/authStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useFarmStore } from '../../store/farmStore';
import { DateHelpers } from '../../utils/dateHelpers';
import { Formatters } from '../../utils/formatters';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

type DashboardScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

export const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { user } = useAuthStore();
  const { 
    summary, 
    loadTransactions, 
    isLoading,
    currentFilter,
    setFilter 
  } = useTransactionStore();
  const { profile } = useFarmStore();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, currentFilter]);

  const loadData = async () => {
    if (user) {
      const dateRange = DateHelpers.getDateRange(currentFilter.period, currentFilter.customRange?.startDate, currentFilter.customRange?.endDate);
      await loadTransactions(user.id, dateRange);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleFilterPress = () => {
    navigation.navigate('Filter');
  };

  const handleAddIncome = () => {
    navigation.navigate('AddIncome');
  };

  const handleAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  const handleViewReport = () => {
    navigation.navigate('Report');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  const getFilterDisplay = () => {
    switch (currentFilter.period) {
      case 'Today':
        return 'Today';
      case 'This Week':
        return 'This Week';
      case 'This Month':
        return DateHelpers.getMonthName(new Date());
      case 'Last 3 Months':
        return 'Last 3 Months';
      case 'Custom':
        if (currentFilter.customRange) {
          return DateHelpers.formatDateRange(currentFilter.customRange);
        }
        return 'Custom Range';
      default:
        return DateHelpers.getMonthName(new Date());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.dateText}>{DateHelpers.formatDate(new Date(), 'MMMM yyyy')}</Text>
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
            <Ionicons name="filter-outline" size={20} color={COLORS.white} />
            <Text style={styles.filterText}>EN</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.filterChip} onPress={handleFilterPress}>
          <Text style={styles.filterChipText}>Filter: {getFilterDisplay()}</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>SUMMARY</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, styles.incomeText]}>
                {Formatters.formatCurrency(summary.totalIncome)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expense</Text>
              <Text style={[styles.summaryValue, styles.expenseText]}>
                {Formatters.formatCurrency(summary.totalExpense)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Balance</Text>
              <Text style={[
                styles.summaryValue,
                summary.balance >= 0 ? styles.incomeText : styles.expenseText
              ]}>
                {Formatters.formatCurrency(summary.balance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={handleAddIncome}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="add-circle" size={32} color={COLORS.income} />
            </View>
            <Text style={styles.actionText}>Income</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleAddExpense}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="remove-circle" size={32} color={COLORS.expense} />
            </View>
            <Text style={styles.actionText}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleViewReport}>
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="bar-chart" size={32} color={COLORS.info} />
            </View>
            <Text style={styles.actionText}>Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleViewHistory}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="time" size={32} color={COLORS.accent} />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
        <View style={styles.recentContainer}>
          {[...useTransactionStore.getState().incomes.slice(0, 2), ...useTransactionStore.getState().expenses.slice(0, 2)]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
            .map((transaction, index) => {
              const isIncome = 'quantity' in transaction;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.transactionCard}
                  onPress={() => navigation.navigate('TransactionDetail', {
                    transactionId: transaction.id,
                    type: isIncome ? 'income' : 'expense'
                  })}
                >
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.transactionIcon,
                      { backgroundColor: isIncome ? '#E8F5E9' : '#FFEBEE' }
                    ]}>
                      <Ionicons
                        name={isIncome ? 'arrow-up' : 'arrow-down'}
                        size={16}
                        color={isIncome ? COLORS.income : COLORS.expense}
                      />
                    </View>
                    <View>
                      <Text style={styles.transactionCategory}>{transaction.category}</Text>
                      <Text style={styles.transactionDate}>
                        {DateHelpers.getRelativeDayName(transaction.date)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    { color: isIncome ? COLORS.income : COLORS.expense }
                  ]}>
                    {isIncome ? '+' : '-'}{Formatters.formatCurrency(transaction.amount)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleViewHistory}
          >
            <Text style={styles.viewAllText}>View All (12 more) ➡️</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddIncome}>
        <Ionicons name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color: COLORS.white,
    marginLeft: 4,
    fontWeight: '600',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  filterChipText: {
    color: COLORS.white,
    marginRight: 4,
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeText: {
    color: COLORS.income,
  },
  expenseText: {
    color: COLORS.expense,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  recentContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingTop: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});