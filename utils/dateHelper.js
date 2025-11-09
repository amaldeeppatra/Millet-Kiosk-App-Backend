const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } = require('date-fns');

const getDashboardDateRange = (timespan) => {
  const now = new Date();
  let startDate, endDate;

  switch (timespan) {
    case 'today':
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      break;
    case 'this_week':
      startDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'this_month':
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case 'last_30_days':
      startDate = startOfDay(subDays(now, 29));
      endDate = endOfDay(now);
      break;
    default: // Default to this month
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
  }
  return { startDate, endDate };
};

module.exports = { getDashboardDateRange };