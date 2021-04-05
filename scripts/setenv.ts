const { writeFile } = require('fs');
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   apiBaseUrl: "${process.env.API_URL}",
   FB_APP_SECRET: "${process.env.FB_APP_SECRET}",
   FB_APP_ID: "${process.env.FB_APP_ID}",
   JWT_SECRET: "${process.env.JWT_SECRET}",
   MONGODB_URL: "${process.env.MONGODB_URL}",
   MONGODB_DB: "${process.env.MONGODB_DB}",
   PORT: "${process.env.PORT}"
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err) => {
   if (err) {
      console.log(err);
   }
   console.log(`Wrote variables to ${targetPath}`);
});
