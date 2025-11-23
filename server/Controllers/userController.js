import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          company: {
            select: {
              id: true,
              name: true
            }
          },
          testResult: {
            select: {
              topRole: true,
              createdAt: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            website: true,
            location: true
          }
        },
        testResult: {
          select: {
            id: true,
            scores: true,
            topRole: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            website: true,
            location: true
          }
        },
        testResult: {
          select: {
            id: true,
            scores: true,
            topRole: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const saveTestResults = async (req, res) => {
  try {
    const { userId, testResults } = req.body;

    console.log('📝 Guardando resultados para usuario:', userId);
    console.log('📊 Resultados:', testResults);

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
      where: {
        userId: parseInt(userId)
      },
      update: {
        scores: testResults.scores,
        topRole: testResults.topRoleName
      },
      create: {
        userId: parseInt(userId),
        scores: testResults.scores,
        topRole: testResults.topRoleName
      }
    });

    console.log('✅ Resultados guardados exitosamente:', testResult);

    const updatedUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        testResult: {
          select: {
            id: true,
            scores: true,
            topRole: true,
            createdAt: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Resultados del test guardados exitosamente',
      testResult: testResult,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Error guardando resultados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al guardar resultados',
      error: error.message
    });
  }
};

export const getUserTestResults = async (req, res) => {
  try {
    const { userId } = req.params;

    const testResult = await prisma.userTestResult.findUnique({
      where: {
        userId: parseInt(userId)
      }
    });

    if (!testResult) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron resultados del test para este usuario'
      });
    }

    res.json({
      success: true,
      testResult
    });

  } catch (error) {
    console.error('❌ Error obteniendo resultados del test:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso'
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name || user.name,
        email: email || user.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
        testResult: {
          select: {
            id: true,
            topRole: true,
            createdAt: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio, skills, avatar } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso'
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name || user.name,
        email: email || user.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
        testResult: {
          select: {
            id: true,
            topRole: true,
            createdAt: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const deleteUserTestResults = async (req, res) => {
  try {
    const { userId } = req.params;

    const testResult = await prisma.userTestResult.findUnique({
      where: {
        userId: parseInt(userId)
      }
    });

    if (!testResult) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron resultados del test para este usuario'
      });
    }

    await prisma.userTestResult.delete({
      where: {
        userId: parseInt(userId)
      }
    });

    res.json({
      success: true,
      message: 'Resultados del test eliminados exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando resultados del test:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};