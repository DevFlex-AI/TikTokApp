import { colors } from '@/constants/colors';
import LiquidGlassTabBar from '@/components/LiquidGlassTabBar';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Tabs } from 'expo-router';
import { Home, MessageCircle, PlusSquare, Search, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  // If not authenticated, don't show tabs
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      tabBar={(props) => <LiquidGlassTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.black,
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          color: colors.black,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'For You',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <PlusSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size }) => (
            <View>
              <MessageCircle size={size} color={color} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});