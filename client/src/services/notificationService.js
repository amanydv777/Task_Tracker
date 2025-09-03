// Check if the browser supports notifications
export const checkNotificationSupport = () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return false;
  }
  return true;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!checkNotificationSupport()) return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Register service worker for push notifications
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Send a notification
export const sendNotification = (title, options = {}) => {
  if (!checkNotificationSupport()) return;

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/logo192.png',
      ...options
    });

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) options.onClick();
    };

    return notification;
  }
};

// Send task due notification
export const sendTaskDueNotification = (task) => {
  return sendNotification(`Task Due: ${task.title}`, {
    body: task.description || 'This task is due now',
    onClick: () => {
      window.location.href = '/';
    }
  });
};

// Send task status change notification
export const sendTaskStatusNotification = (task, status) => {
  return sendNotification(`Task ${status === 'completed' ? 'Completed' : 'Pending'}`, {
    body: `Task "${task.title}" has been marked as ${status}`,
    onClick: () => {
      window.location.href = '/';
    }
  });
};
