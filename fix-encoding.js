const fs = require('fs');
const files = ['app/page.tsx','app/apropos/page.tsx','app/admin/dashboard/services/page.tsx','app/admin/dashboard/team/page.tsx','app/admin/dashboard/testimonials/page.tsx'];
const fix = t => t
  .replace(/Ã©/g,'é').replace(/Ã¨/g,'è').replace(/Ã /g,'à').replace(/Ã¢/g,'â')
  .replace(/Ã®/g,'î').replace(/Ã´/g,'ô').replace(/Ã»/g,'û').replace(/Ã§/g,'ç')
  .replace(/Ã‰/g,'É').replace(/Ã€/g,'À').replace(/Ãª/g,'ê').replace(/Ã¹/g,'ù')
  .replace(/Ã¯/g,'ï').replace(/Ã«/g,'ë').replace(/Ã‚/g,'Â').replace(/Â°/g,'°')
  .replace(/Â«/g,'«').replace(/Â»/g,'»').replace(/â€™/g,"'").replace(/â€˜/g,"'")
  .replace(/â€œ/g,'"').replace(/â€/g,'"').replace(/â€"/g,'–').replace(/â€¦/g,'...')
  .replace(/CrÃ©er/g,'Créer').replace(/crÃ©Ã©/g,'créé').replace(/DÃ©crivez/g,'Décrivez')
  .replace(/IcÃ´ne/g,'Icône').replace(/PrÃªt/g,'Prêt').replace(/Ã©galement/g,'également')
  .replace(/numÃ©rique/g,'numérique').replace(/premiÃ¨re/g,'première')
  .replace(/accÃ¨s/g,'accès').replace(/accÃ¨s/g,'accès').replace(/Ã©quitable/g,'équitable')
  .replace(/dÃ©veloppement/g,'développement').replace(/compÃ©tences/g,'compétences')
  .replace(/certifiantes/g,'certifiantes').replace(/Ã©galitÃ©/g,'égalité');
files.forEach(f => {
  if (fs.existsSync(f)) {
    const fixed = fix(fs.readFileSync(f,'utf8'));
    fs.writeFileSync(f, fixed, 'utf8');
    console.log('OK: ' + f);
  }
});
