import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';

import { FloatingTabBar, type TabItem } from '@/shared/components/navigation/floating-tab-bar';

const TABS: (TabItem & { href: '/' | '/sell' | '/summary' | '/settings' })[] = [
  { name: 'index', href: '/', label: 'Inventory', icon: 'cube' },
  { name: 'sell', href: '/sell', label: 'Sell', icon: 'cart' },
  { name: 'summary', href: '/summary', label: 'Summary', icon: 'stats-chart' },
  { name: 'settings', href: '/settings', label: 'Settings', icon: 'settings' },
];

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot />
      <FloatingTabBar items={TABS} />
      {/* Hidden list: it defines which routes exist. The visible bar is FloatingTabBar. */}
      <TabList style={{ display: 'none' }}>
        {TABS.map((tab) => (
          <TabTrigger href={tab.href} key={tab.name} name={tab.name} />
        ))}
      </TabList>
    </Tabs>
  );
}
