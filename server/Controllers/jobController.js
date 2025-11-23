import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, type, category, companyId } = req.body;

    console.log('💼 Creando empleo:', { title, companyId });

    if (!title || !description || !companyId) {
      return res.status(400).json({
        success: false,
        message: 'Título, descripción y companyId son requeridos'
      });
    }
    const company = await prisma.company.findUnique({
      where: { id: parseInt(companyId) }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary,
        type,
        category,
        companyId: parseInt(companyId)
      },
      include: {
        company: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    console.log('✅ Empleo creado:', job.title);

    res.status(201).json({
      success: true,
      message: 'Empleo creado exitosamente',
      job
    });

  } catch (error) {
    console.error('❌ Error creando empleo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      location = '',
      type = '',
      category = '' 
    } = req.query;
    
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { company: { name: { contains: search, mode: 'insensitive' } } }
          ]
        } : {},
        location ? { location: { contains: location, mode: 'insensitive' } } : {},
        type ? { type: { contains: type, mode: 'insensitive' } } : {},
        category ? { category: { contains: category, mode: 'insensitive' } } : {}
      ].filter(condition => Object.keys(condition).length > 0)
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          applications: {
            select: {
              id: true,
              status: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo empleos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado'
      });
    }

    res.json({
      success: true,
      job
    });

  } catch (error) {
    console.error('❌ Error obteniendo empleo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getJobsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: { companyId: parseInt(companyId) },
        include: {
          applications: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ 
        where: { companyId: parseInt(companyId) } 
      })
    ]);

    res.json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo empleos por empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};