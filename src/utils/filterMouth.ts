type DataActive = 'before' | 'current' | 'after'

export function filterMouth(filterActive: DataActive) {
  let initialDataFilter: Date
  let finalDataFilter: Date
  const currentDate = new Date()

  if (filterActive === 'before') {
      initialDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      finalDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
  }
  if (filterActive === 'current') {
      initialDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      finalDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  }

  if (filterActive === 'after') {
      initialDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      finalDataFilter = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)
  }

  return {
    initData: initialDataFilter.toISOString().split('T')[0],
    endData: finalDataFilter.toISOString().split('T')[0]
  }

}