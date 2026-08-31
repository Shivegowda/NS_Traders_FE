import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './LoginForm.module.css'; // Importing separate styles
import { useNavigate } from 'react-router-dom';
interface LoginValues {
  userName: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .required('userName is required'),
  password: Yup.string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
});

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const formik = useFormik<LoginValues>({
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log('Form Data:', values);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert('Login Successful!');
        resetForm();
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.formCard}>
        <h2 className={styles.title}>Login</h2>

        {/* Email Field */}
        <div className={styles.inputGroup}>
          <label htmlFor="userName" className={styles.label}>User Name</label>
          <input
            id="userName"
            name="userName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.userName}
            className={formik.touched.userName && formik.errors.userName ? styles.inputError : styles.input}
          />
          {formik.touched.userName && formik.errors.userName ? (
            <span className={styles.errorText}>{formik.errors.userName}</span>
          ) : null}
        </div>

        {/* Password Field */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={formik.touched.password && formik.errors.password ? styles.inputError : styles.input}
          />
          {formik.touched.password && formik.errors.password ? (
            <span className={styles.errorText}>{formik.errors.password}</span>
          ) : null}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={formik.isSubmitting} 
          className={formik.isSubmitting ? styles.buttonDisabled : styles.button}
        >
          {formik.isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};
