export function initialFilter(year, month) {
  let filterYear;
  let filterMonth;

  switch (month) {
      case 1:
          filterMonth = 10;
          filterYear = year - 1;
          break;
      case 2:
          filterMonth = 11;
          filterYear = year - 1;
          break;
      case 3:
          filterMonth = 12;
          filterYear = year - 1;
      default:
          filterMonth = month - 3;
          filterYear = year;
          break;
  }

  return {
      filterMonth,
      filterYear,
  };
}

export function finalyFilter(year, month) {
  let filterYear;
  let filterMonth;

  switch (month) {
      case 12:
          filterMonth = 1;
          filterYear = year + 1;
          break;
      default:
          filterMonth = month + 1;
          filterYear = year;
          break;
  }

  return {
      filterMonth,
      filterYear,
  };
}