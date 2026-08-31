import React from 'react';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {

  return (
    <div className={styles.dashboardContainer}>
  

      {/* Main Feature Layout Grid Section */}
      <main className={styles.mainContent}>
        <section className={styles.welcomeCard}>
          <h1 className={styles.title}>Hello, Welcome Back! 👋</h1>
          <p className={styles.subtitle}>
            You have successfully authenticated. This is your private dashboard layout 
            where subsequent API requests will display user data.
          </p>
        </section>
      </main>
    </div>
  );
};
