import { httpServer } from './app';

const PORT = process.env.PORT || 8000;

// eslint-disable-next-line no-console
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
