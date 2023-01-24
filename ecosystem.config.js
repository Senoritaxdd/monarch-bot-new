module.exports = {
  apps: [
    {
      name: "Mainframe",
      namespace: "ACARFX",
      script: 'main.acar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Voucher"
    },
    {
      name: "Requirements",
      namespace: "ACARFX",
      script: 'main.acar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Requirements"
    },
    {
      name: "Statistics",
      namespace: "ACARFX",
      script: 'main.acar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Statistics"
    },
    {
      name: "Security_I",
      namespace: "ACARFX",
      script: 'main.acar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Guard_I"
    },
    {
      name: "Security_II",
      namespace: "ACARFX",
      script: 'main.acar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Guard_II"
    },
    {
      name: "Security_III",
      namespace: "ACARFX",
      script: 'main.acar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Guard_III"
    },
    {
      name: "Security_IV",
      namespace: "ACARFX",
      script: 'main.acar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Guard_IV"
    },
    {
      name: "Distributors",
      namespace: "ACARFX",
      script: 'main.acar',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Distributors"
    },
  ]
};