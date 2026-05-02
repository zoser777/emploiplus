const fs = require('fs');
['app/apropos/page.tsx','app/admin/dashboard/services/page.tsx','app/admin/dashboard/team/page.tsx'].forEach(f => {
  let c = fs.readFileSync(f,'utf8');
  c = c.replace(/\u00c3\u00a0/g,'à');
  fs.writeFileSync(f, c, 'utf8');
  console.log('OK: ' + f);
});
