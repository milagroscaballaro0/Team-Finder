import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

export const saveTestResults = async (req, res) => {
  try {
    const { userId, scores, topRole } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const testResult = await prisma.userTestResult.upsert({
      where: { userId: parseInt(userId) },
      update: {
        scores,
        topRole
      },
      create: {
        userId: parseInt(userId),
        scores,
        topRole
      }
    });

    res.json({
      success: true,
      message: 'Resultados guardados exitosamente',
      testResult
    });

  } catch (error) {
    console.error('❌ Error guardando resultados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getTestResults = async (req, res) => {
  try {
    const { userId } = req.params;

    const testResult = await prisma.userTestResult.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!testResult) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron resultados para este usuario'
      });
    }

    res.json({
      success: true,
      testResult
    });

  } catch (error) {
    console.error('❌ Error obteniendo resultados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};