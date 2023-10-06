import { execSync } from 'child_process'

const setupPrismaTests = () => {
  execSync(
    'npx dotenv-cli -e .env.development -- npx prisma migrate dev --schema ./src/shared/infrastructure/database/prisma/schema.prisma',
  )
}

export default setupPrismaTests
