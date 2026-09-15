import React, { useState } from 'react';
import { 
  Home, 
  BarChart2, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronLeft,
  type LucideIcon, 
  UserCheck,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import styles from './MenuPanel.module.css';

// Type contract defining a single configuration node in our nav tree
interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'Farmers', label: 'Farmers', icon: Users, path: '/farmers' },
  { id: 'Buyers', label: 'Buyers', icon: UserCheck, path: '/buyers' },
  { id: 'Purchase_Orders', label: 'Purchase Orders', icon: ShoppingCart, path: '/purchase-orders' },
  { id: 'Sell_Orders', label: 'Sell Orders', icon: TrendingUp, path: '/sell-orders' },

  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export default function MenuPanel(): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('dashboard');

  const toggleSidebar = (): void => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <aside 
      className={`${styles.sidebar} ${
        isCollapsed ? styles.collapsed : styles.expanded
      }`}
    >
      <div>
        {/* Upper Brand/Toggle Row */}
        <div className={styles.header}>
          {!isCollapsed && (
            <span className={styles.brand}>
              APP CORE
            </span>
          )}
          <button 
            onClick={toggleSidebar}
            className={styles.toggleBtn}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Dynamic Context Navigation List */}
        <nav className={styles.navContainer}>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`${styles.menuButton} ${isActive ? styles.activeButton : ''}`}
              >
                <Icon 
                  size={20} 
                  className={isCollapsed ? styles.iconCenter : styles.iconMargin} 
                />
                
                {!isCollapsed && (
                  <span className={styles.label}>
                    {item.label}
                  </span>
                )}

                {isCollapsed && (
                  <div className={styles.tooltip}>
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Account Control Base Footer */}
      <div className={styles.footer}>
        <button className={`${styles.menuButton} ${styles.logoutButton}`}>
          <LogOut 
            size={20} 
            className={isCollapsed ? styles.iconCenter : styles.iconMargin} 
          />
          {!isCollapsed && <span className={styles.label}>Logout</span>}
          
          {isCollapsed && (
            <div className={`${styles.tooltip} ${styles.logoutTooltip}`}>
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
