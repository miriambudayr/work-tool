import axios from 'axios';

// Send token with every request by default.
export function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

export function formatDate(due) {
  if (!due) {
    return null;
  }
  const date = new Date(due);
  const monthNames = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
  ];
  let month = monthNames[date.getUTCMonth()];
  let day = date.getUTCDate();

  return month + ' ' + day;
}

export function isPastDue(due) {
  // const { due } = this.props;

  if (!due) {
    return null;
  }

  const dueObject = new Date(due);
  const today = new Date();
  const todayMonth = today.getUTCMonth();
  const todayDay = today.getUTCDate();
  const todayYear = today.getUTCFullYear();
  const dueMonth = dueObject.getUTCMonth();
  const dueDay = dueObject.getUTCDate();
  const dueYear = dueObject.getUTCFullYear();

  // Due today
  if (dueMonth === todayMonth && dueDay === todayDay && dueYear === todayYear) {
    return 'today';
  }

  // Past due
  if (dueObject < today) {
    return 'past';
  }

  if (dueObject > today) {
    return null;
  }
}

export async function searchUser(searchTerm) {
  try {
    const res = await axios.get(`/api/user?searchTerm=${searchTerm}`);
    return res;
  } catch (error) {
    console.log(error.message);
  }
}
