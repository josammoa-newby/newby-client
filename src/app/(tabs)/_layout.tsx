import { Tabs } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Keyboard, Platform } from 'react-native';

import { TabBar, type TabKey } from '@/components';

// expo-router 가 BottomTabBarProps 를 export 하지 않아 Tabs 의 tabBar prop 에서 꺼냄
type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const SHOW_EVENT = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const HIDE_EVENT = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

// 키보드가 올라오면 탭바가 입력창을 가리지 않도록 숨김
function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener(SHOW_EVENT, () => setVisible(true));
    const hide = Keyboard.addListener(HIDE_EVENT, () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return visible;
}

function AppTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const keyboardVisible = useKeyboardVisible();
  if (keyboardVisible) return null;

  const activeName = state.routes[state.index].name;

  const handleChange = (key: TabKey) => {
    const route = state.routes.find((r) => r.name === key);
    if (!route || key === activeName) return;
    const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented) navigateToTab(route.key);
  };

  return <TabBar active={activeName as TabKey} onChange={handleChange} />;
}

// 탭 이름은 TabBar 의 TabKey 와 같아야 한다 (Figma Tab_bar 1:406)
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <AppTabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="ai" />
      <Tabs.Screen name="diary" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
