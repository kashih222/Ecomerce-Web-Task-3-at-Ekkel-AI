export const categoriesData = [
  { name: 'Sports', count: 124 },
  { name: 'Kitchen', count: 87 },
  { name: 'Toys', count: 56 },
  { name: 'Decoration', count: 142 },
  { name: 'Electronics', count: 73 },
  { name: 'Fashion', count: 98 },
  { name: 'Beauty', count: 98 },
  { name: 'Office', count: 98 },
  { name: 'Beverage', count: 98 },
];

// Determine the category with the highest count
export const topCategory = categoriesData.reduce((prev, curr) =>
  curr.count > prev.count ? curr : prev,
);