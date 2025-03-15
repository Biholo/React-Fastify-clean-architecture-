import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Charger les variables d'environnement appropriées
if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
}

// Déclaration de l'instance globale
declare global {
    var prisma: PrismaClient | undefined;
}

// Création ou réutilisation de l'instance
const prisma =
    global.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

// En mode développement, on conserve l'instance dans global
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
