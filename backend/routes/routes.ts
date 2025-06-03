import { Router } from 'express';

import { linkController } from '@/controllers/link.ctrl';
import { validateUrl } from '@/middleware/link.mw';

const router: Router = Router();

router.post('/shorten', validateUrl as any, linkController.getShortenedLink.bind(linkController) as any);

router.get('/links', linkController.getAllLinks.bind(linkController) as any);

router.get('/info/:alias', linkController.getLinkInfo.bind(linkController) as any);

router.get('/analytics/:alias', linkController.getStatInfo.bind(linkController) as any);

router.delete('/delete/:alias', linkController.deleteLink.bind(linkController) as any);

router.get('/:alias', linkController.redirectLink.bind(linkController) as any);


export default router;