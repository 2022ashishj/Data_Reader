const fs = require('fs');

// Read the CSV file and split lines
const filePath = '../Data/data.csv';
let rawData = fs.readFileSync(filePath, 'utf-8').trim();
const data = rawData.split('\n').slice(1); 

const getMonth = (dateStr) => dateStr.split('-').slice(0, 2).join('-');

function calculateTotalSales(data) {
  let total = 0;
  data.forEach((line) => {
    const [ , , , , totalPrice] = line.split(',').map((item) =>
      isNaN(item) ? item.trim() : parseFloat(item)
    );
    total += totalPrice;
  });
  return total;
}

function calculateMonthWiseSales(data) {
  const salesByMonth = {};
  data.forEach((line) => {
    const [date, , , , totalPrice] = line.split(',').map((item) =>
      isNaN(item) ? item.trim() : parseFloat(item)
    );
    const month = getMonth(date);
    salesByMonth[month] = (salesByMonth[month] || 0) + totalPrice;
  });
  return salesByMonth;
}

function calculateMostPopularItems(data) {
  const popularItems = {};
  data.forEach((line) => {
    const [date, sku, , quantity] = line.split(',').map((item) =>
      isNaN(item) ? item.trim() : parseFloat(item)
    );
    const month = getMonth(date);
    if (!popularItems[month]) popularItems[month] = {};
    popularItems[month][sku] = (popularItems[month][sku] || 0) + quantity;
  });

  const mostPopularReport = {};
  Object.keys(popularItems).forEach((month) => {
    const mostPopular = Object.entries(popularItems[month]).reduce((max, curr) =>
      curr[1] > max[1] ? curr : max
    );
    mostPopularReport[month] = { item: mostPopular[0], quantity: mostPopular[1] };
  });

  return mostPopularReport;
}

function calculateMostRevenueItems(data) {
  const revenueItems = {};
  data.forEach((line) => {
    const [date, sku, , , totalPrice] = line.split(',').map((item) =>
      isNaN(item) ? item.trim() : parseFloat(item)
    );
    const month = getMonth(date);
    if (!revenueItems[month]) revenueItems[month] = {};
    revenueItems[month][sku] = (revenueItems[month][sku] || 0) + totalPrice;
  });

  const mostRevenueReport = {};
  Object.keys(revenueItems).forEach((month) => {
    const mostRevenue = Object.entries(revenueItems[month]).reduce((max, curr) =>
      curr[1] > max[1] ? curr : max
    );
    mostRevenueReport[month] = { item: mostRevenue[0], revenue: mostRevenue[1] };
  });

  return mostRevenueReport;
}

function calculateItemStats(data, mostPopularItems) {
  const itemStats = {};

  const statsData = {};
  data.forEach((line) => {
    const [date, sku, , quantity] = line.split(',').map((item) =>
      isNaN(item) ? item.trim() : parseFloat(item)
    );
    const month = getMonth(date);
    if (!statsData[sku]) statsData[sku] = {};
    if (!statsData[sku][month]) statsData[sku][month] = [];
    statsData[sku][month].push(quantity);
  });

  Object.keys(mostPopularItems).forEach((month) => {
    const item = mostPopularItems[month].item;
    const quantities = statsData[item][month];
    const min = Math.min(...quantities);
    const max = Math.max(...quantities);
    const avg = quantities.reduce((sum, val) => sum + val, 0) / quantities.length;

    itemStats[month] = { min, max, avg: avg.toFixed(2) };
  });

  return itemStats;
}

const totalSales = calculateTotalSales(data);
const monthWiseSales = calculateMonthWiseSales(data);
const mostPopularItems = calculateMostPopularItems(data);
const mostRevenueItems = calculateMostRevenueItems(data);
const itemStats = calculateItemStats(data, mostPopularItems);


console.log('Total Sales:', totalSales);
console.log('Month-wise Sales:', monthWiseSales);
console.log('Most Popular Items by Month:', mostPopularItems);
console.log('Most Revenue Items by Month:', mostRevenueItems);
console.log('Stats for Most Popular Items:', itemStats);
