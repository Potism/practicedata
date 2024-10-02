const express = require("express");
const app = express();
const port = 9000;

app.use(express.json());

// Enhanced in-memory data store
let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    occupation: "Developer",
    city: "New York",
    isActive: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    occupation: "Designer",
    city: "San Francisco",
    isActive: true,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    occupation: "Manager",
    city: "Chicago",
    isActive: false,
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    age: 28,
    occupation: "Engineer",
    city: "Boston",
    isActive: true,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    age: 40,
    occupation: "Consultant",
    city: "Los Angeles",
    isActive: true,
  },
];

// Get all users
app.get("/users", (req, res) => {
  let result = [...users];

  // Filtering
  if (req.query.minAge) {
    result = result.filter((user) => user.age >= parseInt(req.query.minAge));
  }
  if (req.query.maxAge) {
    result = result.filter((user) => user.age <= parseInt(req.query.maxAge));
  }
  if (req.query.city) {
    result = result.filter(
      (user) => user.city.toLowerCase() === req.query.city.toLowerCase()
    );
  }
  if (req.query.occupation) {
    result = result.filter(
      (user) =>
        user.occupation.toLowerCase() === req.query.occupation.toLowerCase()
    );
  }
  if (req.query.isActive) {
    result = result.filter(
      (user) => user.isActive === (req.query.isActive === "true")
    );
  }

  // Sorting
  if (req.query.sortBy) {
    const sortField = req.query.sortBy.toLowerCase();
    const sortOrder =
      req.query.sortOrder && req.query.sortOrder.toLowerCase() === "desc"
        ? -1
        : 1;
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });
  }

  res.json(result);
});

// Get a specific user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
});

// Create a new user
app.post("/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    occupation: req.body.occupation,
    city: req.body.city,
    isActive: req.body.isActive || true,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user
app.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.age = req.body.age || user.age;
  user.occupation = req.body.occupation || user.occupation;
  user.city = req.body.city || user.city;
  user.isActive =
    req.body.isActive !== undefined ? req.body.isActive : user.isActive;

  res.json(user);
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("User not found");

  users.splice(index, 1);
  res.status(204).send();
});

// Get user statistics
app.get("/users/stats", (req, res) => {
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
    averageAge: users.reduce((sum, user) => sum + user.age, 0) / users.length,
    cityCounts: users.reduce((acc, user) => {
      acc[user.city] = (acc[user.city] || 0) + 1;
      return acc;
    }, {}),
    occupationCounts: users.reduce((acc, user) => {
      acc[user.occupation] = (acc[user.occupation] || 0) + 1;
      return acc;
    }, {}),
  };
  res.json(stats);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
