// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      // filename: "./dev.postgresql",
      host: "node11990-env-8744167.my.p4d.click",
      port: 5432,
      user: "webadmin",
      password: "GTGqxq68211",
      database: "Fasterpreprod",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: "node11990-env-8744167.my.p4d.click",
      port: 5432,
      user: "webadmin",
      password: "GTGqxq68211",
      database: "Fasterpreprod",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: "node11990-env-8744167.my.p4d.click",
      port: 5432,
      user: "webadmin",
      password: "GTGqxq68211",
      database: "Fasterpreprod",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
