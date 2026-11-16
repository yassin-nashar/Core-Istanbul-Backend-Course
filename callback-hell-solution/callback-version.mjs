const users = new Map([
  [1, { id: 1, name: "Ada", email: "ada@example.com" }],
  [2, { id: 2, name: "Grace", email: "grace@example.com" }],
]);

const orders = new Map([
  [1, [{ id: 101 }, { id: 102 }]],
]);

function getUser(userId, callback) {
  setTimeout(() => {
    const user = users.get(userId);

    if (!user) {
      callback(new Error(`Could not load user ${userId}`));
      return;
    }

    callback(null, user);
  }, 30);
}

function getOrders(userId, callback) {
  setTimeout(() => {
    const userOrders = orders.get(userId);

    if (!userOrders) {
      callback(new Error(`Could not load orders for user ${userId}`));
      return;
    }

    callback(null, userOrders);
  }, 30);
}

function sendEmail(user, userOrders, callback) {
  setTimeout(() => {
    callback(null, {
      recipient: user.email,
      orderCount: userOrders.length,
    });
  }, 30);
}

function runWorkflow(userId, callback) {
  getUser(userId, (userError, user) => {
    if (userError) {
      console.log(`Workflow failed: ${userError.message}`);
      callback();
      return;
    }

    console.log(`User loaded: ${user.name}`);

    getOrders(user.id, (ordersError, userOrders) => {
      if (ordersError) {
        console.log(`Workflow failed: ${ordersError.message}`);
        callback();
        return;
      }

      console.log(`Orders loaded: ${userOrders.length}`);

      sendEmail(user, userOrders, (emailError, result) => {
        if (emailError) {
          console.log(`Workflow failed: ${emailError.message}`);
          callback();
          return;
        }

        console.log(`Email sent to: ${result.recipient}`);
        console.log("Workflow complete");
        callback();
      });
    });
  });
}

console.log("Success scenario");
runWorkflow(1, () => {
  console.log("\nFailure scenario");
  runWorkflow(2, () => {});
});
