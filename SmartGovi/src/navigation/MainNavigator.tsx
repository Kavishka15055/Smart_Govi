import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { AddIncomeScreen } from '../screens/main/AddIncomeScreen';
import { AddExpenseScreen } from '../screens/main/AddExpenseScreen';
import { HistoryScreen } from '../screens/main/HistoryScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { ReportScreen } from '../screens/main/ReportScreen';
import { TransactionDetailScreen } from '../screens/main/TransactionDetailScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { FilterModal } from '../screens/modals/FilterModal';
import { COLORS } from '../utils/constants';

export type MainTabParamList = {
  Home: undefined;
  AddIncome: undefined;
  AddExpense: undefined;
  History: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Report: { period?: string };
  TransactionDetail: { transactionId: string; type: 'income' | 'expense' };
  Settings: undefined;
  Filter: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AddIncome') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'AddExpense') {
            iconName = focused ? 'remove-circle' : 'remove-circle-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: COLORS.primary,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{ title: 'GoviGanana' }}
      />
      <Tab.Screen 
        name="AddIncome" 
        component={AddIncomeScreen} 
        options={{ title: 'Add Income' }}
      />
      <Tab.Screen 
        name="AddExpense" 
        component={AddExpenseScreen} 
        options={{ title: 'Add Expense' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ title: 'History' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: 'Back',
        headerTintColor: COLORS.primary,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Report" 
        component={ReportScreen} 
        options={{ title: 'Report' }}
      />
      <Stack.Screen 
        name="TransactionDetail" 
        component={TransactionDetailScreen} 
        options={{ title: 'Transaction Details' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="Filter" 
        component={FilterModal} 
        options={{ 
          title: 'Filter',
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
};