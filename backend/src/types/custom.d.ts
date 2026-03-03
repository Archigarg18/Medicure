declare module 'cors';
declare module 'morgan';

declare module "../routes/contact.js" {
  import { Router } from "express";
  const router: Router;
  export default router;
}

declare module "../routes/appointments.js" {
  import { Router } from "express";
  const router: Router;
  export default router;
}
