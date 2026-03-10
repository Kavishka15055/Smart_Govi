import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useAuthStore } from '../../store/authStore';
import { useTransactionStore } from '../../store/transactionStore';
import { DateHelpers } from '../../utils/dateHelpers';
import { Formatters } from '../../utils/formatters';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

type HistoryScreenNavigationProp = StackNavigationProp<MainStackParamList, 'History'>;

type TransactionItem = {
  id: string;
  type: 'income' | 'expense';
  date: Date;
  category: string;
  amount: number;
  quantity?: number;
  unit?: string;
  notes?: string;
};

export const HistoryScreen = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const { user } = useAuthStore();
  const { incomes, expenses, loadTransactions, isLoading } = useTransactionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    combineTransactions();
  }, [incomes, expenses, searchQuery, selectedType]);

  const loadData = async () => {
    if (user) {
      await loadTransactions(user.id);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const combineTransactions = () => {
    let combined: TransactionItem[] = [
      ...incomes.map(inc => ({
        id: inc.id,
        type: 'income' as const,
        date: inc.date,
        category: inc.category,
        amount: inc.amount,
        quantity: inc.quantity,
        unit: inc.unit,
        notes: inc.notes,
      })),
      ...expenses.map(exp => ({
        id: exp.id,
        type: 'expense' as const,
        date: exp.date,
        category: exp.category,
        amount: exp.amount,
        notes: exp.notes,
      })),
    ];

    // Apply filters
    if (selectedType !== 'all') {
      combined = combined.filter(t => t.type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      combined = combined.filter(t =>
        t.category.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setTransactions(combined);
  };

  const groupTransactionsByDate = () => {
    const groups: { [key: string]: TransactionItem[] } = {};

    transactions.forEach(transaction => {
      const dateKey = DateHelpers.formatDate(transaction.date, 'MMMM d, yyyy');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return groups;
  };

  const renderTransactionItem = ({ item }: { item: TransactionItem }) => (
    <TouchableOpacity
      style={styles.transactionCard}
      onPress={() => navigation.navigate('TransactionDetail', {
        transactionId: item.id,
        type: item.type,
      })}
    >
      <View style={styles.transactionLeft}>
        <View style={[
          styles.transactionIcon,
          { backgroundColor: item.type === 'income' ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Ionicons
            name={item.type === 'income' ? 'arrow-up' : 'arrow-down'}
            size={16}
            color={item.type === 'income' ? COLORS.income : COLORS.expense}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          {item.type === 'income' && item.quantity && (
            <Text style={styles.transactionDetail}>
              {Formatters.formatQuantity(item.quantity, item.unit || 'kg')}
            </Text>
          )}
          {item.notes && (
            <Text style={styles.transactionNote} numberOfLines={1}>
              {item.notes}
            </Text>
          )}
        </View>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.type === 'income' ? COLORS.income : COLORS.expense }
      ]}>
        {item.type === 'income' ? '+' : '-'}{Formatters.formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );

  const renderDateGroup = ({ item }: { item: [string, TransactionItem[]] }) => {
    const [date, groupTransactions] = item;
    const isToday = date === DateHelpers.formatDate(new Date(), 'MMMM d, yyyy');
    
    return (
      <View style={styles.groupContainer}>
        <Text style={styles.groupDate}>
          {isToday ? `${date} (Today)` : date}
        </Text>
        {groupTransactions.map(transaction => (
          <View key={transaction.id}>
            {renderTransactionItem({ item: transaction })}
          </View>
        ))}
      </View>
    );
  };

  const groupedData = Object.entries(groupTransactionsByDate());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate('Filter')}
          >
            <Ionicons name="filter-outline" size={20} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>

          <View style={styles.typeFilter}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'all' && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType('all')}
            >
              <Text style={[
                styles.typeButtonText,
                selectedType === 'all' && styles.typeButtonTextActive,
              ]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'income' && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType('income')}
            >
              <Text style={[
                styles.typeButtonText,
                selectedType === 'income' && styles.typeButtonTextActive,
              ]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'expense' && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType('expense')}
            >
              <Text style={[
                styles.typeButtonText,
                selectedType === 'expense' && styles.typeButtonTextActive,
              ]}>Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={groupedData}
        renderItem={renderDateGroup}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>No transactions found</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddIncome')}
            >
              <Text style={styles.addButtonText}>Add Your First Transaction</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  filterButtonText: {
    marginLeft: 4,
    color: COLORS.primary,
    fontWeight: '500',
  },
  typeFilter: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupDate: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  transactionCard: {
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
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  transactionDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  transactionNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});