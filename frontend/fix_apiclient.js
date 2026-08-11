const fs = require('fs');
const path = require('path');

const files = [
  'd:/Projects/my_nsut/frontend/src/lib/api/auditLogs.ts',
  'd:/Projects/my_nsut/frontend/src/lib/api/adminUsers.ts',
  'd:/Projects/my_nsut/frontend/src/lib/api/adminRoles.ts',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/apiClient\.get\((.*?)\)/g, 'apiClient($1, { method: "GET" })');
  content = content.replace(/apiClient\.post\((.*?), (.*?)\)/g, 'apiClient($1, { method: "POST", body: JSON.stringify($2) })');
  fs.writeFileSync(file, content);
}

console.log("apiClient syntax updated");
