import { listUsers } from "./modules/users/users.js";
import { listOrders } from "./modules/orders/orders.js";

console.log("Backend structure review");
console.log("");
console.log("Users:");

for (const user of listUsers()) {
  console.log(`- ${user.id}: ${user.name}`);
}

console.log("");
console.log("Orders:");

for (const order of listOrders()) {
  console.log(`- ${order.id}: ${order.item} for ${order.userName}`);
}
