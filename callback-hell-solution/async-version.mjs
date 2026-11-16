const users = new Map([
  [1, { id: 1, name: "Ada", email: "ada@example.com" }],
  [2, { id: 2, name: "Grace", email: "grace@example.com" }],
]);

const orders = new Map([
  [1, [{ id: 101 }, { id: 102 }]],
]);

function getUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.get(userId);

      if (!user) {
        reject(new Error(`Could not load user ${userId}`));
        return;
      }

      resolve(user);
    }, 30);
  });
}

function getOrders(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userOrders = orders.get(userId);

      if (!userOrders) {
        reject(new Error(`Could not load orders for user ${userId}`));
        return;
      }

      resolve(userOrders);
    }, 30);
  });
}

function sendEmail(user, userOrders) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recipient: user.email,
        orderCount: userOrders.length,
      });
    }, 30);
  });
}

async function runWorkflow(userId) {
  try {
    const user = await getUser(userId);
    console.log(`User loaded: ${user.name}`);

    const userOrders = await getOrders(user.id);
    console.log(`Orders loaded: ${userOrders.length}`);

    const result = await sendEmail(user, userOrders);
    console.log(`Email sent to: ${result.recipient}`);
    console.log("Workflow complete");
  } catch (error) {
    console.log(`Workflow failed: ${error.message}`);
  }
}

const scenario = process.argv[2];

if (scenario === "success") {
  await runWorkflow(1);
} else if (scenario === "failure") {
  await runWorkflow(2);
} else {
  console.error("Choose a scenario: success or failure");
  process.exitCode = 1;
}
