import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

export const getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.application.count()
    ]);

    res.json({
      success: true,
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo aplicaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const createApplication = async (req, res) => {
  try {
    const { userId, jobId, message } = req.body;

    console.log('📨 Creando postulación:', { userId, jobId });

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'userId y jobId son requeridos'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado'
      });
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: parseInt(userId),
          jobId: parseInt(jobId)
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Ya has postulado a este empleo'
      });
    }

    const application = await prisma.application.create({
      data: {
        userId: parseInt(userId),
        jobId: parseInt(jobId),
        message
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    console.log('✅ Postulación creada');

    res.status(201).json({
      success: true,
      message: 'Postulación enviada exitosamente',
      application
    });

  } catch (error) {
    console.error('❌ Error creando postulación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getApplicationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { userId: parseInt(userId) },
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  location: true
                }
              }
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.application.count({ 
        where: { userId: parseInt(userId) } 
      })
    ]);

    res.json({
      success: true,
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo postulaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { jobId: parseInt(jobId) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.application.count({ 
        where: { jobId: parseInt(jobId) } 
      })
    ]);

    res.json({
      success: true,
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo postulaciones por empleo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser: pending, accepted o rejected'
      });
    }

    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Postulación no encontrada'
      });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: `Postulación ${status === 'accepted' ? 'aceptada' : status === 'rejected' ? 'rechazada' : 'actualizada'}`,
      application: updatedApplication
    });

  } catch (error) {
    console.error('❌ Error actualizando postulación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};