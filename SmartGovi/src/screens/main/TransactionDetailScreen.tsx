import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useTransactionStore } from '../../store/transactionStore';
import { DateHelpers } from '../../utils/dateHelpers';
import { Formatters } from '../../utils/formatters';
import { COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

type TransactionDetailScreenNavigationProp = StackNavigationProp<MainStackParamList, 'TransactionDetail'>;
type TransactionDetailScreenRouteProp = RouteProp<MainStackParamList, 'TransactionDetail'>;

export const TransactionDetailScreen = () => {
  const navigation = useNavigation<TransactionDetailScreenNavigationProp>();
  const route = useRoute<TransactionDetailScreenRouteProp>();
  const { transactionId, type } = route.params;

  const { incomes, expenses, deleteIncome, deleteExpense, isLoading } = useTransactionStore();
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (type === 'income') {
      const found = incomes.find(inc => inc.id === transactionId);
      setTransaction(found);
    } else {
      const found = expenses.find(exp => exp.id === transactionId);
      setTransaction(found);
    }
  }, [transactionId, type, incomes, expenses]);

  const handleEdit = () => {
    // Navigate to edit screen (you can create this later)
    Alert.alert('Info', 'Edit feature coming soon');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            let success;
            if (type === 'income') {
              success = await deleteIncome(transactionId);
            } else {
              success = await deleteExpense(transactionId);
            }

            if (success) {
              Alert.alert('Success', 'Transaction deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  if (!transaction) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isIncome = type === 'income';

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
        <Text style={styles.title}>Transaction Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Type Badge */}
        <View style={[
          styles.typeBadge,
          { backgroundColor: isIncome ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Ionicons
            name={isIncome ? 'arrow-up' : 'arrow-down'}
            size={20}
            color={isIncome ? COLORS.income : COLORS.expense}
          />
          <Text style={[
            styles.typeText,
            { color: isIncome ? COLORS.income : COLORS.expense }
          ]}>
            {isIncome ? 'INCOME' : 'EXPENSE'}
          </Text>
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={[
            styles.amountValue,
            { color: isIncome ? COLORS.income : COLORS.expense }
          ]}>
            {isIncome ? '+' : '-'}{Formatters.formatCurrency(transaction.amount)}
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {DateHelpers.formatDate(transaction.date, 'MMMM d, yyyy')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{transaction.category}</Text>
          </View>

          {isIncome && transaction.quantity && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantity</Text>
              <Text style={styles.detailValue}>
                {Formatters.formatQuantity(transaction.quantity, transaction.unit || 'kg')}
              </Text>
            </View>
          )}

          {transaction.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.detailValue}>{transaction.notes}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>
              {DateHelpers.formatDate(transaction.createdAt, 'MMM d, yyyy h:mm a')}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.error} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerRight: {
    width: 50,
  },
  content: {
    padding: 16,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  amountContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailsCard: {
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButton: {
    borderColor: COLORS.primary,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});