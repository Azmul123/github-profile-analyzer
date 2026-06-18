import { FiAlertTriangle } from 'react-icons/fi';

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="error-message">
      <FiAlertTriangle className="error-message__icon" />
      <p className="error-message__text">{message}</p>
    </div>
  );
}

export default ErrorMessage;
