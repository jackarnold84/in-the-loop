import ghpages from 'gh-pages';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'public');

ghpages.publish(
  distPath,
  {
    add: true,
    dotfiles: true,
  },
  (err) => {
    if (err) {
      console.error('❌ Deploy failed:', err);
    } else {
      console.log('✅ Github pages deployment successful!');
    }
  }
);
