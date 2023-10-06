import { execSync } from 'node:child_process'

export const setupPrismaTests = () => {
  execSync(
    'npx dotenv-cli -e .env.development -- npx prisma migrate dev --schema ./src/shared/infrastructure/database/prisma/schema.prisma',
  )
}
