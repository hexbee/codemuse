import {
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
} from 'lucide-react';
import AIChat from '../AIChat/AIChat';
import styles from './Sidebar.module.css';

const Sidebar = ({ isCollapsed, onToggleCollapse, theme, onToggleTheme }) => {
    return (
        <div
            className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
        >
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    {!isCollapsed && (
                        <>
                            <MessageCircle size={20} />
                            <span>AI Assistant</span>
                        </>
                    )}
                    <div className={styles.headerActions}>
                        <button
                            onClick={onToggleTheme}
                            className={styles.themeToggle}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                        >
                            {theme === 'light' ? (
                                <Moon size={16} />
                            ) : (
                                <Sun size={16} />
                            )}
                        </button>
                        <button
                            onClick={onToggleCollapse}
                            className={styles.collapseToggle}
                            title={
                                isCollapsed
                                    ? 'Expand sidebar'
                                    : 'Collapse sidebar'
                            }
                        >
                            {isCollapsed ? (
                                <ChevronRight size={16} />
                            ) : (
                                <ChevronLeft size={16} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {!isCollapsed && <AIChat />}
        </div>
    );
};

export default Sidebar;
