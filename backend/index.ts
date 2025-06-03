import express from 'express';
import cors from 'cors';

import router from '@/routes/routes';

const app: express.Application = express();

app.use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', router);

app.listen(3001, () => console.log('Server running on port 3001'));